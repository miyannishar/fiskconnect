# Sourcing API (Alumni from JSON + Pinecone)

FastAPI service that loads LinkedIn alumni from JSON, indexes them in **Pinecone** for semantic search, and serves the full list for the Find Alumni page. The student Find Alumni experience uses this API only (no Supabase for MVP).  
**ChromaDB code remains in the repo but is not connected**; the app uses Pinecone only.

## Setup

1. **Python 3.10+** and a virtual environment:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Environment**

   **Required:**

   - `PINECONE_API_KEY` – required; the app uses Pinecone only.

   Optional (see `config.py`):

   - `DATA_PATH` – path to LinkedIn JSON (default: `data/fisk_alumni_linkedin_data.json`).
   - `OPENAI_API_KEY` – required for query expansion (search) and for Pinecone vector mode (indexing when `PINECONE_USE_INTEGRATED_EMBEDDING=false`).
   - `TOP_K` – max search results (default: 20).

3. **Run the API**

   From the `backend` directory:

   ```bash
   export PINECONE_API_KEY=your_key
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   On startup, the app only loads the JSON into memory (for profile lookup and `/alumni`). It does **not** upsert to Pinecone at startup, so the server is ready immediately.  
   Health: [http://localhost:8000/health](http://localhost:8000/health)

4. **Populate Pinecone (required for search)**

   Search uses an existing Pinecone index. Populate or update it by running:

   ```bash
   cd backend
   export PINECONE_API_KEY=your_key
   python embed_json_to_vectordb.py
   ```
   This may take several minutes (rate-limited batches). Run it once before using search, and again when the JSON data changes.

   Optional env: `SOURCING_DATA_PATH`, `MAX_INDEX_PROFILES`, `PINECONE_INDEX`, `PINECONE_NAMESPACE`, `PINECONE_INDEX_HOST`, `PINECONE_USE_INTEGRATED_EMBEDDING`, `PINECONE_TEXT_FIELD`.  
   `OPENAI_API_KEY` required only when `PINECONE_USE_INTEGRATED_EMBEDDING=false`.

   **If you see `DeprecatedPluginError: pinecone-plugin-inference`:** that plugin is deprecated and built into `pinecone` now. Uninstall it in the same environment where you run the app:
   ```bash
   pip uninstall pinecone-plugin-inference -y
   ```

### Pinecone with integrated embedding (e.g. index “fisk”, llama-text-embed-v2)

If your Pinecone index uses **integrated embedding** (field map `text`, dimension 1024), set:

- `PINECONE_API_KEY` – your key
- `PINECONE_INDEX` – index name (e.g. `fisk`)
- `PINECONE_INDEX_HOST` – (optional) index host from Pinecone console if the SDK needs it (e.g. `fisk-xxx.svc.aped-4627-b74a.pinecone.io`)
- `PINECONE_NAMESPACE` – (optional) default `alumni`
- `PINECONE_USE_INTEGRATED_EMBEDDING=true` – (default) upsert by text, query by text; no OpenAI embeddings for index/search
- `PINECONE_TEXT_FIELD=text` – (default) must match the index’s field map

No OpenAI key is required for indexing or search when using integrated embedding. For **vector mode** (you provide 1536-dim vectors), set `PINECONE_USE_INTEGRATED_EMBEDDING=false` and create an index without integrated embedding (dimension 1536, cosine).

## Deploying on Railway (and ChromaDB)

On Railway the container filesystem is **ephemeral**: anything written to disk is lost on redeploy. You have three ways to run ChromaDB:

### Option 1: Rebuild on every deploy (simplest, no extra services)

- Do **not** set `CHROMA_PERSIST_DIR` to a volume; leave it default or any path.
- On each startup the app loads the JSON, calls OpenAI to embed all profiles, and upserts into Chroma in that directory. After deploy, the index lives only in memory/disk until the next redeploy, then it rebuilds.
- **Pros:** No Chroma account, no volume, zero config.  
- **Cons:** Cold starts take longer (embedding ~500 profiles) and use OpenAI credits on every deploy.

### Option 2: Railway Volume (persistent Chroma on disk)

- In Railway, add a **Volume** to your backend service and mount it (e.g. at `/data`).
- Set `CHROMA_PERSIST_DIR=/data/chroma` (or the mount path).
- On first deploy the app builds the index and writes to the volume; on later deploys the same container sees the existing data and startup is fast. Run the `embed_json_to_vectordb` script only when you change the JSON.
- **Pros:** No Chroma account; fast restarts; data survives redeploys.  
- **Cons:** You manage the volume and backup if needed.

### Option 3: Chroma Cloud (hosted Chroma)

- Sign up at [Chroma Cloud](https://trychroma.com/cloud) and create a project; get the API URL and token.
- In Railway (or any host), set:
  - `CHROMA_API_URL` – e.g. `https://api.trychroma.com` or the URL from your Chroma project.
  - `CHROMA_TOKEN` – your Chroma Cloud API key.
- The app uses Chroma’s **HttpClient** and talks to Chroma Cloud; no local Chroma data is stored on Railway.
- **Pros:** No disk or volume; managed scaling and backups.  
- **Cons:** Requires a Chroma account and (usually) a paid plan for production.

You do **not** need a Chroma account for Option 1 or 2; only for Option 3.

**Railway env (all options):** `OPENAI_API_KEY`, and either default/volume path (Options 1–2) or `CHROMA_API_URL` + `CHROMA_TOKEN` (Option 3). Point your frontend’s `NEXT_PUBLIC_SOURCING_API_URL` at your Railway backend URL.

## Frontend

Set in the Next.js app:

- `NEXT_PUBLIC_SOURCING_API_URL=http://localhost:8000`

Find Alumni (Directory and AI-powered search) uses this API only; run Next.js and this API together in dev.

## API

- **GET /health** – readiness; returns `profiles_indexed`.
- **GET /alumni** – returns all alumni from the JSON as `{ "alumni": [ ... ] }` (for the Directory tab).
- **POST /search** – body: `{ "query": "natural language search" }`. Semantic search via Pinecone. Returns `{ "alumni": [ ... ] }` with `relevanceScore`.
