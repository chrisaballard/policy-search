from re import L
from typing import Union, List

import uuid

import boto3
from boto3.dynamodb.conditions import Key
from tqdm import tqdm
import pandas as pd

from .fetch import DocumentSourceFetcher, CSVDocumentSourceFetcher
from .models.policy import PolicyList, Policy


class DynamoDBTable():
    def __init__(
        self,
        dynamodb: Union[int, str],
        key_name: str,
        table_name: str,
    ):
        if dynamodb is not int:
            self._dynamodb = boto3.resource(
                'dynamodb',
                endpoint_url=dynamodb
            )
        else:
            self._dynamodb = dynamodb

        self._tables = [table.table_name for table in self._dynamodb.tables.all()]

        self._table_name = table_name
        self._key_name = key_name
        
        self._table = self.get_create_table()

    def get_create_table(
        self
    ):
        # Create policy table if it doesn't already exist
        if self._table_name not in self._tables:
            return self.create()
        else:
            return self._dynamodb.Table(self._table_name)

    def create(
        self,
    ):
        raise NotImplementedError

    def load(
        self,
        document_source_fetcher: DocumentSourceFetcher
    ):
        with self._table.batch_writer() as batch:
            for doc_ix, doc in enumerate(tqdm(document_source_fetcher.get_docs())):
                item = self._get_item_for_create(doc, doc_ix)
                item_key = item[self._key_name]
                batch.put_item(Item=item)
                doc[self._key_name] = item_key

    def scan(
        self,
        start_id: int=None,
        limit: int=100,
    ):
        scan_params = {'Limit': limit}
        if start_id is not None:
            scan_params['ExclusiveStartKey'] = {self._key_name: start_id}
        response = self._table.scan(**scan_params)
        
        items = []
        last_key = None
        count = 0

        if response['Count'] > 0:
            items = response['Items']
            last_key = response.get('LastEvaluatedKey', None)
            last_key = int(last_key[self._key_name])
            count = response.get('Count', 0)    

        return items, last_key, count

    def get_document(
        self,
        key
    ):
        response = self._table.query(
            KeyConditionExpression=Key(self._key_name).eq(key)
        )
        items = response['Items']
        if len(items) > 0:
            item = items[0]
        else:
            item = {}

        return item

    def _generate_unique_key(self):
        return uuid.uuid4().int

    def _get_item_for_create(self, doc, doc_ix=None):
        if doc_ix is None:
            unique_key = self._generate_unique_key()
        else:
            unique_key = doc_ix
        
        doc[self._key_name] = unique_key

        return doc

class PolicyDynamoDBTable(DynamoDBTable):
    def __init__(
        self,
        dynamodb: Union[int, str],
        key_name: str,
    ):
        super().__init__(dynamodb, key_name, 'Policies')        

    def create(
        self
    ):
        table =  self._dynamodb.create_table(
            TableName=self._table_name,
            KeySchema=[
                {
                    'AttributeName': self._key_name,
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': self._key_name,
                    'AttributeType': 'N'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 10,
                'WriteCapacityUnits': 10
            }
        )

        return table

    def get_document(self, key):
        policy = Policy(
            **super().get_document(key)
        )

        return policy

    def scan(self, start: int=None, limit: int=100):
        items, last_key, count = super().scan(start, limit)

        policies = [Policy(**item) for item in items]

        return PolicyList(policies=policies, last_key=last_key, count=count)

    

       

