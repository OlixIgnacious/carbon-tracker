'use client';

// ============================================================
// Carbon Context — Global State Management
// Hydration-safe: reads localStorage only after mount
// ============================================================

import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import type { Activity, NewActivity, UserProfile, Badge, DailyChallenge, DailySummary } from '@/lib/types';
import {
  getActivities, saveActivities,
  getProfile, saveProfile, createDefaultProfile,
  getBadges, saveBadges,
  getChallenges, saveChallenges,
  generateId, checkAndMigrateStorage,
} from '@/lib/storage';
import { initializeBadges } from '@/lib/badges';
import { evaluateBadges, calculateStreak } from '@/lib/badge-evaluator';

// --- State ---

interface CarbonContextState {
  activities: Activity[];
  profile: UserProfile;
  badges: Badge[];
  challenges: DailyChallenge[];
  isHydrated: boolean;
  recentlyUnlockedBadges: string[];
}

// --- Actions ---

type CarbonAction =
  | { type: 'HYDRATE'; payload: { activities: Activity[]; profile: UserProfile; badges: Badge[]; challenges: DailyChallenge[] } }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'DELETE_ACTIVITY'; payload: string }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'UPDATE_BADGES'; payload: { badges: Badge[]; newlyUnlocked: string[] } }
  | { type: 'SET_CHALLENGES'; payload: DailyChallenge[] }
  | { type: 'UPDATE_CHALLENGE'; payload: DailyChallenge }
  | { type: 'CLEAR_RECENT_BADGES' };

// --- Reducer ---

function carbonReducer(state: CarbonContextState, action: CarbonAction): CarbonContextState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        ...action.payload,
        isHydrated: true,
      };

    case 'ADD_ACTIVITY':
      return {
        ...state,
        activities: [...state.activities, action.payload],
        profile: {
          ...state.profile,
          totalActivitiesLogged: state.profile.totalActivitiesLogged + 1,
        },
      };

    case 'DELETE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.filter((a) => a.id !== action.payload),
      };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };

    case 'UPDATE_BADGES':
      return {
        ...state,
        badges: action.payload.badges,
        recentlyUnlockedBadges: action.payload.newlyUnlocked,
      };

    case 'SET_CHALLENGES':
      return { ...state, challenges: action.payload };

    case 'UPDATE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };

    case 'CLEAR_RECENT_BADGES':
      return { ...state, recentlyUnlockedBadges: [] };

    default:
      return state;
  }
}

// --- Initial State ---

const initialState: CarbonContextState = {
  activities: [],
  profile: createDefaultProfile(),
  badges: [],
  challenges: [],
  isHydrated: false,
  recentlyUnlockedBadges: [],
};

// --- Context ---

interface CarbonContextValue extends CarbonContextState {
  addActivity: (activity: NewActivity) => void;
  deleteActivity: (id: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateChallenge: (challenge: DailyChallenge) => void;
  clearRecentBadges: () => void;
  getDailySummaries: (days: number) => DailySummary[];
  getCategoryTotals: () => { transport: number; energy: number; food: number };
  getTodayTotal: () => number;
}

const CarbonContext = createContext<CarbonContextValue | undefined>(undefined);

// --- Provider ---

export function CarbonProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(carbonReducer, initialState);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    checkAndMigrateStorage();

    const activities = getActivities();
    let profile = getProfile();
    let badges = getBadges();
    const challenges = getChallenges();

    // Initialize badges if empty
    if (badges.length === 0) {
      badges = initializeBadges();
      saveBadges(badges);
    }

    // Update streak
    const streakData = calculateStreak(activities, profile);
    profile = { ...profile, ...streakData };
    saveProfile(profile);

    dispatch({
      type: 'HYDRATE',
      payload: { activities, profile, badges, challenges },
    });
    setMounted(true);
  }, []);

  // Persist state changes to localStorage
  useEffect(() => {
    if (!mounted) return;
    saveActivities(state.activities);
    saveProfile(state.profile);
    saveBadges(state.badges);
    saveChallenges(state.challenges);
  }, [state.activities, state.profile, state.badges, state.challenges, mounted]);

  // Evaluate badges after activity changes
  useEffect(() => {
    if (!mounted || state.activities.length === 0) return;

    const { badges, newlyUnlocked } = evaluateBadges({
      activities: state.activities,
      profile: state.profile,
      badges: state.badges,
    });

    if (newlyUnlocked.length > 0) {
      dispatch({ type: 'UPDATE_BADGES', payload: { badges, newlyUnlocked } });
    }
  }, [state.activities, mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Action Creators ---

  const addActivity = useCallback((activityData: NewActivity) => {
    const activity = {
      ...activityData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    } as Activity;

    dispatch({ type: 'ADD_ACTIVITY', payload: activity });

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: { lastActiveDate: today },
    });
  }, []);

  const deleteActivity = useCallback((id: string) => {
    dispatch({ type: 'DELETE_ACTIVITY', payload: id });
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: updates });
  }, []);

  const updateChallenge = useCallback((challenge: DailyChallenge) => {
    dispatch({ type: 'UPDATE_CHALLENGE', payload: challenge });
  }, []);

  const clearRecentBadges = useCallback(() => {
    dispatch({ type: 'CLEAR_RECENT_BADGES' });
  }, []);

  // --- Computed Values ---

  const getDailySummaries = useCallback(
    (days: number): DailySummary[] => {
      const summaries: DailySummary[] = [];
      const now = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayActivities = state.activities.filter((a) => a.date === dateStr);
        const transport = dayActivities
          .filter((a) => a.type === 'transport')
          .reduce((sum, a) => sum + a.co2e, 0);
        const energy = dayActivities
          .filter((a) => a.type === 'energy')
          .reduce((sum, a) => sum + a.co2e, 0);
        const food = dayActivities
          .filter((a) => a.type === 'food')
          .reduce((sum, a) => sum + a.co2e, 0);

        summaries.push({
          date: dateStr,
          transport: Math.round(transport * 100) / 100,
          energy: Math.round(energy * 100) / 100,
          food: Math.round(food * 100) / 100,
          total: Math.round((transport + energy + food) * 100) / 100,
        });
      }

      return summaries;
    },
    [state.activities]
  );

  const getCategoryTotals = useCallback(() => {
    const transport = state.activities
      .filter((a) => a.type === 'transport')
      .reduce((sum, a) => sum + a.co2e, 0);
    const energy = state.activities
      .filter((a) => a.type === 'energy')
      .reduce((sum, a) => sum + a.co2e, 0);
    const food = state.activities
      .filter((a) => a.type === 'food')
      .reduce((sum, a) => sum + a.co2e, 0);

    return {
      transport: Math.round(transport * 100) / 100,
      energy: Math.round(energy * 100) / 100,
      food: Math.round(food * 100) / 100,
    };
  }, [state.activities]);

  const getTodayTotal = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return state.activities
      .filter((a) => a.date === today)
      .reduce((sum, a) => sum + a.co2e, 0);
  }, [state.activities]);

  return (
    <CarbonContext.Provider
      value={{
        ...state,
        addActivity,
        deleteActivity,
        updateProfile,
        updateChallenge,
        clearRecentBadges,
        getDailySummaries,
        getCategoryTotals,
        getTodayTotal,
      }}
    >
      {children}
    </CarbonContext.Provider>
  );
}

// --- Hook ---

export function useCarbon(): CarbonContextValue {
  const context = useContext(CarbonContext);
  if (!context) {
    throw new Error('useCarbon must be used within a CarbonProvider');
  }
  return context;
}
