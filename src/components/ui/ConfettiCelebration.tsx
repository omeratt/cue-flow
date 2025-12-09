/**
 * ConfettiCelebration - Lottie-based confetti animation for victory moments
 * Implements GH-026: Add animated feedback states
 *
 * Features:
 * - Full-screen confetti overlay
 * - Auto-plays on mount or when triggered
 * - Uses Lottie for smooth 60fps animation
 */

import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

interface ConfettiCelebrationProps {
  readonly visible: boolean;
  readonly onAnimationFinish?: () => void;
  readonly autoPlay?: boolean;
  readonly loop?: boolean;
  readonly duration?: number;
}

export function ConfettiCelebration({
  visible,
  onAnimationFinish,
  autoPlay = true,
  loop = false,
  duration = 3000,
}: ConfettiCelebrationProps) {
  const lottieRef = useRef<LottieView>(null);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      if (autoPlay) {
        lottieRef.current?.play();
      }

      // Auto-hide after duration
      const timer = setTimeout(() => {
        opacity.value = withDelay(
          200,
          withTiming(0, { duration: 3500 }, (isFinished) => {
            isFinished && onAnimationFinish && scheduleOnRN(onAnimationFinish);
          })
        );
      }, duration);

      return () => clearTimeout(timer);
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      lottieRef.current?.reset();
    }
  }, [visible, autoPlay, duration, onAnimationFinish, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LottieView
        ref={lottieRef}
        source={require("../../../assets/lotties/Confetti.json")}
        style={styles.lottie}
        autoPlay={autoPlay}
        loop={loop}
        speed={1}
        resizeMode="cover"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    pointerEvents: "none",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});
