# PRD: CueFlow

## 1. Product overview

### 1.1 Document title and version

- PRD: CueFlow
- Version: 1.0

### 1.2 Product summary

CueFlow is a mobile application designed for amateur billiard and snooker players who want to enhance their casual games with professional-level tools. The app provides an animated shot clock timer with authentic audio alerts, score tracking, and match history management.

The core experience centers around a beautiful, animated circular timer that manages turn duration for each player. When time runs low, the app plays professional tournament-style beep sounds to alert players, creating an authentic competitive atmosphere. The app supports two game modes: Billiard (timer + win tracking) and Snooker (timer + win tracking + in-game point scoring).

A key feature is the rivalry system, which tracks match history between player pairs. Users can quickly resume competitions with previous opponents, view win/loss records, and maintain ongoing rivalries across multiple sessions.

## 2. Goals

### 2.1 Business goals

- Create a simple, focused utility app for the billiard/snooker community
- Build a user base through word-of-mouth in pool halls and among casual players
- Establish CueFlow as the go-to timer app for amateur cue sports

### 2.2 User goals

- Manage turn times fairly during casual games
- Experience professional tournament atmosphere with audio alerts
- Track scores accurately in snooker matches
- Maintain ongoing rivalries and competition history with regular opponents
- Quick access to resume games with frequent opponents

### 2.3 Non-goals

- Online multiplayer or remote play
- Video recording or analysis features
- Social features (chat, friend lists, leaderboards)
- Tournament bracket management
- Coaching or training features
- Monetization in initial version

## 3. User personas

### 3.1 Key user types

- Casual pool players who play regularly with friends
- Amateur snooker enthusiasts who want accurate scoring
- Pool hall regulars who play against various opponents
- Home table owners who host game nights

### 3.2 Basic persona details

- **The Regular**: Plays weekly at a local pool hall with the same group of friends. Wants to keep track of who's winning their ongoing rivalry and ensure fair turn times.
- **The Snooker Fan**: Loves snooker and wants the authentic tournament experience with proper timing and accurate point tracking for each ball potted.
- **The Host**: Has a pool table at home and hosts game nights. Needs a simple way to manage games and keep things competitive.

### 3.3 Role-based access

- **Player**: Full access to all app features (single user type - no roles needed)

## 4. Functional requirements

- **Game mode selection** (Priority: High)

  - User can select between Billiard and Snooker modes from home screen
  - Each mode has distinct visual styling/theming

- **Player setup** (Priority: High)

  - User can enter names for Player 1 and Player 2
  - Names are required before starting a game
  - Previously used player name combinations are suggested

- **Timer duration selection** (Priority: High)

  - Preset options: 10, 15, 20, 30, 45, 60 seconds
  - Custom input field for any duration (in seconds)
  - Selected duration persists for the session

- **Animated circular timer** (Priority: High)

  - Large circular timer displayed center screen
  - Smooth countdown animation
  - Visual progress indicator (arc/ring depletion)
  - Tap to start timer at beginning of turn
  - Tap to stop timer and switch to next player

- **Audio alerts** (Priority: High)

  - Professional beep sound plays every second in final third of timer
  - Final beep is longer/different to indicate time expired
  - Sounds match professional tournament style
  - Option to mute sounds

- **Haptic feedback** (Priority: Medium)

  - Vibration on timer start/stop
  - Vibration pattern during final countdown

- **Win tracking** (Priority: High)

  - Both modes: Button to mark frame/game winner
  - Running win count displayed for each player
  - Win count persists in rivalry history

- **Snooker point scoring** (Priority: High)

  - Ball value buttons: Red (1), Yellow (2), Green (3), Brown (4), Blue (5), Pink (6), Black (7)
  - Running point total for current frame
  - Foul button with point deduction options (4, 5, 6, 7 points to opponent)
  - Points reset when new frame starts

- **Rivalry history** (Priority: High)

  - Home screen displays list of recent rivalries
  - Each rivalry shows: Player names, game mode, current win record
  - Rivalries sorted by most recently played
  - Tap rivalry to start new game or continue
  - Swipe or button to delete rivalry

- **Match persistence** (Priority: Medium)

  - Option to save current game state when exiting
  - Resume game from where left off
  - Clear indication of in-progress vs completed games

- **Theme support** (Priority: Medium)

  - Light mode and Dark mode
  - Auto-detect system preference
  - Manual toggle in settings
  - Theme preference persists

- **Settings** (Priority: Low)
  - Theme toggle
  - Sound on/off
  - Haptic feedback on/off
  - Clear all data option

## 5. User experience

### 5.1 Entry points & first-time user flow

- User opens app for first time
- Home screen shows game mode selection (Billiard/Snooker)
- Empty state message encourages starting first game
- After first game, rivalries appear on home screen

