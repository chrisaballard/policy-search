"""Defines the base class for parsers
"""

from pathlib import Path
from typing import Optional, List, Dict, Tuple


class BaseParser():
    def __init__(
        self,
        data_path: Path,
    ):
        self.data_path = data_path

    def _convert_structure_to_string(
        self,
        doc_structure: List[dict]
    ) -> str:
        doc_string = ''
        for page_ix in doc_structure.keys():
            for sent in doc_structure[page_ix]:
                sent = sent + '\n'
                doc_string += sent

        return doc_string

    def _get_arguments(self, **kwargs):
        doc_ix = kwargs.get('doc_ix', None)
        doc_filename = kwargs.get('doc_filename', None)
        extract_type = kwargs.get('extract_type', 'string')

        return doc_ix, doc_filename, extract_type

    def extract_text(
        self,
        **kwargs,
    ) -> Tuple[bool, Dict[int, List[str]]]:
        """Extract text from a given document. Must be implemented in derived classes
        """
        doc_ix, doc_filename, extract_type = self._get_arguments(**kwargs)

        assert(extract_type in ['structure', 'string'])

        extract_structure = False
        if extract_type == 'structure':
            extract_structure = True

        doc_structure = {}

        return extract_structure, doc_structure