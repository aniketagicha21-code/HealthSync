/**
 * In development, always use same-origin `/api/*` so Vite's dev server can proxy
 * to the FastAPI backend. This avoids CORS issues and browser "Load failed" when
 * cross-origin requests to localhost:8000 are blocked or the env URL is wrong.
 * Production builds use VITE_API_URL (e.g. your Render API).
 */
function getApiBase() {
  if (import.meta.env.DEV) {
    return "";
  }
  return (import.meta.env.VITE_API_URL || "").replace(/\/$/, "").trim();
}

async function apiFetch(path, options) {
  const base = getApiBase();
  const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
  let r;
  try {
    r = await fetch(url, options);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const networkLike =
      /load failed|failed to fetch|networkerror|network request failed/i.test(
        msg
      );
    if (networkLike || e instanceof TypeError) {
      throw new Error(
        "Cannot reach the API. Start the backend on port 8000: cd backend && source .venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000"
      );
    }
    throw e;
  }
  return r;
}

export async function apiHealth() {
  const r = await apiFetch("/api/health");
  if (!r.ok) throw new Error("API unreachable");
  return r.json();
}

export async function createUser() {
  const r = await apiFetch("/api/users", { method: "POST" });
  if (!r.ok) throw new Error("Could not create session");
  return r.json();
}

function detailMessage(data) {
  if (!data || typeof data !== "object") return null;
  const { detail } = data;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((d) => (typeof d === "string" ? d : d.msg || JSON.stringify(d)))
      .join(" ");
  return null;
}

export async function analyzePdf(userId, file) {
  const fd = new FormData();
  fd.append("user_id", userId);
  fd.append("file", file);
  const r = await apiFetch("/api/analyze", { method: "POST", body: fd });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(detailMessage(data) || r.statusText || "Upload failed");
  }
  return data;
}

export async function listAnalyses(userId) {
  const r = await apiFetch(`/api/users/${userId}/analyses`);
  if (!r.ok) throw new Error("Could not load history");
  return r.json();
}

export async function getAnalysis(analysisId) {
  const r = await apiFetch(`/api/analyses/${analysisId}`);
  if (!r.ok) throw new Error("Could not load analysis");
  return r.json();
}
