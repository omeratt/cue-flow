/**
 * Custom storage adapter for redux-persist using expo-file-system new API
 */

import { Directory, File, Paths } from "expo-file-system";
import type { Storage } from "redux-persist";

const STORAGE_DIR_NAME = "cueflow-store";

// Get or create the storage directory
const getStorageDirectory = (): Directory => {
  return new Directory(Paths.document, STORAGE_DIR_NAME);
};

// Ensure the storage directory exists
const ensureStorageDirectory = (): void => {
  const dir = getStorageDirectory();
  if (!dir.exists) {
    dir.create();
  }
};

// Get file for a specific key
const getStorageFile = (key: string): File => {
  const sanitizedKey = key.replaceAll(/[^a-zA-Z0-9_-]/g, "_");
  return new File(getStorageDirectory(), `${sanitizedKey}.json`);
};

/**
 * Expo File System storage adapter for redux-persist
 */
export const expoFileSystemStorage: Storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      const file = getStorageFile(key);
      if (file.exists) {
        return await file.text();
      }
      return null;
    } catch (error) {
      console.error(`Error reading storage key "${key}":`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      ensureStorageDirectory();
      const file = getStorageFile(key);
      file.write(value);
    } catch (error) {
      console.error(`Error writing storage key "${key}":`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      const file = getStorageFile(key);
      if (file.exists) {
        file.delete();
      }
    } catch (error) {
      console.error(`Error removing storage key "${key}":`, error);
    }
  },
};
