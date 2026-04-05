import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

function IconDoc({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3h8l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M15 3v4h4M9 12h6M9 16h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTarget({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconTimeline({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h4v4H4V6zm6 8h10M4 14h4v4H4v-4z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="18" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

function IconFlag({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 3v18M5 5h11l-2 4 2 4H5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChat({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 10h8M8 14h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M6 18l-2 2v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-9l-3 3z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const features = [
  {
    title: "Understand every line",
    body: "See what each test measures and how your value compares to typical ranges — without drowning in jargon.",
    Icon: IconDoc,
    iconWrap: "bg-violet-600 text-white shadow-lg shadow-violet-500/40",
    glow: "rgb(139 92 246)",
  },
  {
    title: "Spot what deserves attention",
    body: "Out-of-range results are highlighted so you know exactly what to discuss with your clinician.",
    Icon: IconTarget,
    iconWrap: "bg-sky-500 text-white shadow-lg shadow-sky-500/40",
    glow: "rgb(14 165 233)",
  },
  {
    title: "Keep a personal record",
    body: "Save analyses over time to track trends and bring richer context to every appointment.",
    Icon: IconTimeline,
    iconWrap: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40",
    glow: "rgb(16 185 129)",
  },
  {
    title: "Flags what needs attention",
    body: "If any value is high, low, or critical, HealthSync calls it out clearly in plain language so you know exactly what to ask about — no medical degree needed.",
    Icon: IconFlag,
    iconWrap: "bg-orange-500 text-white shadow-lg shadow-orange-500/40",
    glow: "rgb(249 115 22)",
  },
  {
    title: "Questions ready for your doctor",
    body: "After every upload, HealthSync generates a personalised list of calm, specific questions based on your actual numbers — so you walk into your appointment prepared, not overwhelmed.",
    Icon: IconChat,
    iconWrap: "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/40",
    glow: "rgb(192 38 211)",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-28 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-mesh-light dark:bg-mesh-dark" />
        <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-600/20 animate-drift" />
        <div className="pointer-events-none absolute -right-32 top-32 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/15 animate-drift" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700 shadow-sm dark:border-violet-500/30 dark:bg-zinc-900/60 dark:text-violet-300"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            HealthSync
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-8 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl sm:leading-[1.05] lg:text-6xl dark:text-white"
          >
            Understand your lab results in{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 bg-clip-text text-transparent">
              plain English
            </span>
            —before your follow-up.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 text-lg font-medium text-zinc-600 sm:text-xl dark:text-zinc-300"
          >
            Upload your report. Get every metric explained, outliers flagged, and
            smart questions for your doctor — in one calm, organized view.
          </motion.p>

          <motion.div variants={item} className="mt-10 text-left sm:text-center">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              Why HealthSync
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Lab PDFs are dense and easy to misread. HealthSync reads the file for
              you, structures every value with reference ranges, and turns the
              noise into a clear narrative you can trust — so you walk into your
              visit informed, not anxious.
            </p>
          </motion.div>

          <motion.div variants={item} className="mt-12">
            <Link
              to="/check"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-10 py-4 text-base font-bold text-white shadow-xl shadow-violet-500/30 transition hover:brightness-110 active:scale-[0.98] dark:shadow-violet-600/25"
            >
              Check Lab Report
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-t border-zinc-200/80 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950/50 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mb-12 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              Why HealthSync
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
              Everything you need from one upload
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-zinc-600 dark:text-zinc-400">
              Built for clarity and speed — so you spend less time decoding and
              more time on what matters.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ title, body, Icon, iconWrap, glow }, i) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-card ring-1 ring-black/[0.03] dark:border-zinc-700/80 dark:bg-zinc-900/80 dark:shadow-card-dark dark:ring-white/[0.06]"
              >
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-50 blur-2xl dark:opacity-35"
                  style={{ background: glow }}
                />
                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${iconWrap}`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="relative mt-5 font-display text-lg font-bold text-zinc-900 dark:text-white">
                  {title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
