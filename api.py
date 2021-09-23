from typing import Optional
import os

from fastapi import FastAPI
import uvicorn

from policy_search.pipeline.dynamo import PolicyDynamoDBTable, PolicyList, Policy


POLICIES_TABLE = 'Policies'

dynamodb_host = os.environ.get('dynamodb_host', 'localhost')
dynamodb_port = os.environ.get('dynamodb_port', '8000')
dynamodb_url = f'http://{dynamodb_host}:{dynamodb_port}'

policy_table = PolicyDynamoDBTable(dynamodb_url, 'policyId')

app = FastAPI()


@app.get('/policies/{policy_id}/', response_model=Policy)
def read_policy(
    policy_id: int,
):
    """Fetch a specific policy by id"""

    return policy_table.get_document(policy_id)

@app.get('/policies/', response_model=PolicyList)
async def read_policies(
    start: int=0,
    limit: int=100,
):
    """Return all policies"""

    return policy_table.scan(start, limit)

@app.get('/policies/search/')
def search_policies(
    query: str, 
    start: int=0, 
    limit: int=100
):
    "Search for policies given a specified query"

    return {'search': 'foo'}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

