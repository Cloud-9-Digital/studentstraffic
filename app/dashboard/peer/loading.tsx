import { GuideSkeleton } from "./guide-skeleton";

export default function GuideHomeLoading() {
  return <GuideSkeleton label="Loading guide home" stats={4} sections={[2, 3]} />;
}
