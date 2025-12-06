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
| Phase 1 | Core timer (home screen, player setup, timer, duration selection) | 🔴 Not Started |
| Phase 2 | Audio & polish (audio alerts, haptics, animations, theme)         | 🔴 Not Started |
| Phase 3 | Scoring (win tracking, snooker points, fouls)                     | 🔴 Not Started |
| Phase 4 | Rivalry system (persistence, history, continue/delete)            | 🔴 Not Started |
| Phase 5 | Polish & testing                                                  | 🔴 Not Started |

### 3. User Story Reference

When implementing a feature, always reference the corresponding user story ID:

- **GH-001**: Select game mode
- **GH-002**: Enter player names
- **GH-003**: Select timer duration
- **GH-004**: Start and stop timer
- **GH-005**: View animated countdown
- **GH-006**: Hear audio alerts
- **GH-007**: Feel haptic feedback
- **GH-008**: Mark game winner
- **GH-009**: Score snooker points
- **GH-010**: Handle snooker fouls
- **GH-011**: View rivalry history
- **GH-012**: Continue existing rivalry
- **GH-013**: Delete rivalry
- **GH-014**: Toggle theme
- **GH-015**: Pause and resume game
- **GH-016**: Mute sounds
- **GH-017**: Start new rivalry

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

## Current Session Status

**Last Updated**: Not started yet

**Completed Stories**: None

**In Progress**: None

**Next Up**: Phase 1 - GH-001 (Select game mode)
