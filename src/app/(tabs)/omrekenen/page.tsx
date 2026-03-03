'use client';

import { useState } from 'react';
import { ArrowDiagram } from '@/components/viz/ArrowDiagram';
import { StepExplanation } from '@/components/shared/StepExplanation';
import { fractionToPercentSteps, percentToFractionSteps } from '@/lib/math/conversions';
import { formatMixedFraction } from '@/lib/math/fractions';
import { LessonShell } from '@/components/lesson/LessonShell';
import { LessonStep } from '@/components/lesson/LessonStep';
import { lessons } from '@/lib/lessons';
import { t } from '@/lib/i18n';

type Direction = 'fractionToPercent' | 'percentToFraction';

function OmrekenenLesson({
  stepIndex,
  onAdvance,
}: {
  stepIndex: number;
  onAdvance: () => void;
}) {
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);
  const [percent, setPercent] = useState(60);

  const lesson = lessons.find((l) => l.id === 6);
  if (!lesson) return null;
  const step = lesson.steps[stepIndex];
  if (!step) return null;

  const show = step.showComponents ?? [];
  const isFractionToPercent = show.includes('fractionToPercent');
  const isPercentToFraction = show.includes('percentToFraction');

  // Fraction → Percent calculations
  const decimal = numerator / denominator;
  const resultPercent = decimal * 100;
  const resultPercentStr = formatMixedFraction(resultPercent);
  const fToP = fractionToPercentSteps(numerator, denominator);
  const arrowStepsFtoP = [
    { value: `${numerator}/${denominator}`, operation: `${numerator}\u00f7${denominator}` },
    { value: parseFloat(decimal.toFixed(6)).toString(), operation: '\u00d7100' },
    { value: `${resultPercentStr}%` },
  ];

  // Percent → Fraction calculations
  const pToF = percentToFractionSteps(percent);
  const arrowStepsPtoF = (() => {
    const steps = percentToFractionSteps(percent);
    const finalStep = steps[steps.length - 1];
    const arrowSteps = [
      { value: `${percent}%`, operation: '\u00f7100' },
      { value: `${percent}/100` },
    ];
    if (finalStep && finalStep.result !== `${percent}/100`) {
      arrowSteps[1].operation = 'vereenvoudig';
      arrowSteps.push({ value: finalStep.result });
    }
    return arrowSteps;
  })();

  return (
    <LessonStep
      step={step}
      onComplete={onAdvance}
      numerator={numerator}
      denominator={denominator}
      percentage={percent}
    >
      {/* Fraction → Percent mode */}
      {isFractionToPercent && (
        <div className="space-y-4">
          {show.includes('arrowDiagram') && <ArrowDiagram steps={arrowStepsFtoP} />}

          {show.includes('numeratorSlider') && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
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
          )}
          {show.includes('denominatorSlider') && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
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
          )}

          {show.includes('steps') && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Stappen:</h2>
              <StepExplanation steps={fToP} />
            </div>
          )}
        </div>
      )}

      {/* Percent → Fraction mode */}
      {isPercentToFraction && (
        <div className="space-y-4">
          {show.includes('arrowDiagram') && <ArrowDiagram steps={arrowStepsPtoF} />}

          {show.includes('percentSlider') && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
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
          )}

          {show.includes('steps') && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Stappen:</h2>
              <StepExplanation steps={pToF} />
            </div>
          )}
        </div>
      )}
    </LessonStep>
  );
}

function OmrekenenFreePlay() {
  const [direction, setDirection] = useState<Direction>('fractionToPercent');
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);
  const [percent, setPercent] = useState(75);

  const fToP = fractionToPercentSteps(numerator, denominator);
  const pToF = percentToFractionSteps(percent);

  const decimal = numerator / denominator;
  const resultPercent = decimal * 100;
  const resultPercentStr = formatMixedFraction(resultPercent);

  const arrowStepsFtoP = [
    { value: `${numerator}/${denominator}`, operation: `${numerator}\u00f7${denominator}` },
    { value: parseFloat(decimal.toFixed(6)).toString(), operation: '\u00d7100' },
    { value: `${resultPercentStr}%` },
  ];

  const arrowStepsPtoF = (() => {
    const steps = percentToFractionSteps(percent);
    const finalStep = steps[steps.length - 1];
    const arrowSteps = [
      { value: `${percent}%`, operation: '\u00f7100' },
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
          <ArrowDiagram steps={arrowStepsFtoP} />
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
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Stappen:</h2>
          <StepExplanation steps={fToP} />
        </div>
      ) : (
        <div>
          <ArrowDiagram steps={arrowStepsPtoF} />
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
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Stappen:</h2>
          <StepExplanation steps={pToF} />
        </div>
      )}
    </div>
  );
}

export default function OmrekenenPage() {
  return (
    <LessonShell
      tabPath="/omrekenen"
      renderLesson={(_lessonId, stepIndex, onAdvance) => (
        <OmrekenenLesson stepIndex={stepIndex} onAdvance={onAdvance} />
      )}
    >
      <OmrekenenFreePlay />
    </LessonShell>
  );
}
