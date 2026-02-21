import os

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
DATA_PATH = os.getenv(
    "SOURCING_DATA_PATH",
    os.path.join(os.path.dirname(__file__), "data", "fisk_alumni_linkedin_data.json"),
)
EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIM = 1536  # text-embedding-3-small
TOP_K = 20

# ChromaDB: persist vectors on disk for semantic search
CHROMA_PERSIST_DIR = os.getenv(
    "CHROMA_PERSIST_DIR",
    os.path.join(os.path.dirname(__file__), "chroma_data"),
)
CHROMA_COLLECTION_NAME = "fisk_alumni"
