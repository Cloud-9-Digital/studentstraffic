import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { FLOATING_TAB_INSET } from "./FloatingTabBar";
import { colors } from "../theme/tokens";

type ToastType = "add" | "remove";

type ToastContextType = {
  showToast: (text: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<{ text: string; type: ToastType } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((text: string, type: ToastType = "add") => {
    if (timer.current) clearTimeout(timer.current);

    opacity.stopAnimation();
    translateY.stopAnimation();
    opacity.setValue(0);
    translateY.setValue(16);
    setToast({ text, type });

    Animated.parallel([
      Animated.timing(opacity,     { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(translateY,  { toValue: 0, useNativeDriver: true, speed: 22, bounciness: 8 }),
    ]).start();

    timer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 8, duration: 220, useNativeDriver: true }),
      ]).start(() => setToast(null));
    }, 2200);
  }, []);

  const bottom = Platform.OS === "ios"
    ? FLOATING_TAB_INSET + 14
    : insets.bottom + 80 + 14;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="none"
          style={[s.toast, { bottom, opacity, transform: [{ translateY }] }]}
        >
          <View style={[s.iconWrap, toast.type === "remove" && s.iconRemove]}>
            <Ionicons
              name={toast.type === "add" ? "bookmark" : "bookmark-outline"}
              size={12}
              color="#fff"
            />
          </View>
          <Text style={s.text}>{toast.text}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const s = StyleSheet.create({
  toast: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#0d1a17",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  iconRemove: {
    backgroundColor: colors.coral,
  },
  text: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
