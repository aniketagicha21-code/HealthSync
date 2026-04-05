import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar() {
  const { pathname } = useLocation();

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        pathname === to
          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/80 bg-white/75 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/75"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <Link to="/" className="group relative z-[60] flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-lg font-bold text-white shadow-md shadow-violet-500/25">
            H
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              HealthSync
            </p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              Lab intelligence, simplified
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navLink("/", "Home")}
          {navLink("/check", "Check lab report")}
          {navLink("/history", "History")}
        </nav>

        <div className="relative z-[60] flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            to="/check"
            className="relative z-[60] rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/30 transition hover:brightness-110 active:scale-[0.98] dark:shadow-violet-500/20"
          >
            <span className="hidden sm:inline">Check lab report</span>
            <span className="sm:hidden">Check</span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
