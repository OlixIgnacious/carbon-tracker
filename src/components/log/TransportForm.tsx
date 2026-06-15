'use client';

import { useState } from 'react';
import { useCarbon } from '@/context/CarbonContext';
import type { TransportMode } from '@/lib/types';
import {
  calculateTransportEmission,
  TRANSPORT_LABELS,
  TRANSPORT_ICONS,
  TRANSPORT_FACTORS,
} from '@/lib/emission-factors';

interface Props {
  onSuccess: (message: string) => void;
}

const MODES = Object.keys(TRANSPORT_LABELS) as TransportMode[];

export function TransportForm({ onSuccess }: Props) {
  const { addActivity } = useCarbon();
  const [mode, setMode] = useState<TransportMode>('petrol_car');
  const [distance, setDistance] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const distanceNum = parseFloat(distance) || 0;
  const preview = calculateTransportEmission(mode, distanceNum);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (distanceNum <= 0) return;

    addActivity({
      type: 'transport',
      mode,
      distanceKm: distanceNum,
      date,
      co2e: preview,
    });

    onSuccess(`Logged ${distanceNum} km by ${TRANSPORT_LABELS[mode].toLowerCase()} — ${preview.toFixed(2)} kg CO₂e`);
    setDistance('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold text-carbon-200 flex items-center gap-2">
        <span aria-hidden="true">🚗</span> Log Transport
      </h2>

      {/* Transport Mode Selector */}
      <fieldset>
        <legend className="text-sm font-medium text-carbon-300 mb-3">Transport Mode</legend>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`p-3 rounded-xl text-center text-xs font-medium transition-all cursor-pointer
                ${mode === m
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-white/3 border border-white/5 text-carbon-400 hover:bg-white/5'
                }
              `}
              aria-pressed={mode === m}
            >
              <span className="text-xl block mb-1" aria-hidden="true">{TRANSPORT_ICONS[m]}</span>
              {TRANSPORT_LABELS[m]}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Distance */}
      <div>
        <label htmlFor="transport-distance" className="block text-sm font-medium text-carbon-300 mb-2">
          Distance (km)
        </label>
        <input
          id="transport-distance"
          type="number"
          min="0"
          step="0.1"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="e.g. 15"
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-carbon-200 placeholder:text-carbon-600
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
        />
        <p className="mt-1 text-xs text-carbon-500">
          Factor: {TRANSPORT_FACTORS[mode]} kg CO₂e/km
        </p>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="transport-date" className="block text-sm font-medium text-carbon-300 mb-2">
          Date
        </label>
        <input
          id="transport-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-carbon-200
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
        />
      </div>

      {/* Live Preview */}
      {distanceNum > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 animate-fade-in">
          <p className="text-sm text-emerald-400 font-medium">
            Estimated emission: <span className="text-lg font-bold">{preview.toFixed(2)}</span> kg CO₂e
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={distanceNum <= 0}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-carbon-700 disabled:text-carbon-500
                   text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200
                   hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed"
      >
        Log Activity
      </button>
    </form>
  );
}
