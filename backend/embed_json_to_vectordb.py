#!/usr/bin/env python3
"""
Standalone script to load the LinkedIn alumni JSON, build embeddings with OpenAI,
and upsert them into ChromaDB. Run from the backend directory.

Usage:
  cd backend
  export OPENAI_API_KEY=your_key
  python embed_json_to_vectordb.py

Optional env:
  SOURCING_DATA_PATH  - path to JSON (default: data/fisk_alumni_linkedin_data.json)
  CHROMA_PERSIST_DIR  - Chroma persistence dir (default: chroma_data)
"""
import sys

from openai import OpenAI

from config import DATA_PATH, OPENAI_API_KEY
from indexer import load_profiles, build_document, embed_texts
from chroma_store import get_client, add_to_chroma


def main() -> int:
    if not OPENAI_API_KEY:
        print("Error: OPENAI_API_KEY is not set.", file=sys.stderr)
        return 1

    print(f"Loading profiles from {DATA_PATH}...")
    profiles = load_profiles(DATA_PATH)
    if not profiles:
        print("Error: No profiles found in data file.", file=sys.stderr)
        return 1

    n = len(profiles)
    print(f"Building documents for {n} profiles...")
    documents = [build_document(p) for p in profiles]
    ids = [str(p.get("id") or i) for i, p in enumerate(profiles)]

    print("Embedding with OpenAI (batches of 100)...")
    client = OpenAI(api_key=OPENAI_API_KEY)
    embeddings = embed_texts(client, documents)
    embeddings_list = embeddings.tolist()

    print("Upserting into ChromaDB...")
    chroma_client = get_client()
    add_to_chroma(chroma_client, ids, embeddings_list, documents)

    print(f"Done. Indexed {n} alumni in the vector DB.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
