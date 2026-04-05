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
| `DATABASE_URL` | Backend | Local: `postgresql://postgres:postgres@127.0.0.1:5433/healthsync`. Supabase: see below. |
| `OPENAI_API_KEY` | Backend | `sk-proj-...` |
| `CORS_ORIGINS` | Backend | Comma-separated origins, no spaces after commas |
| `MAX_UPLOAD_MB` | Backend | `15` |
| `VITE_API_URL` | Vercel (build-time) | `https://your-service.onrender.com` — **no trailing slash** |

### Supabase `DATABASE_URL` (production)

Use the **URI** from Supabase → **Project Settings** → **Database** (same host/user/db as the dashboard).

Shape:

```text
postgresql://postgres:[YOUR-PASSWORD]@db.nwqiilsixeqmhlqnirzd.supabase.co:5432/postgres?sslmode=require
```

- Append **`?sslmode=require`** if it is not already in the string (Supabase expects TLS).
- **Never commit** the real password or check `.env` into git.
- If the password contains special characters (`@`, `#`, `%`, etc.), **URL-encode** the password before placing it in the URI.

Set this value as **`DATABASE_URL`** on **Render** (web service environment) and optionally in local `backend/.env` when pointing at Supabase.

## Production deployment (matches local behavior)

**Stack:** React on **Vercel**, FastAPI on **Render**, PostgreSQL on **Supabase** (free tier). The browser calls your Render API; the API uses `DATABASE_URL` to reach Supabase and OpenAI.

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "HealthSync: full stack for production deploy"
git branch -M main
git remote add origin https://github.com/aniketagicha21-code/HealthSync.git   # if not set
git push -u origin main
```

### Step 2 — Supabase (database)

1. Project **healthsync** (e.g. region **West US / North California**) should already exist.
2. **Settings → Database** → copy the **connection string** (URI).
3. Build the full URL: `postgresql://postgres:YOUR_PASSWORD@db.nwqiilsixeqmhlqnirzd.supabase.co:5432/postgres?sslmode=require`
4. Keep this string secret; you will paste it into Render as **`DATABASE_URL`** only.

### Step 3 — Deploy backend (Render, no Render Postgres)

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** (or edit the existing **Web Service**).
2. Connect `aniketagicha21-code/HealthSync` / branch **`main`** so `render.yaml` applies.
3. **`render.yaml` no longer creates a database** — only the **healthsync-api** web service.
4. Set environment variables on **`healthsync-api`**:
   - **`DATABASE_URL`** — full Supabase URI with `sslmode=require` (see above).
   - **`OPENAI_API_KEY`**
   - **`CORS_ORIGINS`** — your Vercel origins, comma-separated, e.g.  
     `https://your-app.vercel.app,https://your-app-git-main-xxx.vercel.app`
5. Deploy and confirm **GET** `https://<your-render-service>/api/health` returns JSON.

**Cold starts:** Free Render web services spin down after inactivity; the first request may take ~30–60s.

### Step 4 — Deploy frontend (Vercel)

1. [Vercel Dashboard](https://vercel.com) → **Add New…** → **Project** → import `aniketagicha21-code/HealthSync`.
2. **Root Directory:** `frontend` (important).
3. **Framework Preset:** Vite (auto-detected).
4. **Build Command:** `npm run build` (default).
5. **Output Directory:** `dist` (default).
6. **Environment Variables** (Production and Preview):
   - **`VITE_API_URL`** = your Render API base URL, e.g. `https://healthsync-api.onrender.com` (**no** trailing slash).
7. Deploy. If you change `VITE_API_URL`, **redeploy** so the build picks it up.

### Step 5 — CORS

Render → **healthsync-api** → **Environment** → **`CORS_ORIGINS`** must list every frontend origin (production + preview + custom domains), exact scheme and host.

### Step 6 — Verify end-to-end

1. Toggle theme, upload a PDF, results, **History** — same as local.
2. If the API fails, check Render logs, `DATABASE_URL` (Supabase reachable from Render), and `CORS_ORIGINS`.

## License

Private / portfolio use — Aniket Agicha.
