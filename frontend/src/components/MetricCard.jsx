import { motion } from "framer-motion";

const STATUS_STYLES = {
  normal:
    "border-emerald-400/70 bg-emerald-50 text-emerald-900 dark:border-emerald-500/45 dark:bg-emerald-950/50 dark:text-emerald-100",
  high: "border-red-500/70 bg-red-50 text-red-900 dark:border-red-500/55 dark:bg-red-950/45 dark:text-red-100",
  low: "border-amber-500/70 bg-amber-50 text-amber-950 dark:border-amber-500/55 dark:bg-amber-950/40 dark:text-amber-100",
  critical:
    "border-red-500 bg-red-100 text-red-950 shadow-critical-glow animate-pulse-critical dark:border-red-400 dark:bg-red-950/55 dark:text-red-50",
  unknown:
    "border-zinc-300 bg-zinc-100 text-zinc-800 dark:border-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-200",
};

export default function MetricCard({ metric, index }) {
  const badge = STATUS_STYLES[metric.status] || STATUS_STYLES.unknown;
  const attention =
    metric.status && metric.status !== "normal"
      ? "ring-1 ring-inset ring-black/[0.04] dark:ring-white/[0.06]"
      : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.03, 0.45),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:shadow-none ${attention}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
            {metric.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
            Ref: {metric.normal_range}
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${badge}`}
        >
          {metric.status}
        </span>
      </div>
      <p className="mt-4 font-mono text-2xl font-semibold text-zinc-900 dark:text-white">
        {metric.value}
        {metric.unit ? (
          <span className="ml-1 text-base font-medium text-zinc-500 dark:text-zinc-400">
            {metric.unit}
          </span>
        ) : null}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {metric.explanation}
      </p>
    </motion.div>
  );
}
