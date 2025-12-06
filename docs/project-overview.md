# 🎱 CueFlow - Project Overview

## What is CueFlow?

**CueFlow** is an app designed for amateur billiard and snooker players. The app provides professional tools for managing games - turn timers, score tracking, and a shot clock mechanism with audio alerts, just like in professional tournaments.

---

## 🎯 App Purpose

To enable amateur players to enjoy billiard and snooker games with a more professional experience:

- **Turn time management** - Each player gets a set time limit for their turn
- **Audio alerts** - Just like in professional tournaments
- **Score tracking** - Recording wins and results

---

## 🎮 Game Modes

The app supports two game modes:

### 1. Billiard Mode 🎱

- Animated turn timer
- Win tracking between players

### 2. Snooker Mode 🔴

- Animated turn timer
- Win tracking between players
- **In-game score tracking** (points for each player during the game)

---

## ⚡ Core Features

### New Game Setup

1. Select game mode (Billiard/Snooker)
2. Enter both players' names
3. Choose turn duration (e.g., 30 seconds, 45 seconds, 1 minute)

### Turn Timer ⏱️

- **Design:** Large animated circle in the center of the screen
- **Start:** Timer waits for a tap to begin
- **Stop:** Another tap stops the timer (turn change)
- **Animation:** Smooth and user-friendly visual display

### Audio Alerts 🔊

- **When:** In the final third of the time
- **How:** Professional beep sound every second (like in real tournaments)
- **Example:** If 30 seconds is set - in the last 10 seconds you'll hear:
  > _"beep... beep... beep... beep... beep... beep... beep... beep... beep... beeeep"_

### Scoring & Wins 🏆

- **Both modes:** Option to mark a win for a player
- **Snooker mode only:** Point tracking during the game

---

## 🌓 Theme Support

The app includes full **Dark Mode** and **Light Mode** support:

### Light Mode ☀️

- Clean, bright interface
- Optimized for well-lit environments
- Easy visibility under bright pool table lights

### Dark Mode 🌙

- Eye-friendly dark interface
- Perfect for dimly lit pool halls and bars
- Reduces eye strain during long sessions

### Theme Features

- **Auto-detect:** Follows system preference by default
- **Manual toggle:** Users can override and choose their preferred theme
- **Persistent:** Theme choice is saved across sessions

---

## 📱 App Screens

| Screen          | Description                               |
| --------------- | ----------------------------------------- |
| **Home Screen** | Game mode selection (Billiard/Snooker)    |
| **Game Setup**  | Enter player names + choose turn duration |
| **Game Screen** | Timer, scoring, and game controls         |
| **Settings**    | Theme toggle (Dark/Light mode)            |

---

## 🛠️ Technologies

- **React Native** + **Expo** - Cross-platform development
- **Expo Router** - Screen navigation
- **React Native Reanimated** - Smooth animations
- **Expo Haptics** - Haptic feedback (vibration)
- **Expo AV** (to be installed) - Audio alert playback
- **React Native Appearance API** - Dark/Light mode detection

---

## 🎨 Design Principles

- Clean and minimalist interface
- Prominent central timer
- Smooth and pleasant animations
- Native experience on each platform
- Comfortable use even in bright light (e.g., at a pool table)
- Full dark/light mode support for any environment

---

## 📝 Summary

CueFlow transforms any amateur billiard or snooker game into a more professional experience. With an animated timer, authentic audio alerts, score tracking, and full theme support - players can focus on the game itself while the app manages time and results.
