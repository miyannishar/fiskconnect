#!/usr/bin/env python3
"""
Standalone script to load the LinkedIn alumni JSON and upsert into Pinecone.
Run from the backend directory. ChromaDB is not used (code kept in repo only).

Usage:
  cd backend
  export PINECONE_API_KEY=your_key
  python embed_json_to_vectordb.py

Optional env:
  SOURCING_DATA_PATH     - path to JSON
  MAX_INDEX_PROFILES     - cap number of profiles (default 500)
  PINECONE_INDEX         - Pinecone index name (default fisk)
  PINECONE_NAMESPACE     - namespace (default alumni)
  PINECONE_USE_INTEGRATED_EMBEDDING - true (default) or false
  OPENAI_API_KEY         - required only if PINECONE_USE_INTEGRATED_EMBEDDING=false
"""
import sys

from openai import OpenAI

from config import (
    DATA_PATH,
    OPENAI_API_KEY,
    MAX_INDEX_PROFILES,
    PINECONE_API_KEY,
    PINECONE_USE_INTEGRATED_EMBEDDING,
)
from indexer import load_profiles, build_document, embed_texts
from pinecone_store import add_to_pinecone, add_to_pinecone_text


def main() -> int:
    if not PINECONE_API_KEY:
        print("Error: PINECONE_API_KEY is required (this script uses Pinecone only).", file=sys.stderr)
        return 1

    print(f"Loading profiles from {DATA_PATH}...")
    all_profiles = load_profiles(DATA_PATH)
    if not all_profiles:
        print("Error: No profiles found in data file.", file=sys.stderr)
        return 1
    profiles = all_profiles[:MAX_INDEX_PROFILES]
    n = len(profiles)
    if len(all_profiles) > n:
        print(f"Capping to {n} profiles (MAX_INDEX_PROFILES={MAX_INDEX_PROFILES}).")
    print(f"Building documents for {n} profiles...")
    documents = [build_document(p) for p in profiles]
    ids = [str(p.get("id") or i) for i, p in enumerate(profiles)]

    if PINECONE_USE_INTEGRATED_EMBEDDING:
        print("Upserting into Pinecone (integrated embedding)...")
        add_to_pinecone_text(ids, documents)
    else:
        if not OPENAI_API_KEY:
            print("Error: OPENAI_API_KEY required for Pinecone vector mode.", file=sys.stderr)
            return 1
        print("Embedding with OpenAI (batches of 100)...")
        client = OpenAI(api_key=OPENAI_API_KEY)
        embeddings = embed_texts(client, documents)
        print("Upserting into Pinecone...")
        add_to_pinecone(ids, embeddings.tolist())

    print(f"Done. Indexed {n} alumni in Pinecone.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
