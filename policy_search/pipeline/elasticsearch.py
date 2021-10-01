"""Module to load policies from a source into a document store - e.g. ElasticSearch
"""


from typing import List, Optional, Generator

from tqdm import tqdm
from elasticsearch import Elasticsearch, helpers

from .fetch import DocumentSourceFetcher
from ..parser.pdf_parser import PDFParser
from .models.policy import Policy


class ElasticSearchIndex():
    def __init__(
        self,
        es_url: Optional[str] = None,
        es_user: Optional[str] = None,
        es_password: Optional[str] = None,
        es_connector_kwargs: dict = {},
    ):
        self.index_name = 'policies'
        
        if es_url:
            if es_user and es_password:
                self.es = Elasticsearch(
                    [es_url], http_auth=(es_user, es_password), **es_connector_kwargs
                )
            else:
                self.es = Elasticsearch([es_url], **es_connector_kwargs)
            
        else:
            self.es = Elasticsearch(**es_connector_kwargs)
                        
    def delete_and_create_index(self):
        """
        Creates index. Deletes any existing index of the same name first.
        """
        
        self.es.indices.delete(index=self.index_name, ignore=[400, 404])
        self.es.indices.create(index=self.index_name)

    def load_documents(
        self,
        doc_source_fetcher: DocumentSourceFetcher,
        doc_parser: PDFParser,
        #document_store: BaseDocumentStore,
    ):
        """Loads documents in a given path into a document store
        """

        processed_docs = []
        print('Loading and preprocessing documents...')
        for doc, doc_structure in tqdm(doc_source_fetcher.get_text_by_page(doc_parser), unit='docs'):
            processed_docs += self._create_page_dicts_from_doc(doc, doc_structure)

        # Write the documents into the document store
        print('Writing documents to the document store...')
        bulk_loader = helpers.streaming_bulk(
            client=self.es,
            index=self.index_name,
            actions=iter(processed_docs),
            raise_on_error=True
        )
        
        successes = 0
        errs = []
        
        for ok, action in tqdm(bulk_loader, total=len(processed_docs)):
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
        start: Optional[int] = 0,
        keyword_filters: Optional[dict] = None,
    ) -> List[dict]:
        """
        Search for `query`, starting at result `start` and returning up to `limit` results.
        
        `keyword_filters` should be a dictionary, where each key is the field to be filtered, and each value is a list of strings to filter on. In
        Elasticsearch, keywords are datatypes that are only searchable by their exact value, therefore are useful for filtering.

        If `limit` is not provided, the index default will be used.
        """

        fields_to_search = ["text", "policy_name"]

        es_query = {
            "from": start,
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
                    "text": {}
                } 
            }
        }

        if limit:
            es_query["size"] = limit

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