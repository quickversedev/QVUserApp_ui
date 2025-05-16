// src/services/storage.service.ts
import {MMKV} from 'react-native-mmkv';

// Initialize MMKV
export const storage = new MMKV();
const AUTH_DATA_KEY = '@AuthData';
const SKIP_PERMISSIONS = '@SkipPermission';
const SKIP_LOGIN_KEY = '@skipLogin';

export const setSkipLoginFlow = (skipLogin: boolean): void => {
  storage.set(SKIP_LOGIN_KEY, skipLogin);
};

export const getSkipLoginFlow = (): boolean | undefined => {
  return storage.getBoolean(SKIP_LOGIN_KEY);
};

/**
 * Sets auth token string in storage
 * @param token string
 */
export const setAuthToken = (token: string): void => {
  storage.set(AUTH_DATA_KEY, token);
};

/**
 * Gets auth token string from storage
 * @returns string | undefined
 */
export const getAuthToken = (): string | undefined => {
  return storage.getString(AUTH_DATA_KEY) ?? undefined;
};

/**
 * Removes auth token from storage
 */
export const removeAuthToken = (): void => {
  storage.delete(AUTH_DATA_KEY);
};
/**
 * Sets skip permission in storage
 * @param skip boolean
 */
export const setSkipPermissions = (skip: boolean): void => {
  storage.set(SKIP_PERMISSIONS, skip);
};

/**
 * Gets auth token string from storage
 * @returns string | undefined
 */
export const getSkipPermission = (): boolean | undefined => {
  return storage.getBoolean(SKIP_PERMISSIONS) ?? undefined;
};

/**
 * Removes auth token from storage
 */
export const removeSkipPermission = (): void => {
  storage.delete(SKIP_PERMISSIONS);
};

export const StorageService = {
  clearAll: (): void => {
    storage.clearAll();
  },
};
