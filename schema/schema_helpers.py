from pathlib import Path
from typing import List

import yaml
from pydantic import BaseModel


class SchemaSecondLevel(BaseModel):
    id: int
    name: str


class SchemaTopLevel(BaseModel):
    id: int
    name: str
    levels: List[SchemaSecondLevel]


def _to_title_case(text: str) -> str:
    return " ".join(
        [
            w.title() if not (w.startswith("(") and w.endswith(")")) else w
            for w in text.split()
        ]
    )


class Schema:
    def __init__(self, data):
        self.data = data

    @classmethod
    def from_yaml_path(cls, path: Path):
        with open(path, "r") as f:
            data = yaml.safe_load(f)

        return Schema(data)

    def to_dict(self) -> dict:
        """Export JSON dump of yaml data. This should be in the format of
        `List[SchemaTopLevel]`."""

        data_no_keywords = []

        for level1 in self.data:
            levels_no_keywords = [
                {key: level[key] for key in ["id", "name"]}
                for level in level1["levels"]
            ]

            data_no_keywords.append(
                {
                    "id": level1["id"],
                    "name": _to_title_case(level1["name"]),
                    "levels": levels_no_keywords,
                }
            )

        return data_no_keywords


def get_schema_dict_from_path(path: Path) -> dict:
    schema = Schema.from_yaml_path(path)

    return schema.to_dict()
