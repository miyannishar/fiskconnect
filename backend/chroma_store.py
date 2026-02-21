"""
ChromaDB vector store for alumni embeddings.
Supports: (1) Chroma Cloud (CloudClient), (2) remote Chroma (HttpClient), (3) local disk (PersistentClient).
"""
from pathlib import Path
from urllib.parse import urlparse

import chromadb
from chromadb.config import Settings

from config import (
    CHROMA_PERSIST_DIR,
    CHROMA_API_KEY,
    CHROMA_TENANT,
    CHROMA_DATABASE,
    CHROMA_API_URL,
    CHROMA_TOKEN,
    CHROMA_COLLECTION_NAME,
)

_settings = Settings(anonymized_telemetry=False)


def get_client():
    """Return Chroma client: CloudClient if API key set, else HttpClient if URL set, else PersistentClient."""
    if CHROMA_API_KEY:
        return chromadb.CloudClient(
            tenant=CHROMA_TENANT or "default_tenant",
            database=CHROMA_DATABASE or "default_database",
            api_key=CHROMA_API_KEY,
        )
    if CHROMA_API_URL:
        parsed = urlparse(CHROMA_API_URL)
        host = parsed.hostname or "localhost"
        port = parsed.port or (443 if parsed.scheme == "https" else 80)
        ssl = parsed.scheme == "https"
        headers = {"x-chroma-token": CHROMA_TOKEN} if CHROMA_TOKEN else None
        return chromadb.HttpClient(
            host=host,
            port=port,
            ssl=ssl,
            headers=headers,
            settings=_settings,
        )
    Path(CHROMA_PERSIST_DIR).mkdir(parents=True, exist_ok=True)
    return chromadb.PersistentClient(
        path=CHROMA_PERSIST_DIR,
        settings=_settings,
    )


def get_or_create_collection(client, name: str = CHROMA_COLLECTION_NAME):
    """Get existing collection or create with cosine similarity."""
    try:
        return client.get_collection(name=name)
    except Exception:
        return client.create_collection(
            name=name,
            metadata={"hnsw:space": "cosine"},
        )


def add_to_chroma(
    client,
    ids: list[str],
    embeddings: list[list[float]],
    documents: list[str],
):
    """Upsert embeddings into the alumni collection. Ids should match profile ids."""
    coll = get_or_create_collection(client)
    # Chroma expects list of lists for embeddings
    coll.upsert(
        ids=ids,
        embeddings=embeddings,
        documents=documents,
    )


def search_chroma(
    client,
    query_embedding: list[float],
    n_results: int = 20,
) -> list[tuple[str, float]]:
    """
    Query Chroma by embedding. Returns list of (profile_id, relevance_score).
    Chroma cosine distance = 1 - similarity, so we use 1 - distance as score.
    """
    coll = get_or_create_collection(client)
    count = coll.count()
    if count == 0:
        return []
    res = coll.query(
        query_embeddings=[query_embedding],
        n_results=min(n_results, count),
        include=["documents", "distances"],
    )
    ids = res["ids"][0] if res["ids"] else []
    distances = res["distances"][0] if res.get("distances") and res["distances"] else []
    # cosine: distance in [0, 2]; lower = more similar. score = 1 - distance (clamp to [0,1])
    out = []
    for i, did in enumerate(ids):
        dist = distances[i] if i < len(distances) else 0
        score = max(0.0, min(1.0, 1.0 - dist))
        out.append((did, score))
    return out


def search_chroma_multi(
    client,
    query_embeddings: list[list[float]],
    n_results: int = 20,
) -> list[tuple[str, float]]:
    """
    RAG-style retrieval: run a separate vector search for each query embedding,
    then merge by profile id (keep max score per profile) and return top n_results.
    Used when the user query is expanded into multiple search phrases.
    """
    if not query_embeddings:
        return []

    best_score: dict[str, float] = {}
    for qemb in query_embeddings:
        hits = search_chroma(client, qemb, n_results=n_results * 2)
        for pid, score in hits:
            if pid not in best_score or score > best_score[pid]:
                best_score[pid] = score

    sorted_ids = sorted(best_score.keys(), key=lambda x: best_score[x], reverse=True)[:n_results]
    return [(pid, best_score[pid]) for pid in sorted_ids]
