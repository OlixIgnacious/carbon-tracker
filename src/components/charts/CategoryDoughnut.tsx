'use client';

import { useRef, useEffect } from 'react';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

interface Props {
  transport: number;
  energy: number;
  food: number;
}

export function CategoryDoughnut({ transport, energy, food }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const total = transport + energy + food;

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Transport', 'Energy', 'Food'],
        datasets: [
          {
            data: [transport, energy, food],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',  // Blue
              'rgba(249, 115, 22, 0.8)',  // Orange
              'rgba(16, 185, 129, 0.8)',  // Green
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(249, 115, 22, 1)',
              'rgba(16, 185, 129, 1)',
            ],
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: { size: 12 },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: (context) => {
                const value = context.parsed;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return ` ${context.label}: ${value.toFixed(2)} kg CO₂e (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [transport, energy, food, total]);

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-carbon-200 mb-4">
        Emissions by Category
      </h3>
      {total > 0 ? (
        <div className="relative h-[280px]">
          <canvas
            ref={canvasRef}
            aria-label="Doughnut chart showing emissions breakdown by transport, energy, and food categories"
            role="img"
          />
        </div>
      ) : (
        <div className="h-[280px] flex items-center justify-center text-carbon-500">
          <p>No data yet. Start logging activities!</p>
        </div>
      )}

      {/* Accessible legend with values */}
      {total > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs" aria-label="Category breakdown values">
          <div>
            <div className="text-blue-400 font-semibold">{transport.toFixed(1)} kg</div>
            <div className="text-carbon-500">Transport</div>
          </div>
          <div>
            <div className="text-orange-400 font-semibold">{energy.toFixed(1)} kg</div>
            <div className="text-carbon-500">Energy</div>
          </div>
          <div>
            <div className="text-emerald-400 font-semibold">{food.toFixed(1)} kg</div>
            <div className="text-carbon-500">Food</div>
          </div>
        </div>
      )}
    </div>
  );
}
