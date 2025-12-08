/**
 * GamePlayScreen - Main game timer screen
 * Implements:
 * - GH-004: Start and stop timer
 * - GH-005: View animated countdown
 * - GH-008: Mark game winner
 * - GH-009: Score snooker points
 * - GH-010: Handle snooker fouls
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
 *
 * Acceptance Criteria (GH-008):
 * - Two buttons to mark Player 1 or Player 2 as winner ✅
 * - Win count increments for selected player ✅
 * - Current win counts displayed on game screen ✅
 * - Confirmation or undo option for accidental taps ✅
 * - Win is saved to rivalry history ✅
 *
 * Acceptance Criteria (GH-009):
 * - Colored buttons for each ball: Red(1), Yellow(2), Green(3), Brown(4), Blue(5), Pink(6), Black(7) ✅
 * - Tapping adds points to current player's frame score ✅
 * - Running total displayed for each player ✅
 * - Points visually animate when added ✅
 * - Undo last point option available ✅
 *
 * Acceptance Criteria (GH-010):
 * - Foul button opens point selection (4, 5, 6, 7) ✅
 * - Selected foul points added to opponent's score ✅
 * - Foul is recorded/indicated in current frame ✅
 * - Turn switches to opponent after foul ✅
 */

import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import { CircularTimer } from "../components/game/CircularTimer";
import { GameHeader } from "../components/game/GameHeader";
import { PlayerIndicator } from "../components/game/PlayerIndicator";
import { ScoringPanel } from "../components/game/ScoringPanel";
import { TimerInstructions } from "../components/game/TimerInstructions";
import { WinnerModal } from "../components/game/WinnerModal";
import { useTheme } from "../components/providers/ThemeProvider";
import { useGamePlay } from "../hooks/useGamePlay";
import { useScoring } from "../hooks/useScoring";
import { useAppSelector } from "../store/hooks";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TIMER_SIZE = Math.min(SCREEN_WIDTH - 48, 300);

export function GamePlayScreen() {
  const { theme } = useTheme();
  const hapticEnabled = useAppSelector((state) => state.settings.hapticEnabled);

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

  const {
    currentPlayer,
    player1FrameScore,
    player2FrameScore,
    player1SessionWins,
    player2SessionWins,
    winnerModalVisible,
    canUndo,
    handleBallPress,
    handleFoul,
    handleOpenWinnerModal,
    handleCloseWinnerModal,
    handleSelectWinner,
    handleUndo,
  } = useScoring({ hapticEnabled });

  // Redirect if no game mode
  if (!gameMode) {
    router.replace("/");
    return null;
  }

  const isSnooker = gameMode === "snooker";

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <GameHeader
        gameMode={gameMode}
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
      <View style={styles.timerContainer}>
        <CircularTimer
          size={TIMER_SIZE}
          strokeWidth={14}
          progress={progress}
          remainingTime={remainingTime}
          timerState={timerState}
          onPress={handleTimerPress}
          hapticEnabled={hapticEnabled}
        />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsSection}>
        <TimerInstructions
          timerState={timerState}
          textColor={theme.colors.textMuted}
        />
      </View>

      {/* Scoring Panel (snooker mode has ball buttons, both modes have win button) */}
      <ScoringPanel
        gameMode={gameMode}
        player1Name={player1Name}
        player2Name={player2Name}
        currentPlayer={currentPlayer}
        player1FrameScore={player1FrameScore}
        player2FrameScore={player2FrameScore}
        player1SessionWins={player1SessionWins}
        player2SessionWins={player2SessionWins}
        onBallPress={handleBallPress}
        onFoul={handleFoul}
        onWinFrame={handleOpenWinnerModal}
        onUndo={handleUndo}
        canUndo={canUndo}
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

      {/* Winner Modal */}
      <WinnerModal
        visible={winnerModalVisible}
        onClose={handleCloseWinnerModal}
        onSelectWinner={handleSelectWinner}
        player1Name={player1Name}
        player2Name={player2Name}
        player1Score={isSnooker ? player1FrameScore : player1SessionWins}
        player2Score={isSnooker ? player2FrameScore : player2SessionWins}
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
  container: {
    flex: 1,
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  instructionsSection: {
    paddingHorizontal: 32,
    paddingVertical: 8,
  },
});
