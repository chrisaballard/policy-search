from typing import Optional, List
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from elasticsearch import NotFoundError as ElasticNotFoundError

from policy_search.pipeline.dynamo import PolicyDynamoDBTable, PolicyList, Policy
from policy_search.pipeline.opensearch import OpenSearchIndex
from policy_search.pipeline.models.policy import PolicyPageText, PolicySearchResponse
from temp_geographies.load_geographies_data import Geography, load_geographies_data
from schema.schema_helpers import get_schema_dict_from_path, SchemaTopLevel


POLICIES_TABLE = 'Policies'

dynamodb_host = os.environ.get('dynamodb_host', 'localhost')
dynamodb_port = os.environ.get('dynamodb_port', '8000')
dynamodb_url = f'http://{dynamodb_host}:{dynamodb_port}'

policy_table = PolicyDynamoDBTable(dynamodb_url, 'policyId')

opensearch_host = os.environ.get("opensearch_cluster", "https://localhost:9200")
opensearch_user = os.environ.get("opensearch_user", None)
opensearch_password = os.environ.get("opensearch_password", None)
es = OpenSearchIndex(
    es_url=opensearch_host, 
    es_user=opensearch_user, 
    es_password=opensearch_password, 
    es_connector_kwargs={"use_ssl": False, "verify_certs": False, "ssl_show_warn": False},
)

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

