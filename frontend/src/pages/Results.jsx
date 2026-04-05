import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Dashboard from "../components/Dashboard.jsx";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import { getAnalysis } from "../lib/api.js";

export default function Results() {
  const { id } = useParams();
  const location = useLocation();
  const seeded =
    location.state?.analysis &&
    String(location.state.analysis.id) === String(id);
  const [analysis, setAnalysis] = useState(
    seeded ? location.state.analysis : null
  );
  const [loading, setLoading] = useState(!seeded);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) return;
      setError(null);
      if (!seeded) setLoading(true);
      try {
        const data = await getAnalysis(id);
        if (!cancelled) {
          setAnalysis(data);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Could not load analysis");
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id, seeded]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="border-b border-zinc-200/80 bg-white/70 pt-14 dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            to="/check"
            className="text-sm font-semibold text-violet-600 transition hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
          >
            ← Back to upload
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Analysis · {id?.slice(0, 8)}…
          </p>
        </div>
      </div>

      {loading && (
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="h-48 animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-800/80" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800/60" />
              <div className="h-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800/60" />
            </div>
          </motion.div>
        </div>
      )}

      {error && !loading && (
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Link
            to="/check"
            className="mt-6 inline-block text-sm font-semibold text-violet-600 dark:text-violet-400"
          >
            Return to upload
          </Link>
        </div>
      )}

      {!loading && !error && analysis && <Dashboard analysis={analysis} />}

      <Footer />
    </div>
  );
}
