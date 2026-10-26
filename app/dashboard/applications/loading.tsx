import { ListPageSkeleton } from "@/app/dashboard/applications/_components/list-skeleton";

export default function ApplicationsLoading() {
  return <ListPageSkeleton rows={3} label="Loading your applications" />;
}
