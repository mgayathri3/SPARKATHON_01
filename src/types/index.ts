export interface User {
  name: string;
  weight: number;
  waterGoal: number;
  streak: number;
  badges: Badge[];
}

export interface WaterIntake {
  date: string;
  amount: number;
  entries: {
    timestamp: number;
    amount: number;
  }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface Weather {
  temp: number;
  humidity: number;
  description: string;
  icon: string;
  loading: boolean;
  error: string | null;
}

export interface ReminderSettings {
  enabled: boolean;
  interval: number; // in minutes
  startTime: string;
  endTime: string;
}

export interface HistoryData {
  [date: string]: number;
}