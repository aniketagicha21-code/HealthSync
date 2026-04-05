import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import CheckLab from "./pages/CheckLab.jsx";
import History from "./pages/History.jsx";
import Home from "./pages/Home.jsx";
import Results from "./pages/Results.jsx";

export default function App() {
  const location = useLocation();
  return (
    <div className="relative min-h-screen bg-zinc-50 text-zinc-900 antialiased transition-colors duration-300 dark:bg-[#08090c] dark:text-zinc-100">
      <div className="noise" aria-hidden />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-0 min-h-screen"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/check" element={<CheckLab />} />
            <Route path="/history" element={<History />} />
            <Route path="/results/:id" element={<Results />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
