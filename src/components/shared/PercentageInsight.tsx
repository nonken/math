'use client';

import { getPercentageBreakdown } from '@/lib/math/percentageInsights';
import { PieChart } from '@/components/viz/PieChart';

interface Props {
  percentage: number;
  total: number;
}

export function PercentageInsight({ percentage, total }: Props) {
  const breakdown = getPercentageBreakdown(percentage, total);

  return (
    <div className="space-y-3">
      {/* Identity: what this percentage really IS */}
      <div className="bg-primary-light rounded-2xl p-4 flex items-center gap-4">
        {breakdown.fraction && (
          <div className="flex-shrink-0">
            <PieChart
              numerator={breakdown.fraction[0]}
              denominator={breakdown.fraction[1]}
              size={52}
              showLabels={false}
            />
          </div>
        )}
        <p className="font-bold text-primary text-lg leading-tight">
          {breakdown.identity}
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {breakdown.steps.map((step, i) => (
          <div
            key={i}
            className={`rounded-xl p-3 transition-all ${
              step.highlight
                ? 'bg-filled-light border-2 border-filled/20'
                : 'bg-gray-50'
            }`}
          >
            <p className="text-xs text-gray-500 mb-0.5">{step.label}</p>
            <p className={`font-bold ${step.highlight ? 'text-filled text-lg' : 'text-gray-800'}`}>
              {step.calculation}{step.calculation ? ' = ' : ''}{step.result}
            </p>
          </div>
        ))}
      </div>

      {/* Tip */}
      {breakdown.tip && (
        <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-3 text-center">
          <p className="text-sm font-medium text-amber-700">
            Sneltruc: {breakdown.tip}
          </p>
        </div>
      )}
    </div>
  );
}

/** Reference card showing the three building blocks */
export function BuildingBlocksCard() {
  return (
    <div className="bg-white rounded-2xl border-2 border-primary/20 p-4">
      <p className="text-sm font-bold text-gray-800 mb-3">De drie bouwstenen:</p>
      <div className="grid grid-cols-3 gap-2">
        {[
          { pct: '50%', frac: '\u00bd', shortcut: '\u00f7 2', label: 'de helft' },
          { pct: '25%', frac: '\u00bc', shortcut: '\u00f7 4', label: 'een kwart' },
          { pct: '10%', frac: '1/10', shortcut: '\u00f7 10', label: 'een tiende' },
        ].map((block) => (
          <div key={block.pct} className="bg-primary-light rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-primary">{block.pct}</p>
            <p className="text-xs text-gray-600">{block.frac} = {block.label}</p>
            <p className="text-sm font-semibold text-primary/70 mt-1">{block.shortcut}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Hiermee kun je elk percentage uitrekenen!
      </p>
    </div>
  );
}
