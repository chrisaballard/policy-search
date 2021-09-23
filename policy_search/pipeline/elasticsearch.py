"""Module to load policies from a source into a document store - e.g. ElasticSearch
"""


from .fetch import DocumentSourceFetcher

from pathlib import Path
from typing import List

import pandas as pd
from tqdm import tqdm
from haystack.document_store.base import BaseDocumentStore
from haystack.preprocessor import PreProcessor


def load_documents(
    document_source_fetcher: DocumentSourceFetcher,
    doc_path: Path,
    document_store: BaseDocumentStore,
):
    """Loads documents in a given path into a document store
    """

    # Preprocess docs to split into sentences
    preprocessor = PreProcessor(
        clean_empty_lines=True,
        clean_whitespace=True,
        clean_header_footer=True,
        split_by="word",
        split_length=100,
        split_respect_sentence_boundary=True,
    )

    processed_docs = []
    print('Loading and preprocessing documents...')

    doc_text = document_source_fetcher.get_text(doc_path)
    for d in tqdm(doc_text, unit='docs'):
        processed_docs.append(preprocessor.process(d))
    processed_docs = [d for x in processed_docs for d in x]

    # Write the documents into the document store
    print('Writing documents to the document store...')
    document_store.write_documents(
        processed_docs,
        index='policy',
        batch_size=100,
        duplicate_documents='skip'
    )