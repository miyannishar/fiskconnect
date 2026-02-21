# Sourcing API (Alumni from JSON + ChromaDB)

FastAPI service that loads LinkedIn alumni from JSON, indexes them in **ChromaDB** for semantic search, and serves the full list for the Find Alumni page. The student Find Alumni experience uses this API only (no Supabase for MVP).

## Setup

1. **Python 3.10+** and a virtual environment:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Environment**

   In project root or shell:

   - `OPENAI_API_KEY` – required for building embeddings at startup.

   Optional (see `config.py`):

   - `DATA_PATH` – path to LinkedIn JSON (default: `data/fisk_alumni_linkedin_data.json`).
   - `CHROMA_PERSIST_DIR` – where ChromaDB stores vectors (default: `backend/chroma_data`).
   - `TOP_K` – max search results (default: 20).

3. **Run the API**

   From the `backend` directory:

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   On startup, the app loads the JSON, builds embeddings, and upserts them into ChromaDB.  
   Health: [http://localhost:8000/health](http://localhost:8000/health)

4. **Re-index the vector DB (optional)**

   To rebuild Chroma from the JSON without starting the API (e.g. after updating the data file):

   ```bash
   cd backend
   export OPENAI_API_KEY=your_key
   python embed_json_to_vectordb.py
   ```

   Optional env: `SOURCING_DATA_PATH`, `CHROMA_PERSIST_DIR` (see `config.py`).

## Frontend

Set in the Next.js app:

- `NEXT_PUBLIC_SOURCING_API_URL=http://localhost:8000`

Find Alumni (Directory and AI-powered search) uses this API only; run Next.js and this API together in dev.

## API

- **GET /health** – readiness; returns `profiles_indexed`.
- **GET /alumni** – returns all alumni from the JSON as `{ "alumni": [ ... ] }` (for the Directory tab).
- **POST /search** – body: `{ "query": "natural language search" }`. Semantic search via ChromaDB. Returns `{ "alumni": [ ... ] }` with `relevanceScore`.
