import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { mobileClient } from "../../api/mobileClient";
import { colors } from "../../theme/tokens";
export function GuideApplicationLink() {
  const router = useRouter();
  const { data } = useQuery({ queryKey: ["guideApplication"], queryFn: () => mobileClient.getGuideApplication(), staleTime: 30_000 });
  if (data?.guideStatus === "active") return null;
  const pending = data?.application?.status === "pending";
  return <Pressable accessibilityRole="button" onPress={() => router.push("/become-guide")} style={s.row}><Ionicons name="school-outline" size={23} color={colors.primary} /><View style={{ flex: 1 }}><Text style={s.title}>{pending ? "Guide application under review" : data?.guideStatus ? "Your guide profile" : "Become a student guide"}</Text><Text style={s.detail}>{pending ? "View your application status" : "Share your experience. Help another student."}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.muted} /></Pressable>;
}
const s = StyleSheet.create({ row: { flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 20 }, title: { fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13, color: colors.primary }, detail: { fontFamily: "PlusJakartaSans-Regular", fontSize: 11, lineHeight: 18, color: colors.muted, marginTop: 4 } });
