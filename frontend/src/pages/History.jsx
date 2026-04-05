import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import { useClientId } from "../hooks/useClientId.js";
import { listAnalyses } from "../lib/api.js";

export default function History() {
  const { userId, ready, error: sessionError } = useClientId();
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState(null);

  const refreshHistory = useCallback(async () => {
    if (!userId) return;
    try {
      setHistoryError(null);
      const rows = await listAnalyses(userId);
      setHistory(rows);
    } catch (e) {
      setHistoryError(e.message);
    }
  }, [userId]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="border-b border-zinc-200/80 bg-white/50 pt-20 dark:border-zinc-800 dark:bg-zinc-950/30">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            History
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-zinc-900 dark:text-white">
            Past analyses
          </h1>
          <p className="mt-2 max-w-xl text-zinc-600 dark:text-zinc-400">
            Every report you&apos;ve uploaded — open any row to see metrics,
            explanations, and doctor questions.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {!ready ? (
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Preparing your session…
          </p>
        ) : sessionError ? (
          <p className="text-center text-sm text-red-600 dark:text-red-400">
            {sessionError}
          </p>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {history.length === 0
                  ? "No analyses yet."
                  : `${history.length} ${history.length === 1 ? "report" : "reports"} saved`}
              </p>
              <button
                type="button"
                onClick={refreshHistory}
                className="text-sm font-semibold text-violet-600 hover:underline dark:text-violet-400"
              >
                Refresh
              </button>
            </div>

            {historyError && (
              <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                {historyError}
              </p>
            )}

            {history.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  No reports yet.
                </p>
                <Link
                  to="/check"
                  className="mt-4 inline-block text-sm font-semibold text-violet-600 hover:underline dark:text-violet-400"
                >
                  Upload a lab PDF →
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {history.map((h) => (
                  <motion.li
                    key={h.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Link
                      to={`/results/${h.id}`}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/60 dark:hover:border-violet-500/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-zinc-900 dark:text-white">
                          {h.pdf_filename}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {new Date(h.created_at).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          <span className="font-mono font-semibold text-violet-600 dark:text-violet-400">
                            {h.metric_count}
                          </span>{" "}
                          metrics
                        </span>
                        {h.abnormal_count > 0 ? (
                          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700 dark:border-red-500/40 dark:bg-red-950/50 dark:text-red-300">
                            {h.abnormal_count} flagged
                          </span>
                        ) : (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300">
                            All normal
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
