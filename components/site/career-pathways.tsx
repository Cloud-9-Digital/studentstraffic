"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Pathway = {
  flag: string;
  destination: string;
  exam: string;
  timeline: string;
  highlight: string;
  steps: string[];
};

export function getPathways(studyCountry?: string): Pathway[] {
  return [
    {
      flag: "🇮🇳",
      destination: "Practice in India",
      exam: "FMGE / NExT",
      timeline: "6–9 months after graduation",
      highlight: "Most common pathway for Indian students. After completing your MBBS and one-year internship abroad, you clear FMGE (being replaced by NExT) to obtain NMC registration. Students Traffic provides free FMGE/NExT coaching for students who join through us.",
      steps: [
        "Complete MBBS and one-year internship abroad",
        "Clear FMGE or NExT to obtain NMC registration",
        "Start practice in India or apply for PG (MD/MS)",
      ],
    },
    {
      flag: "🇺🇸",
      destination: "Practice in USA",
      exam: "USMLE Step 1, 2 CK, 3",
      timeline: "4–7 years post-graduation",
      highlight: "Highest earning potential globally. Start USMLE Step 1 preparation from Year 2 of MBBS. The residency match for international medical graduates is competitive — around 5–10% match rate — but achievable with strong scores and research experience.",
      steps: [
        "Clear USMLE Step 1 during MBBS Years 3–4",
        "Clear USMLE Step 2 CK after graduation",
        "Match into a US residency programme via ERAS/NRMP",
        "Clear USMLE Step 3 during residency to obtain full licence",
      ],
    },
    {
      flag: "🇬🇧",
      destination: "Practice in UK",
      exam: "PLAB 1 & PLAB 2",
      timeline: "1–2 years post-graduation",
      highlight: "One of the most accessible international pathways for Indian graduates. PLAB 1 is an MCQ exam taken in India or the UK; PLAB 2 is a clinical skills OSCE taken in Manchester. After both, you obtain GMC registration and can apply for NHS posts.",
      steps: [
        "Clear PLAB 1 — MCQ exam, available at centres in India",
        "Clear PLAB 2 — OSCE clinical exam in Manchester, UK",
        "Obtain GMC full registration",
        "Apply for foundation year or specialty training posts in the NHS",
      ],
    },
    {
      flag: "🇦🇺",
      destination: "Australia and New Zealand",
      exam: "AMC CAT + Clinical Exam",
      timeline: "2–4 years post-graduation",
      highlight: "Strong and sustained demand for doctors in both countries. The AMC CAT is a computer adaptive multiple choice exam; the Clinical Exam is an OSCE. After both, you obtain the AMC certificate and register with AHPRA to practise in Australia.",
      steps: [
        "Clear AMC CAT — computer adaptive MCQ exam",
        "Clear AMC Clinical Exam — OSCE format",
        "Obtain AMC certificate and AHPRA registration",
        "Work in general practice or apply for specialty training",
      ],
    },
    {
      flag: "🇨🇦",
      destination: "Practice in Canada",
      exam: "MCCQE Part 1 + NAC OSCE",
      timeline: "3–6 years post-graduation",
      highlight: "Competitive pathway but one of the highest quality of life destinations for doctors. The CaRMS residency match is the key bottleneck — strong MCCQE scores and Canadian clinical exposure both improve match rates significantly.",
      steps: [
        "Clear MCCQE Part 1 — qualifying written exam",
        "Clear NAC OSCE — national assessment collaboration clinical skills exam",
        "Apply for residency through the CaRMS match",
        "Complete residency and obtain LMCC to practise independently",
      ],
    },
    {
      flag: "🌍",
      destination: studyCountry ? `PG in ${studyCountry}` : "PG in your study country",
      exam: "Country-specific PG entrance",
      timeline: "Directly after internship",
      highlight: studyCountry
        ? `Stay in ${studyCountry} after your MBBS and continue into postgraduate specialisation. No additional country-to-country licensing exam required. This pathway suits students who find strong clinical opportunities during their undergraduate years and prefer to build their career where they trained.`
        : "Stay in your study country after MBBS and continue into postgraduate specialisation. No country-to-country licensing exam required. This pathway suits students who find strong clinical opportunities during their undergraduate years and prefer to build their career where they trained.",
      steps: [
        `Complete MBBS and internship${studyCountry ? ` in ${studyCountry}` : " abroad"}`,
        "Appear for the PG entrance examination in that country",
        "Join an MD or specialisation programme locally",
        `Build a medical career${studyCountry ? ` in ${studyCountry}` : " in your study country"}`,
      ],
    },
  ];
}

export function CareerPathways({ studyCountry }: { studyCountry?: string }) {
  const pathways = getPathways(studyCountry);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border">
      {pathways.map((p, i) => (
        <div key={p.destination}>
          <button
            className="flex w-full items-center gap-4 py-4 text-left transition hover:opacity-80"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="text-2xl leading-none">{p.flag}</span>
            <div className="flex-1">
              <span className="text-sm font-semibold text-foreground">{p.destination}</span>
              <span className="ml-3 text-xs text-muted-foreground">{p.exam}</span>
            </div>
            <ChevronDown
              className="size-4 shrink-0 text-muted-foreground transition-transform"
              style={{ transform: open === i ? "rotate(180deg)" : "none" }}
            />
          </button>

          {open === i && (
            <div className="pb-5 pl-10 pr-1">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Timeline: </span>
                {p.timeline}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{p.highlight}</p>
              <ol className="mt-4 space-y-1.5">
                {p.steps.map((step, j) => (
                  <li key={j} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 shrink-0 font-bold text-foreground">{j + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
