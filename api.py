from typing import Optional, List
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from opensearchpy import NotFoundError as OpenSearchNotFoundError

from policy_search.pipeline.dynamo import PolicyDynamoDBTable, PolicyList, Policy
from policy_search.pipeline.opensearch import OpenSearchIndex
from policy_search.pipeline.models.policy import PolicyPageText, PolicySearchResponse
from policy_search.pipeline.semantic_search import SBERTEncoder
from temp_geographies.load_geographies_data import Geography, load_geographies_data
from schema.schema_helpers import Schema, get_schema_dict_from_path, SchemaTopLevel
from policy_search.logging import get_logger

logger = get_logger("api")

# Get sector and instrument schemas
instrument_schema = Schema.from_yaml_path("./schema/instruments.yml")
sector_schema = Schema.from_yaml_path("./schema/sectors.yml")

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


@app.get("/policies/multiple/", response_model=List[Policy])
async def read_policies_by_ids(id: List[int] = Query([])):
    """Get policy metadata from a list of IDs"""

    policies = []

    for _id in id:
        policy = policy_table.get_document(_id)
        if policy is not None:
            policies.append(policy)
        else:
            logger.error(f"Policy {_id} missing in call to /policies/multiple")

    return policies


@app.get("/policies/search/", response_model=PolicySearchResponse)
async def search_policies(
    query: Optional[str] = None,
    start: Optional[int] = 0,
    limit: Optional[int] = 100,
    geography: Optional[List[str]] = Query(None),
    year_start: Optional[int] = Query(None),
    year_end: Optional[int] = Query(None),
    sector: Optional[List[str]] = Query(None),
    instrument: Optional[List[str]] = Query(None),
    response: Optional[List[str]] = Query(None),
    hazard: Optional[List[str]] = Query(None),
    document_type: Optional[List[str]] = Query(None),
    keyword: Optional[List[str]] = Query(None),
):
    "Search for policies given a specified query"

    INNERPRODUCT_THRESHOLD = 70

    kwd_filters = {}

    if geography:
        kwd_filters["country_code.keyword"] = geography
    if sector:
        kwd_filters["sectors.keyword"] = sector_schema.get_leaf_levels(sector)
    if instrument:
        kwd_filters["instruments.keyword"] = instrument_schema.get_leaf_levels(instrument)
    if response:
        kwd_filters["responses.keyword"] = response
    if hazard:
        kwd_filters["hazards.keyword"] = hazard
    if document_type:
        kwd_filters["document_types.keyword"] = document_type
    if keyword:
        kwd_filters["keywords.keyword"] = keyword

    # TODO: this is a short-term fix to filter searches down to CCLW data only.
    kwd_filters["source_name.keyword"] = ["cclw"]

    year_range = None
    if any([year_start, year_end]):
        year_range = (year_start, year_end)

    if query is None:
        titles_ids_alphabetical = es.get_docs_sorted(
            "policy_date",
            asc=False,
            num_docs=start + limit,
            keyword_filters=kwd_filters,
            year_range=year_range,
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
        year_range=year_range,
    )

    results_by_doc = search_result["aggregations"]["sample"]["top_docs"]["buckets"]

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
                    "policyDate": doc_metadata.policy_date,
                    "policyName": doc_metadata.policy_name,
                    "policyType": doc_metadata.policy_type,
                    "documentTypes": doc_metadata.document_types,
                    "countryCode": doc_metadata.country_code,
                    "sourceName": doc_metadata.source_name,
                    "url": doc_metadata.url,
                    "language": doc_metadata.language,
                    "sectors": doc_metadata.sectors,
                    "instruments": doc_metadata.instruments,
                    "hazards": doc_metadata.hazards,
                    "responses": doc_metadata.responses,
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

    except OpenSearchNotFoundError:
        page_text = []

    finally:
        # Get the total page count for the document
        page_count = es.get_page_count_for_doc(policy_id)
        if page_count:
            return {
                "documentMetadata": {"pageCount": page_count},
                "pageText": page_text,
            }
        else:
            raise HTTPException(404, "Document does not exist in OpenSearch database.")


@app.get("/geographies", response_model=List[Geography])
def get_geographies():
    """Get information on geographies. Currently from a static CSV."""

    GEOGRAPHIES_CSV_PATH = Path("./temp_geographies/geographies.csv")

    return load_geographies_data(GEOGRAPHIES_CSV_PATH)


@app.get("/instruments", response_model=List[SchemaTopLevel])
def get_instruments():
    return instrument_schema.to_dict()


@app.get("/sectors", response_model=List[SchemaTopLevel])
def get_sectors():
    return sector_schema.to_dict()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
