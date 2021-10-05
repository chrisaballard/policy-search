from pathlib import Path

import yaml
from transformers import pipeline
import pandas as pd


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
        return list(self.keyword_subsector_mapping.keys())
    
    @property
    def keyword_subsector_mapping(self):
        kwd_subsector_mapping = dict()
        
        for subsector, kwd_list in self.subsector_keyword_mapping.items():
            for keyword in kwd_list:
                kwd_subsector_mapping.update({keyword: subsector})
                                             
        return kwd_subsector_mapping
    
class ZeroShotClassifier:
    def __init__(self, schema: Schema, huggingface_pipeline_name: str = "typeform/distilbert-base-uncased-mnli", multi_label: bool = True):
        self.schema = schema
        self.multi_label = multi_label
        self.clf = self._load_pipeline_from_huggingface(huggingface_pipeline_name)
        
        self._keyword_subsector_mapping = self.schema.keyword_subsector_mapping
    
    def _load_pipeline_from_huggingface(self, name: str):
        return pipeline("zero-shot-classification", model=name)
    
    @property
    def _class_labels(self):
        return self.schema.all_keywords
        
    def predict(self, text: str, threshold: float):
        pipeline_result = self.clf(text, self._class_labels, multi_label=self.multi_label)
        
        res = []
        for idx in range(len(pipeline_result['labels'])):
            if pipeline_result['scores'][idx] >= threshold:
                _label = pipeline_result['labels'][idx]
                _score = pipeline_result['scores'][idx]
                res.append(
                    (_label, self._keyword_subsector_mapping[_label], pipeline_result['scores'][idx])
                )

        return res
