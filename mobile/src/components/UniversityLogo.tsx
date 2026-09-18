import { requireOptionalNativeModule } from "expo";
import { Image as NativeImage, Platform, type ImageStyle, type StyleProp } from "react-native";

// Avoid evaluating expo-image at all when an older client lacks its native code.
// Compatible clients retain Expo's image cache and list recycling support.
const ExpoImage = Platform.OS === "web" || requireOptionalNativeModule("ExpoImage")
  ? (require("expo-image") as typeof import("expo-image")).Image
  : null;

type Props = {
  uri: string;
  style: StyleProp<ImageStyle>;
  onError: () => void;
};

export function UniversityLogo({ uri, style, onError }: Props) {
  if (ExpoImage) {
    return <ExpoImage source={uri} style={style} contentFit="contain" cachePolicy="memory-disk" recyclingKey={uri} onError={onError} />;
  }

  return <NativeImage key={uri} source={{ uri }} style={style} resizeMode="contain" onError={onError} />;
}
