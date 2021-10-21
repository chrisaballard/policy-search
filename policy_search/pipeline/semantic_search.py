from sentence_transformers import SentenceTransformer
import numpy as np

from policy_search.logging import get_logger

logger = get_logger(__name__)


class SentenceEncoder:
    """Base class for a sentence encoder"""

    def __init__(self, **kwargs):
        pass

    def encode(self, text: str) -> np.ndarray:
        """Encode a string, return a numpy array."""
        pass


class SBERTEncoder(SentenceEncoder):
    def __init__(self, model_name: str):
        super().__init__()
        logger.debug("Downloading sentence-transformers model")
        self.encoder = SentenceTransformer(model_name)

    def encode(self, text: str) -> np.ndarray:
        return self.encoder.encode(text)
