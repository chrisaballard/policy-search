from pathlib import Path
from typing import List

import yaml
from pydantic import BaseModel

class SchemaSecondLevel(BaseModel):
    id: int
    name: str
    keywords: List[str]
    
    
class SchemaTopLevel(BaseModel):
    id: int
    name: str
    levels: List[SchemaSecondLevel]
    
    
class Schema:
    def __init__(self, data):
        self.data = data
    
    @classmethod
    def from_yaml_path(cls, path: Path):
        with open(path, "r") as f:
            data = yaml.safe_load(f)
            
        return Schema(data)

    def to_dict(self) -> dict:
        """Export JSON dump of yaml data. This should be in the format of `List[SchemaTopLevel]`.
        """
        
        return self.data
        

def get_schema_dict_from_path(path: Path) -> dict:
    schema = Schema.from_yaml_path(path)
    
    return schema.to_dict()
        
    