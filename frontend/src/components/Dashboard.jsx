import SummaryCard from "./SummaryCard.jsx";
import CategorySection from "./CategorySection.jsx";
import DoctorQuestions from "./DoctorQuestions.jsx";

function groupByCategory(metrics) {
  const map = new Map();
  for (const m of metrics) {
    const c = m.category || "other";
    if (!map.has(c)) map.set(c, []);
    map.get(c).push(m);
  }
  const order = [
    "blood_count",
    "metabolic_panel",
    "lipid_panel",
    "liver",
    "kidney",
    "thyroid",
    "coagulation",
    "inflammatory",
    "vitamins_minerals",
    "hormones",
    "urinalysis",
    "other",
  ];
  const keys = [...new Set([...order, ...map.keys()])];
  return keys.filter((k) => map.has(k)).map((k) => ({ category: k, metrics: map.get(k) }));
}

export default function Dashboard({ analysis }) {
  const groups = groupByCategory(analysis.metrics || []);
  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 pb-24 pt-10 sm:px-6">
      <SummaryCard
        summary={analysis.overall_summary}
        filename={analysis.pdf_filename}
        createdAt={analysis.created_at}
      />
      <div className="space-y-16">
        {groups.map(({ category, metrics }) => (
          <CategorySection key={category} category={category} metrics={metrics} />
        ))}
      </div>
      <DoctorQuestions questions={analysis.doctor_questions} />
    </div>
  );
}
