import { describe, it, expect } from 'vitest';
import { calculateStreak } from '../badge-evaluator';
import type { Activity, UserProfile } from '../types';

describe('Streak Evaluator', () => {
  const baseProfile: UserProfile = {
    name: 'Test',
    region: 'global',
    isFirstVisit: false,
    createdAt: '2024-01-01',
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    streakFreezeUsed: false,
    totalActivitiesLogged: 0,
  };

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];

  it('should calculate streak as 0 with no activities', () => {
    const result = calculateStreak([], baseProfile);
    expect(result.currentStreak).toBe(0);
  });

  it('should calculate streak of 1 for today', () => {
    const activities = [{ date: today }] as Activity[];
    const result = calculateStreak(activities, baseProfile);
    expect(result.currentStreak).toBe(1);
  });

  it('should calculate streak of 2 for yesterday and today', () => {
    const activities = [{ date: yesterday }, { date: today }] as Activity[];
    const result = calculateStreak(activities, baseProfile);
    expect(result.currentStreak).toBe(2);
  });

  it('should maintain streak if missed one day but freeze is unused', () => {
    // Activity 2 days ago, then nothing yesterday, then today
    const activities = [{ date: twoDaysAgo }, { date: today }] as Activity[];
    const result = calculateStreak(activities, baseProfile);
    expect(result.currentStreak).toBe(2);
  });

  it('should reset streak if missed one day and freeze is used', () => {
    // Activity 2 days ago, then today, but freeze already used
    const activities = [{ date: twoDaysAgo }, { date: today }] as Activity[];
    const profile = { ...baseProfile, streakFreezeUsed: true };
    const result = calculateStreak(activities, profile);
    // Streak resets to 1 (just today)
    expect(result.currentStreak).toBe(1);
  });
});
