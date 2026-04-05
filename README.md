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

Supabase’s **direct** host (`db.<project-ref>.supabase.co`) is **IPv6-only** in DNS. **Render has no IPv6 egress**, so that host does not work as-is.

**On Render**, the API **rewrites** a direct `DATABASE_URL` to the **session pooler** automatically (`postgres.<ref>@aws-0-<region>.pooler.supabase.com:5432`), defaulting **`SUPABASE_POOLER_REGION` to `us-west-1`** (West US / N. California). If your project is in another AWS region, set **`SUPABASE_POOLER_REGION`** on the Render service (e.g. `us-east-1`).

You may still paste the **session pooler** URI from Supabase → **Connect** if you prefer; that skips rewriting.

- Append **`?sslmode=require`** if missing (the app adds it when rewriting).
- **Transaction pooler** (`:6543`): the app adds **`pgbouncer=true`**, uses **psycopg3** with **`prepare_threshold=None`**, and **NullPool** so PgBouncer transaction mode works with SQLAlchemy. For a long-lived API like this, **session pooler** (`:5432`, `postgres.<ref>@aws-0-…`) is usually simpler if you hit pooler quirks.
- **Never commit** the real password. URL-encode special characters in the password (`@`, `#`, `%`, …).

The **direct** URI works on your laptop **only if** your network supports IPv6 to Supabase.

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

1. Project **healthsync** should already exist.
2. Paste **`DATABASE_URL`** into Render using either the **direct** URI from **Settings → Database** or the **Session pooler** URI from **Connect**. Direct URLs are rewritten on Render to the pooler unless you set **`SUPABASE_POOLER_REGION`** when the default region is wrong.
3. Keep the string secret.

### Step 3 — Deploy backend (Render, no Render Postgres)

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** (or edit the existing **Web Service**).
2. Connect `aniketagicha21-code/HealthSync` / branch **`main`** so `render.yaml` applies.
3. **`render.yaml` no longer creates a database** — only the **healthsync-api** web service.
4. Set environment variables on **`healthsync-api`**:
   - **`DATABASE_URL`** — Supabase URI (direct or pooler; see above).
   - **`SUPABASE_POOLER_REGION`** (optional) — e.g. `us-east-1` if not **us-west-1**.
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
