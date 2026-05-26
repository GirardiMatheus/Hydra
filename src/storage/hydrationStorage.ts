import AsyncStorage from '@react-native-async-storage/async-storage';

import { HydrationState } from '../types/hydration';

const STORAGE_KEY = '@hydra/app-state';

const DEFAULT_STATE: HydrationState = {
  profile: null,
  doseMl: 300,
  goalMl: 0,
  consumedMl: 0,
  reminderTimes: [],
  streak: 0,
  lastCompletedDate: null,
  history: [],
  onboardingCompleted: false,
  updatedAt: new Date().toISOString(),
  dailyFeedback: null,
};

export async function loadHydrationState(): Promise<HydrationState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return DEFAULT_STATE;
  }

  try {
    const parsed = JSON.parse(raw) as HydrationState;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

export async function saveHydrationState(state: HydrationState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
