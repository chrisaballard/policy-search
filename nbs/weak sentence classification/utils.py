from pathlib import Path
import re

import yaml
from transformers import pipeline
import pandas as pd
import numpy as np


def load_policy_dataset():
    data_path = "../../data/policy_dataset.csv"
    
    return pd.read_csv(data_path)

class Schema:
    def __init__(self, data):
        self.data = data
    
    @classmethod
    def from_yaml_path(cls, path: Path):
        with open(path, "r") as f:
            data = yaml.safe_load(f)
            
        return Schema(data)

    @property
    def name_subsector_mapping(self):
        return {i['name']: [v['name'] for v in i['levels']] for i in self.data}
    
    @property
    def name_keyword_mapping(self):
        return {i['name']: flatten_list_of_lists([v['keywords'] for v in i['levels']]) for i in self.data}
    
    @property
    def subsector_keyword_mapping(self):
        return {v['name']: v['keywords'] for i in self.data for v in i['levels']}
    
    @property
    def all_keywords(self):
        all_kw = []
        for kw_list in self.subsector_keyword_mapping.values():
            for kw in kw_list:
                all_kw.append(kw)

        return np.array(all_kw)
    
    @property
    def _keyword_subsector_mapping(self):
        kwd_subsector_mapping = []

        for subsector, kwd_list in self.subsector_keyword_mapping.items():
            for keyword in kwd_list:
                kwd_subsector_mapping.append(subsector)
                                             
        return np.array(kwd_subsector_mapping)
    
class ZeroShotClassifier:
    def __init__(
        self, 
        schema: Schema, 
        huggingface_pipeline_name: str = "typeform/distilbert-base-uncased-mnli", 
        concat_keywords_with_subsectors: bool = False,
        multi_label: bool = True,
    ):
        self.schema = schema
        self.concat_keywords_with_subsectors = concat_keywords_with_subsectors
        self.multi_label = multi_label
        self.clf = self._load_pipeline_from_huggingface(huggingface_pipeline_name)
        
        self._keyword_subsector_mapping = self.schema.keyword_subsector_mapping
    
    def _load_pipeline_from_huggingface(self, name: str):
        return pipeline("zero-shot-classification", model=name)
    
    def _keyword_subsector_concatenator(self, kwd: str):
        """string modifier for _embed_keywords"""
        
        return f"{kwd} {self._keyword_subsector_mapping[kwd]}"
    
    def _keyword_from_concatenated_keyword_subsector(self, _str: str) -> str:
        
        return re.findall(r"([a-z\s-]+)\s[A-Z]", _str)[0]
    
    @property
    def _class_labels(self):
        if self.concat_keywords_with_subsectors:
            return [self._keyword_subsector_concatenator(k) for k in self.schema.all_keywords]
        else:
            return self.schema.all_keywords
        
    def predict(self, text: str, threshold: float):
        pipeline_result = self.clf(text, self._class_labels, multi_label=self.multi_label)
        
        res = []
        for idx in range(len(pipeline_result['labels'])):
            if pipeline_result['scores'][idx] >= threshold:
                _label = pipeline_result['labels'][idx]
                _keyword = self._keyword_from_concatenated_keyword_subsector(_label) if self.concat_keywords_with_subsectors else _label
                _score = pipeline_result['scores'][idx]
                res.append(
                    (_keyword, self._keyword_subsector_mapping[_keyword], pipeline_result['scores'][idx])
                )

        return res
