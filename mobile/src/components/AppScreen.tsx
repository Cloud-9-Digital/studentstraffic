import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing } from "../theme/tokens";

type Props = PropsWithChildren<{
  scroll?: boolean;
  tabScreen?: boolean;
}>;

export function AppScreen({ children, scroll = true, tabScreen = false }: Props) {
  const extraBottom = 0;

  if (!scroll) {
    return (
      <SafeAreaView style={styles.safe} edges={tabScreen ? ["top", "left", "right"] : undefined}>
        <View style={[styles.content, { paddingBottom: extraBottom }]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={tabScreen ? ["top", "left", "right"] : undefined}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 32 + extraBottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenX,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenX,
  },
});
