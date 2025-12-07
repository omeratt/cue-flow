/**
 * Redux store configuration with persistence
 */

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { expoFileSystemStorage } from "../lib/storage";

import gameReducer from "./slices/gameSlice";
import rivalryReducer from "./slices/rivalrySlice";
import scoreReducer from "./slices/scoreSlice";
import settingsReducer from "./slices/settingsSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage: expoFileSystemStorage,
  whitelist: ["rivalry", "settings"], // Only persist these slices
};

// Combine reducers
const rootReducer = combineReducers({
  game: gameReducer,
  rivalry: rivalryReducer,
  settings: settingsReducer,
  score: scoreReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
