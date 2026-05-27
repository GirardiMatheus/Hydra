import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as Haptics from 'expo-haptics';

import { buildHydrationPlan } from '../utils/hydration';
import { getTodayKey } from '../utils/date';
import {
  requestNotificationPermissions,
  scheduleDailyHydrationReminders,
} from '../services/notifications';
import { playWaterDropSound } from '../services/sounds';
import {
  loadHydrationState,
  saveHydrationState,
} from '../storage/hydrationStorage';
import {
  ActivityLevel,
  DoseOption,
  HydrationState,
  UserProfile,
} from '../types/hydration';
import { getRandomCompletionMessage } from '../utils/messages';

interface HydrationContextValue extends HydrationState {
  isReady: boolean;
  hasCompletedOnboarding: boolean;
  remainingMl: number;
  progressPercent: number;
  nextReminder: string | null;
  todayLabel: string;
  submitOnboarding: (profile: UserProfile, doseMl: DoseOption) => Promise<void>;
  updateDoseSetting: (doseMl: DoseOption) => Promise<void>;
  registerWaterIntake: () => Promise<void>;
  resetDayIfNeeded: () => Promise<void>;
  completionMessage: string;
}

const HydrationContext = createContext<HydrationContextValue | null>(null);

function sortTimes(times: string[]): string[] {
  return [...times].sort();
}

export function HydrationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HydrationState>({
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
  });
  const [isReady, setIsReady] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      const loaded = await loadHydrationState();

      if (!mounted) {
        return;
      }

      setState(loaded);
      setIsReady(true);

      if (loaded.onboardingCompleted && loaded.reminderTimes.length > 0) {
        await requestNotificationPermissions();
        await scheduleDailyHydrationReminders(loaded.reminderTimes);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    void saveHydrationState(state);
  }, [isReady, state]);

  const hasCompletedOnboarding = state.onboardingCompleted;
  const remainingMl = Math.max(0, state.goalMl - state.consumedMl);
  const progressPercent =
    state.goalMl > 0
      ? Math.min(100, (state.consumedMl / state.goalMl) * 100)
      : 0;
  const nextReminder =
    state.reminderTimes.find((time) => {
      const [hour, minute] = time.split(':').map(Number);
      const now = new Date();
      const reminderMinutes = hour * 60 + minute;
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      return reminderMinutes >= currentMinutes;
    }) ?? null;
  const todayLabel = getTodayKey();

  const persist = async (nextState: HydrationState) => {
    setState(nextState);
    await saveHydrationState(nextState);
  };

  const resetDayIfNeeded = async () => {
    if (!state.profile) {
      return;
    }

    const today = getTodayKey();
    const storedDay = getTodayKey(new Date(state.updatedAt));

    if (storedDay === today) {
      return;
    }

    const yesterday = getTodayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const completedYesterday = state.lastCompletedDate === yesterday;
    const previousEntry = {
      date: storedDay,
      consumedMl: state.consumedMl,
      goalMl: state.goalMl,
      completed: state.consumedMl >= state.goalMl,
    };

    const updatedHistory = [
      previousEntry,
      ...state.history.filter((entry) => entry.date !== previousEntry.date),
    ].slice(0, 14);
    const nextFeedback = previousEntry.completed
      ? 'Você hidratou mais que uma planta tropical 🌴'
      : 'Hoje faltou água, amanhã o corpo cobra 😭';

    await persist({
      ...state,
      consumedMl: 0,
      streak: completedYesterday ? state.streak + 1 : 0,
      history: updatedHistory,
      updatedAt: new Date().toISOString(),
      dailyFeedback: nextFeedback,
    });
  };

  useEffect(() => {
    if (!state.profile) {
      return;
    }

    void resetDayIfNeeded();
  }, [state.profile]);

  const submitOnboarding = async (profile: UserProfile, doseMl: DoseOption) => {
    const plan = buildHydrationPlan(profile, doseMl);
    const nextState: HydrationState = {
      ...state,
      profile,
      doseMl,
      goalMl: plan.goalMl,
      reminderTimes: sortTimes(plan.reminderTimes),
      onboardingCompleted: true,
      consumedMl: 0,
      history: state.history,
      updatedAt: new Date().toISOString(),
      dailyFeedback: null,
    };

    await requestNotificationPermissions();
    await scheduleDailyHydrationReminders(nextState.reminderTimes);
    setCompletionMessage('');
    await persist(nextState);
  };

  const updateDoseSetting = async (doseMl: DoseOption) => {
    if (!state.profile) {
      return;
    }

    const plan = buildHydrationPlan(state.profile, doseMl);
    const nextState: HydrationState = {
      ...state,
      doseMl,
      goalMl: plan.goalMl,
      reminderTimes: sortTimes(plan.reminderTimes),
      updatedAt: new Date().toISOString(),
    };

    await requestNotificationPermissions();
    await scheduleDailyHydrationReminders(nextState.reminderTimes);
    await persist(nextState);
  };

  const registerWaterIntake = async () => {
    if (!state.profile) {
      return;
    }

    const nextConsumed = Math.min(
      state.goalMl,
      state.consumedMl + state.doseMl,
    );
    const isComplete = nextConsumed >= state.goalMl;
    const today = getTodayKey();
    const updatedHistory = [
      {
        date: today,
        consumedMl: nextConsumed,
        goalMl: state.goalMl,
        completed: isComplete,
      },
      ...state.history.filter((entry) => entry.date !== today),
    ].slice(0, 14);

    if (isComplete) {
      const yesterday = getTodayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
      const completedYesterday = state.lastCompletedDate === yesterday;
      const nextStreak = completedYesterday ? state.streak + 1 : 1;
      const completionText = getRandomCompletionMessage();
      setCompletionMessage(completionText);
      try {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
      } catch {
        // Ignore haptic failures on runtimes that do not support them.
      }

      await persist({
        ...state,
        consumedMl: nextConsumed,
        streak: nextStreak,
        lastCompletedDate: today,
        history: updatedHistory,
        updatedAt: new Date().toISOString(),
        dailyFeedback: completionText,
      });
      return;
    }

    setCompletionMessage('');
    try {
      await Haptics.selectionAsync();
    } catch {
      // Ignore haptic failures on runtimes that do not support them.
    }
    await playWaterDropSound();
    await persist({
      ...state,
      consumedMl: nextConsumed,
      history: updatedHistory,
      updatedAt: new Date().toISOString(),
    });
  };

  const value = useMemo<HydrationContextValue>(
    () => ({
      ...state,
      isReady,
      hasCompletedOnboarding,
      remainingMl,
      progressPercent,
      nextReminder,
      todayLabel,
      submitOnboarding,
      updateDoseSetting,
      registerWaterIntake,
      resetDayIfNeeded,
      completionMessage,
    }),
    [
      state,
      isReady,
      hasCompletedOnboarding,
      remainingMl,
      progressPercent,
      nextReminder,
      todayLabel,
      completionMessage,
    ],
  );

  return (
    <HydrationContext.Provider value={value}>
      {children}
    </HydrationContext.Provider>
  );
}

export function useHydration() {
  const context = useContext(HydrationContext);

  if (!context) {
    throw new Error('useHydration must be used within HydrationProvider');
  }

  return context;
}
