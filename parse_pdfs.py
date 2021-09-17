"""PDF layout parsing
"""

from pathlib import Path
import re
from operator import itemgetter
from itertools import groupby

from pipeline.load_documents import get_doc_list_from_csv
from pipeline.preprocess import clean_text

import fitz
import spacy
import numpy as np
from sortedcontainers import SortedKeyList


MIN_WORDS_SPAN = 0
MIN_WORDS_LINE = 5
MIN_LEN_TEXT_BLOCK = 5
WORD_SEPARATOR = ' '
SENTENCE_SEPARATOR = '.'
LIND_ENDINGS = ['.', ';', '?', '!']

# Regex expressions for substitutions in an extracted text span
regex_span_sub = [
    (
        # regex to identify repeated non-word characters, commonly found in contents pages
        re.compile(r'[^\w|\s]{2,}[0-9]*'), 
        ''
    ),
    (
        # Replace non-breaking spaces with space character
        re.compile(r'\xa0'),
        ' '
    )
]

# Regex expression for matching line endings
regex_line_endings = re.compile(r'[?|.|!|;]\Z')


class PolicyPDFTextExtractor():
    def __init__(
        self,
        data_path: Path,
        content_dir: str,
        text_dir: str,
    ):
        self.data_path = data_path
        self.content_path = data_path / content_dir
        self.text_path = data_path / text_dir
        self.nlp = spacy.load('en_core_web_sm')

    def apply_regex_subs(self, string):
        for regex_pattern, repl_string in regex_span_sub:
            string = re.sub(regex_pattern, repl_string, string)
        
        return string

    def flags_decomposer(self, flags):
        """Make font flags human readable."""
        l = []
        if flags & 2 ** 0:
            l.append("superscript")
        if flags & 2 ** 1:
            l.append("italic")
        if flags & 2 ** 2:
            l.append("serifed")
        else:
            l.append("sans")
        if flags & 2 ** 3:
            l.append("monospaced")
        else:
            l.append("proportional")
        if flags & 2 ** 4:
            l.append("bold")
        
        return l

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
        blocks = document[page_ix].get_text('dict')['blocks']
        page_text_blocks = []
        for b in blocks:
            if b['type'] == 0:
                ptb = []
                ptb_y1 = []
                for l in b['lines']:
                    ptb_l =[]
                    for s in l['spans']:
                        s_flags = self.flags_decomposer(s['flags'])
                        # Ignore superscript text as is likely to be a reference
                        if 'superscript' not in s_flags:
                            text = self.apply_regex_subs(s['text'])
                            #if len(text.split(WORD_SEPARATOR)) > MIN_WORDS_SPAN:
                            ptb_l.append(text)
                    if len(ptb_l) > 0:
                        ptb.append(''.join(ptb_l))

                # Get block vertical position of top and bottom
                b_y0, b_y1 = b['bbox'][1], b['bbox'][3]
                ptb_y1.append((b_y0, b_y1))
                line_spacing = self.block_line_spacing(ptb_y1)
                
                if len(ptb) > 0:
                    # If there is no final character ending the line, then add one
                    # if len(re.findall(regex_line_endings, ptb[-1].strip())) == 0:
                    #     ptb[-1] = ptb[-1].strip() + SENTENCE_SEPARATOR
                    x0, y0, x1, y1 = b['bbox']
                    page_text_blocks.append((x0, y0, x1, y1, ' '.join(ptb), b['type']))
                            

        # Sort the textblocks in natural reading order, by sorting on y1 and x0
        page_text_blocks_sorted = SortedKeyList(page_text_blocks, key=itemgetter(3, 0))

        extracted_text_blocks = []
        for x1, y1, x2, y2, text, block_type in page_text_blocks_sorted:
            if block_type == 0:
                # Split on newlines, ignore text with a single word on a line, otherwise concatenate
                # text_lines = [
                #     [
                #         w.strip() for w in 
                #         tl.split(WORD_SEPARATOR)
                #         if len(w) > 0
                #     ] for tl in text.strip().split('\n')
                # ]
                #text_lines = [tl for tl in text_lines if len(tl) >= MIN_WORDS_LINE]
                #text = ' '.join(' '.join([w for w in tl]) for tl in text_lines)
                # Remove newlines
                text = text.replace('\n', ' ')
                # Replace multiple spaces
                text = re.sub(r'\s{2,}', ' ', text)
                # Strip spaces
                text = text.strip()
                
                if len(text.split(' ')) > MIN_LEN_TEXT_BLOCK:
                    extracted_text_blocks.append(text)

        # Concatenate extracted text blocks
        page_text = WORD_SEPARATOR.join(extracted_text_blocks)

        # Occasionally, duplicated text is being extracted from the pdf - remove these cases
        # TODO: remove dups

        # Final cleaning of page text
        page_text = clean_text(page_text)

        return page_text

    def open(self, pdf_filename):
        return fitz.open(self.content_path / pdf_filename)

    def sentence_segmenter(self, page_text, min_line_length=MIN_WORDS_LINE):
        doc = self.nlp(page_text)

        return [sent.text for sent in doc.sents if len(sent.text.split(WORD_SEPARATOR)) >= MIN_WORDS_LINE]

    def extract_text(self, pdf_filename: Path, save_text: bool=False):
        doc_structure = {}

        doc = self.open(pdf_filename)
        # Remove hidden and sensitive text
        doc.scrub()
        
        for doc_page_ix in range(0, doc.page_count):
            page_text = self.extract_text_blocks_on_page(doc, doc_page_ix)

            # If we extracted text, then add to doc structure
            if len(page_text) > 0:
                doc_structure[doc_page_ix] = self.sentence_segmenter(page_text)

        doc.close()

        if save_text:
            self.save_text(doc_structure, pdf_filename)

        return doc_structure

    def save_text(self, doc_structure, pdf_filename):
        text_filename = self.text_path / f'{pdf_filename.stem}.txt'
        with open(text_filename, 'wt') as text_f:
            for page_ix in doc_structure:
                for sent in doc_structure[page_ix]:
                    text_f.write(sent + '\n')

    def process_pdfs(self, csv_path: Path):
        content_filename_col = 'policy_content_file'
        docs = get_doc_list_from_csv(csv_path, content_filename_col)

        # Iterate over documents, generate page images and perform layout analysis
        for doc in docs:
            pdf_filename = Path(doc[content_filename_col])

            doc_text = self.extract_text(pdf_filename, save_text=True)


