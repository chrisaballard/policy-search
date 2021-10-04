"""
Temporary methods to load information on geographies from a static file. 

** This should be removed when the data moves to DynamoDB **
"""

from pathlib import Path
from typing import List

import pandas as pd
from pydantic import BaseModel, Field


class Geography(BaseModel):
    code: str
    name: str
    geography_type: str = Field(alias="geographyType")
    world_bank_region: str = Field(alias="worldBankRegion")
    federal: bool = Field(alias="isFederal")
    wb_income_group: str = Field(alias="wbIncomeGroup")


def load_geographies_data(
    csv_path: Path
) -> List[Geography]:
    """
    Parse geographies data into a format that can be returned by a '/geographies' API endpoint.
    """

    df = pd.read_csv(csv_path).rename(columns={"Name": "name", "Geography type": "geographyType", "World Bank Region": "worldBankRegion", "Federal": "isFederal", "Iso": "code", "Wb income group": "wbIncomeGroup"})

    return [Geography.parse_obj(item) for item in df.to_dict('records')]
