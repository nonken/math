'use client';

import { useState } from 'react';
import { PieChart } from '@/components/viz/PieChart';
import { FractionBar } from '@/components/viz/FractionBar';
import { PercentageBar } from '@/components/viz/PercentageBar';
import { MathDisplay } from '@/components/shared/MathDisplay';
import { t } from '@/lib/i18n';

export default function VerkenPage() {
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);

  const decimal = numerator / denominator;
  const percentage = decimal * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.verken.title}</h1>
      <p className="text-gray-500 text-sm mb-6">{t.verken.subtitle}</p>

      {/* Equivalence display */}
      <div className="bg-primary-light rounded-2xl p-4 mb-8 text-center">
        <div className="flex items-center justify-center gap-3 flex-wrap text-xl font-semibold">
          <MathDisplay numerator={numerator} denominator={denominator} />
          <span className="text-gray-400">=</span>
          <span className="text-primary">{decimal % 1 === 0 ? decimal.toFixed(0) : parseFloat(decimal.toFixed(4)).toString()}</span>
          <span className="text-gray-400">=</span>
          <span className="text-primary">{percentage % 1 === 0 ? percentage.toFixed(0) : parseFloat(percentage.toFixed(2)).toString()}%</span>
        </div>
        <p className="text-xs text-primary/70 mt-2">{t.verken.sameThingMessage}</p>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col items-center">
          <PieChart numerator={numerator} denominator={denominator} size={160} />
          <span className="text-xs text-gray-400 mt-2">Taartdiagram</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <FractionBar numerator={numerator} denominator={denominator} />
          <span className="text-xs text-gray-400 mt-2">Breukenbalk</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <PercentageBar percentage={percentage} />
          <span className="text-xs text-gray-400 mt-2">Percentagebalk</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">{t.verken.numerator} (teller)</label>
            <span className="text-lg font-bold text-primary w-8 text-center">{numerator}</span>
          </div>
          <input
            type="range"
            min={0}
            max={denominator}
            value={numerator}
            onChange={(e) => setNumerator(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">{t.verken.denominator} (noemer)</label>
            <span className="text-lg font-bold text-primary w-8 text-center">{denominator}</span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            value={denominator}
            onChange={(e) => {
              const newDenom = Number(e.target.value);
              setDenominator(newDenom);
              if (numerator > newDenom) setNumerator(newDenom);
            }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
