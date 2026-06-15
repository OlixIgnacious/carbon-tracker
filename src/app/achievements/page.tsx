'use client';

import { useCarbon } from '@/context/CarbonContext';

export default function AchievementsPage() {
  const { badges, profile, isHydrated } = useCarbon();

  if (!isHydrated) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-6 h-[160px] animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  const unlocked = badges.filter((b) => b.unlockedAt !== null);
  const locked = badges.filter((b) => b.unlockedAt === null);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-carbon-100 tracking-tight">
          Achievements
        </h1>
        <p className="text-carbon-400 mt-1">
          {unlocked.length} of {badges.length} badges unlocked
        </p>
      </section>

      {/* Streak Display */}
      <section className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl" aria-hidden="true">
            {profile.currentStreak > 0 ? '🔥' : '❄️'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-carbon-100">
              {profile.currentStreak} day{profile.currentStreak !== 1 ? 's' : ''} streak
            </h2>
            <p className="text-sm text-carbon-400">
              {profile.currentStreak > 0
                ? `Keep going! Longest streak: ${profile.longestStreak} days`
                : 'Log an activity today to start your streak!'}
            </p>
          </div>
        </div>

        {/* Progress bar to next streak badge */}
        {profile.currentStreak < 30 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-carbon-500 mb-1">
              <span>
                Next streak badge: {profile.currentStreak < 3 ? '3 days' : profile.currentStreak < 7 ? '7 days' : '30 days'}
              </span>
              <span>
                {profile.currentStreak}/{profile.currentStreak < 3 ? 3 : profile.currentStreak < 7 ? 7 : 30}
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    (profile.currentStreak / (profile.currentStreak < 3 ? 3 : profile.currentStreak < 7 ? 7 : 30)) * 100
                  )}%`,
                }}
                role="progressbar"
                aria-valuenow={profile.currentStreak}
                aria-valuemin={0}
                aria-valuemax={profile.currentStreak < 3 ? 3 : profile.currentStreak < 7 ? 7 : 30}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div>
            <div className="text-xl font-bold text-emerald-400">{profile.totalActivitiesLogged}</div>
            <div className="text-xs text-carbon-500">Activities Logged</div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-400">{profile.currentStreak}</div>
            <div className="text-xs text-carbon-500">Current Streak</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-400">{unlocked.length}</div>
            <div className="text-xs text-carbon-500">Badges Earned</div>
          </div>
        </div>
      </section>

      {/* Unlocked Badges */}
      {unlocked.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-carbon-200 mb-4 flex items-center gap-2">
            <span aria-hidden="true">✅</span> Unlocked
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 stagger-children">
            {unlocked.map((badge) => (
              <div
                key={badge.id}
                className="glass-card p-5 text-center hover:border-emerald-500/30"
              >
                <span className="text-4xl block mb-3 animate-confetti" aria-hidden="true">
                  {badge.icon}
                </span>
                <h3 className="font-semibold text-carbon-200 text-sm mb-1">{badge.name}</h3>
                <p className="text-xs text-carbon-500 mb-2">{badge.description}</p>
                {badge.unlockedAt && (
                  <p className="text-xs text-emerald-500/70">
                    Earned {new Date(badge.unlockedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Locked Badges */}
      {locked.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-carbon-200 mb-4 flex items-center gap-2">
            <span aria-hidden="true">🔒</span> Locked
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 stagger-children">
            {locked.map((badge) => (
              <div
                key={badge.id}
                className="glass-card p-5 text-center opacity-50"
              >
                <span className="text-4xl block mb-3 grayscale blur-[1px]" aria-hidden="true">
                  {badge.icon}
                </span>
                <h3 className="font-semibold text-carbon-400 text-sm mb-1">{badge.name}</h3>
                <p className="text-xs text-carbon-600">{badge.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
