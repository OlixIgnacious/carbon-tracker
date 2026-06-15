'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCarbon } from '@/context/CarbonContext';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { NarrativeInsight } from '@/components/dashboard/NarrativeInsight';
import { DailyChallengeCard } from '@/components/dashboard/DailyChallengeCard';
import { REGIONAL_AVERAGES } from '@/lib/emission-factors';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Dynamic import for chart components (client-only, uses canvas)
const EmissionsLineChart = dynamic(
  () => import('@/components/charts/EmissionsLineChart').then((m) => ({ default: m.EmissionsLineChart })),
  { ssr: false, loading: () => <div className="glass-card p-6 h-[380px] animate-shimmer" /> }
);

const CategoryDoughnut = dynamic(
  () => import('@/components/charts/CategoryDoughnut').then((m) => ({ default: m.CategoryDoughnut })),
  { ssr: false, loading: () => <div className="glass-card p-6 h-[380px] animate-shimmer" /> }
);

function getTrend(value: number, average: number): 'good' | 'average' | 'high' {
  if (value === 0) return 'good';
  if (value < average * 0.6) return 'good';
  if (value <= average) return 'average';
  return 'high';
}

export default function DashboardPage() {
  const { isHydrated, getDailySummaries, getCategoryTotals, getTodayTotal, profile, badges } = useCarbon();

  if (!isHydrated) {
    return (
      <ProtectedRoute>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-5 h-[120px] animate-shimmer" />
            ))}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const todayTotal = getTodayTotal();
  const summaries = getDailySummaries(30);
  const categoryTotals = getCategoryTotals();
  const weeklyTotal = summaries.slice(-7).reduce((sum, d) => sum + d.total, 0);
  const monthlyTotal = summaries.reduce((sum, d) => sum + d.total, 0);
  const unlockedBadges = badges.filter((b) => b.unlockedAt !== null);
  const regionalAverage = REGIONAL_AVERAGES[profile.region] || REGIONAL_AVERAGES.global;

  return (
    <ProtectedRoute>
      <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-carbon-100 tracking-tight">
            Dashboard
          </h1>
          <p className="text-carbon-400 mt-1">
            Welcome back, {profile.name}!
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-carbon-400">
          Region: <span className="text-carbon-200 capitalize">{profile.region === 'us' ? 'US' : profile.region === 'uk' ? 'UK' : profile.region === 'eu' ? 'EU' : profile.region}</span>
        </div>
      </section>

      {/* Daily Challenge */}
      <section>
        <DailyChallengeCard />
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Emissions summary">
        <SummaryCard
          label="Today"
          value={todayTotal}
          icon="📅"
          trend={getTrend(todayTotal, regionalAverage)}
          subtitle={todayTotal === 0 ? 'No activities logged today' : `${profile.region.toUpperCase()} avg: ${regionalAverage} kg/day`}
        />
        <SummaryCard
          label="This Week"
          value={Math.round(weeklyTotal * 100) / 100}
          icon="📈"
          subtitle={weeklyTotal > 0 ? `${(weeklyTotal / 7).toFixed(1)} kg/day average` : undefined}
        />
        <SummaryCard
          label="This Month"
          value={Math.round(monthlyTotal * 100) / 100}
          icon="📊"
          subtitle={monthlyTotal > 0 ? `${(monthlyTotal / 30).toFixed(1)} kg/day average` : undefined}
        />
        <SummaryCard
          label="Current Streak"
          value={profile.currentStreak}
          unit="days"
          icon="🔥"
          subtitle={profile.longestStreak > 0 ? `Longest: ${profile.longestStreak} days` : 'Start logging to build streaks!'}
        />
      </section>

      {/* Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EmissionsLineChart data={summaries} />
        </div>
        <div>
          <CategoryDoughnut
            transport={categoryTotals.transport}
            energy={categoryTotals.energy}
            food={categoryTotals.food}
          />
        </div>
      </section>

      {/* Narrative + Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NarrativeInsight todayTotal={todayTotal} weeklyTotal={weeklyTotal} />

        {/* Quick Actions Card */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-carbon-200 mb-4">
            ⚡ Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/log"
              className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform" aria-hidden="true">➕</span>
              <div>
                <p className="font-medium text-sm">Log an Activity</p>
                <p className="text-xs text-emerald-500/70">Track your transport, energy, or food</p>
              </div>
            </Link>
            <Link
              href="/insights"
              className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform" aria-hidden="true">💡</span>
              <div>
                <p className="font-medium text-sm">Get AI Insights</p>
                <p className="text-xs text-blue-500/70">Personalized reduction recommendations</p>
              </div>
            </Link>
            <Link
              href="/achievements"
              className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform" aria-hidden="true">🏆</span>
              <div>
                <p className="font-medium text-sm">View Achievements</p>
                <p className="text-xs text-purple-500/70">
                  {unlockedBadges.length} of {badges.length} badges unlocked
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
      </div>
    </ProtectedRoute>
  );
}
