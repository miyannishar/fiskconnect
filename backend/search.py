"""
Retrieve top-k profiles by cosine similarity between query embedding and index.
Format results as SourcedAlumni for the frontend.
"""
from typing import Any

import numpy as np

from config import TOP_K


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """a: (n, dim), b: (dim,) or (m, dim). Returns (n,) or (n, m)."""
    a_norm = a / (np.linalg.norm(a, axis=1, keepdims=True) + 1e-8)
    if b.ndim == 1:
        b_norm = b / (np.linalg.norm(b) + 1e-8)
        return np.dot(a_norm, b_norm)
    b_norm = b / (np.linalg.norm(b, axis=1, keepdims=True) + 1e-8)
    return np.dot(a_norm, b_norm.T)


def _get(obj: Any, *keys: str, default: str | None = None):
    for key in keys:
        if isinstance(obj, dict) and key in obj and obj[key] is not None:
            obj = obj[key]
        else:
            return default
    return obj


def profile_to_sourced(profile: dict, score: float) -> dict:
    """Map a LinkedIn profile dict to the SourcedAlumni API shape."""
    first = profile.get("firstName") or ""
    last = profile.get("lastName") or ""
    full_name = f"{first} {last}".strip() or "Unknown"

    current_position = (profile.get("currentPosition") or [{}])[0]
    current_company = _get(current_position, "companyName") or ""
    current_title = ""
    exp_list = profile.get("experience") or []
    if exp_list:
        current_title = exp_list[0].get("position") or ""

    loc = profile.get("location") or {}
    parsed = loc.get("parsed") or {}
    location = parsed.get("text") or loc.get("linkedinText") or ""

    top_skills = profile.get("topSkills")
    if isinstance(top_skills, str):
        skills = [s.strip() for s in top_skills.split("•") if s.strip()]
    else:
        skills = []

    about = profile.get("about") or ""
    about_snippet = (about[:200] + "…") if len(about) > 200 else about

    photo = _get(profile, "profilePicture", "url") or profile.get("photo") or ""

    return {
        "id": profile.get("id") or "",
        "linkedinUrl": profile.get("linkedinUrl") or "",
        "fullName": full_name,
        "headline": profile.get("headline") or "",
        "currentCompany": current_company,
        "currentTitle": current_title,
        "location": location,
        "skills": skills,
        "aboutSnippet": about_snippet,
        "photo": photo,
        "relevanceScore": round(float(score), 4),
    }


def retrieve(
    profiles: list[dict],
    embeddings: np.ndarray,
    query_embedding: np.ndarray,
    top_k: int = TOP_K,
) -> list[dict]:
    """
    Get top-k profiles by cosine similarity.
    query_embedding: (dim,) array.
    Returns list of SourcedAlumni dicts sorted by score descending.
    """
    scores = cosine_similarity(embeddings, query_embedding)
    indices = np.argsort(scores)[::-1][:top_k]
    return [
        profile_to_sourced(profiles[i], float(scores[i]))
        for i in indices
        if scores[i] > 0
    ]


def retrieve_multi(
    profiles: list[dict],
    embeddings: np.ndarray,
    query_embeddings: list[np.ndarray],
    top_k: int = TOP_K,
) -> list[dict]:
    """
    Get top-k profiles using multiple query embeddings (e.g. from query expansion).
    For each profile takes the max similarity over all query embeddings.
    """
    if not query_embeddings:
        return []
    all_scores = np.stack(
        [cosine_similarity(embeddings, q) for q in query_embeddings],
        axis=1,
    )
    scores = np.max(all_scores, axis=1)
    indices = np.argsort(scores)[::-1][:top_k]
    return [
        profile_to_sourced(profiles[i], float(scores[i]))
        for i in indices
        if scores[i] > 0
    ]
