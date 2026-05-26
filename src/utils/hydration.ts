import {
  ActivityLevel,
  DoseOption,
  HydrationPlan,
  UserProfile,
} from '@/types/hydration';

const ACTIVITY_BONUS: Record<ActivityLevel, number> = {
  sedentario: 0,
  weekly_1_2: 300,
  weekly_3_5: 700,
  daily: 1000,
};

export function calculateGoalMl(profile: UserProfile): number {
  const weight = Number(profile.weightKg) || 0;
  const base = weight * 35;

  return Math.round(base + ACTIVITY_BONUS[profile.activityLevel]);
}

export function createReminderTimes(
  goalMl: number,
  doseMl: DoseOption,
): string[] {
  const doseCount = Math.max(1, Math.ceil(goalMl / doseMl));
  const startMinutes = 8 * 60;
  const endMinutes = 22 * 60;
  const interval = (endMinutes - startMinutes) / doseCount;

  return Array.from({ length: doseCount }, (_, index) => {
    const minutes = Math.round(startMinutes + interval * index);
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');

    return `${hours}:${mins}`;
  });
}

export function buildHydrationPlan(
  profile: UserProfile,
  doseMl: DoseOption,
): HydrationPlan {
  const goalMl = calculateGoalMl(profile);

  return {
    goalMl,
    goalLiters: Number((goalMl / 1000).toFixed(2)),
    doseMl,
    reminderTimes: createReminderTimes(goalMl, doseMl),
  };
}

export function getActivityLabel(activityLevel: ActivityLevel): string {
  switch (activityLevel) {
    case 'sedentario':
      return 'Sedentário';
    case 'weekly_1_2':
      return '1 a 2 vezes por semana';
    case 'weekly_3_5':
      return '3 a 5 vezes por semana';
    case 'daily':
      return 'Todos os dias';
  }
}
