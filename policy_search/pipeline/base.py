"""Defines base classes for objects
"""

from typing import List

from .models.policy import Policy


class BaseCallback():
    def __init__(self, name: str, is_batched: bool=True):
        self.name = name
        self.is_batched = is_batched

    def prepare(self):
        """Prepare data for processing"""
        pass

    def add(self, **kwargs):
        """Add a policy document"""

        doc = kwargs.get('doc', {})
        doc_structure = kwargs.get('doc_structure', {})

        return doc, doc_structure

    def finalise(self):
        """Finalise the dataset after processing"""
        pass

    def process_batch(self):
        """Process a batch during processing"""
        pass
