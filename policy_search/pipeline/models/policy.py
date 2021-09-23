from typing import List, Optional

from pydantic import BaseModel, HttpUrl, Field


class Policy(BaseModel):
    policy_id: int = Field(alias='policyId')
    policy_name: str = Field(alias='policyName')
    country_code: str = Field(alias='countryCode')
    language: str
    source_name: str = Field(alias='sourceName')
    source_policy_id: Optional[int] = Field(alias='sourcePolicyId')
    url: HttpUrl
    policy_type: Optional[str] = Field(alias='policyType')
    policy_txt_file: str


class PolicyList(BaseModel):
    policies: List[Policy]
    last_key: int
    count: int