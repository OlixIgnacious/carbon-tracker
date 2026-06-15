'use client';

import { useEffect, useState } from 'react';

interface Props {
  label: string;
  value: number;
  unit?: string;
  icon: string;
  trend?: 'good' | 'average' | 'high';
  subtitle?: string;
}

export function SummaryCard({ label, value, unit = 'kg CO₂e', icon, trend, subtitle }: Props) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter
  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current * 100) / 100);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const trendColor = {
    good: 'text-emerald-400',
    average: 'text-amber-400',
    high: 'text-red-400',
  };

  const trendBg = {
    good: 'bg-emerald-500/10 border-emerald-500/20',
    average: 'bg-amber-500/10 border-amber-500/20',
    high: 'bg-red-500/10 border-red-500/20',
  };

  return (
    <div className={`glass-card p-5 border ${trend ? trendBg[trend] : 'border-white/5'}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-carbon-400 font-medium">{label}</span>
        <span className="text-2xl" aria-hidden="true">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold tracking-tight ${trend ? trendColor[trend] : 'text-carbon-100'}`}>
          {displayValue.toFixed(1)}
        </span>
        <span className="text-sm text-carbon-500">{unit}</span>
      </div>
      {subtitle && (
        <p className="mt-2 text-xs text-carbon-500">{subtitle}</p>
      )}
    </div>
  );
}
