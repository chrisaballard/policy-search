from pathlib import Path
import re

import yaml
from transformers import pipeline
from sentence_transformers import SentenceTransformer
from sentence_transformers import util as sbert_utils
import pandas as pd
import numpy as np
import torch


def load_policy_dataset():
    data_path = "../../data/policy_dataset.csv"

    return pd.read_csv(data_path)


def flatten_list_of_lists(_list: list) -> list:
    """
    [[1, 2], [3]] -> [1, 2, 3]
    [[1, 2], 3] -> [1, 2, 3]
    """

    res = []

    for item in _list:
        if isinstance(item, list):
            res = res + item
        else:
            res.append(item)

    return res


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
        return {i["name"]: [v["name"] for v in i["levels"]] for i in self.data}

    @property
    def name_keyword_mapping(self):
        return {
            i["name"]: flatten_list_of_lists([v["keywords"] for v in i["levels"]])
            for i in self.data
        }

    @property
    def subsector_keyword_mapping(self):
        return {v["name"]: v["keywords"] for i in self.data for v in i["levels"]}

    @property
    def all_keywords(self):
        all_kw = []
        for kw_list in self.subsector_keyword_mapping.values():
            for kw in kw_list:
                all_kw.append(kw)

        return np.array(all_kw)

    @property
    def keyword_subsector_mapping(self):
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
            return [
                self._keyword_subsector_concatenator(k)
                for k in self.schema.all_keywords
            ]
        else:
            return self.schema.all_keywords

    def predict(self, text: str, threshold: float):
        pipeline_result = self.clf(
            text, self._class_labels, multi_label=self.multi_label
        )

        res = []
        for idx in range(len(pipeline_result["labels"])):
            if pipeline_result["scores"][idx] >= threshold:
                _label = pipeline_result["labels"][idx]
                _keyword = (
                    self._keyword_from_concatenated_keyword_subsector(_label)
                    if self.concat_keywords_with_subsectors
                    else _label
                )
                # _score = pipeline_result["scores"][idx]
                res.append(
                    (
                        _keyword,
                        self._keyword_subsector_mapping[_keyword],
                        pipeline_result["scores"][idx],
                    )
                )

        return res


class CosineDistanceClassifier:
    def __init__(
        self,
        schema: Schema,
        sbert_model: SentenceTransformer,
        distance_measure: str,
        concat_keywords_with_subsectors: bool,
    ):
        assert distance_measure in ["dot_product", "cosine"]

        self._normalise_vectors = distance_measure == "dot_product"

        self.schema = schema
        self._keyword_subsector_mapping = self.schema.keyword_subsector_mapping

        self.encoder = sbert_model
        self.distance_measure = distance_measure

        # self.encoder = self._get_sentence_encoder()
        self._keyword_embeddings = self._embed_keywords(concat_keywords_with_subsectors)

    # def _get_sentence_encoder(self):
    #     return SentenceTransformer(self.sbert_model)

    def _keyword_subsector_concatenator(self, kwd: str, k_ix: int):
        """string modifier for _embed_keywords"""

        return f"{kwd} {self._keyword_subsector_mapping[k_ix]}"

    def _embed_keywords(self, concat_with_subsectors: bool):
        keywords = self.schema.all_keywords

        if concat_with_subsectors:
            keywords = [
                self._keyword_subsector_concatenator(k, k_ix)
                for k_ix, k in enumerate(keywords)
            ]

        keyword_embeddings = self.encoder.encode(keywords, convert_to_tensor=True)

        if self._normalise_vectors:
            keyword_embeddings = torch.nn.functional.normalize(
                keyword_embeddings, p=2, dim=1
            )

        return keyword_embeddings

    def _get_grouped_labels(self, pred, conf):
        """
        Takes the predicted labels at keyword level and returns unique
        predictions by level
        """

        # for pred_ix, pred in enumerate(preds):
        # Get the predicted labels at subsector level
        pred_labels = self.schema.keyword_subsector_mapping[pred]

        # Find the unique labels at subsector level and return the first element of each
        # unique label
        unique_labels, unique_label_idx = np.unique(pred_labels, return_index=True)
        unique_label_conf = conf[unique_label_idx]

        # Sort the predictions in reverse order of confidence
        sorted_conf_idx = np.argsort(unique_label_conf)[::-1]
        unique_labels = unique_labels[sorted_conf_idx]
        unique_label_conf = unique_label_conf[sorted_conf_idx]

        return unique_labels, unique_label_conf

    def _get_predicted_labels(self, cos_scores: torch.Tensor, threshold: float):
        all_preds = []
        all_conf = []
        for idx in range(0, cos_scores.shape[0]):
            # Get the predicted labels and confidences over threshold
            cls_idx = torch.where(cos_scores[idx] > threshold)[0]
            preds = cls_idx.cpu().numpy()

            conf = cos_scores[idx, cls_idx].cpu().numpy()

            # Get the unique subsector level predicted labels and confidences
            preds, conf = self._get_grouped_labels(preds, conf)

            all_preds.append(preds)
            all_conf.append(conf)

        return all_preds, all_conf

    def predict(self, query: str, threshold: float, return_embeddings: bool):
        query_embedding = self.encoder.encode(query, convert_to_tensor=True)
        if self._normalise_vectors:
            query_embedding = torch.nn.functional.normalize(query_embedding, p=2, dim=0)

        cos_scores = sbert_utils.cos_sim(query_embedding, self._keyword_embeddings)

        preds, conf = self._get_predicted_labels(cos_scores, threshold)

        if return_embeddings:
            result = (query_embedding, preds, conf)
        else:
            result = (preds, conf)

        return result
