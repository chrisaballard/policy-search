import os
from pathlib import Path

import click
import yaml

from policy_search.pipeline.fetch import CSVDocumentSourceFetcher
from policy_search.pipeline.dynamo import PolicyDynamoDBTable
from policy_search.pipeline.opensearch import OpenSearchIndex
from policy_search.parser.pdf_parser import PDFParser
from policy_search.parser.passage_parser import PassageParser
from policy_search.pipeline.processor import DocumentProcessor
from policy_search.pipeline.dataset import PolicyTextDataset


TXT_FILEAME_ATTRIBUTE = "policy_txt_file"
DOC_FILENAME_ATTRIBUTE = "policy_content_file"

with open("./config.yml", "rt") as config_f:
    config = yaml.load(config_f)


def get_doc_fetcher(
    csv_filename: Path, doc_filename_attribute: str, fetch_count: int = None
):
    cclw_attributes = config["sources"]["cclw"]["attributes"]

    return CSVDocumentSourceFetcher(
        csv_filename, doc_filename_attribute, cclw_attributes, fetch_count
    )


@click.group()
def cli():
    click.echo("test")


@cli.command()
@click.argument("data-path", type=click.Path(exists=True))
@click.argument("document-filename", type=str)
@click.argument("embeddings-mapping-filename", type=str)
@click.argument("embeddings-filename", type=str)
@click.argument("predictions-filename", type=str)
@click.argument("embedding-dim", type=int)
@click.option(
    "-d",
    "--doc-filename-attribute",
    default=DOC_FILENAME_ATTRIBUTE,
    help="name of column in csv containing text filename",
)
def load(
    data_path: Path,
    document_filename: str,
    embeddings_mapping_filename: str,
    embeddings_filename: str,
    predictions_filename: str,
    doc_filename_attribute: str,
    embedding_dim: int,
):
    """Load already parsed documents from a given dataset file into dynamodb and
    opensearch"""

    data_path = Path(data_path)
    document_path = data_path / document_filename

    dynamodb_host = os.environ.get("dynamodb_host", "localhost")
    dynamodb_port = os.environ.get("dynamodb_port", "8000")
    dynamodb_url = f"http://{dynamodb_host}:{dynamodb_port}"

    # Get the document fetcher
    doc_fetcher = get_doc_fetcher(document_path, doc_filename_attribute)

    # Initialise passage parser
    doc_parser = PassageParser(
        data_path,
        embeddings_mapping_filename,
        embeddings_filename,
        predictions_filename,
        embedding_dim,
    )

    # Initialise dynamodb table
    dynamodb_table = PolicyDynamoDBTable(dynamodb_url, "policyId")

    # Initialise elasticsearch
    elastic_host = os.environ.get("elasticsearch_cluster", "https://localhost:9200")
    search_index = OpenSearchIndex(
        es_url=elastic_host,
        es_user="admin",
        es_password="admin",
        es_connector_kwargs={
            "use_ssl": False,
            "verify_certs": False,
            "ssl_show_warn": False,
        },
        embedding_dim=embedding_dim,
    )

    # Initialise document processor, add callback objects and process text
    doc_processor = DocumentProcessor(doc_fetcher, doc_parser, n_batch=50)
    doc_processor.add_callback(dynamodb_table)
    doc_processor.add_callback(search_index)
    doc_processor.process_text()


@cli.command()
@click.argument("data-path", type=click.Path(exists=True))
@click.argument("document-filename", type=str)
@click.argument("passage-dataset-filename", type=str)
@click.option(
    "-d",
    "--doc-filename-attribute",
    default=DOC_FILENAME_ATTRIBUTE,
    help="name of column in csv containing text filename",
)
def extract(
    data_path: Path,
    document_filename: str,
    passage_dataset_filename: str,
    doc_filename_attribute: str,
):
    """Parses pdf files listed in a csv dataset.
    The text from each pdf file is extracted and loaded into a dataset file.
    This file can then be loaded into opensearch using the cli load command
    """

    data_path = Path(data_path)
    document_path = data_path / document_filename
    passage_dataset_path = data_path / passage_dataset_filename

    # Get the document fetcher
    doc_fetcher = get_doc_fetcher(document_path, doc_filename_attribute)

    # Initialise pdf document parser
    doc_parser = PDFParser(data_path, "content", "text", save_pdf_text=True)

    # Initialise policy text dataset
    dataset = PolicyTextDataset(passage_dataset_path, is_batched=True)

    # Initialise document processor, add callback objects and process text
    doc_processor = DocumentProcessor(doc_fetcher, doc_parser, n_batch=50)
    doc_processor.add_callback(dataset)

    doc_processor.process_text()


if __name__ == "__main__":
    cli()
