import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";

const ScanOverlay = () => {
  const translateY = useSharedValue(0);
  const cornerOpacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(199, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )
    cornerOpacity.value = withRepeat(
      withTiming(0.4, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )
  }, [])

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }))

  const cornerStyle = useAnimatedStyle(() => ({
    opacity: cornerOpacity.value
  }))

  return (
    <View style={overlayStyles.container} pointerEvents="none">
      <Animated.View style={[overlayStyles.corners, cornerStyle]}>
        {(["tl", "tr", "bl", "br"] as const).map((pos) => (
          <View key={pos} style={[overlayStyles.corner, overlayStyles[pos]]} />
        ))}
      </Animated.View>

      <Animated.View style={[overlayStyles.scanLine, scanLineStyle]} />
    </View>
  )
}

const CORNER_SIZE = 18;
const CORNER_THICKNESS = 2.5;
const ACCENT = "#4ade80";

const overlayStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    margin: 10
  },
  corners: {
    ...StyleSheet.absoluteFillObject
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: ACCENT,
    borderWidth: 0
  },
  tl: {
    top: 0, left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS
  },
  tr: {
    top: 0, right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS
  },
  bl: {
    bottom: 0, left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS
  },
  br: {
    bottom: 0, right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: ACCENT,
    borderRadius: 1,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4
  }
})

export default ScanOverlay;