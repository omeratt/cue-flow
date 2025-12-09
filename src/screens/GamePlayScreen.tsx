/**
 * GamePlayScreen - Main game timer screen
 * Implements GH-004 to GH-010, GH-024: Timer, countdown, scoring, fouls, winner selection
 * Refactored in GH-019: Condensed comments, uses composition pattern
 */

import React, { useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import { GameHeader } from "../components/layout/GameHeader";
import { PlayerIndicator } from "../components/layout/PlayerIndicator";
import { WinnerModal } from "../components/modals/WinnerModal";
import { useTheme } from "../components/providers/ThemeProvider";
import { ScoringPanel } from "../components/scoring/ScoringPanel";
import { CircularTimer } from "../components/timer/CircularTimer";
import { TimerInstructions } from "../components/timer/TimerInstructions";
import { useGamePlay, useScoring } from "../hooks";
import { useAppSelector } from "../store/hooks";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TIMER_SIZE = Math.min(SCREEN_WIDTH - 48, 300);

export function GamePlayScreen() {
  const { theme } = useTheme();
  const hapticEnabled = useAppSelector((state) => state.settings.hapticEnabled);

  const gamePlay = useGamePlay();

  // Timer control callbacks for scoring integration (GH-024)
  const handleTimerStop = useCallback(() => {
    // Stop timer without switching player
    if (gamePlay.timerState.value === "running") {
      gamePlay.handlePauseResume();
    }
  }, [gamePlay]);

  const handleTimerReset = useCallback(() => {
    // Reset and stop timer
    gamePlay.reset();
  }, [gamePlay]);

  const scoring = useScoring({
    hapticEnabled,
    onTimerStop: handleTimerStop,
    onTimerReset: handleTimerReset,
  });

  // Redirect if no game mode
  if (!gamePlay.gameMode) {
    gamePlay.router.replace("/");
    return null;
  }

  const {
    gameMode,
    modeConfig,
    player1Name,
    player2Name,
    currentPlayer,
    remainingTime,
    progress,
    timerState,
    soundEnabled,
  } = gamePlay;
  const isSnooker = gameMode === "snooker";

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <GameHeader
        gameMode={gameMode}
        modeConfig={modeConfig}
        timerState={timerState}
        textColor={theme.colors.text}
        onBack={gamePlay.handleBack}
        onPauseResume={gamePlay.handlePauseResume}
        onResetTimer={handleTimerReset}
        soundEnabled={soundEnabled}
        onToggleSound={gamePlay.handleToggleSound}
      />

      <PlayerIndicator
        player1Name={player1Name}
        player2Name={player2Name}
        currentPlayer={currentPlayer}
        onSwitchPlayer={gamePlay.handleManualPlayerSwitch}
        primaryColor={theme.colors.primary}
        mutedColor={theme.colors.textMuted}
        switchButtonColor={theme.colors.textSecondary}
      />

      <View style={styles.timerContainer}>
        <CircularTimer
          size={TIMER_SIZE}
          strokeWidth={14}
          progress={progress}
          remainingTime={remainingTime}
          timerState={timerState}
          onPress={gamePlay.handleTimerPress}
          hapticEnabled={hapticEnabled}
        />
      </View>

      <View style={styles.instructionsSection}>
        <TimerInstructions
          timerState={timerState}
          textColor={theme.colors.textMuted}
        />
      </View>

      <ScoringPanel
        gameMode={gameMode}
        player1Name={player1Name}
        player2Name={player2Name}
        currentPlayer={scoring.currentPlayer}
        player1FrameScore={scoring.player1FrameScore}
        player2FrameScore={scoring.player2FrameScore}
        player1SessionWins={scoring.player1SessionWins}
        player2SessionWins={scoring.player2SessionWins}
        onBallPress={scoring.handleBallPress}
        onFoul={scoring.handleFoul}
        onWinFrame={scoring.handleOpenWinnerModal}
        onUndo={scoring.handleUndo}
        onRedo={scoring.handleRedo}
        canUndo={scoring.canUndo}
        canRedo={scoring.canRedo}
        colors={{
          surface: theme.colors.surface,
          surfaceElevated: theme.colors.surfaceElevated,
          text: theme.colors.text,
          textSecondary: theme.colors.textSecondary,
          textMuted: theme.colors.textMuted,
          primary: theme.colors.primary,
          error: theme.colors.error,
          success: theme.colors.success,
          border: theme.colors.border,
          buttonBackground: theme.colors.buttonBackground,
          buttonText: theme.colors.buttonText,
        }}
        hapticEnabled={hapticEnabled}
      />

      <WinnerModal
        visible={scoring.winnerModalVisible}
        onClose={scoring.handleCloseWinnerModal}
        onSelectWinner={scoring.handleSelectWinner}
        player1Name={player1Name}
        player2Name={player2Name}
        player1Score={
          isSnooker ? scoring.player1FrameScore : scoring.player1SessionWins
        }
        player2Score={
          isSnooker ? scoring.player2FrameScore : scoring.player2SessionWins
        }
        frameLabel={isSnooker ? "Frame" : "Game"}
        colors={{
          modalBackground: "rgba(0, 0, 0, 0.6)",
          modalSurface: theme.colors.surface,
          modalText: theme.colors.text,
          modalTextSecondary: theme.colors.textSecondary,
          success: theme.colors.success,
          primary: theme.colors.primary,
          border: theme.colors.border,
        }}
        hapticEnabled={hapticEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  instructionsSection: { paddingHorizontal: 32, paddingVertical: 8 },
});
