"""Returns document passages that have already been parsed from a pdf file,
and are stored in a dataset.
"""

from pathlib import Path
from typing import Tuple, Dict, List
from collections import defaultdict
import gzip

from .base import BaseParser
from ..logging import logging

import pandas as pd
import numpy as np


class PassageParser(BaseParser):
    def __init__(
        self,
        data_path: Path,
        embeddings_mapping_filename: str,
        embeddings_filename: str,
        predictions_filename: str,
        embedding_dim: int,
    ):
        super().__init__(data_path)

        self._data_path = data_path
        self._embeddings_mapping_filename = embeddings_mapping_filename
        self._embeddings_filename = embeddings_filename
        self._embedding_dim = embedding_dim
        self.predictions_filename = predictions_filename

        self.mapping = None
        self.embeddings = None
        self.predictions = None

        self._load()

    def _load(self):
        logging.debug("Loading embeddings mapping file...")
        with gzip.open(
            self._data_path / self._embeddings_mapping_filename
        ) as mapping_f:
            self.mapping = pd.read_pickle(mapping_f)
        self.mapping.set_index("policy_id", inplace=True)

        logging.debug("Loading embeddings...")
        self.embeddings = np.memmap(
            self._data_path / self._embeddings_filename, dtype="float32", mode="r+"
        ).reshape((-1, self._embedding_dim))

        logging.debug("Loading predictions file...")
        with gzip.open(self._data_path / self.predictions_filename) as pred_f:
            self.predictions = pd.read_csv(pred_f)

    def extract_text(self, **kwargs) -> Tuple[Dict[int, List[str]], str]:
        """Reads each text passage and returns a list of dictionaries containing
        passage text, embedding vector and predicted passage level attributes
        (e.g. sector and instrument)
        """

        extract_structure, doc_structure = super().extract_text(**kwargs)
        doc_ix, _, _ = self._get_arguments(**kwargs)

        # Get the passages for the given document
        try:
            policy_passages = self.mapping.loc[doc_ix, ["page_id", "text_id", "text"]]
            # Reset the index to page id
            policy_passages.set_index("page_id", drop=True, inplace=True)

            doc_structure = defaultdict(list)
            for page_id, passage in policy_passages.iterrows():
                doc_structure[page_id + 1].append(
                    {
                        "text_id": passage["text_id"],
                        "text": passage["text"],
                        "embedding": self.embeddings[passage["text_id"], :].tolist(),
                    }
                )
        except KeyError:
            logging.warn(
                f"Document {doc_ix} does not exist in {self._embeddings_mapping_filename}"  # noqa: E501
            )

        if not extract_structure:
            return self._convert_structure_to_string(doc_structure), None
        else:
            return doc_structure, None
