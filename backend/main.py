"""
FastAPI app for LinkedIn-powered alumni search.
Uses ChromaDB for vector search; serves full alumni list from JSON for Directory.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

from config import OPENAI_API_KEY, DATA_PATH, EMBEDDING_MODEL, TOP_K
from indexer import load_profiles, build_document, embed_texts
from search import profile_to_sourced
from query_expand import expand_query
from chroma_store import get_client, add_to_chroma, search_chroma, search_chroma_multi

# Loaded at startup: list of profile dicts and id -> profile for lookup
_profiles: list[dict] = []
_profiles_by_id: dict[str, dict] = {}
_chroma_client = None


@asynccontextmanager
async def lifespan(app):
    global _profiles, _profiles_by_id, _chroma_client
    try:
        _profiles = load_profiles(DATA_PATH)
        if not _profiles:
            raise RuntimeError("No profiles loaded from data file")
        _profiles_by_id = {str(p.get("id") or i): p for i, p in enumerate(_profiles)}

        if not OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is required for indexing")

        documents = [build_document(p) for p in _profiles]
        client = OpenAI(api_key=OPENAI_API_KEY)
        embeddings = embed_texts(client, documents)
        embeddings_list = embeddings.tolist()
        ids = [str(p.get("id") or i) for i, p in enumerate(_profiles)]

        _chroma_client = get_client()
        add_to_chroma(_chroma_client, ids, embeddings_list, documents)
    except FileNotFoundError as e:
        raise RuntimeError(f"Index build failed: {e}") from e
    except ValueError as e:
        raise RuntimeError(f"Index build failed: {e}") from e
    yield
    _profiles = []
    _profiles_by_id = {}
    _chroma_client = None


app = FastAPI(
    title="FiskConnect Sourcing API",
    description="Alumni list and semantic search over LinkedIn data (ChromaDB)",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

    if not _chroma_client or not _profiles_by_id:
        raise HTTPException(status_code=503, detail="Search index not ready")

    if not OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured")

    # Refactor help request into 3–5 short search phrases (e.g. "Microsoft", "resume", "software engineering")
    phrases = expand_query(req.query.strip())
    if not phrases:
        return SearchResponse(alumni=[])

    client = OpenAI(api_key=OPENAI_API_KEY)
    resp = client.embeddings.create(input=phrases, model=EMBEDDING_MODEL)
    query_embeddings = [e.embedding for e in resp.data]

    # RAG: get chunks (one per alumni) per phrase, merge by profile id (max score)
    if len(query_embeddings) == 1:
        hits = search_chroma(_chroma_client, query_embeddings[0], n_results=TOP_K)
    else:
        hits = search_chroma_multi(_chroma_client, query_embeddings, n_results=TOP_K)

    results = []
    for pid, score in hits:
        profile = _profiles_by_id.get(pid)
        if profile:
            results.append(profile_to_sourced(profile, score))
    return SearchResponse(alumni=results)