@app.get('/policies/search/', response_model=PolicySearchResponse)
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

    query_emb = [
                                0.07361985743045807,
                                0.03755076229572296,
                                -0.011847656220197678,
                                -0.0011768997646868229,
                                -0.0798792764544487,
                                -0.030095819383859634,
                                -0.10685122758150101,
                                -0.07810492813587189,
                                -0.0648517906665802,
                                -0.006201210897415876,
                                -0.011102820746600628,
                                0.05160045996308327,
                                0.01564754545688629,
                                -0.007065878249704838,
                                -0.011179235763847828,
                                -0.014645668677985668,
                                0.02528424747288227,
                                0.010297940112650394,
                                0.03397999331355095,
                                -0.1905948519706726,
                                -0.007712529506534338,
                                -0.003047114470973611,
                                0.09911715239286423,
                                0.011225341819226742,
                                0.08958741277456284,
                                0.011151389218866825,
                                0.055560629814863205,
                                -0.07977496087551117,
                                0.061310358345508575,
                                0.006441796664148569,
                                -0.028288301080465317,
                                0.033735860139131546,
                                0.009499270468950272,
                                -0.019574055448174477,
                                -0.017450716346502304,
                                0.10884973406791687,
                                0.03313279524445534,
                                -0.024725308641791344,
                                0.01868407428264618,
                                0.024925539270043373,
                                -0.025169050320982933,
                                0.05060199275612831,
                                0.06384047865867615,
                                0.057808768004179,
                                0.007130296900868416,
                                0.02160285972058773,
                                -0.04170365631580353,
                                -0.08803526312112808,
                                -0.06431550532579422,
                                -0.06190995126962662,
                                0.022663090378046036,
                                -0.019157210364937782,
                                -0.02467973344027996,
                                -0.010685251094400883,
                                -0.012908728793263435,
                                -0.12067384272813797,
                                -0.050354983657598495,
                                0.058672789484262466,
                                -0.02936938777565956,
                                -0.005128674674779177,
                                -0.11080770194530487,
                                0.05329090729355812,
                                -0.019469985738396645,
                                0.019679587334394455,
                                -0.06829185038805008,
                                0.059969719499349594,
                                0.056938741356134415,
                                0.11678194999694824,
                                -0.018774664029479027,
                                -0.04273722693324089,
                                0.03290308266878128,
                                -0.050418954342603683,
                                0.04345113784074783,
                                0.10347656160593033,
                                0.01780150644481182,
                                -0.07157974690198898,
                                0.008906757459044456,
                                0.06532936543226242,
                                0.04061485454440117,
                                -0.07351918518543243,
                                0.00839600432664156,
                                0.025939343497157097,
                                0.0941266268491745,
                                -0.025726839900016785,
                                0.019717371091246605,
                                -0.060713883489370346,
                                -0.025876931846141815,
                                0.0191104207187891,
                                0.010687163099646568,
                                -0.036484245210886,
                                0.09743397682905197,
                                -0.009194415993988514,
                                -0.020001262426376343,
                                0.08615046739578247,
                                0.05940740555524826,
                                0.0361248217523098,
                                0.041819337755441666,
                                0.016583574935793877,
                                -0.04263754189014435,
                                -0.01857004128396511,
                                0.003951104823499918,
                                -0.02152465097606182,
                                0.022030550986528397,
                                0.06145218014717102,
                                -0.049993690103292465,
                                -0.01917480304837227,
                                0.008129497058689594,
                                -0.04052037000656128,
                                -0.03854485973715782,
                                0.0023853464517742395,
                                -0.02038142830133438,
                                -0.043834857642650604,
                                -0.04182671383023262,
                                0.032236915081739426,
                                0.018099164590239525,
                                0.004068027250468731,
                                0.06624232977628708,
                                -0.024777278304100037,
                                0.007657219190150499,
                                0.10907670855522156,
                                -0.06956710666418076,
                                0.0032790342811495066,
                                -0.021359477192163467,
                                0.029267197474837303,
                                0.02362830378115177,
                                0.004594230558723211,
                                -0.07736299932003021,
                                4.914140321553951e-32,
                                0.02610943652689457,
                                0.03971663489937782,
                                0.005405300762504339,
                                -0.008514161221683025,
                                -0.00982697308063507,
                                -0.06946294754743576,
                                0.006111011374741793,
                                -0.043599434196949005,
                                -0.026304613798856735,
                                0.012818197719752789,
                                -0.0027271925937384367,
                                0.009584268555045128,
                                0.027344705536961555,
                                -0.01640736497938633,
                                0.027692921459674835,
                                -0.03539305925369263,
                                -0.004774983506649733,
                                0.055824607610702515,
                                -0.0008736482122913003,
                                0.11675163358449936,
                                0.02331610955297947,
                                0.03365208953619003,
                                0.010330685414373875,
                                -0.05516364425420761,
                                -0.03992526978254318,
                                0.03157084807753563,
                                0.000338114274200052,
                                -0.028325345367193222,
                                0.009256662800908089,
                                0.0018774415366351604,
                                0.0538930781185627,
                                -0.08774624764919281,
                                -0.09269865602254868,
                                -0.02132227085530758,
                                -0.07211790233850479,
                                -0.05507867410778999,
                                -0.04028896614909172,
                                -0.0034090124536305666,
                                0.036166053265333176,
                                -0.11504832655191422,
                                0.0223070215433836,
                                0.03142959251999855,
                                0.03141796961426735,
                                -0.0005739113548770547,
                                0.16873960196971893,
                                0.053683802485466,
                                0.03739260137081146,
                                -0.04165425896644592,
                                -0.010319805704057217,
                                0.013772456906735897,
                                -0.02682766318321228,
                                -0.00526499655097723,
                                -0.07342661172151566,
                                -0.006691109389066696,
                                0.033473871648311615,
                                0.00837407261133194,
                                0.08592717349529266,
                                0.10888713598251343,
                                0.00989050418138504,
                                0.02791202999651432,
                                -0.008980093523859978,
                                0.053382523357868195,
                                -0.02978161722421646,
                                0.0030395432841032743,
                                0.07208830118179321,
                                -0.14045760035514832,
                                -0.07927577197551727,
                                -0.011099332943558693,
                                0.08094727993011475,
                                -0.09747745841741562,
                                -0.00833472516387701,
                                -0.06000444293022156,
                                0.06841836869716644,
                                0.051691725850105286,
                                -0.029998067766427994,
                                0.036054495722055435,
                                0.010087231174111366,
                                -0.12531587481498718,
                                0.0052643739618361,
                                0.019266238436102867,
                                0.018921472132205963,
                                -0.01606060191988945,
                                -0.05036131292581558,
                                -0.03700856864452362,
                                0.019236421212553978,
                                0.026627281680703163,
                                0.0007233191281557083,
                                0.01795065775513649,
                                0.09460289776325226,
                                0.04731209948658943,
                                -0.07509196549654007,
                                -0.00438858475536108,
                                0.005004422273486853,
                                0.020083634182810783,
                                -0.00019523201626725495,
                                -3.5727387551717195e-33,
                                0.01361802127212286,
                                0.06451453268527985,
                                -0.06149826571345329,
                                0.058694709092378616,
                                -0.04115476831793785,
                                0.03586813062429428,
                                0.01368364505469799,
                                0.04668015241622925,
                                0.0574331134557724,
                                0.00887305848300457,
                                -0.0066606164909899235,
                                -0.07113923132419586,
                                0.09141034632921219,
                                0.0316954143345356,
                                0.011064772494137287,
                                -0.001491278875619173,
                                0.0276124719530344,
                                0.1166800931096077,
                                0.07489144057035446,
                                0.044026702642440796,
                                -0.02382124960422516,
                                0.06416703760623932,
                                -0.06807846575975418,
                                0.01580711454153061,
                                0.019898759201169014,
                                -0.03369660675525665,
                                -0.007372533902525902,
                                -0.03038819134235382,
                                -0.048008084297180176,
                                -0.004333272110670805,
                                0.020718857645988464,
                                -0.04565265774726868,
                                -0.024783316999673843,
                                0.04240923374891281,
                                -0.0733485072851181,
                                -0.024778949096798897,
                                -0.03566848114132881,
                                0.017518814653158188,
                                -0.067299023270607,
                                0.08527565002441406,
                                0.031473398208618164,
                                0.03945990279316902,
                                -0.03272946923971176,
                                0.060840919613838196,
                                -0.04246842861175537,
                                0.030508138239383698,
                                -0.11530447751283646,
                                0.01968509331345558,
                                -0.07660342007875443,
                                -0.08460819721221924,
                                0.026734663173556328,
                                -0.03948049992322922,
                                0.06846275180578232,
                                -0.027325553819537163,
                                0.07758908718824387,
                                -0.036317262798547745,
                                0.041410863399505615,
                                -0.030728494748473167,
                                -0.015968207269906998,
                                0.018813157454133034,
                                0.05140361934900284,
                                -0.047300346195697784,
                                -0.008767960593104362,
                                -0.0449601486325264,
                                0.027472540736198425,
                                0.006994633004069328,
                                -0.011297817341983318,
                                0.06711959838867188,
                                0.04377560317516327,
                                -0.011272870004177094,
                                0.03953312337398529,
                                -0.010038001462817192,
                                0.050973616540431976,
                                -0.0106560830026865,
                                -0.021944750100374222,
                                0.039422329515218735,
                                0.01950826309621334,
                                0.11501716822385788,
                                -0.024542417377233505,
                                -0.06775183975696564,
                                0.007596476469188929,
                                0.022673754021525383,
                                -0.10365508496761322,
                                0.0007325002807192504,
                                -0.05611008033156395,
                                0.07766986638307571,
                                0.01131244283169508,
                                -0.01815665513277054,
                                0.14028844237327576,
                                0.00032554392237216234,
                                -0.03306354954838753,
                                0.028758371248841286,
                                0.014345893636345863,
                                0.007189623545855284,
                                0.0317256897687912,
                                -3.3794246684171634e-33,
                                -0.029198624193668365,
                                -0.06190667673945427,
                                0.015595120377838612,
                                0.04256018251180649,
                                -0.0653730183839798,
                                -0.007054990157485008,
                                -0.007058938033878803,
                                0.005539783276617527,
                                -0.033582013100385666,
                                0.07923554629087448,
                                -0.10274773091077805,
                                0.010364122688770294,
                                -0.10152923315763474,
                                0.061558373272418976,
                                0.05816778913140297,
                                0.05159008130431175,
                                0.016762269660830498,
                                0.07396920770406723,
                                -0.0158253014087677,
                                -0.02827053889632225,
                                0.01558179035782814,
                                -0.018638702109456062,
                                0.06781839579343796,
                                0.02933637425303459,
                                -0.05320872366428375,
                                -0.002446472877636552,
                                0.034744154661893845,
                                -0.022010086104273796,
                                -0.01162346638739109,
                                0.0007954147877171636,
                                -0.07535023987293243,
                                -0.04092632234096527,
                                -0.0395154245197773,
                                -0.09392214566469193,
                                -0.02068377658724785,
                                0.04483310878276825,
                                -0.09760221838951111,
                                0.02591595984995365,
                                0.042302023619413376,
                                0.017361121252179146,
                                -0.08109858632087708,
                                -0.06839043647050858,
                                -0.0146871916949749,
                                -0.004416814539581537,
                                0.07971712201833725,
                                -0.031971514225006104,
                                -0.07519206404685974,
                                -0.026314089074730873,
                                0.05525593087077141,
                                -0.0009874122915789485,
                                0.006545839831233025,
                                -0.011756917461752892,
                                -0.043128374963998795,
                                -0.08195669949054718,
                                0.0952439084649086,
                                0.05347609147429466,
                                -0.06872400641441345,
                                -0.08849772810935974,
                                -0.0760512501001358,
                                -0.0630798488855362,
                                0.0034804255701601505,
                                0.015287412330508232,
                                -0.022523188963532448,
                                0.004376212600618601
                            ]

    # There is no option to offset results for terms aggregation queries, so instead we 
    # get the first `start+limit` results and offset them by `start`.
    search_result = es.search(
        query,
        query_emb,
        limit=start+limit,
        keyword_filters=kwd_filters,
       
    )

    results_by_doc = search_result["aggregations"]["top_docs"]["buckets"]

    query_results_by_doc = []

    # Iterate over each document returned from the query
    for result in results_by_doc[start : start+limit]:
        hits_by_page = result["top_passage_hits"]["hits"]["hits"]
        # num_pages_with_hit = result["doc_count"]
        policy_id = result["key"]
        if hits_by_page:
            policy_name = hits_by_page[0]["_source"]["policy_name"]
            policy_country_code = hits_by_page[0]["_source"]["country_code"]
            policy_source_name = hits_by_page[0]["_source"]["source_name"]

        document_response = []

        # Iterate over each page hit in each document
        for hit in hits_by_page:
            page_text_hits = []
            # Find the matching text passages and add to results
            for page_inner_hits in hit["inner_hits"]["text"]["hits"]["hits"]:
                    page_text_hits.append(
                        page_inner_hits["_source"]["text"]
                    )

            # Add the page matches for this document
            if len(page_inner_hits) > 0:
                document_response.append({
                    "pageNumber": hit["_source"]["page_number"],
                    "text": page_text_hits,
                })

        # Add the query matches for this document
        query_results_by_doc.append(
            {   
                "policyId": policy_id,
                "policyName": policy_name,
                "countryCode": policy_country_code,
                "sourceName": policy_source_name,
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
        # Get the page text for the given document and page
        es_doc = es.get_doc_by_id(doc_id)
        page_text = es_doc["_source"]["text"]

        # Get the total page count for the document
        page_count = es.get_page_count_for_doc(policy_id)
        return {
            "documentMetadata": {
                "pageCount": page_count
            },
            "pageText": page_text,
        }

    except ElasticNotFoundError:
        raise HTTPException(status_code=404, detail="Policy document or page within it not found")

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

