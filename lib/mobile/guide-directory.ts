import { peerSafeText } from "@/lib/peer-contact-policy";

type DirectoryRow = {
  id: number; fullName: string; photoUrl: string | null; courseName: string | null;
  currentYearOrBatch: string | null; languages: string[] | null;
  universityName: string; universitySlug: string; countryName: string | null;
  acceptingRequests: boolean; bookingStatus: string | null; bookingUpdatedAt: Date | null;
};

export function mapMobileGuide(row: DirectoryRow, now = Date.now()) {
  const retryAt = row.bookingStatus === "declined" && row.bookingUpdatedAt
    ? row.bookingUpdatedAt.getTime() + 7 * 24 * 60 * 60 * 1000 : null;
  const requestState = row.bookingStatus === "accepted" ? "accepted"
    : row.bookingStatus === "pending" ? "pending"
    : !row.acceptingRequests ? "paused"
    : retryAt && retryAt > now ? "cooldown" : "available";
  return {
    id: row.id,
    fullName: peerSafeText(row.fullName) ?? "Student guide",
    photoUrl: row.photoUrl,
    courseName: row.courseName ? peerSafeText(row.courseName) : null,
    currentYearOrBatch: row.currentYearOrBatch ? peerSafeText(row.currentYearOrBatch) : null,
    languages: (row.languages ?? []).map(language => peerSafeText(language)).filter(Boolean),
    universityName: row.universityName,
    universitySlug: row.universitySlug,
    countryName: row.countryName,
    requestState,
    retryAt: requestState === "cooldown" && retryAt ? new Date(retryAt).toISOString() : null,
  };
}
