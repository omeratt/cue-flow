/**
 * SwipeableRivalryCard - A swipeable wrapper for RivalryCard with delete action
 * Implements GH-013: Delete rivalry (swipe-to-delete gesture)
 * Memoized for performance when rendering in lists
 */

import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback, useRef } from "react";
import { StyleSheet, Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { typography } from "../../lib/theme";
import type { Rivalry } from "../../types/rivalry";
import { useTheme } from "../providers/ThemeProvider";
import { RivalryCard } from "./RivalryCard";

interface SwipeableRivalryCardProps {
  readonly rivalry: Rivalry;
  readonly onPress: (rivalry: Rivalry) => void;
  readonly onDelete: (rivalry: Rivalry) => void;
}

interface DeleteActionProps {
  readonly drag: SharedValue<number>;
  readonly onDeletePress: () => void;
  readonly deleteButtonColor: string;
}

const DELETE_ACTION_WIDTH = 80;

/**
 * Right action component that renders the delete button
 */
function DeleteAction({
  drag,
  onDeletePress,
  deleteButtonColor,
}: DeleteActionProps) {
  const animatedStyle = useAnimatedStyle(() => {
    // The drag value is negative when swiping left
    // We want the button to slide in from the right
    return {
      transform: [{ translateX: drag.value + DELETE_ACTION_WIDTH }],
    };
  });

  return (
    <Animated.View style={[styles.rightActionContainer, animatedStyle]}>
      <RectButton
        style={[styles.deleteButton, { backgroundColor: deleteButtonColor }]}
        onPress={onDeletePress}
      >
        <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </RectButton>
    </Animated.View>
  );
}

function SwipeableRivalryCardComponent({
  rivalry,
  onPress,
  onDelete,
}: SwipeableRivalryCardProps) {
  const { theme } = useTheme();
  const swipeableRef = useRef<SwipeableMethods>(null);

  const handleDeletePress = useCallback(() => {
    // Close the swipeable first, then trigger delete
    swipeableRef.current?.close();
    onDelete(rivalry);
  }, [onDelete, rivalry]);

  const renderRightActions = useCallback(
    (
      _progress: SharedValue<number>,
      drag: SharedValue<number>
    ): React.ReactNode => {
      return (
        <DeleteAction
          drag={drag}
          onDeletePress={handleDeletePress}
          deleteButtonColor={theme.colors.error}
        />
      );
    },
    [handleDeletePress, theme.colors.error]
  );

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={renderRightActions}
      containerStyle={styles.swipeableContainer}
    >
      <RivalryCard rivalry={rivalry} onPress={onPress} />
    </ReanimatedSwipeable>
  );
}

// Memoize to prevent unnecessary re-renders in lists
export const SwipeableRivalryCard = memo(SwipeableRivalryCardComponent);

const styles = StyleSheet.create({
  swipeableContainer: {
    marginBottom: 0, // RivalryCard already has marginBottom
  },
  rightActionContainer: {
    width: DELETE_ACTION_WIDTH,
    marginBottom: 12, // Match RivalryCard's marginBottom
  },
  deleteButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: typography.fonts.semiBold,
    marginTop: 4,
  },
});
