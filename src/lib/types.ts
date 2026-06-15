// ============================================================
// Core TypeScript Types for Carbon Tracker
// ============================================================

// --- Transport ---
export type TransportMode =
  | 'petrol_car'
  | 'diesel_car'
  | 'electric_car'
  | 'motorcycle'
  | 'bus'
  | 'train'
  | 'short_haul_flight'
  | 'long_haul_flight'
  | 'bicycle'
  | 'walking';

export interface TransportActivity {
  id: string;
  type: 'transport';
  mode: TransportMode;
  distanceKm: number;
  date: string; // ISO date string YYYY-MM-DD
  co2e: number; // kg CO₂e (computed)
  createdAt: string; // ISO datetime
}

// --- Energy ---
export type EnergySource = 'electricity' | 'natural_gas' | 'water';

export interface EnergyActivity {
  id: string;
  type: 'energy';
  source: EnergySource;
  amount: number;
  unit: 'kWh' | 'm3';
  date: string;
  co2e: number;
  createdAt: string;
}

// --- Food ---
export type FoodCategory =
  | 'beef'
  | 'lamb'
  | 'cheese'
  | 'pork'
  | 'chicken'
  | 'fish'
  | 'eggs'
  | 'rice'
  | 'milk'
  | 'vegetables'
  | 'fruits'
  | 'legumes';

export interface FoodActivity {
  id: string;
  type: 'food';
  category: FoodCategory;
  weightKg: number;
  date: string;
  co2e: number;
  createdAt: string;
}

// --- Union Activity Type ---
export type Activity = TransportActivity | EnergyActivity | FoodActivity;

export type NewActivity = 
  | Omit<TransportActivity, 'id' | 'createdAt'>
  | Omit<EnergyActivity, 'id' | 'createdAt'>
  | Omit<FoodActivity, 'id' | 'createdAt'>;

// --- Daily Summary ---
export interface DailySummary {
  date: string;
  transport: number;
  energy: number;
  food: number;
  total: number;
}

// --- Badge ---
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'onboarding' | 'streaks' | 'transport' | 'food' | 'energy' | 'progress' | 'meta';
  unlockedAt: string | null;
}

// --- User Profile ---
export type Region = 'global' | 'us' | 'uk' | 'eu' | 'asia';

export interface UserProfile {
  name: string;
  region: Region;
  isFirstVisit: boolean;
  createdAt: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  streakFreezeUsed: boolean;
  totalActivitiesLogged: number;
}

// --- Daily Challenge ---
export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'food' | 'energy';
  icon: string;
  status: 'pending' | 'accepted' | 'completed' | 'skipped';
  date: string;
}

// --- App State ---
export interface CarbonState {
  activities: Activity[];
  profile: UserProfile;
  badges: Badge[];
  challenges: DailyChallenge[];
}
