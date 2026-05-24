import { PropsWithChildren } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "../theme/tokens";
import { FLOATING_TAB_INSET } from "./FloatingTabBar";

type Props = PropsWithChildren<{
  scroll?: boolean;
  tabScreen?: boolean;
}>;

export function AppScreen({ children, scroll = true, tabScreen = false }: Props) {
  const insets = useSafeAreaInsets();

  // On iOS inside a tab, the floating pill tab bar is absolutely positioned
  // so we need extra bottom padding to avoid content going under it.
  const extraBottom = tabScreen && Platform.OS === "ios" ? FLOATING_TAB_INSET : 0;

  if (!scroll) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.content, { paddingBottom: extraBottom }]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
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
