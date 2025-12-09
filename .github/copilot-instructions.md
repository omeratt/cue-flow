# Copilot Instructions for CueFlow

## Project Context

This is **CueFlow** - a mobile app for amateur billiard and snooker players. Before starting any work, familiarize yourself with:

- **Project Overview**: See `docs/project-overview.md` for a high-level understanding of what the app does
- **PRD (Product Requirements Document)**: See `docs/prd.md` for detailed requirements, user stories, and acceptance criteria
- **Tech Stack**: See `docs/tech-stack.md` for approved technologies for each feature

## ⚠️ Technology Guidelines

**CRITICAL**: Before implementing any feature, check `docs/tech-stack.md` to see which technologies are approved for that feature.

- ✅ **DO**: Use only the technologies listed in the tech stack document
- ❌ **DON'T**: Invent or use alternative libraries without approval
- ❓ **ASK**: If you believe a different technology is needed, ask the user first before implementing

If the tech stack doesn't cover a specific need:

1. Stop implementation
2. Explain what technology you think is needed and why
3. Wait for user approval
4. If approved, add the technology to `docs/tech-stack.md`

## Task Tracking

When working on this project, always follow this workflow:

### 1. Check Current Progress

Before starting any task, review the PRD (`docs/prd.md`) and identify:

- Which user stories (GH-001 to GH-017) have been completed
- Which user stories are in progress
- Which user stories are pending

### 2. Development Phases

Follow the phased approach defined in the PRD (Section 9.3):

| Phase   | Focus                                                             | Status         |
| ------- | ----------------------------------------------------------------- | -------------- |
| Phase 1 | Core timer (home screen, player setup, timer, duration selection) | ✅ Completed   |
| Phase 2 | Audio & polish (audio alerts, haptics, animations, theme)         | ✅ Completed   |
| Phase 3 | Scoring (win tracking, snooker points, fouls)                     | ✅ Completed   |
| Phase 4 | Rivalry system (persistence, history, continue/delete)            | ✅ Completed   |
| Phase 5 | Polish & testing                                                  | ✅ Completed   |
| Phase 6 | Code quality, architecture & UI animations                        | 🚧 In Progress |

### 3. User Story Reference

When implementing a feature, always reference the corresponding user story ID:

- **GH-001**: Select game mode ✅ COMPLETED
- **GH-002**: Enter player names ✅ COMPLETED
- **GH-003**: Select timer duration ✅ COMPLETED
- **GH-004**: Start and stop timer ✅ COMPLETED
- **GH-005**: View animated countdown ✅ COMPLETED
- **GH-006**: Hear audio alerts ✅ COMPLETED
- **GH-007**: Feel haptic feedback ✅ COMPLETED
- **GH-008**: Mark game winner ✅ COMPLETED
- **GH-009**: Score snooker points ✅ COMPLETED
- **GH-010**: Handle snooker fouls ✅ COMPLETED
- **GH-011**: View rivalry history ✅ COMPLETED (basic UI)
- **GH-012**: Continue existing rivalry ✅ COMPLETED
- **GH-013**: Delete rivalry ✅ COMPLETED
- **GH-014**: Toggle theme ✅ COMPLETED
- **GH-015**: Pause and resume game ✅ COMPLETED
- **GH-016**: Mute sounds ✅ COMPLETED
- **GH-017**: Start new rivalry ✅ COMPLETED

### Phase 6: Code Quality & Architecture (GH-018 to GH-023)

- **GH-018**: Reorganize component file hierarchy ✅ COMPLETED
- **GH-019**: Refactor large components (>150 lines) ✅ COMPLETED
- **GH-020**: Extract logic from UI components to hooks ✅ COMPLETED
- **GH-021**: Add micro-interaction animations ✅ COMPLETED
- **GH-024**: Bug fixes & timer enhancements ✅ COMPLETED
- **GH-025**: Add screen transition animations 🔲 PENDING
- **GH-026**: Add animated feedback states 🔲 PENDING

### 4. Completion Checklist

After completing a user story:

1. Verify all acceptance criteria from the PRD are met
2. Update this file's phase status table
3. Report to the user which stories are done and what's next

## Tech Stack

- **Framework**: React Native with Expo (SDK 54)
- **Navigation**: Expo Router
- **Animations**: React Native Reanimated
- **State Management**: Redux Toolkit with redux-persist
- **Storage**: expo-file-system (for redux-persist)
- **Haptics**: Expo Haptics
- **Audio**: Expo AV (to be installed)
- **Language**: TypeScript

## Code Standards

