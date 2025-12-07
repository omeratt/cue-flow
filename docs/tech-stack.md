# CueFlow - Tech Stack

This document defines the approved technologies for each feature in CueFlow. **Do not use alternative libraries or approaches without explicit approval.**

---

## 🏗️ Core Framework

| Technology   | Version | Purpose                            |
| ------------ | ------- | ---------------------------------- |
| React Native | 0.81.5  | Mobile app framework               |
| Expo         | SDK 54  | Development platform & native APIs |
| TypeScript   | 5.9.2   | Type-safe JavaScript               |
| Expo Router  | 6.0.17  | File-based navigation              |

---

## 📱 Navigation & Routing

| Feature           | Technology  | Notes                                  |
| ----------------- | ----------- | -------------------------------------- |
| Screen navigation | Expo Router | File-based routing in `/app` directory |
| Deep linking      | Expo Router | Built-in support                       |
| Navigation state  | Expo Router | Automatic state management             |

---

## 🎨 UI & Styling

| Feature              | Technology                     | Notes                       |
| -------------------- | ------------------------------ | --------------------------- |
| Component styling    | React Native StyleSheet        | Native styling API          |
| Theming (Dark/Light) | React Native Appearance API    | System theme detection      |
| Theme context        | React Context                  | Custom ThemeProvider        |
| Icons                | @expo/vector-icons             | Ionicons, MaterialIcons     |
| Safe areas           | react-native-safe-area-context | Already installed           |
| Gradients            | expo-linear-gradient           | Premium 3D effects on balls |

---

## ⏱️ Timer & Animations

| Feature           | Technology                    | Notes                                      |
| ----------------- | ----------------------------- | ------------------------------------------ |
| Timer countdown   | React Native Reanimated       | `useSharedValue` + `withTiming` - NO STATE |
| Timer state       | Reanimated SharedValue        | All timer logic runs on UI thread          |
| Circular progress | React Native Reanimated + SVG | Animated SVG arc with `useDerivedValue`    |
| SVG rendering     | react-native-svg              | **To be installed**                        |
| Color transitions | React Native Reanimated       | `interpolateColor`                         |
| 60fps animations  | React Native Reanimated       | Native driver                              |

**⚠️ Timer Implementation Guidelines:**

- **DO NOT** use `useState` or `useReducer` for timer logic
- **DO** use `useSharedValue` for all timer values (remaining time, running state, etc.)
- **DO** use `useDerivedValue` for computed values (progress percentage, colors)
- **DO** use `runOnJS` only for side effects (audio, haptics, Redux dispatch)
- Timer should run entirely on the UI thread for maximum performance

**Installation needed:**

```bash
npx expo install react-native-svg
```

---

## 🔊 Audio

| Feature        | Technology          | Notes                          |
| -------------- | ------------------- | ------------------------------ |
| Sound playback | expo-audio          | **To be installed**            |
| Beep alerts    | useAudioPlayer hook | Preloaded audio files          |
| Audio files    | Local assets        | MP3 format in `/assets/audio/` |

**Installation needed:**

```bash
npx expo install expo-audio
```

**Usage example:**

```typescript
import { useAudioPlayer } from "expo-audio";

const beepSound = require("./assets/audio/beep.mp3");

function TimerComponent() {
  const player = useAudioPlayer(beepSound);

  const playBeep = () => {
    player.seekTo(0); // Reset to start
    player.play();
  };
}
```

> ⚠️ Note: `expo-av` is deprecated and will be removed in SDK 55. Use `expo-audio` instead.

---

## 📳 Haptics

| Feature               | Technology                  | Notes                   |
| --------------------- | --------------------------- | ----------------------- |
| Vibration feedback    | expo-haptics                | Already installed       |
| Impact feedback       | Haptics.impactAsync()       | Light, Medium, Heavy    |
| Notification feedback | Haptics.notificationAsync() | Success, Warning, Error |

---

## 💾 Data Persistence

| Feature             | Technology                             | Notes                                |
| ------------------- | -------------------------------------- | ------------------------------------ |
| State management    | Redux Toolkit                          | `@reduxjs/toolkit` - **To install**  |
| State persistence   | redux-persist                          | Persist Redux state                  |
| Storage engine      | expo-file-system                       | File-based storage for redux-persist |
| File system storage | redux-persist-expo-file-system-storage | Expo FileSystem adapter              |
| Rivalry history     | Redux + redux-persist                  | Persisted automatically              |
| Settings storage    | Redux + redux-persist                  | Theme, sound, haptic preferences     |
| Game state          | Redux + redux-persist                  | Save/resume functionality            |

**Installation needed:**

```bash
npx expo install expo-file-system
npm install @reduxjs/toolkit redux-persist redux-persist-expo-file-system-storage react-redux
```

---

## 🎯 State Management

| Feature               | Technology       | Notes                          |
| --------------------- | ---------------- | ------------------------------ |
| Global state          | Redux Toolkit    | Single store for entire app    |
| State slices          | createSlice      | Modular state management       |
| Async actions         | createAsyncThunk | For complex async operations   |
| Local component state | React useState   | Simple UI-only state           |
| Derived state         | Redux selectors  | Memoized with `createSelector` |
| React bindings        | react-redux      | `useSelector`, `useDispatch`   |
| State persistence     | redux-persist    | Auto-persist to file system    |
| TypeScript support    | Redux Toolkit    | Built-in type inference        |

