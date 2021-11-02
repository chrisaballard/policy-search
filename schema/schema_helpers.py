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

    def _leaf_mapping(self):
        """Return a dictionary mapping a top level schema node to corresponding lower levels"""
        
        mapping = {}
        for level in self.to_dict():
            mapping[level["name"]] = [sublevel["name"] for sublevel in level["levels"]]

        return mapping

    def _get_leaf_levels(self):
        leaf_levels = []
        for levels in self._leaf_mapping().values():
            leaf_levels += levels

        return leaf_levels
    
    def _get_leaf_levels_for_node(self, name):
        """For a given top level node, return a list of lower levels assigned to that node"""

        # Lookup level in dictionary, unless a leaf level has been passed
        if name not in self._get_leaf_levels():
            # return the leaf levels assigned to the top level
            return self._leaf_mapping().get(name, [])

        # Otherwise, if this is a leaf level, return the leaf level as there are no further leaf levels
        return [name]

    def get_leaf_levels(self, levels_list: List[str]):
        """For a given schema, remaps a list of top levels to a list of leaf levels in the schema"""

        schema_leaf_levels = []
        for level_name in levels_list:
            schema_leaf_levels += self._get_leaf_levels_for_node(level_name)

        return schema_leaf_levels





def get_schema_dict_from_path(path: Path) -> dict:
    schema = Schema.from_yaml_path(path)

    return schema.to_dict()
