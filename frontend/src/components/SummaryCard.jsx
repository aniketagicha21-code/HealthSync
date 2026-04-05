import { motion } from "framer-motion";

export default function SummaryCard({ summary, filename, createdAt }) {
  const date =
    createdAt &&
    new Date(createdAt).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-zinc-200/90 bg-white p-8 shadow-card dark:border-zinc-700/80 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-card-dark"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-600/15" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
          Overall picture
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
          What your report is saying
        </h2>
        {(filename || date) && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {filename && (
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {filename}
              </span>
            )}
            {filename && date && " · "}
            {date}
          </p>
        )}
        <p className="mt-6 text-base leading-relaxed text-zinc-700 sm:text-lg dark:text-zinc-300">
          {summary}
        </p>
      </div>
    </motion.article>
  );
}
