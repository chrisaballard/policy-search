"""Module to load policies from a source into a document store - e.g. ElasticSearch
"""


from pathlib import Path
from typing import List

import pandas as pd
from tqdm import tqdm
from haystack.document_store.base import BaseDocumentStore
from haystack.preprocessor import PreProcessor

LINE_SEPARATOR = '\n'


def _filter_attributes(doc_attributes: dict):
    """Remove attributes which are null"""

    filtered_attributes = {}

    for k, v in doc_attributes.items():
        if not pd.isnull(v):
            filtered_attributes[k] = v

    return filtered_attributes

        
def fetch_docs_from_files(
    doc_path: Path, 
    doc_dict: List[dict],
    doc_filename_attribute: str,
    doc_attribute_mapping: List=None,
) -> dict:
    """Given a path to a set of documents, yields dictionaries containing document text and metadata.
    Optionally accepts a dictionary specifying a mapping between attribute names and functions used to return formatted
    attributes when loading document metadata.

    Args:
        doc_path (Path): full path to directory containing documents
        doc_dict (List[dict]): list of dictionaries containing document text and attributes
        doc_attribute_mapping (dict): optional dictionary mapping attributes to transformation functions

    Returns:
        yields a dictionary element for each document
    """

    for doc in doc_dict:
        doc_text = ''
        doc_filename = doc[doc_filename_attribute]
        with open(doc_path / doc_filename, 'rt') as doc_f:
            for l in doc_f:
                doc_text = doc_text + LINE_SEPARATOR + l

        yield {
                'text': doc_text,
                'meta': _filter_attributes(doc)
        }
            

def get_doc_list_from_csv(
    csv_filename: Path,
    doc_filename_attribute: str,
    doc_attribute_mapping: List=None
) -> List[dict]:
    """Reads a csv to get a list of policy documents to process and returns a list of dictionaries containing policy
    documents and metadata.

    Args:
        csv_filename (str): filename of csv file
        doc_attribute_mapping (dict): optional dictionary mapping attributes to transformation functions
    """

    documents_df = pd.read_csv(
        csv_filename,
        dtype={'source_policy_id': int}
    )
    selected_cols = [doc_filename_attribute]
    if doc_attribute_mapping is not None:
        selected_cols += list(doc_attribute_mapping)

    documents_df.dropna(subset=[doc_filename_attribute], inplace=True)
    documents_df = documents_df.loc[
        (documents_df.language == 'en') & (documents_df.doc_mime_type == 'application/pdf')
    ]
    doc_dict = documents_df.loc[:, selected_cols].to_dict(orient='records')

    return doc_dict


def load_documents_from_csv(
    csv_filename: Path,
    doc_path: Path,
    doc_filename_attribute: str,
    document_store: BaseDocumentStore,
    doc_attribute_mapping: List=None
):
    """Loads documents in a given path into a document store
    """

    # Get the list of documents to be processed from the csv
    docs = get_doc_list_from_csv(csv_filename, doc_filename_attribute, doc_attribute_mapping)
    # Retrieve the text for each document
    docs = fetch_docs_from_files(doc_path, docs, doc_filename_attribute, doc_attribute_mapping)

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
    for d in tqdm(docs, unit='docs'):
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