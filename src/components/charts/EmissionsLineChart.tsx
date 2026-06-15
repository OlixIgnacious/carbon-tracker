'use client';

import { useRef, useEffect } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import type { DailySummary } from '@/lib/types';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);

interface Props {
  data: DailySummary[];
}

export function EmissionsLineChart({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    const labels = data.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    });

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Total CO₂e (kg)',
            data: data.map((d) => d.total),
            borderColor: '#10b981',
            backgroundColor: gradient,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#022c22',
            pointBorderWidth: 2,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: (context) => `${(context.parsed.y || 0).toFixed(2)} kg CO₂e`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.03)',
            },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              maxTicksLimit: 10,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.03)',
            },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              callback: (value) => `${value} kg`,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-carbon-200 mb-4">
        Emissions Trend (Last 30 Days)
      </h3>
      <div className="relative h-[300px]">
        <canvas ref={canvasRef} aria-label="Line chart showing daily CO2 emissions over the last 30 days" role="img" />
      </div>
      {/* Accessible data table alternative */}
      <details className="mt-4">
        <summary className="text-xs text-carbon-500 cursor-pointer hover:text-carbon-400">
          View data as table (accessible)
        </summary>
        <div className="mt-2 max-h-40 overflow-auto">
          <table className="w-full text-xs text-carbon-400">
            <thead>
              <tr>
                <th className="text-left pb-1">Date</th>
                <th className="text-right pb-1">kg CO₂e</th>
              </tr>
            </thead>
            <tbody>
              {data.filter((d) => d.total > 0).map((d) => (
                <tr key={d.date}>
                  <td>{d.date}</td>
                  <td className="text-right">{d.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
