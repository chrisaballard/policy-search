from typing import Union

from tqdm import tqdm

from ..parser.pdf_parser import PDFParser
from .fetch import DocumentSourceFetcher
from .base import BaseCallback


class DocumentProcessor():
    def __init__(
        self, 
        fetcher: DocumentSourceFetcher,
        parser: PDFParser,
        n_batch: int=100
    ):
        self._fetcher = fetcher
        self._parser = parser
        self._n_batch = n_batch
        self._callbacks = {}

    def add_callback(
        self, 
        callback_object: BaseCallback
    ):
        self._callbacks[callback_object.name] = callback_object

    def process_text(self):
        for callback in self._callbacks.values():
            callback.prepare()

        for doc_ix, (doc, doc_structure) in tqdm(enumerate(
            self._fetcher.get_text(self._parser, 'structure')), unit='docs'):
            for callback in self._callbacks.values():
                callback.add(doc=doc, doc_structure=doc_structure)

                if (doc_ix > 0 and doc_ix % self._n_batch == 0) or (doc_ix == self._fetcher.n_docs - 1):
                    callback.process_batch()

        for callback in self._callbacks.values():
            callback.finalise()
