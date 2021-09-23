import os
from pathlib import Path

import click
from click.core import batch
from click.decorators import pass_context
import yaml
# from haystack.document_store import ElasticsearchDocumentStore
# from haystack.retriever.sparse import ElasticsearchRetriever
# from haystack.pipeline import ExtractiveQAPipeline
# from haystack.reader import FARMReader
# from haystack.utils import print_answers

from policy_search.pipeline.fetch import CSVDocumentSourceFetcher
from policy_search.pipeline.dynamo import PolicyDynamoDBTable
from policy_search.search.results import format_policy_search_results, pretty_print_answers


DOC_FILEAME_ATTRIBUTE = 'policy_txt_file'

@click.group()
@click.pass_context
def main(ctx):
    ctx.ensure_object(dict)
    #ctx.obj['document_store'] = ElasticsearchDocumentStore(index='policy', name_field='policy_name')

@main.command()
@click.pass_context
@click.argument('doc-path', type=click.Path(exists=True))
@click.argument('csv-filename', type=click.Path(exists=True))
@click.option('-d', '--doc-filename-attribute', default=DOC_FILEAME_ATTRIBUTE, 
    help='name of column in csv containing text filename'
)
def load(ctx, doc_path: Path, csv_filename: Path, doc_filename_attribute: str):
    """Load policy documents into dynamodb and elastic search"""
    doc_path = Path(doc_path)
    csv_filename = Path(csv_filename)
    with open('./config.yml', 'rt') as config_f:
        config = yaml.load(config_f)

    # Get initialised document store from click context
    # document_store = ctx.obj['document_store']
    # load_documents_from_csv(
    #     csv_filename,
    #     doc_path,
    #     doc_filename_attribute,
    #     document_store,
    #     config['attributes']
    # )

    dynamodb_host = os.environ.get('dynamodb_host', 'localhost')
    dynamodb_port = os.environ.get('dynamodb_port', '8000')
    dynamodb_url = f'http://{dynamodb_host}:{dynamodb_port}'

    cclw_attributes = config['sources']['cclw']['attributes']
    fetcher = CSVDocumentSourceFetcher(csv_filename, DOC_FILEAME_ATTRIBUTE, cclw_attributes)

    policy_table = PolicyDynamoDBTable(dynamodb_url, 'policyId')
    policy_table.load(fetcher)


@main.command()
@click.pass_context
def query(ctx):
    # Get initialised document store from click context
    document_store = ctx.obj['document_store']
    retriever = ElasticsearchRetriever(document_store=document_store)
    reader = FARMReader(model_name_or_path="deepset/roberta-base-squad2", use_gpu=False)
    policy_search_pipeline = ExtractiveQAPipeline(reader, retriever)
    search_prediction = policy_search_pipeline.run(query='what incentives are used to encourage ev takeup')
    pretty_print_answers(format_policy_search_results(search_prediction))


if __name__ == '__main__':
    main(obj={})