def main(csv_filename: Path, data_path: Path):
    pdf_extractor = PolicyPDFTextExtractor(data_path, 'content', 'text_new')

    # Test 1 - multiple figures, charts and tables
    # "Gear Change, A bold vision for cycling and walking"
    pdf_filename = Path('cclw-9487-328f4a0991ba45d2b2bcc127fde4ea28.pdf')
    # Test 2 - more conventional doc structure with bulleted lists
    # "National home retrofit scheme 2020"
    #pdf_filename = Path('cclw-10000-99686d8409b541ec98b6938af58af923.pdf')
    # Test 3 - 2 column layout
    pdf_filename = Path('cclw-10046-169a288207764ad0bdd5598cedd1d5d0.pdf')

    # Test 4 - multiple tables + multi-column layout
    pdf_filename = Path('cclw-10086-357cef7658b8440b823e4c76c0b09745.pdf')
    # In this document, text from the separate columns is flowing together into individual lines because the columns are close together

    # Test 5 - standard document layout
    pdf_filename = Path('cclw-9999-0e15395e46754c6c96fcfc19815a6fd8.pdf')

    # cclw-9487-328f4a0991ba45d2b2bcc127fde4ea28.txt
    #doc_structure = pdf_extractor.extract_text(pdf_filename)
    doc = pdf_extractor.open(pdf_filename)
    extracted_text_blocks = pdf_extractor.extract_text_blocks_on_page(doc, 4)
    #doc_structure = pdf_extractor.extract_text(pdf_filename, save_text=True)

    # Process all pdfs
    #pdf_extractor.process_pdfs(csv_filename)
    

if __name__ == '__main__':
    csv_filename = Path('./data/corpus_20210701/processed_policies.csv')
    data_path = Path('./data/corpus_20210701')

    main(csv_filename, data_path)