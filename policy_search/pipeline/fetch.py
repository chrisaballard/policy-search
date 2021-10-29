"""Module defining classes for reading policy documents from various sources
"""

from pathlib import Path
from typing import List, Dict, Tuple
from functools import partial

import pandas as pd

from .models.policy import Policy
from . import transform


LINE_SEPARATOR = '\n'

class DocumentSourceFetcher():
    """Fetches documents from a given source"""

    def __init__(
        self,
        attribute_mapping:List=None,
        fetch_count: int=None
    ):
        self._docs = []
        self.n_docs = 0
        self._attribute_mapping = attribute_mapping
        
        self.fetch_count = fetch_count

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

    @property
    def _attribute_col_names(self):
        """Return column names given in attribute mapping config"""

        return [a for a in self._attribute_mapping.keys()]

    @property
    def _attribute_target_field_names(self):
        """Return a mapping between attribute column names and target name"""

        return {a_name: a_settings["name"] for a_name, a_settings in self._attribute_mapping.items()}

    def _transform_attributes(self, docs: Dict[str, Dict[str, str]]):
        """Transforms attributes in the provided document dictionary using the configured attribute mapping"""

        # Get a dictionary mapping attribute name to a transformation function
        transform_fields = {}
        for a_settings in self._attribute_mapping.values():
            a_transform = a_settings.get("func_transform", None)
            if a_transform is not None:
                transform_func_name = a_transform["function"]
                transform_func_args = a_transform.get("args", {})
                _func_transform = partial(
                    getattr(transform, transform_func_name),
                    **transform_func_args
                )
                transform_fields[a_settings["name"]] = _func_transform

        # Process each document and attribute, applying required transformations where required
        for doc_ix, doc in enumerate(docs):
            for attribute_name, attribute_value in doc.items():
                _func_transform = transform_fields.get(attribute_name, None)
                if _func_transform is not None:
                    transformed_value = _func_transform(attribute_value)
                    docs[doc_ix][attribute_name] = transformed_value

        return docs

class CSVDocumentSourceFetcher(DocumentSourceFetcher):
    """Fetches documents from a dataset containing a list of documents and associated pdf files.
    Passages from each document are obtained by applying a pdf parser to each document.
    """

    def __init__(
        self,
        csv_filename: Path,
        csv_filename_col: str,
        attribute_mapping: dict=None,
        fetch_count: int=None
    ):
        super().__init__(attribute_mapping, fetch_count)

        self._csv_filename = csv_filename
        self._csv_filename_col = csv_filename_col

    def get_docs(
        self,
    ) -> List[Dict[str, str]]:
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
        documents_df.rename(columns=self._attribute_target_field_names, inplace=True)

        # Retain at most fetch_count documents if defined
        if self.fetch_count is not None:
            documents_df = documents_df.head(self.fetch_count)

        # Transform dataframe to list of dictionaries
        self._docs = documents_df.to_dict(orient='records')
        self._docs = [
            {k: v for k, v in d.items() if pd.notnull(v)}
            for d in self._docs
        ]

        self._docs = self._transform_attributes(self._docs)

        self.n_docs = len(self._docs)

        return self._docs

    def get_text(
        self,
        doc_parser,
        extract_type: str = 'string',
    ) -> Tuple[Policy, List[Dict[str, str]]]:
        """Uses a document parser to extract text from the list of documents provided when the object
        is initialised.
        """

        if len(self._docs) == 0:
            self.get_docs()

        for doc_ix, doc in enumerate(self._docs):
            doc_filename = Path(doc[self._csv_filename_col])
            doc_structure, text_filename = doc_parser.extract_text(
                doc_ix=doc_ix, 
                doc_filename=doc_filename, 
                extract_type=extract_type
            )
            doc['policyId'] = doc_ix
            doc['policy_txt_file'] = text_filename
            doc = Policy(**doc)

            yield doc, doc_structure

    def get_text_by_page(
        self,
        doc_parser,
    ) -> dict:
        return self.get_text(doc_parser, extract_type='structure')


