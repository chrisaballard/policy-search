"""Defines base classes for objects
"""

from typing import List

from .models.policy import Policy


class BaseCallback():
    def __init__(self, name: str):
        self.name = name

    def add(self, **kwargs):
        doc = kwargs.get('doc', {})
        doc_structure = kwargs.get('doc_structure', {})

        return doc, doc_structure

    def finalise(self):
        pass
