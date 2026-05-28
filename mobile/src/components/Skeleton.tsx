import { useEffect, useRef } from "react";
import { Animated, View, type DimensionValue, type ViewStyle } from "react-native";

type Props = {
  width: DimensionValue;
  height: number;
  borderRadius?: number;
  light?: boolean;
  style?: ViewStyle;
};

const LIGHT_COLOR = "rgba(255,255,255,0.22)";
const DARK_COLOR = "#E4E7EC";

export function Skeleton({ width, height, borderRadius = 6, light = false, style }: Props) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View style={[{ opacity }, style]}>
      <View style={{ width, height, borderRadius, backgroundColor: light ? LIGHT_COLOR : DARK_COLOR }} />
    </Animated.View>
  );
}