### 5.2 Core experience

- **Select mode**: User taps Billiard or Snooker card on home screen
- **Setup game**: Enter player names, select timer duration
- **Play**: Timer screen appears, tap to start first turn
- **During turn**: Timer counts down with visual animation
- **Alert phase**: Audio beeps in final third of time
- **End turn**: Tap to stop timer, switches to next player
- **Score** (Snooker): Tap ball buttons to add points
- **Win**: Mark winner when frame/game ends
- **Continue**: Start next frame or end rivalry session

### 5.3 Advanced features & edge cases

- Timer expires: Long beep, visual indication, auto-pause
- Foul in snooker: Points awarded to opponent
- App backgrounded during game: Timer pauses automatically
- Rivalry already exists: Prompt to continue or start fresh
- Delete rivalry: Confirmation dialog before permanent deletion

### 5.4 UI/UX highlights

- Large, tappable timer dominates game screen
- High contrast colors for visibility in various lighting
- Minimal UI during gameplay to reduce distractions
- Quick access to scoring without leaving timer view
- Smooth animations using React Native Reanimated
- Native feel on both iOS and Android

## 6. Narrative

Picture two friends at their local pool hall on a Friday night. They've been playing against each other for months, but arguments about turn times and who's actually winning overall always come up. One of them pulls out CueFlow, taps on their existing rivalry, and the app shows they're currently tied 12-12 in their ongoing competition. They set the timer to 30 seconds per turn, just like the pros, and start playing. As each turn winds down, the familiar tournament beeps add excitement and urgency. At the end of the night, CueFlow shows the updated score: 14-13. The rivalry continues next week, right where they left off.

## 7. Success metrics

### 7.1 User-centric metrics

- Games completed per user per week
- Number of active rivalries per user
- Session duration
- Return rate (users who play again within 7 days)

### 7.2 Business metrics

- Total app downloads
- Daily/Monthly active users
- User retention (Day 1, Day 7, Day 30)
- App store ratings and reviews

### 7.3 Technical metrics

- App crash rate < 0.1%
- Timer accuracy within 100ms
- App launch time < 2 seconds
- Audio latency < 50ms

## 8. Technical considerations

### 8.1 Integration points

- Expo AV for audio playback
- Expo Haptics for vibration feedback
- AsyncStorage or Expo SecureStore for local data persistence
- React Native Reanimated for animations
- System appearance API for theme detection

### 8.2 Data storage & privacy

- All data stored locally on device
- No user accounts or cloud sync required
- No personal data collected beyond player names
- Player names stored only on device
- Option to clear all data from settings

### 8.3 Scalability & performance

- Lightweight local storage (JSON)
- Efficient timer implementation using native driver animations
- Lazy loading of rivalry history for performance
- No network requests required for core functionality

### 8.4 Potential challenges

- Timer accuracy when app is backgrounded
- Audio playback timing precision
- Handling device rotation during gameplay
- Ensuring animations run at 60fps
- Testing on various screen sizes

## 9. Milestones & sequencing

### 9.1 Project estimate

- Medium: 3-4 weeks

### 9.2 Team size & composition

- 1 Developer: Full-stack mobile development
- Design: Using standard components with custom styling

### 9.3 Suggested phases

- **Phase 1: Core timer** (1 week)

  - Home screen with mode selection
  - Player setup screen
  - Basic circular timer with start/stop
  - Timer duration selection

- **Phase 2: Audio & polish** (0.5 weeks)

  - Audio alert system
  - Haptic feedback
  - Timer animations refinement
  - Theme support (dark/light)

- **Phase 3: Scoring** (1 week)

  - Win tracking for both modes
  - Snooker point scoring UI
  - Foul handling

- **Phase 4: Rivalry system** (1 week)

  - Local data persistence
  - Rivalry history on home screen
  - Continue/resume functionality
  - Delete rivalry feature

- **Phase 5: Polish & testing** (0.5 weeks)

  - Bug fixes
  - Performance optimization
  - UI polish
  - Testing on multiple devices

- **Phase 6: Code quality & UI animations** (1 week)
  - Component file hierarchy reorganization
  - Refactor large components (>150 lines)
  - Extract business logic to custom hooks
  - Add micro-interaction animations
  - Add screen transition animations
  - Add animated feedback states

## 10. User stories

### 10.1 Select game mode

- **ID**: GH-001
- **Description**: As a player, I want to select between Billiard and Snooker modes so that I can use the appropriate features for my game.
- **Acceptance criteria**:
  - Home screen displays two distinct cards/buttons for Billiard and Snooker
  - Each mode has a unique icon or visual identifier
  - Tapping a mode navigates to the game setup screen
  - Selected mode is passed to subsequent screens

### 10.2 Enter player names

