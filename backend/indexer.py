"""
Load LinkedIn JSON and build one searchable document per profile.
Embed documents with OpenAI and store in memory for semantic search.
"""
import json
from pathlib import Path
from typing import Any

from openai import OpenAI
import numpy as np

from config import DATA_PATH, EMBEDDING_MODEL, OPENAI_API_KEY


def _get(obj: Any, *keys: str, default: str = "") -> str:
    for key in keys:
        if isinstance(obj, dict) and key in obj and obj[key] is not None:
            obj = obj[key]
        else:
            return default
    return str(obj).strip() if obj is not None else default


def build_document(profile: dict) -> str:
    """Build a single searchable text blob for one LinkedIn profile."""
    parts = []

    about = _get(profile, "about")
    if about:
        parts.append(about)

    headline = _get(profile, "headline")
    if headline and headline != "--":
        parts.append(headline)

    top_skills = _get(profile, "topSkills")
    if top_skills:
        parts.append(top_skills.replace(" • ", " "))

    loc = profile.get("location") or {}
    parsed = loc.get("parsed") or {}
    loc_text = parsed.get("text") or loc.get("linkedinText") or ""
    if loc_text:
        parts.append(loc_text)

    for cp in profile.get("currentPosition") or []:
        company = cp.get("companyName")
        if company:
            parts.append(company)

    for exp in profile.get("experience") or []:
        position = exp.get("position")
        company = exp.get("companyName")
        desc = exp.get("description")
        if position:
            parts.append(position)
        if company:
            parts.append(company)
        if desc:
            parts.append(desc)

    return "\n".join(p for p in parts if p).strip() or " "


def load_profiles(data_path: str) -> list[dict]:
    path = Path(data_path)
    if not path.exists():
        raise FileNotFoundError(f"Data file not found: {path}")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data if isinstance(data, list) else []


def embed_texts(client: OpenAI, texts: list[str], model: str = EMBEDDING_MODEL) -> np.ndarray:
    """Embed a list of texts with OpenAI. Returns (n, dim) numpy array."""
    out = []
    batch_size = 100
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        resp = client.embeddings.create(input=batch, model=model)
        for e in resp.data:
            out.append(e.embedding)
    return np.array(out, dtype=np.float32)


def build_index(data_path: str | None = None) -> tuple[list[dict], np.ndarray]:
    """
    Load profiles, build documents, embed with OpenAI.
    Returns (profiles_list, embeddings_array) where embeddings_array[i] is the embedding for profiles_list[i].
    """
    path = data_path or DATA_PATH
    profiles = load_profiles(path)
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY environment variable is required for indexing")

    documents = [build_document(p) for p in profiles]
    client = OpenAI(api_key=OPENAI_API_KEY)
    embeddings = embed_texts(client, documents)
    return profiles, embeddings
