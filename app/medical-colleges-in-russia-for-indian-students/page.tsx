import type { Metadata } from "next";

import { StudyAbroadGuidePage } from "@/components/site/study-abroad-guide-page";
import { getStudyAbroadGuide } from "@/lib/data/study-abroad-guides";
import { buildIndexableMetadata } from "@/lib/metadata";

const guide = getStudyAbroadGuide("medical-colleges-in-russia-for-indian-students");

export const metadata: Metadata = buildIndexableMetadata(guide.metadata);

export default function MedicalCollegesInRussiaPage() {
  return <StudyAbroadGuidePage {...guide.page} />;
}
