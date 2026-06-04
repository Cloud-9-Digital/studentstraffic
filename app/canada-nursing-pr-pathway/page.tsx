import type { Metadata } from "next";
import { StudyAbroadGuidePage } from "@/components/site/study-abroad-guide-page";
import { getStudyAbroadGuide } from "@/lib/data/study-abroad-guides";
import { buildIndexableMetadata } from "@/lib/metadata";

const guide = getStudyAbroadGuide("canada-nursing-pr-pathway");

export const metadata: Metadata = buildIndexableMetadata(guide.metadata);

export default function CanadaNursingPrPathwayPage() {
  return <StudyAbroadGuidePage {...guide.page} />;
}