- **ID**: GH-002
- **Description**: As a player, I want to enter names for both players so that the app can display who's turn it is and track scores correctly.
- **Acceptance criteria**:
  - Setup screen has two text input fields for player names
  - Both fields are required before proceeding
  - Names can be 1-20 characters
  - Keyboard dismisses when tapping outside input
  - "Start Game" button is disabled until both names entered

### 10.3 Select timer duration

- **ID**: GH-003
- **Description**: As a player, I want to choose how long each turn should be so that I can customize the game pace.
- **Acceptance criteria**:
  - Preset buttons for 10, 15, 20, 30, 45, 60 seconds
  - Custom input field accepts any number (5-300 seconds)
  - Selected duration is visually highlighted
  - Default selection is 30 seconds
  - Duration is displayed on game screen

### 10.4 Start and stop timer

- **ID**: GH-004
- **Description**: As a player, I want to tap the timer to start and stop it so that I can control turn timing with a simple gesture.
- **Acceptance criteria**:
  - Timer displays in center of screen as large circle
  - Initial state shows "Tap to Start" message
  - First tap starts countdown with animation
  - Subsequent tap stops timer and switches player
  - Current player name displayed above timer
  - Timer resets to full duration for next player

### 10.5 View animated countdown

- **ID**: GH-005
- **Description**: As a player, I want to see a smooth visual countdown so that I can easily gauge remaining time at a glance.
- **Acceptance criteria**:
  - Circular progress ring depletes as time passes
  - Remaining seconds displayed as large number in center
  - Animation runs at 60fps without stuttering
  - Color changes as time gets low (e.g., green → yellow → red)
  - Animation pauses when timer is stopped

### 10.6 Hear audio alerts

- **ID**: GH-006
- **Description**: As a player, I want to hear beep sounds in the final seconds so that I know time is running out without watching the screen.
- **Acceptance criteria**:
  - Beep sound plays every second in final third of timer
  - For 30-second timer, beeps start at 10 seconds remaining
  - Final beep (at 0) is longer/different tone
  - Sounds are professional and tournament-like
  - Audio works when phone is on silent (optional setting)

### 10.7 Feel haptic feedback

- **ID**: GH-007
- **Description**: As a player, I want to feel vibration feedback so that I have tactile confirmation of timer events.
- **Acceptance criteria**:
  - Short vibration when timer starts
  - Short vibration when timer stops
  - Vibration pulses during final countdown (optional)
  - Haptics can be disabled in settings

### 10.8 Mark game winner

- **ID**: GH-008
- **Description**: As a player, I want to mark who won a game/frame so that wins are tracked for our rivalry.
- **Acceptance criteria**:
  - Two buttons to mark Player 1 or Player 2 as winner
  - Win count increments for selected player
  - Current win counts displayed on game screen
  - Confirmation or undo option for accidental taps
  - Win is saved to rivalry history

### 10.9 Score snooker points

- **ID**: GH-009
- **Description**: As a snooker player, I want to tap buttons for each ball potted so that points are automatically calculated.
- **Acceptance criteria**:
  - Colored buttons for each ball: Red(1), Yellow(2), Green(3), Brown(4), Blue(5), Pink(6), Black(7)
  - Tapping adds points to current player's frame score
  - Running total displayed for each player
  - Points visually animate when added
  - Undo last point option available

### 10.10 Handle snooker fouls

- **ID**: GH-010
- **Description**: As a snooker player, I want to record fouls so that penalty points are awarded to my opponent.
- **Acceptance criteria**:
  - Foul button opens point selection (4, 5, 6, 7)
  - Selected foul points added to opponent's score
  - Foul is recorded/indicated in current frame
  - Turn switches to opponent after foul

### 10.11 View rivalry history

- **ID**: GH-011
- **Description**: As a player, I want to see my recent rivalries on the home screen so that I can quickly continue playing with regular opponents.
- **Acceptance criteria**:
  - Home screen shows list of rivalries below mode selection
  - Each rivalry shows: both player names, game mode, win record
  - Rivalries sorted by most recently played
  - Empty state shown when no rivalries exist
  - List scrolls if many rivalries

### 10.12 Continue existing rivalry

- **ID**: GH-012
- **Description**: As a player, I want to tap a rivalry to continue playing so that I don't have to re-enter player names.
- **Acceptance criteria**:
  - Tapping rivalry navigates to game screen
  - Player names pre-populated from rivalry
  - Previous win counts loaded
  - Option to adjust timer duration before starting
  - "Continue" vs "New Game" clearly indicated if game in progress

### 10.13 Delete rivalry

- **ID**: GH-013
- **Description**: As a player, I want to delete a rivalry so that I can start fresh or remove old matchups.
- **Acceptance criteria**:
  - Swipe-to-delete gesture on rivalry item
  - Alternative: delete button/icon on rivalry
  - Confirmation dialog before deletion
  - Deletion removes all associated game history
  - Deleted rivalry disappears from list immediately

