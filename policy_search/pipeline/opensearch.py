"""Module to load policies from a source into a document store - e.g. ElasticSearch
"""


from typing import List, Optional, Tuple

from opensearchpy import OpenSearch, helpers

from .models.policy import Policy
from .base import BaseCallback


class OpenSearchIndex(BaseCallback):
    def __init__(
        self,
        es_url: Optional[str] = None,
        es_user: Optional[str] = None,
        es_password: Optional[str] = None,
        es_connector_kwargs: dict = {},
        embedding_dim: int = 312,
    ):
        super().__init__("elasticsearch")
        self.index_name = "policies"

        self.es_url = es_url
        self.es_login = (es_user, es_password)
        self.es_connector_kwargs = es_connector_kwargs

        self.embedding_dim = embedding_dim

        self._connect_to_elasticsearch()

        self._docs_to_load = []

    def _connect_to_elasticsearch(
        self,
    ):

        if self.es_url:
            if all(self.es_login):
                self.es = OpenSearch(
                    [self.es_url], http_auth=self.es_login, **self.es_connector_kwargs
                )
            else:
                self.es = OpenSearch([self.es_url], **self.es_connector_kwargs)

        else:
            self.es = OpenSearch(**self.es_connector_kwargs)

    def _is_connected_to_elasticsearch(self) -> bool:
        return self.es.ping()

    def _index_body(self):
        """Define policy index fields and types"""

        return {
            "settings": {
                "index": {
                    "knn": True,
                    "knn.algo_param.ef_search": 100,  # TODO: tune me. see https://opensearch.org/docs/latest/search-plugins/knn/knn-index#index-settings
                },
                "analysis": {
                    "normalizer": {
                        "lowercase_asciifold": {
                            "type": "custom",
                            "char_filter": [],
                            "filter": ["lowercase", "asciifolding"],
                        }
                    }
                },
            },
            "mappings": {
                "properties": {
                    "text": {
                        "type": "nested",
                        "properties": {
                            "text": {"type": "text"},
                            "embedding": {
                                "type": "knn_vector",
                                "dimension": self.embedding_dim,
                                "method": {
                                    "name": "hnsw",
                                    "space_type": "innerproduct",
                                    "engine": "nmslib",
                                    "parameters": {
                                        "ef_construction": 128,  # TODO: tune me
                                        "m": 12,  # TODO: tune me
                                    },
                                },
                            },
                        },
                    },
                    "policy_name": {
                        "type": "text",
                        "fields": {
                            "normalized": {
                                "type": "keyword",
                                "normalizer": "lowercase_asciifold",
                            }
                        },
                    },
                    "policy_date": {"type": "date", "format": "dd/MM/yyyy"},
                }
            },
        }

    def delete_and_create_index(self):
        """
        Creates index. Deletes any existing index of the same name first.
        """

        self.es.indices.delete(index=self.index_name, ignore=[400, 404])
        self.es.indices.create(index=self.index_name, body=self._index_body())

    def add(
        self,
        **kwargs,
    ):
        """
        Add document to an in-memory store of Elasticsearch documents ready for load.
        """
        doc, doc_structure = super().add(**kwargs)
        self._docs_to_load += self._create_page_dicts_from_doc(doc, doc_structure)

    def prepare(self):
        super().prepare()

        if not self._is_connected_to_elasticsearch():
            self._connect_to_elasticsearch()

        self.delete_and_create_index()

    def process_batch(self):
        """
        Load documents in the in-memory store into Elasticsearch.
        """

        super().process_batch()

        # We check the connection here in case there have been any issues since
        # creation of the instance of this class.
        if not self._is_connected_to_elasticsearch():
            self._connect_to_elasticsearch()

        try:
            bulk_loader = helpers.streaming_bulk(
                client=self.es,
                index=self.index_name,
                actions=iter(self._docs_to_load),
                raise_on_error=True,
                request_timeout=120,
                max_retries=5,
                chunk_size=1,
                initial_backoff=5,
                max_backoff=200,
            )

            successes = 0
            errs = []

            for ok, action in bulk_loader:
                if not ok:
                    errs.append(action)

                successes += ok
        # except ReadTimeoutError as e:
        #     logger.error("Read timeout error occured when processing batch, igoring batch")
        # except TransportError as e:
        #     logger.error("Transport error occured when processing batch, ignoring batch: " + str(e))
        finally:
            # Clear in memory store of documents to load ready for next batch
            self._docs_to_load = []

    def get_doc_by_id(
        self,
        _id: str,
        _source: Optional[List[str]] = None,
    ) -> dict:
        """Get document by its '_id' field."""

        return self.es.get(
            index=self.index_name,
            id=_id,
            _source=_source,
        )

    def search(
        self,
        query: str,
        query_embedding: List[float],
        limit: Optional[int] = None,
        # start: Optional[int] = 0,
        keyword_filters: Optional[dict] = None,
        max_pages_per_doc: Optional[int] = 10,
        year_range: Tuple[int, int] = None,
        max_passages_per_page: Optional[int] = 5,
        sampler_top_docs_to_filter_per_shard: Optional[int] = 120,
    ) -> List[dict]:
        """
        Search for `query`, starting at result `start` and returning up to `limit` results.

        `keyword_filters` should be a dictionary, where each key is the field to be filtered, and each value is a list of strings to filter on. In
        Elasticsearch, keywords are datatypes that are only searchable by their exact value, therefore are useful for filtering.

        If `limit` is not provided, the index default will be used.
        If `max_pages_per_doc` is not provided, the top 10 pages for each document will be returned.

        `sampler_top_docs_to_filter_per_shard` (Optional[int]): when running aggregation, only aggregate over the top N documents per shard. By default in Elasticsearch
        there are 5 shards, so the default of 100 means aggregating over 100*5 = 500 documents.
        """

        BOOST_TEXT_MATCH = 1.2
        BOOST_TEXT_MATCH_PHRASE = 2
        BOOST_TEXT_KNN = 1
        BOOST_TITLE_MATCH_PHRASE = 1.2

        es_query = {
            "size": 0,
            "query": {
                "bool": {
                    "must": [
                        {
                            "nested": {
                                "path": "text",
                                "score_mode": "max",
                                "inner_hits": {
                                    "_source": [
                                        "text.text_id",
                                        "text.text",
                                        "text.embedding",
                                    ],
                                    "size": max_passages_per_page,
                                },
                                "query": {
                                    "bool": {
                                        "should": [
                                            {
                                                "match": {
                                                    "text.text": {
                                                        "query": query,
                                                        "boost": BOOST_TEXT_MATCH,
                                                    },
                                                }
                                            },
                                            {
                                                "match_phrase": {
                                                    "text.text": {
                                                        "query": query,
                                                        "boost": BOOST_TEXT_MATCH_PHRASE,
                                                    },
                                                }
                                            },
                                            {
                                                "knn": {
                                                    "text.embedding": {
                                                        "vector": query_embedding,
                                                        "k": max_passages_per_page,
                                                        "boost": BOOST_TEXT_KNN,
                                                    },
                                                },
                                            },
                                        ]
                                    }
                                },
                            }
                        },
                    ],
                    "should": [
                        {
                            "match_phrase": {
                                "policy_name": {
                                    "query": query,
                                    "boost": BOOST_TITLE_MATCH_PHRASE,
                                }
                            }
                        }
                    ],
                }
            },
            "aggs": {
                "sample": {
                    "sampler": {"shard_size": sampler_top_docs_to_filter_per_shard},
                    "aggs": {
                        "top_docs": {
                            "terms": {
                                "field": "policy_id",
                                "order": {"top_hit": "desc"},
                            },
                            "aggs": {
                                "top_passage_hits": {
                                    "top_hits": {
                                        "_source": {"excludes": ["text.embedding"]},
                                        "size": max_pages_per_doc,
                                    }
                                },
                                "top_hit": {"max": {"script": {"source": "_score"}}},
                            },
                        }
                    },
                },
            },
        }

        if limit:
            es_query["aggs"]["sample"]["aggs"]["top_docs"]["terms"]["size"] = limit

        if keyword_filters is not None:
            if len(keyword_filters) > 0:
                terms_clauses = []

                for field, values in keyword_filters.items():
                    terms_clauses.append({"terms": {field: values}})

                es_query["query"]["bool"]["filter"] = terms_clauses

        if year_range is not None:
            if "filter" not in es_query["query"]["bool"]:
                es_query["query"]["bool"]["filter"] = []

            es_query["query"]["bool"]["filter"].append(
                self._year_range_filter(year_range)
            )

        return self.es.search(
            body=es_query,
            index=self.index_name,
            request_timeout=30,
            preference="prototype_user",
        )

    def _year_range_filter(self, year_range: Tuple[int, int]):
        """Returns an opensearch filter for year range"""

        start_date = f"01/01/{year_range[0]}" if year_range[0] is not None else None
        end_date = f"31/12/{year_range[1]}" if year_range[1] is not None else None

        policy_year_conditions = {}
        if start_date is not None:
            policy_year_conditions["gte"] = start_date
        if end_date is not None:
            policy_year_conditions["lte"] = end_date

        range_filter = {"range": {}}

        range_filter["range"]["policy_date"] = policy_year_conditions

        return range_filter

    def get_page_count_for_doc(self, policy_id: int) -> int:
        """Return the total number of pages in the elastic search index for a given document"""

        es_query = {
            "query": {"match": {"policy_id": policy_id}},
            "size": 0,
            "aggs": {"page_count": {"max": {"field": "page_number"}}},
        }

        query_result = self.es.search(body=es_query, index=self.index_name)

        doc_page_count = query_result["aggregations"]["page_count"]["value"]

        return doc_page_count

    def _create_page_dicts_from_doc(
        self, doc: Policy, doc_structure: dict
    ) -> List[dict]:
        """
        For use with `doc_source_fetcher.get_text_by_page`
        """

        page_docs = []

        for page_num, page_text in doc_structure.items():
            page_docs.append(
                {
                    "_id": f"{doc.policy_id}_page{page_num}",
                    "policy_id": doc.policy_id,
                    "policy_name": doc.policy_name.strip(),
                    "policy_date": doc.policy_date,
                    "page_number": page_num,
                    "country_code": doc.country_code,
                    "source_name": doc.source_name,
                    "sectors": doc.sectors,
                    "instruments": doc.instruments,
                    "document_types": doc.document_types,
                    "hazards": doc.hazards,
                    "responses": doc.responses,
                    "language": doc.language,
                    "keywords": doc.keywords,
                    "text": page_text,
                }
            )

        return page_docs

    def _create_doc_dict(self, doc: Policy, doc_structure: str) -> dict:
        """
        For use with `doc_source_fetcher.get_text`
        """

        return {
            "text": doc_structure,
            "policy_id": doc.policy_id,
            "policy_name": doc.policy_name,
            "country_code": doc.country_code,
            "source_name": doc.source_name,
        }

    def get_docs_sorted(
        self,
        field_name: str,
        asc: bool = True,
        keyword_filters: Optional[dict] = None,
        year_range: Tuple[int, int] = None,
        num_docs: int = 10000,
    ) -> List[dict]:
        """Get document IDs (`policy_id`) and field values, sorted by the values of `field_name`.

        Args:
            field_name (str): name of a field, in dot notation. A `_term` sort will be used on this field.
            asc (bool, optional): sort the results ascending (/descending). Defaults to True.
            num_docs (int, optional): the number of documents to return
            keyword_filters (dict, optional): each key is a field to be filtered, and each value is a list of strings to filter on.
        """

        sort_order = "asc" if asc else "desc"

        query = {
            "size": 0,
            "aggs": {
                "sorted_field": {
                    "terms": {
                        "field": field_name,
                        "order": {"_term": sort_order},
                        "size": num_docs,
                    },
                    "aggs": {"ids": {"terms": {"field": "policy_id"}}},
                }
            },
        }

        if any([keyword_filters, year_range]):
            query["query"] = {}
            query["query"]["bool"] = {}
            query["query"]["bool"]["filter"] = []

        if keyword_filters:
            terms_clauses = []

            for field, values in keyword_filters.items():
                terms_clauses.append({"terms": {field: values}})

            query["query"]["bool"]["filter"] = terms_clauses

        if year_range is not None:
            query["query"]["bool"]["filter"].append(self._year_range_filter(year_range))

        query_result = self.es.search(body=query, index=self.index_name)

        sorted_docs = []

        for doc_by_field in query_result["aggregations"]["sorted_field"]["buckets"]:
            field_value = doc_by_field["key"]

            for doc_by_id in doc_by_field["ids"]["buckets"]:
                doc_id = doc_by_id["key"]

                sorted_docs.append({"policy_id": doc_id, field_name: field_value})

        return sorted_docs
