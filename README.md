# HealthSync

Full-stack lab report analyzer: PDF text extraction (pdfplumber), structured analysis (GPT-4o), PostgreSQL history, React dashboard.

## Local development

### Prerequisites

- Node.js 20+
- Python **3.12.x** (recommended; 3.14+ may lack prebuilt wheels for some dependencies)
- Docker (for PostgreSQL) or a local Postgres instance

### 1. Start PostgreSQL

From the repo root:

```bash
docker compose up -d
```

### 2. Backend (FastAPI)

```bash
cd backend
python3.12 -m venv .venv   # or: python3 -m venv .venv on 3.12 default systems
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` with your real `OPENAI_API_KEY` and matching `DATABASE_URL`.

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

### 3. Frontend (Vite + React)

```bash
cd frontend
npm install
cp .env.example .env.local
```

Ensure `frontend/.env.local` contains:

```
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

App: http://localhost:5173

## Environment variables

| Variable | Where | Example |
|----------|--------|---------|
| `DATABASE_URL` | Backend | `postgresql://postgres:postgres@127.0.0.1:5433/healthsync` (Docker maps host **5433** → container 5432) |
| `OPENAI_API_KEY` | Backend | `sk-proj-...` |
| `CORS_ORIGINS` | Backend | Comma-separated origins, no spaces after commas |
| `MAX_UPLOAD_MB` | Backend | `15` |
| `VITE_API_URL` | Vercel (build-time) | `https://your-service.onrender.com` — **no trailing slash** |

## Production deployment (matches local behavior)

**Stack:** React on **Vercel**, FastAPI + Postgres on **Render**. The browser talks to your API over HTTPS; the API talks to Postgres and OpenAI.

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "HealthSync: full stack for production deploy"
git branch -M main
git remote add origin https://github.com/aniketagicha21-code/HealthSync.git   # if not set
git push -u origin main
```

### Step 2 — Deploy backend + database (Render)

1. Open [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect `aniketagicha21-code/HealthSync` and select the `main` branch.
3. Render reads `render.yaml` and will create **PostgreSQL** (`healthsync-db`) and a **Web Service** (`healthsync-api`).
4. When prompted, set **environment variables** (or add them after in the service **Environment** tab):
   - **`OPENAI_API_KEY`** — your OpenAI secret key.
   - **`CORS_ORIGINS`** — must include your Vercel URL(s), comma-separated, for example:
     - `https://healthsync.vercel.app,https://healthsync-xxx-aniketagicha21-code.vercel.app`
     - Add **Production** and **Preview** URLs if you use both (from Vercel project settings → Domains).
5. Wait for the first deploy. Copy the web service URL (e.g. `https://healthsync-api.onrender.com`). Confirm **GET** `https://…/api/health` returns JSON.

**Cold starts:** Free Render web services spin down after inactivity; the first request may take ~30–60s.

### Step 3 — Deploy frontend (Vercel)

1. [Vercel Dashboard](https://vercel.com) → **Add New…** → **Project** → import `aniketagicha21-code/HealthSync`.
2. **Root Directory:** `frontend` (important).
3. **Framework Preset:** Vite (auto-detected).
4. **Build Command:** `npm run build` (default).
5. **Output Directory:** `dist` (default).
6. **Environment Variables** (Production and Preview):
   - **`VITE_API_URL`** = your Render API base URL, e.g. `https://healthsync-api.onrender.com` (**no** trailing slash).
7. Deploy. After the build finishes, open the Vercel URL and test upload + history.

**Order note:** If the first Vercel build ran before you had the API URL, set `VITE_API_URL` and click **Redeploy** (env vars are baked in at build time).

### Step 4 — Align CORS with your real Vercel domain

After you know the production (and preview) URLs:

1. Render → **healthsync-api** → **Environment** → edit **`CORS_ORIGINS`** to list every frontend origin you use.
2. **Save** and let the service redeploy.

### Step 5 — Verify end-to-end

1. Toggle theme, upload a PDF, open results, open **History** — same flows as localhost.
2. If the UI shows API errors, check: `VITE_API_URL`, Render logs, and `CORS_ORIGINS` (must match the exact browser origin, including `https` and no path).

## License

Private / portfolio use — Aniket Agicha.
