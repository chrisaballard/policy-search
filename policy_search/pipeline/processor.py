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
    ):
        self._fetcher = fetcher
        self._parser = parser
        self._callbacks = {}

    def add_callback(
        self, 
        callback_object: BaseCallback
    ):
        self._callbacks[callback_object.name] = callback_object

    def process_text(self):
        for doc, doc_structure in tqdm(self._fetcher.get_text(self._parser, 'structure'), unit='docs'):
            for callback in self._callbacks.values():
                callback.add(doc=doc, doc_structure=doc_structure)

        for callback in self._callbacks.values():
            callback.finalise()
