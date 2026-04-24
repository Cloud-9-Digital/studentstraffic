import { BookOpen, GraduationCap, ShieldCheck, Users, Stethoscope, Trophy } from "lucide-react";

export type SeminarEvent = {
  date: string;
  day: string;
  city: string;
  venue: string;
  state: string;
  time?: string;
};

export const EVENTS = [
  { date: "10 May 2026", day: "Sunday",   city: "Chennai",         venue: "Hotel Hilton",               state: "TN", time: "10:00 AM" },
  { date: "17 May 2026", day: "Sunday",   city: "Madurai",         venue: "Royal Court",                state: "TN" },
  { date: "23 May 2026", day: "Saturday", city: "Dindigul",        venue: "Parson's Court",             state: "TN" },
  { date: "24 May 2026", day: "Sunday",   city: "Coimbatore",      venue: "TBD",                        state: "TN" },
  { date: "28 May 2026", day: "Thursday", city: "Salem",           venue: "Shrie Shaanth Hotel",        state: "TN", time: "10:00 AM" },
  { date: "31 May 2026", day: "Sunday",   city: "Tirunelveli",     venue: "RR Inn Group's of Hotel",    state: "TN" },
  { date: "7 Jun 2026",  day: "Sunday",   city: "Nagercoil",       venue: "Hotel Lance International",  state: "TN" },
  { date: "13 Jun 2026", day: "Saturday", city: "Madurai",         venue: "Royal Court",                state: "TN" },
  { date: "14 Jun 2026", day: "Sunday",   city: "Trichy",          venue: "Breeze Residency",           state: "TN" },
  { date: "20 Jun 2026", day: "Saturday", city: "Pollachi",        venue: "Sakthi Mahal Hotel",         state: "TN", time: "10:00 AM" },
  { date: "21 Jun 2026", day: "Sunday",   city: "Karaikudi",       venue: "APS Hall",                   state: "TN" },
  { date: "28 Jun 2026", day: "Sunday",   city: "Sivakasi",        venue: "RSR Residency",              state: "TN" },
  { date: "4 Jul 2026",  day: "Saturday", city: "Ramanathapuram",  venue: "Daiwik Hotel",               state: "TN" },
  { date: "5 Jul 2026",  day: "Sunday",   city: "Thoothukudi",     venue: "Hotel Raj",                  state: "TN" },
  { date: "12 Jul 2026", day: "Sunday",   city: "Theni",           venue: "Hotel Theni International",  state: "TN" },
  { date: "18 Jul 2026", day: "Saturday", city: "Erode",           venue: "Royal Embassy Hotel",        state: "TN", time: "10:00 AM" },
  { date: "19 Jul 2026", day: "Sunday",   city: "Tirupur",         venue: "May Berry Hotel",            state: "TN", time: "10:00 AM" },
] satisfies readonly SeminarEvent[];

export const FREE_INCLUSIONS = [
  {
    icon: BookOpen,
    title: "FMGE Prep Roadmap",
    desc: "Which books, which subjects, how to prepare month-by-month — structured by doctors who passed.",
  },
  {
    icon: GraduationCap,
    title: "University Selection Help",
    desc: "NMC-approved universities in Russia, Georgia, Kyrgyzstan — ranked honestly by our doctors.",
  },
  {
    icon: ShieldCheck,
    title: "NMC Registration Guidance",
    desc: "Step-by-step walkthrough of registering with the National Medical Commission after clearing FMGE.",
  },
  {
    icon: Users,
    title: "Ongoing Peer Mentorship",
    desc: "Access to a mentor — a real doctor — from the day you enroll until the day you practise in India.",
  },
  {
    icon: Stethoscope,
    title: "Clinical Internship Advice",
    desc: "How to make the most of your rotations abroad and build experience that counts for NMC.",
  },
  {
    icon: Trophy,
    title: "FMGE Coaching Support",
    desc: "Coaching resources, mock tests, and structured guidance — completely free for students enrolled through us.",
  },
] as const;

export const DIFFERENTIATORS = [
  {
    number: "01",
    title: "Talk to doctors, not sales agents",
    body: "Every seminar features FMGE-cleared doctors who studied in Russia and Georgia and are now practising in India. Their advice comes from experience, not commission.",
  },
  {
    number: "02",
    title: "Ask the hard questions openly",
    body: "Will you get clinical exposure? Is the degree respected? Can you actually clear FMGE? Get unfiltered answers in the room — not scripted brochure language.",
  },
  {
    number: "03",
    title: "Free support from enrollment to practice",
    body: "If you enroll through us, a mentor stays with you throughout your degree, FMGE prep, and NMC registration. One relationship, not a hand-off.",
  },
] as const;

export const SPEAKER_COUNTRIES = [
  {
    country: "Vietnam",
    countryCode: "vn",
    detail: "Student representatives sharing firsthand experience of studying MBBS in Vietnam.",
    hasFmgeGraduates: false,
  },
  {
    country: "Russia",
    countryCode: "ru",
    detail: "FMGE-cleared doctors from KSMU, PSMU, Kazan State, and other NMC-approved universities.",
    hasFmgeGraduates: true,
  },
  {
    country: "Georgia",
    countryCode: "ge",
    detail: "FMGE-cleared graduates from TSMU, David Tvildiani, University of Georgia, and more.",
    hasFmgeGraduates: true,
  },
  {
    country: "Kyrgyzstan",
    countryCode: "kg",
    detail: "FMGE-cleared doctors from KSMA, Osh State, and International School of Medicine.",
    hasFmgeGraduates: true,
  },
  {
    country: "Uzbekistan",
    countryCode: "uz",
    detail: "FMGE-cleared graduates from Tashkent Medical Academy and other NMC-listed institutions.",
    hasFmgeGraduates: true,
  },
] as const;

export const FAQ = [
  {
    q: "What time does the seminar start and how long does it last?",
    a: "The Chennai seminar starts at 10:00 AM. Timings for other cities are being finalized and will be shared in your WhatsApp confirmation.",
  },
  {
    q: "Is there a registration fee?",
    a: "No. Entry is completely free. There are no hidden charges for attending the seminar.",
  },
  {
    q: "Who should attend — students or parents?",
    a: "Both. Students can interact directly with doctors. Parents are encouraged to bring questions about NMC recognition, costs, and long-term career outcomes.",
  },
  {
    q: "Which countries will the doctors represent?",
    a: "Primarily Russia and Georgia — the two most popular NMC-approved destinations for Indian MBBS students. All speakers have completed their degrees, cleared FMGE, and are practising in India.",
  },
  {
    q: "What if my city isn't on the list?",
    a: "Register anyway. We'll add cities based on demand and personally notify you when one is scheduled near you.",
  },
  {
    q: "What happens after I register?",
    a: "Our team will WhatsApp you the nearest seminar date, exact venue address, and timing — and answer any advance questions.",
  },
  {
    q: "Is the mentorship truly free?",
    a: "Yes — for students who enroll through Students Traffic. From university selection to FMGE coaching to NMC registration, a dedicated mentor supports you at every stage.",
  },
] as const;
