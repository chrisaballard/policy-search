from typing import List, Optional

from pydantic import BaseModel, HttpUrl, Field


class Policy(BaseModel):
    policy_id: int = Field(alias="policyId")
    policy_name: str = Field(alias="policyName")
    country_code: str = Field(alias="countryCode")
    language: str
    source_name: str = Field(alias="sourceName")
    source_policy_id: Optional[int] = Field(alias="sourcePolicyId")
    url: HttpUrl
    policy_type: Optional[str] = Field(alias="policyType")
    policy_txt_file: Optional[str] = Field(alias="policyTxtFile")


class PolicyList(BaseModel):
    policies: List[Policy]
    last_key: int
    count: int


class PolicyPageMetadata(BaseModel):
    page_count: int = (Field(alias="pageCount"),)
    content_url: str = Field(alias="contentUrl")


class PolicyPageText(BaseModel):
    document_metadata: dict = Field(
        alias="documentMetadata"
    )  # TODO: change type to PolicyPageMetadata when methods to get its field values are implemented
    page_text: List[str] = Field(alias="pageText")


class PolicyPageSearchResult(BaseModel):
    page_number: int = Field(alias="pageNumber")
    highlighted_text: List[str] = Field(alias="text")


# TODO: some of this is a duplicate of the Policy class above. Is there a way we can avoid duplicating these fields in code?
class PolicySearchResult(BaseModel):
    policy_id: int = Field(alias="policyId")
    policy_name: str = Field(alias="policyName")
    country_code: str = Field(alias="countryCode")
    language: str
    source_name: str = Field(alias="sourceName")
    source_policy_id: Optional[int] = Field(alias="sourcePolicyId")
    url: HttpUrl
    policy_type: Optional[str] = Field(alias="policyType")
    policy_txt_file: Optional[str] = Field(alias="policyTxtFile")
    resultsByPage: Optional[List[PolicyPageSearchResult]] = []


class PolicySearchResponse(BaseModel):
    metadata: dict = Field(alias="metadata")
    resultsByDocument: List[PolicySearchResult]
