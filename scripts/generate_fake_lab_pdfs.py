"""Generate synthetic lab report PDFs for local HealthSync testing (not real patient data)."""

from pathlib import Path

from fpdf import FPDF


def write_report(path: Path, title: str, body_lines: list[str]) -> None:
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_margins(left=14, top=14, right=14)
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 14)
    pdf.multi_cell(pdf.epw, 7, title)
    pdf.ln(2)
    pdf.set_font("Helvetica", "", 9)
    for line in body_lines:
        pdf.multi_cell(pdf.epw, 4.5, line)
    pdf.output(str(path))


def main() -> None:
    out = Path(__file__).resolve().parent / "fixtures"
    out.mkdir(parents=True, exist_ok=True)

    normal = [
        "Patient: DEMO, NORMAL (synthetic)",
        "DOB: 01/15/1990  |  Collected: 03/01/2026",
        "",
        "=== COMPLETE BLOOD COUNT ===",
        "WBC 6.8 thousand/uL  (Reference: 4.5 - 11.0)",
        "RBC 4.85 million/uL   (Reference: 4.5 - 5.9)",
        "Hemoglobin 14.8 g/dL  (Reference: 13.5 - 17.5 M)",
        "Hematocrit 44.2 %     (Reference: 38.0 - 50.0 M)",
        "Platelets 265 thousand/uL  (Reference: 150 - 400)",
        "MCV 91 fL  MCH 30.5 pg  MCHC 33.5 g/dL",
        "",
        "=== COMPREHENSIVE METABOLIC PANEL ===",
        "Glucose (fasting) 92 mg/dL  (Reference: 70 - 99)",
        "BUN 14 mg/dL  (Reference: 7 - 20)",
        "Creatinine 0.95 mg/dL  (Reference: 0.74 - 1.35 M)",
        "eGFR >60 mL/min/1.73m2",
        "Sodium 140 mmol/L  (Reference: 136 - 145)",
        "Potassium 4.2 mmol/L  (Reference: 3.5 - 5.1)",
        "CO2 26 mmol/L  (Reference: 23 - 29)",
        "Calcium 9.6 mg/dL  (Reference: 8.5 - 10.5)",
        "Total Protein 6.9 g/dL  (Reference: 6.0 - 8.3)",
        "Albumin 4.4 g/dL  (Reference: 3.5 - 5.5)",
        "Total Bilirubin 0.7 mg/dL  (Reference: 0.2 - 1.2)",
        "ALK Phosphatase 72 U/L  (Reference: 44 - 147)",
        "AST 24 U/L  (Reference: 10 - 40)  ALT 28 U/L  (Reference: 10 - 55)",
        "",
        "=== LIPID PANEL ===",
        "Total Cholesterol 178 mg/dL  (Reference: <200)",
        "LDL Cholesterol 98 mg/dL  (Reference: <100 optimal)",
        "HDL Cholesterol 56 mg/dL  (Reference: >40 M)",
        "Triglycerides 118 mg/dL  (Reference: <150)",
        "",
        "=== THYROID ===",
        "TSH 2.1 mIU/L  (Reference: 0.4 - 4.0)",
        "",
        "End of report - all values within listed reference intervals (synthetic demo).",
    ]

    abnormal = [
        "Patient: DEMO, ABNORMAL (synthetic)",
        "DOB: 08/22/1985  |  Collected: 03/02/2026",
        "",
        "=== COMPLETE BLOOD COUNT ===",
        "WBC 8.1 thousand/uL  (Reference: 4.5 - 11.0)",
        "RBC 3.95 million/uL   (Reference: 4.5 - 5.9)  LOW",
        "Hemoglobin 10.1 g/dL  (Reference: 13.5 - 17.5 M)  LOW",
        "Hematocrit 32.0 %     (Reference: 38.0 - 50.0 M)  LOW",
        "Platelets 228 thousand/uL  (Reference: 150 - 400)",
        "MCV 81 fL  MCH 25.5 pg  MCHC 31.5 g/dL",
        "",
        "=== COMPREHENSIVE METABOLIC PANEL ===",
        "Glucose (fasting) 156 mg/dL  (Reference: 70 - 99)  HIGH",
        "BUN 18 mg/dL  (Reference: 7 - 20)",
        "Creatinine 1.05 mg/dL  (Reference: 0.74 - 1.35 M)",
        "eGFR 78 mL/min/1.73m2",
        "Sodium 139 mmol/L  (Reference: 136 - 145)",
        "Potassium 4.0 mmol/L  (Reference: 3.5 - 5.1)",
        "CO2 24 mmol/L  (Reference: 23 - 29)",
        "Calcium 9.4 mg/dL  (Reference: 8.5 - 10.5)",
        "Total Protein 7.1 g/dL  (Reference: 6.0 - 8.3)",
        "Albumin 4.1 g/dL  (Reference: 3.5 - 5.5)",
        "Total Bilirubin 0.8 mg/dL  (Reference: 0.2 - 1.2)",
        "ALK Phosphatase 88 U/L  (Reference: 44 - 147)",
        "AST 32 U/L  (Reference: 10 - 40)  ALT 42 U/L  (Reference: 10 - 55)",
        "",
        "=== LIPID PANEL ===",
        "Total Cholesterol 278 mg/dL  (Reference: <200)  HIGH",
        "LDL Cholesterol 192 mg/dL  (Reference: <100)  HIGH",
        "HDL Cholesterol 38 mg/dL  (Reference: >40 M)  LOW",
        "Triglycerides 245 mg/dL  (Reference: <150)  HIGH",
        "",
        "=== THYROID ===",
        "TSH 1.8 mIU/L  (Reference: 0.4 - 4.0)",
        "",
        "End of report - synthetic demo with intentional abnormalities for software testing.",
    ]

    write_report(out / "fake_labs_all_normal.pdf", "Laboratory Report (Synthetic)", normal)
    write_report(
        out / "fake_labs_abnormal.pdf",
        "Laboratory Report (Synthetic - Abnormal Demo)",
        abnormal,
    )
    print("Wrote:", out / "fake_labs_all_normal.pdf")
    print("Wrote:", out / "fake_labs_abnormal.pdf")


if __name__ == "__main__":
    main()
