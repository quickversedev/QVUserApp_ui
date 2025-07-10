// src/utils/global/firstLaunch.ts

/**
 * Utility function to check if this is the first time the app is being launched
 *
 * NOTE: This is NOT a React Hook. It should not be called with 'use' prefix
 * as it's a regular async function. For hooks, they must:
 * 1. Start with 'use' prefix
 * 2. Be called at the top level of a function component or another hook
 * 3. Not be called inside loops, conditions, or nested functions
 *
 * @returns Promise<boolean> - true if this is the first launch, false otherwise
 */
import { getAlreadyLaunched } from '../../services/localStorage/storage.service';

export const checkFirstLaunch = async (): Promise<boolean> => {
  try {
    const alreadyLaunched = getAlreadyLaunched();
    return alreadyLaunched === undefined || alreadyLaunched === null;
  } catch (error) {
    console.error('[checkFirstLaunch] Failed to check launch status:', error);
    return false;
  }
};
