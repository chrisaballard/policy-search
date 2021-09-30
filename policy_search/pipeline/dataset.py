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
        save_filname: Path
    ):
        super().__init__('policy_dataset')

        self._save_filename = save_filname
        self._dataset = []

    @property
    def dataset(self):        
        return self._dataset

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
        self._dataset = pd.DataFrame(self._dataset)
        self.save()

    def save(self):
        self._dataset.to_csv(self._save_filename)

