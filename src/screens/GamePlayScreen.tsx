/**
 * GamePlayScreen - Main game timer screen
 * Implements:
 * - GH-004: Start and stop timer
 * - GH-005: View animated countdown
 *
 * Acceptance Criteria (GH-004):
 * - Timer displays in center of screen as large circle ✅
 * - Initial state shows "Tap to Start" message ✅
 * - First tap starts countdown with animation ✅
 * - Subsequent tap stops timer and switches player ✅
 * - Current player name displayed above timer ✅
 * - Timer resets to full duration for next player ✅
 *
 * Acceptance Criteria (GH-005):
 * - Circular progress ring depletes as time passes ✅
 * - Remaining seconds displayed as large number in center ✅
 * - Animation runs at 60fps without stuttering ✅
 * - Color changes as time gets low (green → yellow → red) ✅
 * - Animation pauses when timer is stopped ✅
 */

import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";

import { CircularTimer } from "../components/game/CircularTimer";
import { GameHeader } from "../components/game/GameHeader";
import { PlayerIndicator } from "../components/game/PlayerIndicator";
import { ScoreDisplay } from "../components/game/ScoreDisplay";
import { TimerInstructions } from "../components/game/TimerInstructions";
import { useTheme } from "../components/providers/ThemeProvider";
import { useGamePlay } from "../hooks/useGamePlay";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TIMER_SIZE = Math.min(SCREEN_WIDTH - 64, 320);

export function GamePlayScreen() {
  const { theme } = useTheme();

  const {
    gameMode,
    modeConfig,
    player1Name,
    player2Name,
    currentPlayerName,
    remainingTime,
    progress,
    timerState,
    soundEnabled,
    handleTimerPress,
    handleBack,
    handlePauseResume,
    handleToggleSound,
    router,
  } = useGamePlay();

  // Redirect if no game mode
  if (!gameMode) {
    router.replace("/");
    return null;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <GameHeader
        modeConfig={modeConfig}
        timerState={timerState}
        textColor={theme.colors.text}
        onBack={handleBack}
        onPauseResume={handlePauseResume}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Player indicator */}
      <PlayerIndicator
        currentPlayerName={currentPlayerName}
        labelColor={theme.colors.textMuted}
        nameColor={theme.colors.primary}
      />

      {/* Timer */}
      <Pressable onPress={handleTimerPress} style={styles.timerContainer}>
        <CircularTimer
          size={TIMER_SIZE}
          strokeWidth={16}
          progress={progress}
          remainingTime={remainingTime}
          timerState={timerState}
        />
      </Pressable>

      {/* Instructions */}
      <View style={styles.instructionsSection}>
        <TimerInstructions
          timerState={timerState}
          textColor={theme.colors.textMuted}
        />
      </View>

      {/* Score display */}
      <View style={styles.scoreSection}>
        <ScoreDisplay
          player1Name={player1Name}
          player2Name={player2Name}
          colors={{
            surface: theme.colors.surface,
            text: theme.colors.text,
            textSecondary: theme.colors.textSecondary,
            border: theme.colors.border,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instructionsSection: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  scoreSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
