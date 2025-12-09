/**
 * HomeScreen - Main screen with game mode selection and rivalry list
 * Implements GH-001: Select game mode
 * Implements GH-013: Delete rivalry
 * Refactored in GH-019: Split into sub-components
 */

import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GameModeSection } from "../components/home/GameModeSection";
import { HomeHeader } from "../components/home/HomeHeader";
import { RivalriesSection } from "../components/home/RivalriesSection";
import { useTheme } from "../components/providers/ThemeProvider";
import { ConfirmationModal } from "../components/ui/ConfirmationModal";
import { useHome } from "../hooks/useHome";

export function HomeScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    sortedRivalries,
    rivalryToDelete,
    handleGameModeSelect,
    handleRivalryPress,
    handleSettingsPress,
    handleDeleteRequest,
    handleConfirmDelete,
    handleCancelDelete,
  } = useHome();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader onSettingsPress={handleSettingsPress} />
        <GameModeSection onGameModeSelect={handleGameModeSelect} />
        <RivalriesSection
          rivalries={sortedRivalries}
          onRivalryPress={handleRivalryPress}
          onDeleteRequest={handleDeleteRequest}
        />
      </ScrollView>

      <ConfirmationModal
        visible={rivalryToDelete !== null}
        title="Delete Rivalry?"
        message={
          rivalryToDelete
            ? `Are you sure you want to delete the rivalry between ${rivalryToDelete.player1Name} and ${rivalryToDelete.player2Name}? This will remove all game history.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
});
