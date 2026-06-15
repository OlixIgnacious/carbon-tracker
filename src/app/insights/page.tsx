'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCarbon } from '@/context/CarbonContext';
import { getFilteredInsights, type InsightRecommendation } from '@/lib/insights-fallback';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function InsightsPage() {
  const { activities, getCategoryTotals, isHydrated } = useCarbon();
  const [insights, setInsights] = useState<InsightRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryTotals = getCategoryTotals();
  const topCategory = (() => {
    const { transport, energy, food } = categoryTotals;
    if (transport === 0 && energy === 0 && food === 0) return null;
    if (transport >= energy && transport >= food) return 'transport' as const;
    if (energy >= transport && energy >= food) return 'energy' as const;
    return 'food' as const;
  })();

  const loadFallbackInsights = useCallback(() => {
    const fallback = getFilteredInsights(topCategory, 5);
    setInsights(fallback);
    setIsAiGenerated(false);
  }, [topCategory]);

  // Load fallback insights initially
  useEffect(() => {
    if (!isHydrated) return;
    loadFallbackInsights();
  }, [isHydrated, loadFallbackInsights]);

  const fetchAiInsights = async () => {
    if (activities.length === 0) {
      setError('Log some activities first to get personalized AI insights.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build summary for AI
      const summary = buildSummary();

      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary }),
      });

      const data = await res.json();

      if (data.useFallback || !data.recommendations) {
        loadFallbackInsights();
        setError('AI insights unavailable. Showing curated recommendations instead.');
      } else {
        setInsights(data.recommendations);
        setIsAiGenerated(true);
      }
    } catch {
      loadFallbackInsights();
      setError('Could not connect to AI service. Showing curated recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const buildSummary = (): string => {
    const { transport, energy, food } = categoryTotals;
    const total = transport + energy + food;

    const transportModes = activities
      .filter((a) => a.type === 'transport')
      .reduce((acc, a) => {
        if (a.type === 'transport') {
          acc[a.mode] = (acc[a.mode] || 0) + a.co2e;
        }
        return acc;
      }, {} as Record<string, number>);

    const foodCategories = activities
      .filter((a) => a.type === 'food')
      .reduce((acc, a) => {
        if (a.type === 'food') {
          acc[a.category] = (acc[a.category] || 0) + a.co2e;
        }
        return acc;
      }, {} as Record<string, number>);

    return `Total emissions: ${total.toFixed(1)} kg CO₂e
Transport: ${transport.toFixed(1)} kg CO₂e (${Object.entries(transportModes).map(([k, v]) => `${k}: ${v.toFixed(1)} kg`).join(', ') || 'none'})
Energy: ${energy.toFixed(1)} kg CO₂e
Food: ${food.toFixed(1)} kg CO₂e (${Object.entries(foodCategories).map(([k, v]) => `${k}: ${v.toFixed(1)} kg`).join(', ') || 'none'})
Total activities logged: ${activities.length}`;
  };

  const difficultyColor = {
    easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    hard: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const categoryIcon = {
    transport: '🚗',
    energy: '⚡',
    food: '🍽️',
    general: '🌍',
  };

  if (!isHydrated) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-6 h-[140px] animate-shimmer" />
        ))}
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <section className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-carbon-100 tracking-tight">
              Insights
            </h1>
            <p className="text-carbon-400 mt-1">
              {isAiGenerated
                ? 'AI-powered recommendations based on your data'
                : 'Curated recommendations to reduce your footprint'}
            </p>
          </div>
          <button
            onClick={fetchAiInsights}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-carbon-700 disabled:text-carbon-500
                       text-white font-medium py-2.5 px-5 rounded-xl text-sm transition-all
                       hover:shadow-lg hover:shadow-blue-500/20 disabled:cursor-not-allowed
                       flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin" aria-hidden="true">⏳</span>
                Generating...
              </>
            ) : (
              <>
                <span aria-hidden="true">✨</span>
                Get AI Insights
              </>
            )}
          </button>
        </section>

        {/* Error/Info */}
        {error && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-xl text-sm" role="alert">
            {error}
          </div>
        )}

        {/* AI Badge */}
        {isAiGenerated && (
          <div className="flex items-center gap-2 text-xs text-blue-400">
            <span className="bg-blue-500/20 px-2 py-1 rounded-full">✨ AI Generated</span>
            <span className="text-carbon-500">Powered by Google Gemini</span>
          </div>
        )}

        {/* Insights Cards */}
        <div className="space-y-4 stagger-children">
          {insights.map((insight, index) => (
            <div key={index} className="glass-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl mt-0.5" aria-hidden="true">
                    {categoryIcon[insight.category] || '🌍'}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-carbon-200 mb-1">{insight.title}</h3>
                    <p className="text-sm text-carbon-400 leading-relaxed">{insight.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      {insight.estimatedSavingKgCO2e > 0 && (
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          Save ~{insight.estimatedSavingKgCO2e} kg CO₂e/day
                        </span>
                      )}
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${difficultyColor[insight.difficulty]}`}>
                        {insight.difficulty.charAt(0).toUpperCase() + insight.difficulty.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {insights.length === 0 && !loading && (
          <div className="glass-card p-8 text-center">
            <span className="text-4xl block mb-4" aria-hidden="true">💡</span>
            <h3 className="text-lg font-semibold text-carbon-200 mb-2">No insights yet</h3>
            <p className="text-sm text-carbon-400">
              Start logging activities to receive personalized recommendations.
            </p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
