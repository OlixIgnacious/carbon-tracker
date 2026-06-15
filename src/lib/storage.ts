// ============================================================
// localStorage Abstraction Layer
// Handles serialization, error recovery, and schema versioning
// ============================================================

import type { Activity, UserProfile, Badge, DailyChallenge } from './types';

const STORAGE_KEYS = {
  activities: 'carbon_tracker_activities',
  profile: 'carbon_tracker_profile',
  badges: 'carbon_tracker_badges',
  challenges: 'carbon_tracker_challenges',
  version: 'carbon_tracker_version',
} as const;

const CURRENT_VERSION = 1;

// --- Helpers ---

function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function safeGet<T>(key: string, fallback: T): T {
  if (!isLocalStorageAvailable()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Handle quota exceeded
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Consider clearing old data.');
    }
  }
}

// --- Activities ---

export function getActivities(): Activity[] {
  return safeGet<Activity[]>(STORAGE_KEYS.activities, []);
}

export function saveActivities(activities: Activity[]): void {
  safeSet(STORAGE_KEYS.activities, activities);
}

export function addActivity(activity: Activity): Activity[] {
  const activities = getActivities();
  activities.push(activity);
  saveActivities(activities);
  return activities;
}

export function deleteActivity(id: string): Activity[] {
  const activities = getActivities().filter((a) => a.id !== id);
  saveActivities(activities);
  return activities;
}

// --- Profile ---

export function getProfile(): UserProfile {
  return safeGet<UserProfile>(STORAGE_KEYS.profile, createDefaultProfile());
}

export function saveProfile(profile: UserProfile): void {
  safeSet(STORAGE_KEYS.profile, profile);
}

export function createDefaultProfile(): UserProfile {
  return {
    name: 'Eco Explorer',
    region: 'global',
    isFirstVisit: true,
    createdAt: new Date().toISOString(),
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    streakFreezeUsed: false,
    totalActivitiesLogged: 0,
  };
}

// --- Badges ---

export function getBadges(): Badge[] {
  return safeGet<Badge[]>(STORAGE_KEYS.badges, []);
}

export function saveBadges(badges: Badge[]): void {
  safeSet(STORAGE_KEYS.badges, badges);
}

// --- Challenges ---

export function getChallenges(): DailyChallenge[] {
  return safeGet<DailyChallenge[]>(STORAGE_KEYS.challenges, []);
}

export function saveChallenges(challenges: DailyChallenge[]): void {
  safeSet(STORAGE_KEYS.challenges, challenges);
}

// --- Version Migration ---

export function checkAndMigrateStorage(): void {
  if (!isLocalStorageAvailable()) return;
  const version = safeGet<number>(STORAGE_KEYS.version, 0);
  if (version < CURRENT_VERSION) {
    // Future migrations go here
    safeSet(STORAGE_KEYS.version, CURRENT_VERSION);
  }
}

// --- Clear All ---

export function clearAllData(): void {
  if (!isLocalStorageAvailable()) return;
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

// --- Generate unique ID ---

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
