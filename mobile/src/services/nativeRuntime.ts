import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
export const supportsNativeCalls = Platform.OS !== "web" && !isExpoGo;
export const NATIVE_BUILD_REQUIRED = "Voice calls and push notifications require the Students Traffic development build. Expo Go is a browsing and chat preview only.";
