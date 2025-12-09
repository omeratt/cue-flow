/**
 * AnimatedModal - Modal with spring-based slide up animation
 * GH-025: Screen transition animations
 *
 * Features:
 * - Spring-based slide up animation
 * - Backdrop fade animation
 * - Scale effect for modal content
 * - Smooth enter/exit transitions
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Spring configuration for natural modal movement
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 300,
  mass: 0.8,
};

// Timing config for backdrop
const BACKDROP_TIMING = {
  duration: 200,
  easing: Easing.out(Easing.ease),
};

interface AnimatedModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
  readonly contentStyle?: ViewStyle;
  readonly backgroundColor?: string;
  readonly backdropOpacity?: number;
}

export function AnimatedModal({
  visible,
  onClose,
  children,
  contentStyle,
  backgroundColor = "#FFFFFF",
  backdropOpacity = 0.5,
}: AnimatedModalProps) {
  const progress = useSharedValue(0);
  const [isModalVisible, setIsModalVisible] = useState(visible);

  // Handle visibility changes
  const handleAnimationEnd = useCallback(() => {
    if (!visible) {
      setIsModalVisible(false);
    }
  }, [visible]);

  // Monitor animation completion
  useAnimatedReaction(
    () => progress.value,
    (currentValue, previousValue) => {
      "worklet";
      // Animation ended (closing)
      if (previousValue !== null && previousValue > 0 && currentValue === 0) {
        // Use a short timeout to ensure state update happens on JS thread
      }
    }
  );

  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      progress.value = withSpring(1, SPRING_CONFIG);
    } else {
      progress.value = withTiming(0, BACKDROP_TIMING);
      // Delay hiding modal until animation completes
      const timeout = setTimeout(handleAnimationEnd, BACKDROP_TIMING.duration);
      return () => clearTimeout(timeout);
    }
  }, [visible, progress, handleAnimationEnd]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, backdropOpacity]),
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [SCREEN_HEIGHT * 0.3, 0]
    );
    const scale = interpolate(progress.value, [0, 1], [0.9, 1]);
    const opacity = interpolate(progress.value, [0, 0.5, 1], [0, 0.5, 1]);

    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  if (!isModalVisible) {
    return null;
  }

  return (
    <Modal
      visible={isModalVisible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View style={styles.container} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.content,
            { backgroundColor },
            contentStyle,
            contentAnimatedStyle,
          ]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
});
