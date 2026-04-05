import { motion } from "framer-motion";

function ChatIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 4h12v8H7l-3 3v-3H4V4z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M7 7h6M7 9.5h4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export default function DoctorQuestions({ questions }) {
  if (!questions?.length) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-violet-200/90 bg-gradient-to-br from-violet-50 via-white to-cyan-50/80 p-8 shadow-card dark:border-violet-500/25 dark:from-violet-950/40 dark:via-zinc-900 dark:to-cyan-950/20 dark:shadow-card-dark"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30">
          <ChatIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            For your appointment
          </p>
          <h2 className="mt-0.5 font-display text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
            Questions to ask your doctor
          </h2>
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
        Specific prompts grounded in your results — ready to bookmark or bring
        on your phone.
      </p>
      <ol className="mt-8 space-y-3">
        {questions.map((q, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.35 }}
            className="flex gap-4 rounded-2xl border border-zinc-200/90 bg-white/90 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80 sm:p-5"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-violet-500 bg-gradient-to-b from-violet-600 to-fuchsia-600 font-display text-sm font-bold tabular-nums text-white shadow-md shadow-violet-500/25"
              aria-hidden
            >
              {i + 1}
            </span>
            <p className="min-w-0 pt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
              {q}
            </p>
          </motion.li>
        ))}
      </ol>
    </motion.section>
  );
}
