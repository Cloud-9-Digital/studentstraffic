import type { StudentApplication, StudentProfile, University } from "../types/domain";

export const universities: University[] = [
  {
    slug: "kazan-federal-university",
    name: "Kazan Federal University",
    country: "Russia",
    city: "Kazan",
    course: "MBBS",
    tuitionUsd: 5400,
    duration: "6 years",
    medium: "English",
    recognition: ["NMC", "WHO", "FAIMER"],
    summary:
      "A large public university with a long medical tradition, strong clinical exposure, and an established Indian student community.",
    fit: "Best for students who want a recognised public university with city life and structured academics.",
    imageTone: "green",
  },
  {
    slug: "tbilisi-state-medical-university",
    name: "Tbilisi State Medical University",
    country: "Georgia",
    city: "Tbilisi",
    course: "MD / MBBS equivalent",
    tuitionUsd: 8000,
    duration: "6 years",
    medium: "English",
    recognition: ["NMC", "WHO", "WFME"],
    summary:
      "Georgia's flagship medical university, known for international cohorts, European-style academics, and urban hospital access.",
    fit: "Best for students prioritising English-medium instruction and a compact capital-city campus life.",
    imageTone: "blue",
  },
  {
    slug: "osh-state-university",
    name: "Osh State University",
    country: "Kyrgyzstan",
    city: "Osh",
    course: "MBBS",
    tuitionUsd: 3600,
    duration: "5 years",
    medium: "English",
    recognition: ["NMC", "WHO"],
    summary:
      "A budget-friendly option with broad Indian student intake, practical hospital exposure, and lower living costs.",
    fit: "Best for budget-conscious students who want a shorter program duration.",
    imageTone: "coral",
  },
];

export const applications: StudentApplication[] = [
  {
    id: "app_001",
    universitySlug: "kazan-federal-university",
    universityName: "Kazan Federal University",
    course: "MBBS",
    status: "under_review",
    nextStep: "Upload passport scan for counsellor verification.",
    updatedAt: "Today",
  },
  {
    id: "app_002",
    universitySlug: "tbilisi-state-medical-university",
    universityName: "Tbilisi State Medical University",
    course: "MD / MBBS equivalent",
    status: "draft",
    nextStep: "Confirm budget and preferred intake.",
    updatedAt: "Yesterday",
  },
];

export const profile: StudentProfile = {
  name: "Bharat",
  email: "bharat@example.com",
  phone: "+91 98765 43210",
  neetScore: 512,
  budgetUsd: 6500,
  preferredCountries: ["Russia", "Georgia", "Kyrgyzstan"],
};

export const shortlistSlugs = ["kazan-federal-university", "osh-state-university"];
