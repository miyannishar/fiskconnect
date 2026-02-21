import os
from pathlib import Path

# Load .env from backend directory when present
_env_path = Path(__file__).resolve().parent / ".env"
if _env_path.exists():
    try:
        from dotenv import load_dotenv
        load_dotenv(_env_path)
    except ImportError:
        pass

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
DATA_PATH = os.getenv(
    "SOURCING_DATA_PATH",
    os.path.join(os.path.dirname(__file__), "data", "fisk_alumni_linkedin_data.json"),
)
EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIM = 1536  # text-embedding-3-small
TOP_K = 20

# ChromaDB: either persistent disk (local/Railway volume) or Chroma Cloud
CHROMA_PERSIST_DIR = os.getenv(
    "CHROMA_PERSIST_DIR",
    os.path.join(os.path.dirname(__file__), "chroma_data"),
)
# Chroma Cloud: if CHROMA_API_KEY is set, use CloudClient (tenant + database from env)
CHROMA_API_KEY = os.getenv("CHROMA_API_KEY", "")
CHROMA_TENANT = os.getenv("CHROMA_TENANT", "")
CHROMA_DATABASE = os.getenv("CHROMA_DATABASE", "")
# Fallback for remote Chroma (HttpClient) when API key not used
CHROMA_API_URL = os.getenv("CHROMA_API_URL", "").rstrip("/")
CHROMA_TOKEN = os.getenv("CHROMA_TOKEN", "")
CHROMA_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "fisk_alumni")
# Cap profiles indexed (used for both Pinecone and Chroma)
MAX_INDEX_PROFILES = int(os.getenv("MAX_INDEX_PROFILES", "500"))

# Pinecone: when set, use Pinecone for vector search (no Chroma)
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX", "fisk")
# For integrated-embedding indexes, Pinecone may require the index host (e.g. fisk-xxx.svc.region.pinecone.io)
PINECONE_INDEX_HOST = os.getenv("PINECONE_INDEX_HOST", "").rstrip("/")
PINECONE_NAMESPACE = os.getenv("PINECONE_NAMESPACE", "alumni")
# Integrated embedding: if "true", upsert records with text field and query by text (index embeds via llama-text-embed-v2)
PINECONE_USE_INTEGRATED_EMBEDDING = os.getenv("PINECONE_USE_INTEGRATED_EMBEDDING", "true").lower() in ("1", "true", "yes")
# Index field map key for text to embed (must match Pinecone index config, e.g. "text")
PINECONE_TEXT_FIELD = os.getenv("PINECONE_TEXT_FIELD", "text")
# Delay (seconds) between upsert batches for integrated embedding to avoid 429 (e.g. 250k TPM limit)
PINECONE_UPSERT_BATCH_DELAY = float(os.getenv("PINECONE_UPSERT_BATCH_DELAY", "20"))

# CORS: comma-separated origins (e.g. https://fisk-ten.vercel.app); localhost is always allowed in dev
_CORS_DEFAULT = "http://localhost:3000,http://127.0.0.1:3000,https://fisk-ten.vercel.app"
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", _CORS_DEFAULT).split(",") if o.strip()]
