"""
FastAPI app for LinkedIn-powered alumni search.
Uses Pinecone only for vector search; serves full alumni list from JSON for Directory.
(ChromaDB code is kept in the repo but not connected.)
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

from config import (
    OPENAI_API_KEY,
    DATA_PATH,
    EMBEDDING_MODEL,
    TOP_K,
    MAX_INDEX_PROFILES,
    PINECONE_API_KEY,
    PINECONE_USE_INTEGRATED_EMBEDDING,
    CORS_ORIGINS,
)
from indexer import load_profiles
from search import profile_to_sourced
from query_expand import expand_query
from pinecone_store import (
    search_pinecone,
    search_pinecone_multi,
    search_pinecone_by_text,
    search_pinecone_multi_text,
)

# Loaded at startup: list of profile dicts and id -> profile for lookup
_profiles: list[dict] = []
_profiles_by_id: dict[str, dict] = {}


@asynccontextmanager
async def lifespan(app):
    global _profiles, _profiles_by_id
    try:
        if not PINECONE_API_KEY:
            raise ValueError("PINECONE_API_KEY is required (this app uses Pinecone only)")

        all_profiles = load_profiles(DATA_PATH)
        if not all_profiles:
            raise RuntimeError("No profiles loaded from data file")
        _profiles = all_profiles[:MAX_INDEX_PROFILES]
        _profiles_by_id = {str(p.get("id") or i): p for i, p in enumerate(_profiles)}
        # Pinecone index is populated separately (run embed_json_to_vectordb.py). Startup does not block on upsert.
    except FileNotFoundError as e:
        raise RuntimeError(f"Index build failed: {e}") from e
    except ValueError as e:
        raise RuntimeError(f"Index build failed: {e}") from e
    yield
    _profiles = []
    _profiles_by_id = {}


app = FastAPI(
    title="FiskConnect Sourcing API",
    description="Alumni list and semantic search over LinkedIn data (Pinecone)",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str


class SearchResponse(BaseModel):
    alumni: list[dict]


@app.get("/health")
def health():
    return {"status": "ok", "profiles_indexed": len(_profiles)}


@app.get("/alumni", response_model=SearchResponse)
def list_alumni():
    """Return all alumni from the JSON (for Directory tab). No Supabase."""
    results = [profile_to_sourced(p, 1.0) for p in _profiles]
    return SearchResponse(alumni=results)


@app.post("/search", response_model=SearchResponse)
def search(req: SearchRequest):
    """
    Help-seeking search: refactor query into search phrases, retrieve from vector DB
    (RAG-style chunks = one per alumni), merge and return top alumni as JSON for cards.
    """
    if not req.query or not req.query.strip():
        return SearchResponse(alumni=[])

    if not _profiles_by_id:
        raise HTTPException(status_code=503, detail="Search index not ready")

    # Refactor help request into 3–5 short search phrases (e.g. "Microsoft", "resume", "software engineering")
    phrases = expand_query(req.query.strip())
    if not phrases:
        return SearchResponse(alumni=[])

    # RAG: get chunks (one per alumni) per phrase, merge by profile id (max score) via Pinecone
    if PINECONE_USE_INTEGRATED_EMBEDDING:
        hits = search_pinecone_multi_text(phrases, n_results=TOP_K)
    else:
        if not OPENAI_API_KEY:
            raise HTTPException(status_code=503, detail="OpenAI API key not configured")
        client = OpenAI(api_key=OPENAI_API_KEY)
        resp = client.embeddings.create(input=phrases, model=EMBEDDING_MODEL)
        query_embeddings = [e.embedding for e in resp.data]
        if len(query_embeddings) == 1:
            hits = search_pinecone(query_embeddings[0], n_results=TOP_K)
        else:
            hits = search_pinecone_multi(query_embeddings, n_results=TOP_K)

    results = []
    for pid, score in hits:
        profile = _profiles_by_id.get(pid)
        if profile:
            results.append(profile_to_sourced(profile, score))
    return SearchResponse(alumni=results)