### 10.14 Toggle theme

- **ID**: GH-014
- **Description**: As a player, I want to switch between dark and light mode so that I can use the app comfortably in any lighting.
- **Acceptance criteria**:
  - Settings screen has theme toggle
  - Options: Auto (system), Light, Dark
  - Theme changes immediately when selected
  - Selected theme persists across app restarts
  - Auto mode follows device system setting

### 10.15 Pause and resume game

- **ID**: GH-015
- **Description**: As a player, I want the game to pause when I leave the app so that I don't lose my place if interrupted.
- **Acceptance criteria**:
  - Timer automatically pauses when app goes to background
  - Game state preserved when navigating away
  - "Resume Game" option when returning to app
  - Option to abandon current game and return home

### 10.16 Mute sounds

- **ID**: GH-016
- **Description**: As a player, I want to mute the audio alerts so that I can play without disturbing others.
- **Acceptance criteria**:
  - Sound toggle in settings
  - Quick mute button accessible from game screen
  - Muted state persists across sessions
  - Visual indicator when sounds are muted
  - Haptics still work when muted (unless also disabled)

### 10.17 Start new rivalry

- **ID**: GH-017
- **Description**: As a player, I want to start a fresh game with new player names so that I can play with different people.
- **Acceptance criteria**:
  - Mode selection always allows entering new names
  - New rivalry created when names don't match existing
  - If names match existing rivalry, prompt to continue or start fresh
  - New rivalries appear in history after first game

---

## 11. Phase 6: Code Quality & UI Animations

### 11.1 Reorganize component file hierarchy

- **ID**: GH-018
- **Description**: As a developer, I want the component folder structure to be logically organized so that I can find and maintain components easily.
- **Acceptance criteria**:
  - Components organized into logical category folders (ui, cards, timer, scoring, modals, layout, icons, providers)
  - All components moved from flat `game/` folder to appropriate categories
  - All imports updated across the codebase
  - No broken imports or runtime errors
  - Clear separation between reusable UI components and feature-specific components

### 11.2 Refactor large components

- **ID**: GH-019
- **Description**: As a developer, I want all components to be under 150 lines so that they are easier to read, test, and maintain.
- **Acceptance criteria**:
  - WinnerModal (384 lines) split into smaller sub-components
  - CircularTimer (307 lines) has animation logic extracted to a hook
  - GameSetupScreen (444 lines) has form logic extracted to a hook and UI split into sub-components
  - No component file exceeds 150 lines (screens can be up to 200 lines)
  - Sub-components are reusable and focused on single responsibilities

### 11.3 Extract logic from UI components to hooks

- **ID**: GH-020
- **Description**: As a developer, I want UI components to be presentational only so that business logic is testable and reusable.
- **Acceptance criteria**:
  - Create useCircularTimerAnimation hook for timer color and progress animations
  - Create useGameSetup hook for form state, validation, and duration logic
  - Create useWinnerModal hook for selection state and confirmation flow
  - Create useRivalryCard hook for press animation and date formatting
  - UI components receive all data via props
  - Hooks are testable in isolation

### 11.4 Add micro-interaction animations

- **ID**: GH-021
- **Description**: As a player, I want subtle animations on interactive elements so that the app feels responsive and polished.
- **Acceptance criteria**:
  - Ball buttons have scale pulse and color flash on press
  - Score changes have animated number counter (increment/decrement)
  - Win button has subtle glow/pulse effect
  - Foul button has shake animation on press
  - Player indicator has slide transition when switching players
  - Duration buttons have spring press effect
  - Text inputs have focus border animation
  - All animations run at 60fps

### 11.5 Add screen transition animations

- **ID**: GH-022
- **Description**: As a player, I want smooth transitions between screens so that navigation feels native and fluid.
- **Acceptance criteria**:
  - Home → Setup transitions with slide from right + fade
  - Setup → Play transitions with fade through + scale
  - Modal open/close uses spring-based slide up with backdrop fade
  - Back navigation has slide back with parallax effect
  - No jarring or instant screen changes
  - Animations feel consistent with platform conventions

### 11.6 Add animated feedback states

- **ID**: GH-023
- **Description**: As a player, I want visual feedback that matches app state so that I always know what's happening.
- **Acceptance criteria**:
  - Timer running has subtle pulse on progress ring
  - Timer warning (<33% remaining) has color shift + faster pulse
  - Timer expired has shake + flash effect
  - Game won shows celebration animation (confetti or similar)
  - Rivalry cards slide in with staggered animation
  - Empty states fade in with scale
  - Loading states have skeleton shimmer effect
  - All feedback animations are visually clear but not distracting

---
