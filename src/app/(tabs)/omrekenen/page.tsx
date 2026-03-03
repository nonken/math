'use client';

import { useState } from 'react';
import { ArrowDiagram } from '@/components/viz/ArrowDiagram';
import { StepExplanation } from '@/components/shared/StepExplanation';
import { fractionToPercentSteps, percentToFractionSteps } from '@/lib/math/conversions';
import { formatMixedFraction } from '@/lib/math/fractions';
import { t } from '@/lib/i18n';

type Direction = 'fractionToPercent' | 'percentToFraction';

export default function OmrekenenPage() {
  const [direction, setDirection] = useState<Direction>('fractionToPercent');

  // Fraction → Percent state
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);

  // Percent → Fraction state
  const [percent, setPercent] = useState(75);

  const fToP = fractionToPercentSteps(numerator, denominator);
  const pToF = percentToFractionSteps(percent);

  const decimal = numerator / denominator;
  const resultPercent = decimal * 100;
  const resultPercentStr = formatMixedFraction(resultPercent);

  const arrowStepsFtoP = [
    { value: `${numerator}/${denominator}`, operation: `${numerator}÷${denominator}` },
    { value: parseFloat(decimal.toFixed(6)).toString(), operation: '×100' },
    { value: `${resultPercentStr}%` },
  ];

  const arrowStepsPtoF = (() => {
    const steps = percentToFractionSteps(percent);
    const finalStep = steps[steps.length - 1];
    const arrowSteps = [
      { value: `${percent}%`, operation: '÷100' },
      { value: `${percent}/100` },
    ];
    if (finalStep && finalStep.result !== `${percent}/100`) {
      arrowSteps[1].operation = 'vereenvoudig';
      arrowSteps.push({ value: finalStep.result });
    }
    return arrowSteps;
  })();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.omrekenen.title}</h1>

      {/* Direction toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setDirection('fractionToPercent')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
            direction === 'fractionToPercent'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-500'
          }`}
        >
          {t.omrekenen.fractionToPercent}
        </button>
        <button
          onClick={() => setDirection('percentToFraction')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
            direction === 'percentToFraction'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-500'
          }`}
        >
          {t.omrekenen.percentToFraction}
        </button>
      </div>

      {direction === 'fractionToPercent' ? (
        <div>
          {/* Arrow diagram */}
          <ArrowDiagram steps={arrowStepsFtoP} />

          {/* Sliders */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5 mb-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Teller</label>
                <span className="text-lg font-bold text-primary">{numerator}</span>
              </div>
              <input
                type="range"
                min={1}
                max={denominator}
                value={numerator}
                onChange={(e) => setNumerator(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Noemer</label>
                <span className="text-lg font-bold text-primary">{denominator}</span>
              </div>
              <input
                type="range"
                min={2}
                max={20}
                value={denominator}
                onChange={(e) => {
                  const newDen = Number(e.target.value);
                  setDenominator(newDen);
                  if (numerator > newDen) setNumerator(newDen);
                }}
                className="w-full"
              />
            </div>
          </div>

          {/* Steps */}
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Stappen:</h2>
          <StepExplanation steps={fToP} />
        </div>
      ) : (
        <div>
          {/* Arrow diagram */}
          <ArrowDiagram steps={arrowStepsPtoF} />

          {/* Slider */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Percentage</label>
              <span className="text-lg font-bold text-primary">{percent}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Steps */}
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Stappen:</h2>
          <StepExplanation steps={pToF} />
        </div>
      )}
    </div>
  );
}
