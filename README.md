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
| `DATABASE_URL` | Backend | Local: `postgresql://postgres:postgres@127.0.0.1:5433/healthsync`. Production: from **Render Postgres** (see below). |
| `OPENAI_API_KEY` | Backend | `sk-proj-...` |
| `CORS_ORIGINS` | Backend | Comma-separated origins, no spaces after commas |
| `MAX_UPLOAD_MB` | Backend | `15` |
| `VITE_API_URL` | Vercel (build-time) | `https://your-service.onrender.com` — **no trailing slash** |

### Production `DATABASE_URL` (Render Postgres)

Use **Render managed PostgreSQL**. The URL Render provides (internal or external) is a normal `postgresql://…` string, usually including TLS (`sslmode=require`). Paste it as **`DATABASE_URL`** on the web service, or use **`render.yaml`** so it is wired with `fromDatabase` (no Supabase-specific options or rewrites in app code).

## Production deployment

**Stack:** React on **Vercel**, FastAPI + **Render Postgres** on **Render**.

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "HealthSync: full stack for production deploy"
git branch -M main
git remote add origin https://github.com/aniketagicha21-code/HealthSync.git   # if not set
git push -u origin main
```

### Step 2 — Deploy with Blueprint (`render.yaml`)

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect repo **`aniketagicha21-code/HealthSync`**, branch **`main`**.
3. The blueprint creates **Render Postgres** (`healthsync-db`, **Basic** plan in YAML — change `plan` in `render.yaml` if you need another tier) and **healthsync-api** with **`DATABASE_URL`** from that database.
4. Set **sync** secrets on the web service: **`OPENAI_API_KEY`**, **`CORS_ORIGINS`** (your Vercel origins, comma-separated).
5. Deploy and confirm **GET** `https://<your-render-service>/api/health` returns JSON.

**Already have a Postgres instance?** Remove the `databases:` block from `render.yaml` and set **`DATABASE_URL`** manually to Render’s connection string (or use `fromDatabase` pointing at an existing database name in your Render account per [Blueprint spec](https://render.com/docs/blueprint-spec)).

**Cold starts:** Free Render web services spin down after inactivity; the first request may take ~30–60s.

### Step 3 — Frontend (Vercel)

1. [Vercel Dashboard](https://vercel.com) → **Add New…** → **Project** → import the repo.
2. **Root Directory:** `frontend`.
3. **Environment Variables:** **`VITE_API_URL`** = your Render API base URL (no trailing slash).
4. Deploy.

### Step 4 — CORS

**`CORS_ORIGINS`** on **healthsync-api** must include every browser origin (production + preview + custom domains).

### Step 5 — Verify

Upload a PDF, open results and **History**; if the API errors, check Render logs and **`CORS_ORIGINS`**.

## License

Private / portfolio use — Aniket Agicha.
