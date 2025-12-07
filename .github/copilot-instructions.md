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
| Phase 2 | Audio & polish (audio alerts, haptics, animations, theme)         | 🟡 In Progress |
| Phase 3 | Scoring (win tracking, snooker points, fouls)                     | 🔴 Not Started |
| Phase 4 | Rivalry system (persistence, history, continue/delete)            | 🔴 Not Started |
| Phase 5 | Polish & testing                                                  | 🔴 Not Started |

### 3. User Story Reference

When implementing a feature, always reference the corresponding user story ID:

- **GH-001**: Select game mode ✅ COMPLETED
- **GH-002**: Enter player names ✅ COMPLETED
- **GH-003**: Select timer duration ✅ COMPLETED
- **GH-004**: Start and stop timer
- **GH-005**: View animated countdown
- **GH-006**: Hear audio alerts
- **GH-004**: Start and stop timer ✅ COMPLETED
- **GH-005**: View animated countdown ✅ COMPLETED
- **GH-006**: Hear audio alerts ✅ COMPLETED
- **GH-007**: Feel haptic feedback (partial - basic haptic on tap/switch)
- **GH-008**: Mark game winner
- **GH-009**: Score snooker points
- **GH-010**: Handle snooker fouls
- **GH-011**: View rivalry history ✅ COMPLETED (basic UI)
- **GH-012**: Continue existing rivalry ✅ COMPLETED
- **GH-013**: Delete rivalry
- **GH-014**: Toggle theme
- **GH-015**: Pause and resume game ✅ COMPLETED
- **GH-016**: Mute sounds ✅ COMPLETED
- **GH-017**: Start new rivalry ✅ COMPLETED

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
│       ├── ScoreDisplay.tsx        # Score component
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

- `src/components/ui/` - Generic UI components
- `src/components/game/` - Game-specific components
- `src/hooks/` - Reusable hooks

## Current Session Status

**Last Updated**: December 7, 2025

**Completed Stories**: GH-001, GH-002, GH-003, GH-004, GH-005, GH-006, GH-011 (basic), GH-012, GH-015, GH-016, GH-017

**In Progress**: Phase 2 - Audio & polish (nearly complete)

**Next Up**: GH-007 (Feel haptic feedback - enhancement), GH-014 (Toggle theme)
