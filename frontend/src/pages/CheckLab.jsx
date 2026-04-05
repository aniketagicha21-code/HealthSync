import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import UploadZone from "../components/UploadZone.jsx";
import { useClientId } from "../hooks/useClientId.js";
import { analyzePdf } from "../lib/api.js";

export default function CheckLab() {
  const navigate = useNavigate();
  const { userId, ready, error: sessionError, ensureUser } = useClientId();
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const onFile = async (file) => {
    setUploadError(null);
    setBusy(true);
    try {
      const uid = userId || (await ensureUser());
      const res = await analyzePdf(uid, file);
      navigate(`/results/${res.id}`, { state: { analysis: res } });
    } catch (e) {
      setUploadError(e.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="border-b border-zinc-200/80 bg-white/50 pt-20 dark:border-zinc-800 dark:bg-zinc-950/30">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Analyze
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-zinc-900 dark:text-white">
            Check your lab report
          </h1>
          <p className="mt-2 max-w-xl text-zinc-600 dark:text-zinc-400">
            Drop a PDF below. We&apos;ll extract the text, parse every metric, and
            build your dashboard.
          </p>
        </div>
      </div>

      <div className="py-12">
        {!ready ? (
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Preparing your session…
          </p>
        ) : sessionError ? (
          <p className="text-center text-sm text-red-600 dark:text-red-400">
            {sessionError}
          </p>
        ) : (
          <UploadZone
            disabled={!userId}
            busy={busy}
            onFile={onFile}
            error={uploadError}
          />
        )}
      </div>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6"
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          After uploading, your report appears on{" "}
          <Link
            to="/history"
            className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
          >
            History
          </Link>
          .
        </p>
      </motion.section>

      <Footer />
    </div>
  );
}