**Redux Store Structure:**

```typescript
store/
  index.ts              # Store configuration with persist
  slices/
    gameSlice.ts        # Game mode, players, timer settings
    rivalrySlice.ts     # Rivalry history and records
    settingsSlice.ts    # Theme, sound, haptic preferences
    scoreSlice.ts       # Current game scores
```

---

## 🧪 Development Tools

| Tool            | Purpose                           |
| --------------- | --------------------------------- |
| ESLint          | Code linting (already configured) |
| TypeScript      | Type checking                     |
| Expo Dev Client | Development & debugging           |

---

## 📁 Project Structure

Based on Expo best practices, the project follows a feature-based structure:

```
app/                    # Expo Router screens (routing only)
  _layout.tsx           # Root layout with providers
  index.tsx             # Home screen
  game/
    _layout.tsx         # Game stack layout
    setup.tsx           # Player setup screen
    play.tsx            # Main game/timer screen
  settings.tsx          # Settings screen

src/                    # All source code outside of routing
  components/           # Reusable components
    ui/                 # Basic UI components (Button, Card, Input, etc.)
    timer/              # Timer-specific components
      CircularTimer.tsx
      TimerDisplay.tsx
    game/               # Game-specific components
      PlayerCard.tsx
      ScoreBoard.tsx
      BallButtons.tsx   # Snooker ball value buttons

  features/             # Feature-specific modules
    game/
      hooks/
        useTimer.ts     # Timer logic (Reanimated-based)
        useAudio.ts     # Sound playback
      utils/
        timerUtils.ts
    rivalry/
      hooks/
        useRivalry.ts
      utils/
        rivalryUtils.ts

  store/                # Redux store
    index.ts            # Store configuration with persist
    hooks.ts            # Typed useSelector/useDispatch
    slices/
      gameSlice.ts      # Game mode, players, timer settings
      rivalrySlice.ts   # Rivalry history and records
      settingsSlice.ts  # Theme, sound, haptic preferences
      scoreSlice.ts     # Current game scores

  lib/                  # Shared utilities and services
    storage.ts          # File system storage helpers
    theme.ts            # Theme configuration
    constants/
      game.ts           # Game constants (ball values, etc.)
      sounds.ts         # Sound file references
      colors.ts         # Color palette

  types/                # TypeScript types
    game.ts             # Game-related types
    rivalry.ts          # Rivalry types
    navigation.ts       # Navigation types

assets/
  audio/                # Sound files (MP3)
  images/               # Image assets
  fonts/                # Custom fonts (if any)
```

**Key Principles:**

- `app/` contains ONLY route files (minimal logic)
- `src/` contains all business logic and components
- Feature-based organization for scalability
- Shared code in `lib/` and `components/ui/`
- Redux store centralized in `store/`

---

## 🚫 Not Approved (Do Not Use)

The following are explicitly **NOT approved** for this project:

| Category         | Not Approved                                  | Reason                            |
| ---------------- | --------------------------------------------- | --------------------------------- |
| State Management | Zustand, MobX, Jotai                          | Redux Toolkit is the standard     |
| Timer State      | useState/useReducer for timer                 | Use Reanimated SharedValue only   |
| Styling          | Styled Components, NativeWind, Tamagui        | Keep it simple with StyleSheet    |
| Animation        | Lottie, Moti                                  | Reanimated is sufficient          |
| Audio            | react-native-sound, react-native-track-player | expo-av is the Expo standard      |
| Storage          | AsyncStorage, MMKV, WatermelonDB, Realm       | Use expo-file-system with persist |
| HTTP             | Axios, fetch wrappers                         | No network requests needed        |
| Context          | React Context for global state                | Use Redux instead                 |

---

## ✅ Installation Checklist

Before starting development, install missing dependencies:

```bash
# Required for timer animations
npx expo install react-native-svg

# Required for audio alerts
npx expo install expo-audio

# Required for state management and persistence
npx expo install expo-file-system
npm install @reduxjs/toolkit react-redux redux-persist redux-persist-expo-file-system-storage
```

---

## 🔧 Redux Store Setup

Example store configuration with persistence:

```typescript
// src/store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { documentDirectory, EncodingType } from "expo-file-system";
import { createExpoFileSystemStorage } from "redux-persist-expo-file-system-storage";

import gameReducer from "./slices/gameSlice";
import rivalryReducer from "./slices/rivalrySlice";
import settingsReducer from "./slices/settingsSlice";
import scoreReducer from "./slices/scoreSlice";

const expoFileSystemStorage = createExpoFileSystemStorage({
  storagePath: `${documentDirectory}cueflow-store/`,
  encoding: EncodingType.UTF8,
});

const persistConfig = {
  key: "root",
  storage: expoFileSystemStorage,
  whitelist: ["rivalry", "settings"], // Only persist these slices
};

const rootReducer = combineReducers({
  game: gameReducer,
  rivalry: rivalryReducer,
  settings: settingsReducer,
  score: scoreReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 📝 Adding New Technologies

If a feature requires a technology not listed here:

1. **Stop** - Do not implement with an unapproved technology
2. **Ask** - Propose the technology to the user with justification
3. **Wait** - Get explicit approval before proceeding
4. **Document** - Add approved technology to this file

This ensures consistency and prevents unnecessary complexity.
