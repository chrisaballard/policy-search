import os
from pathlib import Path

import click
from click.core import batch
from click.decorators import pass_context
import yaml

from policy_search.pipeline.fetch import CSVDocumentSourceFetcher
from policy_search.pipeline.dynamo import PolicyDynamoDBTable
from policy_search.pipeline.elasticsearch import ElasticSearchIndex
from policy_search.parser.pdf_parser import PDFParser
from policy_search.pipeline.processor import DocumentProcessor
from policy_search.pipeline.dataset import PolicyTextDataset


TXT_FILEAME_ATTRIBUTE = 'policy_txt_file'
DOC_FILENAME_ATTRIBUTE = 'policy_content_file'

with open('./config.yml', 'rt') as config_f:
    config = yaml.load(config_f)

@click.group()
@click.pass_context
def main(ctx):
    ctx.ensure_object(dict)

@main.command()
@click.pass_context
@click.argument('data-path', type=click.Path(exists=True))
@click.argument('csv-filename', type=click.Path(exists=False))
@click.option('-d', '--doc-filename-attribute', default=DOC_FILENAME_ATTRIBUTE, 
    help='name of column in csv containing text filename'
)
def load(ctx, data_path: Path, csv_filename: Path, doc_filename_attribute: str):
    """Load policy documents into dynamodb and elastic search"""
    data_path = Path(data_path)
    csv_filename = data_path / csv_filename

    dynamodb_host = os.environ.get('dynamodb_host', 'localhost')
    dynamodb_port = os.environ.get('dynamodb_port', '8000')
    dynamodb_url = f'http://{dynamodb_host}:{dynamodb_port}'

    cclw_attributes = config['sources']['cclw']['attributes']
    doc_fetcher = CSVDocumentSourceFetcher(
        csv_filename, 
        doc_filename_attribute, 
        cclw_attributes,
    )

    # Initialise dynamodb table
    dynamodb_table = PolicyDynamoDBTable(dynamodb_url, 'policyId')

    # Initialise pdf document parser
    doc_parser = PDFParser(data_path, 'content', 'text', save_pdf_text=True)

    # Initialise policy text dataset
    dataset = PolicyTextDataset(Path('./data/policy_dataset.csv'), is_batched=True)

    # Initialise elasticsearch
    elastic_host = os.environ.get('elasticsearch_cluster', 'localhost:9200')
    es = ElasticSearchIndex(es_url=elastic_host)
    # es.delete_and_create_index()

    # Initialise document processor, add callback objects and process text
    doc_processor = DocumentProcessor(doc_fetcher, doc_parser, n_batch=50)
    doc_processor.add_callback(dataset)
    doc_processor.add_callback(dynamodb_table)
    doc_processor.add_callback(es)
    doc_processor.process_text()
    

if __name__ == '__main__':
    main(obj={})