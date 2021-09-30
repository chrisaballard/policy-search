"""Module defining classes for reading policy documents from various sources
"""

from pathlib import Path
from typing import List

import pandas as pd

from .models.policy import Policy


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
        doc_parser,
        extract_type: str = 'string',
    ) -> dict:

        if self._doc_dict is None:
            self.get_docs()

        for doc in self._doc_dict:
            doc_filename = Path(doc[self._csv_filename_col])
            doc_structure, text_filename = doc_parser.extract_text(doc_filename, extract_type)
            doc['policy_txt_file'] = text_filename
            doc = Policy(**doc)

            yield doc, doc_structure

    def get_text_by_page(
        self,
        doc_parser,
    ) -> dict:
        return self.get_text(doc_parser, extract_type='structure')

        