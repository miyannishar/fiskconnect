"""
Pinecone vector store for alumni embeddings.

Supports two modes (see config PINECONE_USE_INTEGRATED_EMBEDDING):
- Integrated embedding (default): index has field map "text"; we upsert records with id + text,
  query by text; Pinecone embeds with the index model (e.g. llama-text-embed-v2).
- Vector mode: we embed with OpenAI (1536 dim), upsert vectors, query by vector.
  Index must be created without integrated embedding, dimension 1536, metric cosine.
"""
import time

from pinecone import Pinecone
from pinecone.exceptions import PineconeApiException

from config import (
    PINECONE_API_KEY,
    PINECONE_INDEX_NAME,
    PINECONE_INDEX_HOST,
    PINECONE_NAMESPACE,
    PINECONE_TEXT_FIELD,
    PINECONE_UPSERT_BATCH_DELAY,
)


def get_index():
    """Return Pinecone index. Use host if set (required for some integrated-embedding indexes)."""
    pc = Pinecone(api_key=PINECONE_API_KEY)
    if PINECONE_INDEX_HOST:
        return pc.Index(host=PINECONE_INDEX_HOST)
    return pc.Index(PINECONE_INDEX_NAME)


def add_to_pinecone(
    ids: list[str],
    embeddings: list[list[float]],
) -> None:
    """Upsert vectors into Pinecone (vector mode: no integrated embedding)."""
    index = get_index()
    vectors = [
        {"id": pid, "values": emb}
        for pid, emb in zip(ids, embeddings, strict=True)
    ]
    batch_size = 100
    for i in range(0, len(vectors), batch_size):
        batch = vectors[i : i + batch_size]
        index.upsert(vectors=batch, namespace=PINECONE_NAMESPACE)


def add_to_pinecone_text(
    ids: list[str],
    documents: list[str],
) -> None:
    """Upsert records with text field for indexes with integrated embedding (Pinecone embeds)."""
    index = get_index()
    records = [
        {"_id": pid, PINECONE_TEXT_FIELD: doc}
        for pid, doc in zip(ids, documents, strict=True)
    ]
    # Stay under 250k tokens/min: use small batches (~24 docs) and delay between batches; retry on 429
    batch_size = 24
    max_retries = 5
    retry_wait = 65  # seconds to wait for TPM window to reset
    for i in range(0, len(records), batch_size):
        if i > 0 and PINECONE_UPSERT_BATCH_DELAY > 0:
            time.sleep(PINECONE_UPSERT_BATCH_DELAY)
        batch = records[i : i + batch_size]
        for attempt in range(max_retries):
            try:
                index.upsert_records(namespace=PINECONE_NAMESPACE, records=batch)
                break
            except PineconeApiException as e:
                if e.status == 429 and attempt < max_retries - 1:
                    time.sleep(retry_wait)
                    continue
                raise


def search_pinecone(
    query_embedding: list[float],
    n_results: int = 20,
) -> list[tuple[str, float]]:
    """Query Pinecone by vector. Returns list of (profile_id, score). Cosine score in [0,1]."""
    index = get_index()
    res = index.query(
        vector=query_embedding,
        top_k=n_results,
        namespace=PINECONE_NAMESPACE,
        include_metadata=False,
    )
    out = []
    for match in (res.matches or []):
        pid = match.id
        score = float(match.score or 0)
        out.append((pid, score))
    return out


def search_pinecone_by_text(
    query_text: str,
    n_results: int = 20,
) -> list[tuple[str, float]]:
    """Query by text (integrated-embedding indexes). Returns list of (profile_id, score)."""
    index = get_index()
    res = index.search(
        namespace=PINECONE_NAMESPACE,
        query={"inputs": {"text": query_text}, "top_k": n_results},
    )
    out = []
    # Support both 2025 search_records shape (result.hits with _id/_score) and legacy (matches with id/score)
    hits = getattr(getattr(res, "result", res), "hits", None) or getattr(res, "hits", None) or getattr(res, "matches", []) or []
    for h in hits:
        pid = getattr(h, "_id", None) or getattr(h, "id", None)
        score = float(getattr(h, "_score", None) or getattr(h, "score", 0) or 0)
        if pid:
            out.append((str(pid), score))
    return out


def search_pinecone_multi(
    query_embeddings: list[list[float]],
    n_results: int = 20,
) -> list[tuple[str, float]]:
    """Run a query per embedding, merge by id (max score), return top n_results."""
    if not query_embeddings:
        return []
    best_score: dict[str, float] = {}
    for qemb in query_embeddings:
        hits = search_pinecone(qemb, n_results=n_results * 2)
        for pid, score in hits:
            if pid not in best_score or score > best_score[pid]:
                best_score[pid] = score
    sorted_ids = sorted(best_score.keys(), key=lambda x: best_score[x], reverse=True)[:n_results]
    return [(pid, best_score[pid]) for pid in sorted_ids]


def search_pinecone_multi_text(
    query_texts: list[str],
    n_results: int = 20,
) -> list[tuple[str, float]]:
    """Run a query per text (integrated embedding), merge by id (max score), return top n_results."""
    if not query_texts:
        return []
    best_score: dict[str, float] = {}
    for qtext in query_texts:
        hits = search_pinecone_by_text(qtext, n_results=n_results * 2)
        for pid, score in hits:
            if pid not in best_score or score > best_score[pid]:
                best_score[pid] = score
    sorted_ids = sorted(best_score.keys(), key=lambda x: best_score[x], reverse=True)[:n_results]
    return [(pid, best_score[pid]) for pid in sorted_ids]
