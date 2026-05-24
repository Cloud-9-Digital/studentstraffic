import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/tokens";

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 28,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "PlusJakartaSans-ExtraBold",
    color: colors.ink,
    fontSize: 18,
  },
  action: {
    fontFamily: "PlusJakartaSans-Bold",
    color: colors.primary,
    fontSize: 13,
  },
});