- Use functional components with hooks
- Follow the existing project structure in `src/`
- Use the existing theme system in `src/lib/theme.ts`
- Support both dark and light modes
- Write clean, readable code with meaningful variable names
- Use React Native Reanimated for smooth 60fps animations
- **Timer logic MUST use Reanimated SharedValues only** - NO useState/useReducer for timer
- Use Redux Toolkit for global state management
- Routes in `app/` should be thin - put logic in `src/`
- **TypeScript: Full type coverage required** - NO `any` type allowed. Use proper types, generics, or `unknown` with type guards

---

## 🏗️ Component Architecture Guidelines

**CRITICAL**: Follow these guidelines from the START of development, not as a refactor later.

### Screen Size Limit

- **Screens should be under 150 lines of code**
- If a screen is getting long, it's a sign you need to extract components/hooks

### Component Extraction Rules

When building a new screen, immediately identify and extract:

| Component Type         | When to Extract                                          | Location                             |
| ---------------------- | -------------------------------------------------------- | ------------------------------------ |
| **UI Elements**        | Any reusable visual element (buttons, cards, indicators) | `src/components/ui/`                 |
| **Feature Components** | Feature-specific components (game timer, player cards)   | `src/components/{feature}/`          |
| **Layout Components**  | Headers, footers, sections                               | `src/components/{feature}/` or `ui/` |

### Hook Extraction Rules

| Hook Type           | When to Extract                                        | Location                             |
| ------------------- | ------------------------------------------------------ | ------------------------------------ |
| **Feature Logic**   | Complex state + callbacks + side effects for a feature | `src/hooks/use{Feature}.ts`          |
| **Shared Logic**    | Logic used across multiple screens                     | `src/hooks/`                         |
| **Animation Logic** | Reanimated SharedValues + animations                   | `src/hooks/use{Feature}Animation.ts` |

### Naming Conventions

```
Components:  PascalCase     → PlayerIndicator.tsx, GameHeader.tsx
Hooks:       camelCase      → useGamePlay.ts, useGameTimer.ts
Utilities:   camelCase      → formatTime.ts, storage.ts
Constants:   SCREAMING_CASE → GAME_MODES, TIMER_DURATIONS
```

### File Structure Pattern

For a new screen like `GamePlayScreen`, create:

```
src/
├── screens/
│   └── GamePlayScreen.tsx          # < 150 lines, composes components
├── hooks/
│   └── useGamePlay.ts              # Screen logic hook
├── components/
│   └── game/
│       ├── GameHeader.tsx          # Header component
│       ├── PlayerIndicator.tsx     # Player display
│       ├── ScoringPanel.tsx        # Score component
│       └── TimerInstructions.tsx   # Instructions text
```

### Component Design Principles

1. **Single Responsibility**: Each component does ONE thing well
2. **Props Over State**: Prefer receiving data via props over internal state
3. **Composition**: Build complex UIs by composing simple components
4. **Colocation**: Keep related components in the same folder

### Screen Composition Template

A well-structured screen should look like this:

```tsx
export function ExampleScreen() {
  const { theme } = useTheme();
  const { data, actions } = useFeatureHook();

  if (!data) {
    return <LoadingState />;
  }

  return (
    <View style={styles.container}>
      <FeatureHeader {...headerProps} />
      <FeatureContent {...contentProps} />
      <FeatureFooter {...footerProps} />
    </View>
  );
}
```

### Before Creating a New Screen, Ask:

1. ✅ What components can I extract immediately?
2. ✅ What logic belongs in a custom hook?
3. ✅ Are there existing components I can reuse?
4. ✅ Will the screen be under 150 lines?

### Existing Component Library

Check these locations for reusable components before creating new ones:

- `src/components/ui/` - Generic UI components (ConfirmationModal, EmptyState, ErrorBoundary, LoadingState, SnookerBall)
- `src/components/cards/` - Card-based components (GameModeCard, RivalryCard, SwipeableRivalryCard)
- `src/components/timer/` - Timer components (CircularTimer, TimerInstructions)
- `src/components/scoring/` - Scoring components (ScoringPanel, BallButtonRow, FoulButton, WinButton, UndoButton)
- `src/components/modals/` - Modal components (WinnerModal)
- `src/components/layout/` - Layout components (GameHeader, PlayerIndicator)
- `src/components/icons/` - Icon components (GameModeIcon, PauseResumeIcon)
- `src/components/providers/` - Context providers (ThemeProvider)
- `src/hooks/` - Reusable hooks

## Current Session Status

**Last Updated**: December 9, 2025

**Completed Stories**: GH-001 to GH-017

**Current Phase**: Phase 6 - Code Quality, Architecture & UI Animations 🚧

**Phase 6 Tasks**:

### GH-018: Reorganize Component File Hierarchy

Restructure `src/components/` from flat `game/` folder to logical categories:

