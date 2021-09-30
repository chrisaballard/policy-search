"""Build a dataset consisting of passage level entries
"""

from typing import List, Dict
from pathlib import Path

import pandas as pd

from .models.policy import Policy
from .base import BaseCallback


class PolicyTextDataset(BaseCallback):
    def __init__(
        self,
        save_filename: Path,
        is_batched: bool=True
    ):
        super().__init__('policy_dataset', is_batched)

        self._save_filename = save_filename
        self._dataset = []

    @property
    def dataset(self):        
        return self._dataset

    def prepare(self):
        if self._save_filename.exists():
            self._save_filename.unlink()

    def add(
        self, 
        **kwargs,
    ):
        doc, doc_structure = super().add(**kwargs)

        for page_ix, doc_page in doc_structure.items():
            for page_passage_text in doc_page:
                if len(page_passage_text) > 0:
                    passage_entry = {
                        'policy_id': doc.policy_id,
                        'policy_name': doc.policy_name,
                        'page_id': page_ix,
                        'text': page_passage_text
                    }
                    self._dataset.append(passage_entry)

    def finalise(self):
        if not self.is_batched:
            self._dataset = pd.DataFrame(self._dataset)
            self.save(self._dataset, 'w', True)

    def save(self, dataset, mode, header):
        dataset.to_csv(self._save_filename, mode=mode, header=header, index=False)

    def process_batch(self):
        if self.is_batched:
            batch = pd.DataFrame(self._dataset)

            mode = 'w'
            header = True
            if self._save_filename.exists():
                mode = 'a'
                header = False
            
            self.save(batch, mode, header)
            self._dataset = []

