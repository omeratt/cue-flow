/**
 * GameSetupScreen - Player names and timer duration selection
 * Implements:
 * - GH-002: Enter player names
 * - GH-003: Select timer duration
 * Refactored in GH-019: Split into sub-components
 */

import { useRouter } from "expo-router";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../components/providers/ThemeProvider";
import { DurationSelector } from "../components/setup/DurationSelector";
import { PlayerInputSection } from "../components/setup/PlayerInputSection";
import { RivalryBadge } from "../components/setup/RivalryBadge";
import { SetupHeader } from "../components/setup/SetupHeader";
import { StartButton } from "../components/setup/StartButton";
import { useGameSetup } from "../hooks/useGameSetup";

export function GameSetupScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    player1Name,
    player2Name,
    selectedDuration,
    customDuration,
    isCustom,
    isValid,
    gameMode,
    activeRivalry,
    setPlayer1Name,
    setPlayer2Name,
    handleDurationSelect,
    handleCustomDurationChange,
    handleStartGame,
    handleBack,
  } = useGameSetup();

  if (!gameMode) {
    router.replace("/");
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 16 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SetupHeader gameMode={gameMode} onBack={handleBack} />

          {activeRivalry && <RivalryBadge rivalry={activeRivalry} />}

          <PlayerInputSection
            player1Name={player1Name}
            player2Name={player2Name}
            onPlayer1Change={setPlayer1Name}
            onPlayer2Change={setPlayer2Name}
          />

          <DurationSelector
            selectedDuration={selectedDuration}
            customDuration={customDuration}
            isCustom={isCustom}
            onDurationSelect={handleDurationSelect}
            onCustomDurationChange={handleCustomDurationChange}
          />
        </ScrollView>

        <StartButton isValid={isValid} onPress={handleStartGame} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
});
