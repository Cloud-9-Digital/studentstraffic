import { GuideSkeleton } from "../guide-skeleton";

export default function MyStudentsLoading() {
  return <GuideSkeleton label="Loading students" sections={[5]} wide />;
}
