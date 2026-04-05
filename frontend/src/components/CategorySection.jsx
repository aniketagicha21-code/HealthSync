import { motion } from "framer-motion";
import MetricCard from "./MetricCard.jsx";

const LABELS = {
  blood_count: "Complete blood count",
  metabolic_panel: "Metabolic panel",
  lipid_panel: "Lipid panel",
  liver: "Liver enzymes",
  kidney: "Kidney function",
  thyroid: "Thyroid",
  coagulation: "Coagulation",
  urinalysis: "Urinalysis",
  inflammatory: "Inflammatory markers",
  vitamins_minerals: "Vitamins & minerals",
  hormones: "Hormones",
  other: "Other tests",
};

export default function CategorySection({ category, metrics }) {
  const title = LABELS[category] || category.replace(/_/g, " ");
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className="scroll-mt-28"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-300 to-transparent dark:via-violet-600/40" />
        <h2 className="font-display text-xl font-bold capitalize text-zinc-900 sm:text-2xl dark:text-white">
          {title}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-300 to-transparent dark:via-violet-600/40" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {metrics.map((m, i) => (
          <MetricCard key={`${m.name}-${i}`} metric={m} index={i} />
        ))}
      </div>
    </motion.section>
  );
}
