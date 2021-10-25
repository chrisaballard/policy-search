"""PDF layout parsing
"""

from pathlib import Path
import re
from operator import itemgetter
from typing import List, Tuple, Dict

from policy_search.pipeline.fetch import CSVDocumentSourceFetcher
from policy_search.pipeline.preprocess import clean_text
from .base import BaseParser

import fitz
import spacy
from sortedcontainers import SortedKeyList

# Supress fitz layout errors
# fitz.TOOLS.mupdf_display_errors(False)


MIN_WORDS_SPAN = 0
MIN_WORDS_LINE = 2
MIN_LEN_TEXT_BLOCK = 2
WORD_SEPARATOR = " "
SENTENCE_SEPARATOR = "."
LIND_ENDINGS = [".", ";", "?", "!"]

# Regex expressions for substitutions in an extracted text span
regex_span_sub = [
    (
        # regex to identify repeated non-word characters, commonly found in contents
        # pages
        re.compile(r"[^\w|\s]{2,}[0-9]+"),
        "",
    ),
    (
        # Replace non-breaking spaces with space character
        re.compile(r"\xa0"),
        " ",
    ),
    (
        # Replace newlines with a space character
        re.compile(r"\n"),
        " ",
    ),
]

# Regex expression for matching line endings
regex_line_endings = re.compile(r"[?|.|!|;]\Z")


class PDFParser(BaseParser):
    def __init__(
        self, data_path: Path, content_dir: str, text_dir: str, save_pdf_text: bool
    ):
        super().__init__(data_path)

        self.content_path = data_path / content_dir
        self.text_path = data_path / text_dir
        self.save_pdf_text = save_pdf_text

        self.nlp = spacy.load("en_core_web_sm")

    def apply_regex_subs(self, string):
        for regex_pattern, repl_string in regex_span_sub:
            string = re.sub(regex_pattern, repl_string, string)

        return string

    def flags_decomposer(self, flags):
        """Make font flags human readable."""
        _list = []
        if flags & 2 ** 0:
            _list.append("superscript")
        if flags & 2 ** 1:
            _list.append("italic")
        if flags & 2 ** 2:
            _list.append("serifed")
        else:
            _list.append("sans")
        if flags & 2 ** 3:
            _list.append("monospaced")
        else:
            _list.append("proportional")
        if flags & 2 ** 4:
            _list.append("bold")

        return _list

    def block_line_spacing(self, ptb_y1):
        ly_diff = []
        if len(ly_diff) > 1:
            for ly_ix, ly in enumerate(ptb_y1):
                if ly_ix > 0:
                    ly_diff.append(ly[1] - ptb_y1[ly_ix - 1][1])

            return int(sum(ly_diff) / len(ly_diff))
        else:
            return ptb_y1[0][1] - ptb_y1[0][0]

    def extract_text_blocks_on_page(self, document: fitz.Document, page_ix: int):
        # Fetch all text blocks (approximately paragraphs) from the page
        blocks = document[page_ix].get_text("dict", flags=fitz.TEXT_DEHYPHENATE)[
            "blocks"
        ]
        page_text_blocks = []
        for b in blocks:
            if b["type"] == 0:
                ptb = []
                for line in b["lines"]:
                    ptb_l = []
                    for s in line["spans"]:
                        s_flags = self.flags_decomposer(s["flags"])
                        # Ignore superscript text as is likely to be a reference
                        if "superscript" not in s_flags:
                            text = self.apply_regex_subs(s["text"])
                            ptb_l.append(text)
                    if len(ptb_l) > 0:
                        ptb.append("".join(ptb_l))

                if len(ptb) > 0:
                    x0, y0, x1, y1 = b["bbox"]
                    page_text_blocks.append((x0, y0, x1, y1, " ".join(ptb), b["type"]))

        # Sort the textblocks in natural reading order, by sorting on y1 and x0
        page_text_blocks_sorted = SortedKeyList(page_text_blocks, key=itemgetter(0, 3))

        extracted_text_blocks = []
        for x1, y1, x2, y2, text, block_type in page_text_blocks_sorted:
            if block_type == 0:
                # Replace multiple spaces
                text = re.sub(r"\s{2,}", " ", text)
                # Strip spaces off beginning and end
                text = text.strip()

                if len(text.split(" ")) > MIN_LEN_TEXT_BLOCK:
                    extracted_text_blocks.append(text)

        # Concatenate extracted text blocks
        page_text = WORD_SEPARATOR.join(extracted_text_blocks)

        # Occasionally, duplicated text is being extracted from the pdf - remove these
        # cases
        # TODO: remove dups

        # Final cleaning of page text
        page_text = clean_text(page_text)

        return page_text

    def open(self, pdf_filename):
        return fitz.open(self.content_path / pdf_filename)

    def sentence_segmenter(self, page_text, min_line_length=MIN_WORDS_LINE):
        doc = self.nlp(page_text)

        return [
            sent.text
            for sent in doc.sents
            if len(sent.text.split(WORD_SEPARATOR)) >= MIN_WORDS_LINE
        ]

    def extract_text(
        self, 
        **kwargs,
    ) -> Tuple[Dict[int, List[str]], str]:
        """Use the PDF parser to extract the text for each page
        """

        extract_structure, doc_structure = super().extract_text(**kwargs)
        _, doc_filename, _ = self._get_arguments(**kwargs)

        try:
            doc = self.open(doc_filename)
            
            for doc_page_ix in range(0, doc.page_count):
                page_text = self.extract_text_blocks_on_page(doc, doc_page_ix)

                # If we extracted text, then add to doc structure.
                # Page index starts at 1.
                if len(page_text) > 0:
                    doc_structure[doc_page_ix + 1] = [
                        sent.strip() for sent in self.sentence_segmenter(page_text)
                    ]
                else:
                    doc_structure[doc_page_ix + 1] = []

            doc.close()
        except Exception:
            return doc_structure, None

        text_filename = None
        if self.save_pdf_text:
            text_filename = self.save_text(doc_structure, doc_filename)

        if not extract_structure:
            return self._convert_structure_to_string(doc_structure), text_filename
        else:
            return doc_structure, text_filename

    def save_text(self, doc_structure, pdf_filename):
        text_filename = f"{pdf_filename.stem}.txt"
        text_path = self.text_path / text_filename
        with open(text_path, "wt") as text_f:
            for page_ix in doc_structure:
                for sent in doc_structure[page_ix]:
                    text_f.write(sent + "\n")

        return text_filename

    def process_pdfs(
        self,
        doc_fetcher: CSVDocumentSourceFetcher,
        save_text: bool = False,
        yield_text: bool = True,
    ):
        content_filename_col = "policy_content_file"
        docs = doc_fetcher.get_docs()

        # Iterate over documents, generate page images and perform layout analysis
        for doc in docs:
            pdf_filename = Path(doc[content_filename_col])

            doc_text = self.extract_text(
                pdf_filename,
            )

            if yield_text:
                yield doc_text