```
src/components/
├── ui/              # Generic reusable UI (buttons, modals, loading states)
│   ├── ConfirmationModal.tsx
│   ├── EmptyState.tsx
│   ├── ErrorBoundary.tsx
│   ├── LoadingState.tsx
│   └── SnookerBall.tsx
├── cards/           # Card-based components
│   ├── GameModeCard.tsx
│   ├── RivalryCard.tsx
│   └── SwipeableRivalryCard.tsx
├── timer/           # Timer-specific components
│   ├── CircularTimer.tsx
│   └── TimerInstructions.tsx
├── scoring/         # Scoring-related components
│   ├── ScoringPanel.tsx
│   ├── ScoringPanelButtons.tsx
│   ├── BallButtonRow.tsx
│   ├── SnookerBallButton.tsx
│   ├── FoulButton.tsx
│   ├── WinButton.tsx
│   └── UndoButton.tsx
├── modals/          # Modal components
│   ├── WinnerModal.tsx
│   └── ConfirmationModal.tsx (move from ui/)
├── layout/          # Layout components
│   ├── GameHeader.tsx
│   └── PlayerIndicator.tsx
├── icons/           # Icon components
│   ├── GameModeIcon.tsx
│   └── PauseResumeIcon.tsx
└── providers/       # Context providers
    └── ThemeProvider.tsx
```

**Acceptance Criteria:**

- [x] All components moved to appropriate category folders
- [x] All imports updated across the codebase
- [x] No broken imports or runtime errors
- [x] Components are easier to find and maintain

---

### GH-019: Refactor Large Components (>150 lines)

Components to split:

| Component             | Current Lines | Action                                                                                              |
| --------------------- | ------------- | --------------------------------------------------------------------------------------------------- |
| `WinnerModal.tsx`     | 384 lines     | Split into `WinnerModalContent`, `WinnerSelectionView`, `WinnerConfirmationView`                    |
| `CircularTimer.tsx`   | 307 lines     | Extract animation logic to `useCircularTimerAnimation.ts` hook                                      |
| `GameSetupScreen.tsx` | 444 lines     | Extract `PlayerInputSection`, `DurationSelector`, `DurationButton` components + `useGameSetup` hook |
| `RivalryCard.tsx`     | 206 lines     | Extract formatting utils, simplify styles                                                           |
| `ScoringPanel.tsx`    | 203 lines     | Keep as-is (already well composed)                                                                  |

**Acceptance Criteria:**

- [x] No component file exceeds 150 lines (screens can be up to 200)
- [x] Logic extracted to custom hooks
- [x] Sub-components are reusable and testable
- [x] Code is more readable and maintainable

---

### GH-020: Extract Logic from UI Components to Hooks ✅ COMPLETED

Create dedicated hooks:

| Hook                           | Extracted From  | Responsibilities                                         |
| ------------------------------ | --------------- | -------------------------------------------------------- |
| `useCircularTimerAnimation.ts` | CircularTimer   | Color interpolation, progress animation, press animation |
| `useGameSetup.ts`              | GameSetupScreen | Form state, validation, duration selection logic         |
| `useWinnerModal.ts`            | WinnerModal     | Selection state, confirmation flow, haptic feedback      |
| `useRivalryCard.ts`            | RivalryCard     | Press animation, date formatting                         |
| `useSettings.ts`               | SettingsScreen  | Theme selection, toggles, clear data handlers            |
| `useHome.ts`                   | HomeScreen      | Rivalry management, game mode selection, navigation      |

**Acceptance Criteria:**

- [x] UI components are pure/presentational (only render + styles)
- [x] All business logic lives in hooks
- [x] Hooks are testable in isolation
- [x] Components receive data and callbacks via props

---

### GH-021: Add Micro-Interaction Animations ✅ COMPLETED

Add subtle animations for better UX:

| Element                | Animation                                     | Status |
| ---------------------- | --------------------------------------------- | ------ |
| Ball buttons (snooker) | Scale pulse on press                          | ✅     |
| Score changes          | Scale pulse animation                         | ✅     |
| Win button             | Subtle scale press effect                     | ✅     |
| Foul button            | Shake + scale animation on press              | ✅     |
| Player indicator       | Smooth slide + fade transition                | ✅     |
| Duration buttons       | Non-bouncy scale press effect                 | ✅     |
| Text inputs            | Focus border color animation                  | ✅     |
| Undo button            | Scale + rotation animation                    | ✅     |
| Game mode cards        | Non-bouncy scale + background color animation | ✅     |
| Rivalry cards          | Non-bouncy scale animation                    | ✅     |
| Start button           | Scale press animation                         | ✅     |

