import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

export default function UploadZone({
  disabled,
  busy,
  onFile,
  error,
}) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const pick = useCallback(() => {
    if (!disabled && !busy) inputRef.current?.click();
  }, [disabled, busy]);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDrag(false);
      const f = e.dataTransfer.files?.[0];
      if (f && f.name.toLowerCase().endsWith(".pdf")) onFile(f);
    },
    [onFile]
  );

  return (
    <motion.div
      id="analyze"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-3xl px-4 sm:px-6"
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
            Upload your lab PDF
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Text-based PDFs work best. Max 15 MB.
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={disabled || busy}
        onClick={pick}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={`group relative w-full rounded-3xl border-2 border-dashed p-10 text-center transition ${
          drag
            ? "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950/30"
            : "border-zinc-300 bg-white hover:border-violet-400/60 dark:border-zinc-600 dark:bg-zinc-900/40 dark:hover:border-violet-500/50"
        } ${disabled || busy ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={disabled || busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-2xl text-white shadow-lg shadow-violet-500/30">
            ↗
          </span>
          <p className="font-display text-lg font-semibold text-zinc-900 dark:text-white">
            {busy ? "Analyzing your report…" : "Click or drag PDF here"}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {busy
              ? "Extracting metrics, checking ranges, and drafting questions for your visit."
              : "Your file is processed by your HealthSync backend."}
          </p>
        </div>
        <div className="pointer-events-none absolute inset-x-8 bottom-6 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent opacity-0 transition group-hover:opacity-100 dark:via-violet-400/40" />
      </button>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
