"""Module to load policies from a source into a document store - e.g. ElasticSearch
"""


from pathlib import Path
from typing import List

import pandas as pd
from tqdm import tqdm
#from haystack.document_store.base import BaseDocumentStore
#from haystack.preprocessor import PreProcessor

from .fetch import DocumentSourceFetcher
from ..parser.pdf_parser import PDFParser
from .models.policy import Policy


class ElasticSearchIndex():
    def __init__(
        self
    ):
        self.index_name = 'Policies'

    def load_documents(
        self,
        doc_source_fetcher: DocumentSourceFetcher,
        doc_parser: PDFParser,
        #document_store: BaseDocumentStore,
    ):
        """Loads documents in a given path into a document store
        """

        # Preprocess docs to split into sentences
        # preprocessor = PreProcessor(
        #     clean_empty_lines=True,
        #     clean_whitespace=True,
        #     clean_header_footer=True,
        #     split_by="word",
        #     split_length=100,
        #     split_respect_sentence_boundary=True,
        # )

        processed_docs = []
        print('Loading and preprocessing documents...')

        for doc, doc_structure in tqdm(doc_source_fetcher.get_text(doc_parser), unit='docs'):
            #processed_docs.append(preprocessor.process(doc))
            processed_docs.append(
                self._create_doc_dict(doc, doc_structure)
            )
        processed_docs = [d for x in processed_docs for d in x]

        # Write the documents into the document store
        print('Writing documents to the document store...')
        # document_store.write_documents(
        #     processed_docs,
        #     index='policy',
        #     batch_size=100,
        #     duplicate_documents='skip'
        # )
    
    def _create_doc_dict(
        self,
        doc: Policy,
        doc_structure: dict
    ):
        return {
            'text': doc_structure,
            'meta': {
                'policy_id': doc.policy_id,
                'policy_name': doc.policy_name,
                'country_code': doc.country_code,     
                'source_name': doc.source_name
            }
        }