**Technology**: React Native Reanimated (already approved)

**Acceptance Criteria:**

- [x] All interactive elements have press feedback
- [x] Score numbers animate when changing
- [x] Player switch has smooth transition
- [x] Animations run at 60fps (using Reanimated)
- [x] Animations are subtle, not distracting (non-bouncy per user preference)

---

### GH-024: Bug Fixes & Timer Enhancements ✅ COMPLETED

Critical bug fixes and feature enhancements for timer and scoring functionality.

#### 🐛 Bugs Fixed:

| ID      | Description                                                             | Status |
| ------- | ----------------------------------------------------------------------- | ------ |
| BUG-001 | When marking a winner - timer should stop and undo history should reset | ✅     |
| BUG-002 | In Snooker, scoring balls should reset and stop the timer               | ✅     |
| BUG-003 | Undo functionality in Billiard mode is not working                      | ✅     |
| BUG-004 | Undo should include last action (points OR wins, not just one type)     | ✅     |
| BUG-005 | Undo/Redo buttons should stop the timer                                 | ✅     |
| BUG-006 | Foul in Snooker should stop timer and switch to other player            | ✅     |

#### ✨ Features Added:

| ID       | Description                                                          | Status |
| -------- | -------------------------------------------------------------------- | ------ |
| FEAT-001 | Add Redo button with functionality (both Snooker and Billiard)       | ✅     |
| FEAT-002 | Add Timer Reset button next to Pause button (resets and stops timer) | ✅     |
| FEAT-003 | Redesign player turn layout: `Player1 --- Switch Button --- Player2` | ✅     |
| FEAT-004 | Add professional transition animation when switching player turns    | ✅     |

#### 📐 Player Layout Design:

```
┌─────────────────────────────────────────────────────────────┐
│  Player1 (dim when inactive)  |  🔄  |  Player2 (highlight) │
└─────────────────────────────────────────────────────────────┘
```

- Active player: Primary text color with subtle emphasis + slightly larger font
- Inactive player: Disabled/dimmed text color
- Switch button: Icon only (no text needed)
- Beautiful transition animation when players switch

#### 🎯 Logic Summary:

**Billiard Mode:**

- Undo/Redo: Operates only on wins (not points, since Billiard has no point scoring)
- Timer stops on: undo, redo, win marked

**Snooker Mode:**

- Undo/Redo: Operates on the last action (either points OR wins - unified history)
- Timer stops + resets on: ball scored, foul
- Timer stops on: undo, redo, win marked
- Foul: Stops timer + switches to other player

**Both Modes:**

- New reset timer button next to pause
- Redesigned player turn layout with animations

**Acceptance Criteria:**

- [x] BUG-001: Timer stops when winner is marked
- [x] BUG-002: Timer resets and stops on snooker ball scoring
- [x] BUG-003: Undo works correctly in Billiard mode
- [x] BUG-004: Undo includes last action (points or wins)
- [x] BUG-005: Undo/Redo stops the timer
- [x] BUG-006: Foul stops timer and switches player
- [x] FEAT-001: Redo button added and functional
- [x] FEAT-002: Timer reset button added
- [x] FEAT-003: Player turn layout redesigned
- [x] FEAT-004: Player switch animation implemented

---

### GH-025: Add Screen Transition Animations

Improve navigation feel:

| Transition       | Animation                                |
| ---------------- | ---------------------------------------- |
| Home → Setup     | Slide from right with fade               |
| Setup → Play     | Fade through with scale                  |
| Modal open/close | Spring-based slide up with backdrop fade |
| Back navigation  | Slide back with parallax                 |

**Technology**: Expo Router + React Native Reanimated

**Acceptance Criteria:**

- [ ] All screen transitions are animated
- [ ] Modals have smooth enter/exit animations
- [ ] Navigation feels native and fluid
- [ ] No jarring or instant transitions

---

### GH-026: Add Animated Feedback States

Add dynamic visual feedback:

| State                 | Animation                         |
| --------------------- | --------------------------------- |
| Timer running         | Subtle pulse on progress ring     |
| Timer warning (< 33%) | Color shift + faster pulse        |
| Timer expired         | Shake + flash effect              |
| Game won              | Confetti or celebration animation |
| Rivalry loaded        | Cards slide in staggered          |
| Empty state           | Fade in with scale                |
| Loading               | Skeleton shimmer                  |

**Acceptance Criteria:**

- [ ] Visual feedback matches timer state
- [ ] Warning states are clearly communicated
- [ ] Success moments feel celebratory
- [ ] List items animate into view
- [ ] Loading states are polished

---

**Previous Phases Completed**: Phase 1-5 ✅

**App Status**: Functional, needs code quality and UX polish
