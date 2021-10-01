from typing import Optional, List
import os

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from elasticsearch import NotFoundError as ElasticNotFoundError

from policy_search.pipeline.dynamo import PolicyDynamoDBTable, PolicyList, Policy
from policy_search.pipeline.elasticsearch import ElasticSearchIndex
from policy_search.pipeline.models.policy import PolicyPageText, PolicySearchResponse


POLICIES_TABLE = 'Policies'

dynamodb_host = os.environ.get('dynamodb_host', 'localhost')
dynamodb_port = os.environ.get('dynamodb_port', '8000')
dynamodb_url = f'http://{dynamodb_host}:{dynamodb_port}'

policy_table = PolicyDynamoDBTable(dynamodb_url, 'policyId')

elastic_host = os.environ.get('elasticsearch_cluster', 'localhost:9200')
es = ElasticSearchIndex(es_url=elastic_host)

app = FastAPI()

# Add CORS middleware to allow cross origin requests from any port on localhost
# Note: this is likely to need changing for deployment
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex='https?:\/\/localhost:?[0-9]*',
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/policies/', response_model=PolicyList)
async def read_policies(
    start: int=0,
    limit: int=100,
):
    """Return all policies"""

    return policy_table.scan(start, limit)

@app.get('/policies/search/')#, response_model=PolicySearchResponse)
def search_policies(
    query: str, 
    start: Optional[int]=0, 
    limit: Optional[int]=100,
    geography: Optional[List[str]] = Query(None),
):
    "Search for policies given a specified query"

    if geography:
        kwd_filters = {
            "country_code.keyword": geography
        }
    else:
        kwd_filters = None

    # There is no option to offset results for terms aggregation queries, so instead we 
    # get the first `start+limit` results and offset them by `start`.
    search_result = es.search(
        query,
        limit=start+limit,
        keyword_filters=kwd_filters,
    )

    results_by_doc = search_result["aggregations"]["top_docs"]["buckets"]

    query_results_by_doc = []

    for result in results_by_doc[start : start+limit]:
        hits_by_page = result["top_passage_hits"]["hits"]["hits"]
        # num_pages_with_hit = result["doc_count"]
        policy_id = result["key"]

        document_response = []

        for hit in hits_by_page:
            if "highlight" in hit:
                # Only return a page if there is at least one text match in the page
                document_response.append({
                    "pageNumber": hit["_source"]["page_number"],
                    "text": hit["highlight"]["text"],
                })

        query_results_by_doc.append(
            {   
                "policyId": policy_id,
                "resultsByPage": document_response,
            }
        )

    response = {
        "metadata": {
            "numDocsReturned": len(results_by_doc[start : start+limit]),
        },
        "resultsByDocument": query_results_by_doc,
    }

    return response

@app.get('/policies/{policy_id}/', response_model=Policy)
def read_policy(
    policy_id: int,
):
    """Fetch a specific policy by id"""

    return policy_table.get_document(policy_id)

@app.get('/policies/{policy_id}/text/', response_model=PolicyPageText)
def get_policy_text_by_page(
    policy_id: int,
    page: int,
):
    """Get the text of one page of a policy document"""

    doc_id = f"{policy_id}_page{page}"

    try:
        es_doc = es.get_doc_by_id(doc_id)
        page_text = es_doc["_source"]["text"]
        return {
            "documentMetadata": {},
            "pageText": page_text,
        }

    except ElasticNotFoundError:
        raise HTTPException(status_code=404, detail="Policy document or page within it not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

