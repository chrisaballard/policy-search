"""Module to load policies from a source into a document store - e.g. ElasticSearch
"""


from typing import List, Optional, Generator

from elasticsearch import Elasticsearch, helpers

from .fetch import DocumentSourceFetcher
from ..parser.pdf_parser import PDFParser
from .models.policy import Policy
from .base import BaseCallback


class ElasticSearchIndex(BaseCallback):
    def __init__(
        self,
        es_url: Optional[str] = None,
        es_user: Optional[str] = None,
        es_password: Optional[str] = None,
        es_connector_kwargs: dict = {},
    ):  
        super().__init__('elasticsearch')
        self.index_name = 'policies'

        self.es_url = es_url
        self.es_login = (es_user, es_password)
        self.es_connector_kwargs = es_connector_kwargs

        self._connect_to_elasticsearch()
        
        self._docs_to_load = []

    def _connect_to_elasticsearch(
        self,
        ):

        if self.es_url:
            if all(self.es_login):
                self.es = Elasticsearch(
                    [self.es_url], http_auth=self.es_login, **self.es_connector_kwargs
                )
            else:
                self.es = Elasticsearch([self.es_url], **self.es_connector_kwargs)
            
        else:
            self.es = Elasticsearch(**self.es_connector_kwargs)

    def _is_connected_to_elasticsearch(self) -> bool:
        return self.es.ping()
                        
    def delete_and_create_index(self):
        """
        Creates index. Deletes any existing index of the same name first.
        """
        
        self.es.indices.delete(index=self.index_name, ignore=[400, 404])
        self.es.indices.create(index=self.index_name)

    def add(
        self,
        **kwargs,
    ):
        """
        Add document to an in-memory store of Elasticsearch documents ready for load.
        """
        doc, doc_structure = super().add(**kwargs)
        self._docs_to_load += self._create_page_dicts_from_doc(doc, doc_structure)

    def finalise(self):
        """
        Load documents in the in-memory store into Elasticsearch.
        """

        # We check the connection here in case there have been any issues since 
        # creation of the instance of this class.
        if not self._is_connected_to_elasticsearch():
            self._connect_to_elasticsearch()

        self.delete_and_create_index()

        bulk_loader = helpers.streaming_bulk(
            client=self.es,
            index=self.index_name,
            actions=iter(self._docs_to_load),
            raise_on_error=True
        )
        
        successes = 0
        errs = []
        
        for ok, action in bulk_loader:
            if not ok:
                errs.append(action)
                
            successes += ok

    def get_doc_by_id(
        self,
        _id: str,
    ) -> dict:
        """Get document by its '_id' field."""

        return self.es.get(
            index=self.index_name, 
            id=_id,
        )

    def search(
        self,
        query: str,
        limit: Optional[int] = None,
        # start: Optional[int] = 0,
        keyword_filters: Optional[dict] = None,
        max_pages_per_doc: Optional[int] = 10
    ) -> List[dict]:
        """
        Search for `query`, starting at result `start` and returning up to `limit` results.
        
        `keyword_filters` should be a dictionary, where each key is the field to be filtered, and each value is a list of strings to filter on. In
        Elasticsearch, keywords are datatypes that are only searchable by their exact value, therefore are useful for filtering.

        If `limit` is not provided, the index default will be used.
        If `max_pages_per_doc` is not provided, the top 10 pages for each document will be returned.
        """

        fields_to_search = ["text", "policy_name"]

        es_query = {
            "query": { 
                "bool": {
                    "should": [
                        {
                            "multi_match": {
                                "query": query,
                                "fields": fields_to_search
                            }
                        }
                    ],
                }
            },
            "highlight": {
                "fields": {
                    "text": {
                        "number_of_fragments": 0
                    }
                } 
            },
            "aggs": {
                "top_docs": {
                    "terms": {
                        "field": "policy_id",
                        "order": {
                            "top_hit": "desc"
                        },
                    },
                    "aggs": {
                        "top_passage_hits": {
                            "top_hits": {
                                "highlight": {
                                    "fields": {
                                        "text": {
                                            "number_of_fragments": 0
                                        }
                                    } 
                                },
                                "size": max_pages_per_doc,
                            }
                        },
                        "top_hit" : {
                            "max": {
                                "script": {
                                "source": "_score"
                                }
                            }
                        }
                    }
                }
            }
        }

        if limit:
            es_query["aggs"]["top_docs"]["terms"]["size"] = limit

        if keyword_filters:
            terms_clauses = []
            
            for field, values in keyword_filters.items():
                terms_clauses.append(
                    {
                        "terms": {
                            field: values
                        }
                    }
                )

            es_query["query"]["bool"]["must"] = terms_clauses

        return self.es.search(
            body=es_query,
            index=self.index_name
        )
            
    def _create_page_dicts_from_doc(
        self,
        doc: Policy,
        doc_structure: dict
    ) -> List[dict]:
        """
        For use with `doc_source_fetcher.get_text_by_page`
        """
        
        page_docs = []

        for page_num, page_text in doc_structure.items():
            page_docs.append({
                "_id": f"{doc.policy_id}_page{page_num}",
                'text': page_text,
                'policy_id': doc.policy_id,
                'policy_name': doc.policy_name,
                'page_number': page_num,
                'country_code': doc.country_code,     
                'source_name': doc.source_name,
            })

        return page_docs

    def _create_doc_dict(
        self,
        doc: Policy,
        doc_structure: str
    ) -> dict:
        """
        For use with `doc_source_fetcher.get_text`
        """

        return {
            'text': doc_structure,
            'policy_id': doc.policy_id,
            'policy_name': doc.policy_name,
            'country_code': doc.country_code,     
            'source_name': doc.source_name,
        }