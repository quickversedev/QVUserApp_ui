// src/services/storage.service.ts
import {MMKV} from 'react-native-mmkv';

// Initialize MMKV
export const storage = new MMKV();

export const StorageService = {
  clearAll: (): void => {
    storage.clearAll();
  },
};
