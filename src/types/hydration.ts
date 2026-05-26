export type ActivityLevel =
  | 'sedentario'
  | 'weekly_1_2'
  | 'weekly_3_5'
  | 'daily';

export type DoseOption = 200 | 250 | 300 | 500;

export type Gender = 'masculino' | 'feminino' | 'outro';

export interface UserProfile {
  name: string;
  age: string;
  gender: Gender;
  heightCm: string;
  weightKg: string;
  activityLevel: ActivityLevel;
}

export interface HydrationPlan {
  goalMl: number;
  goalLiters: number;
  doseMl: DoseOption;
  reminderTimes: string[];
}

export interface DayHistoryEntry {
  date: string;
  consumedMl: number;
  goalMl: number;
  completed: boolean;
}

export interface HydrationState {
  profile: UserProfile | null;
  doseMl: DoseOption;
  goalMl: number;
  consumedMl: number;
  reminderTimes: string[];
  streak: number;
  lastCompletedDate: string | null;
  history: DayHistoryEntry[];
  onboardingCompleted: boolean;
  updatedAt: string;
  dailyFeedback: string | null;
}
