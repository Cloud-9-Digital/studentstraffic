import { View } from "react-native";
import { Image } from "expo-image";

// Mira's own mark, the same artwork as the website dock
// (components/site/chatbot/mira-mark.png). Rendered bare, never animated: it is
// an identity, not a status light. On a dark surface the bubble's own dark
// shape vanishes, so `onDark` sets it on a light disc instead.
export function MiraMark({ size = 30, onDark = false }: { size?: number; onDark?: boolean }) {
  const mark = <Image source={require("../../../assets/mira-mark.png")} style={{ width: size, height: size }} contentFit="contain" accessible={false} />;
  if (!onDark) return mark;
  const disc = Math.round(size * 1.45);
  return <View style={{ width: disc, height: disc, borderRadius: disc / 2, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>{mark}</View>;
}
