import { StyleSheet, Text } from "react-native";
import type { ApplicationStatus } from "../types/domain";
import { colors } from "../theme/tokens";

const labels: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  accepted: "Accepted",
  rejected: "Rejected",
  waitlisted: "Waitlisted",
};

export function StatusPill({ status }: { status: ApplicationStatus }) {
  const done = status === "accepted" || status === "submitted";
  return (
    <Text style={[styles.pill, done ? styles.done : styles.pending]}>
      {labels[status]}
    </Text>
  );
}

const styles = StyleSheet.create({
  pill: {
    overflow: "hidden",
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "800",
  },
  done: {
    backgroundColor: "#e7f6ef",
    color: colors.success,
  },
  pending: {
    backgroundColor: colors.amberSoft,
    color: colors.amber,
  },
});
