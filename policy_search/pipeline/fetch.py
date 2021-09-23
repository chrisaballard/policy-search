"""Module defining classes for reading policy documents from various sources
"""

from pathlib import Path
from typing import List

import pandas as pd

LINE_SEPARATOR = '\n'

class DocumentSourceFetcher():
    """Fetches documents from a given source"""

    def __init__(
        self,
        attribute_mapping:List=None
    ):
        self._doc_dict = {}
        self._attribute_mapping = attribute_mapping
        self._attribute_col_names = self.attribute_col_names(attribute_mapping)

    def get_docs(self):
        raise NotImplementedError

    def get_text(self):
        raise NotImplementedError

    def _filter_attributes(self, doc_attributes: dict):
        """Remove attributes which are null"""

        filtered_attributes = {}

        for k, v in doc_attributes.items():
            if not pd.isnull(v):
                filtered_attributes[k] = v

        return filtered_attributes

    def attribute_col_names(self, attribute_mapping):
        return [a for a in attribute_mapping.keys()]


class CSVDocumentSourceFetcher(DocumentSourceFetcher):
    """Fetches documents from a csv file source"""

    def __init__(
        self,
        csv_filename: Path,
        csv_filename_col: str,
        attribute_mapping: dict=None,
    ):
        super().__init__(attribute_mapping)

        self._csv_filename = csv_filename
        self._csv_filename_col = csv_filename_col

    def get_docs(
        self,
    ) -> List[dict]:
        """Reads a csv to get a list of policy documents to process and returns a list of dictionaries containing policy
        documents and metadata.

        Args:
            csv_filename (str): filename of csv file
            doc_attribute_mapping (dict): optional dictionary mapping attributes to transformation functions
        """

        documents_df = pd.read_csv(
            self._csv_filename,
            dtype={'source_policy_id': int}
        )
        selected_cols = [self._csv_filename_col]
        if self._attribute_mapping is not None:
            selected_cols += list(self._attribute_col_names)

        documents_df.dropna(subset=[self._csv_filename_col], inplace=True)
        documents_df = documents_df.loc[
            (documents_df.language == 'en') & (documents_df.doc_mime_type == 'application/pdf'),
            selected_cols
        ]

        # Map columns in dataframe to attribute keys
        documents_df.rename(columns=self._attribute_mapping, inplace=True)

        # Transform dataframe to list of dictionaries
        self._doc_dict = documents_df.to_dict(orient='records')
        self._doc_dict = [
            {k: v for k, v in d.items() if pd.notnull(v)}
            for d in self._doc_dict
        ]

        return self._doc_dict

    def get_text(
        self,
        doc_path: Path, 
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

        if self._doc_dict is None:
            self.get_docs()

        for doc in self._doc_dict:
            doc_text = ''
            doc_filename = doc[self._csv_filename_col]
            with open(doc_path / doc_filename, 'rt') as doc_f:
                for l in doc_f:
                    doc_text = doc_text + LINE_SEPARATOR + l

            yield {
                    'text': doc_text,
                    'meta': self._filter_attributes(doc)
            }
                


