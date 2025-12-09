/**
 * RivalriesSection - Section displaying rivalry list or empty state
 * Extracted from HomeScreen as part of GH-019
 * Enhanced in GH-025: Staggered list animation
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { typography } from "../../lib/theme";
import type { Rivalry } from "../../types/rivalry";
import { SwipeableRivalryCard } from "../cards/SwipeableRivalryCard";
import { useTheme } from "../providers/ThemeProvider";
import { AnimatedListItem } from "../ui/AnimatedListItem";
import { EmptyState } from "../ui/EmptyState";

interface RivalriesSectionProps {
  readonly rivalries: readonly Rivalry[];
  readonly onRivalryPress: (rivalry: Rivalry) => void;
  readonly onDeleteRequest: (rivalry: Rivalry) => void;
}

export function RivalriesSection({
  rivalries,
  onRivalryPress,
  onDeleteRequest,
}: RivalriesSectionProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
        Your Rivalries
      </Text>
      {rivalries.length > 0 ? (
        rivalries.map((rivalry, index) => (
          <AnimatedListItem key={rivalry.id} index={index}>
            <SwipeableRivalryCard
              rivalry={rivalry}
              onPress={onRivalryPress}
              onDelete={onDeleteRequest}
            />
          </AnimatedListItem>
        ))
      ) : (
        <EmptyState
          icon="🎯"
          title="No Rivalries Yet"
          message="Start a game with a friend to begin tracking your rivalry!"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: typography.fonts.semiBold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
});
