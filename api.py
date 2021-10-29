from typing import Optional, List
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from elasticsearch import NotFoundError as ElasticNotFoundError
import numpy as np

from policy_search.pipeline.dynamo import PolicyDynamoDBTable, PolicyList, Policy
from policy_search.pipeline.opensearch import OpenSearchIndex
from policy_search.pipeline.models.policy import PolicyPageText, PolicySearchResponse
from policy_search.pipeline.semantic_search import SBERTEncoder
from temp_geographies.load_geographies_data import Geography, load_geographies_data
from schema.schema_helpers import get_schema_dict_from_path, SchemaTopLevel


POLICIES_TABLE = "Policies"

dynamodb_host = os.environ.get("dynamodb_host", "localhost")
dynamodb_port = os.environ.get("dynamodb_port", "8000")
dynamodb_url = f"http://{dynamodb_host}:{dynamodb_port}"

policy_table = PolicyDynamoDBTable(dynamodb_url, "policyId")

opensearch_host = os.environ.get("opensearch_cluster", "https://localhost:9200")
opensearch_user = os.environ.get("opensearch_user", None)
opensearch_password = os.environ.get("opensearch_password", None)
es = OpenSearchIndex(
    es_url=opensearch_host,
    es_user=opensearch_user,
    es_password=opensearch_password,
    es_connector_kwargs={
        "use_ssl": True,
        "verify_certs": True,
        "ssl_show_warn": False,
        "timeout": 120,
    },
)
query_encoder = SBERTEncoder("msmarco-distilbert-dot-v5")

app = FastAPI()

# Add CORS middleware to allow cross origin requests from any port
# NOTE: this is likely to need changing for deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/policies/", response_model=PolicyList)
async def read_policies(
    start: int = 0,
    limit: int = 100,
):
    """Return all policies"""

    return policy_table.scan(start, limit)


async def read_policies_by_ids(ids: List[int]):
    """Get policy metadata from a list of IDs"""
    return [policy_table.get_document(_id) for _id in ids]


@app.get("/policies/search/", response_model=PolicySearchResponse)
async def search_policies(
    query: Optional[str] = None,
    start: Optional[int] = 0,
    limit: Optional[int] = 100,
    geography: Optional[List[str]] = Query(None),
):
    "Search for policies given a specified query"

    INNERPRODUCT_THRESHOLD = 70

    if geography:
        kwd_filters = {"country_code.keyword": geography}
    else:
        kwd_filters = None

    if query is None:
        titles_ids_alphabetical = es.get_docs_sorted_alphabetically(
            "policy_name", asc=True, num_docs=start + limit, keyword_filters=kwd_filters
        )
        ids = [item["policy_id"] for item in titles_ids_alphabetical]
        documents = await read_policies_by_ids(ids)
        documents = documents[start : start + limit]

        return {
            "metadata": {
                "numDocsReturned": len(documents),
            },
            "resultsByDocument": documents,
        }

    # Encode query
    query_emb = query_encoder.encode(query)

    # There is no option to offset results for terms aggregation queries, so instead we
    # get the first `start+limit` results and offset them by `start`.
    search_result = es.search(
        query,
        query_emb,
        limit=start + limit,
        keyword_filters=kwd_filters,
    )

    results_by_doc = search_result["aggregations"]["top_docs"]["buckets"]

    query_results_by_doc = []

    # Iterate over each document returned from the query
    for result in results_by_doc[start : start + limit]:
        hits_by_page = result["top_passage_hits"]["hits"]["hits"]
        # num_pages_with_hit = result["doc_count"]
        policy_id = result["key"]

        document_response = []

        # Iterate over each page hit in each document
        for hit in hits_by_page:
            page_text_hits = []
            # Find the matching text passages and add to results
            for page_inner_hits in hit["inner_hits"]["text"]["hits"]["hits"]:
                passage_score = np.dot(
                    query_emb, page_inner_hits["_source"]["embedding"]
                )
                if passage_score >= INNERPRODUCT_THRESHOLD:
                    page_text_hits.append(page_inner_hits["_source"]["text"])

            # Add the page matches for this document
            if len(page_text_hits) > 0:
                document_response.append(
                    {
                        "pageNumber": hit["_source"]["page_number"],
                        "text": page_text_hits,
                    }
                )

            doc_metadata = await read_policies_by_ids([policy_id])
            doc_metadata = doc_metadata[0]

        # Add the query matches for this document
        if len(document_response) > 0:
            query_results_by_doc.append(
                {
                    "policyId": policy_id,
                    "policyName": doc_metadata.policy_name,
                    "policyType": doc_metadata.policy_type,
                    "countryCode": doc_metadata.country_code,
                    "sourceName": doc_metadata.source_name,
                    "url": doc_metadata.url,
                    "language": doc_metadata.language,
                    "resultsByPage": document_response,
                }
            )

    response = {
        "metadata": {
            "numDocsReturned": len(results_by_doc[start : start + limit]),
        },
        "resultsByDocument": query_results_by_doc,
    }

    return response


@app.get("/policies/{policy_id}/", response_model=Policy)
def read_policy(
    policy_id: int,
):
    """Fetch a specific policy by id"""

    return policy_table.get_document(policy_id)


@app.get("/policies/{policy_id}/text/", response_model=PolicyPageText)
def get_policy_text_by_page(
    policy_id: int,
    page: int,
):
    """Get the text of one page of a policy document"""

    doc_id = f"{policy_id}_page{page}"

    try:
        # Get the page text for the given document and page
        es_doc = es.get_doc_by_id(doc_id, _source=["text.text_id", "text.text"])
        page_text = [item["text"] for item in es_doc["_source"]["text"]]

        # Get the total page count for the document
        page_count = es.get_page_count_for_doc(policy_id)
        return {
            "documentMetadata": {"pageCount": page_count},
            "pageText": page_text,
        }

    except ElasticNotFoundError:
        raise HTTPException(
            status_code=404, detail="Policy document or page within it not found"
        )


@app.get("/geographies", response_model=List[Geography])
def get_geographies():
    """Get information on geographies. Currently from a static CSV."""

    GEOGRAPHIES_CSV_PATH = Path("./temp_geographies/geographies.csv")

    return load_geographies_data(GEOGRAPHIES_CSV_PATH)


@app.get("/instruments", response_model=List[SchemaTopLevel])
def get_instruments():
    return get_schema_dict_from_path("./schema/instruments.yml")


@app.get("/sectors", response_model=List[SchemaTopLevel])
def get_sectors():
    return get_schema_dict_from_path("./schema/sectors.yml")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
