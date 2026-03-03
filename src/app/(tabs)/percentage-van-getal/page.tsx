'use client';

import { useState } from 'react';
import { FillingBar } from '@/components/viz/FillingBar';
import { StepExplanation } from '@/components/shared/StepExplanation';
import { percentOfNumberSteps } from '@/lib/math/conversions';
import { QUICK_PERCENTAGES } from '@/lib/constants';
import { LessonShell } from '@/components/lesson/LessonShell';
import { LessonStep } from '@/components/lesson/LessonStep';
import { lessons } from '@/lib/lessons';
import { t } from '@/lib/i18n';

function PercentageLesson({
  stepIndex,
  onAdvance,
}: {
  stepIndex: number;
  onAdvance: () => void;
}) {
  const [percentage, setPercentage] = useState(50);
  const [number, setNumber] = useState(80);

  const lesson = lessons.find((l) => l.id === 4);
  if (!lesson) return null;
  const step = lesson.steps[stepIndex];
  if (!step) return null;

  const result = (percentage / 100) * number;
  const steps = percentOfNumberSteps(percentage, number);
  const show = step.showComponents ?? [];

  // For challenge steps, set the right number context
  const targetNumber = step.id === '4-challenge1' ? 120 : step.id === '4-challenge2' ? 70 : number;
  const challengeResult = (percentage / 100) * targetNumber;
  const challengeSteps = percentOfNumberSteps(percentage, targetNumber);

  // Use challenge number if in a challenge step
  const displayNumber = step.type === 'challenge' ? targetNumber : number;
  const displayResult = step.type === 'challenge' ? challengeResult : result;
  const displaySteps = step.type === 'challenge' ? challengeSteps : steps;

  return (
    <LessonStep
      step={step}
      onComplete={onAdvance}
      percentage={percentage}
    >
      {/* Filling bar */}
      {show.includes('fillingBar') && (
        <div className="flex justify-center mb-4">
          <FillingBar percentage={percentage} total={displayNumber} result={displayResult} />
        </div>
      )}

      {/* Quick-tap buttons */}
      {show.includes('quickButtons') && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">{t.percentageVanGetal.quickButtons}</p>
          <div className="flex gap-2">
            {QUICK_PERCENTAGES.map((p) => (
              <button
                key={p}
                onClick={() => setPercentage(p)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                  percentage === p
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Percentage slider */}
      {show.includes('percentageSlider') && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-3">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">{t.percentageVanGetal.percentage}</label>
            <span className="text-lg font-bold text-primary">{percentage}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* Number slider */}
      {show.includes('numberSlider') && !step.type?.startsWith('challenge') && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-3">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">{t.percentageVanGetal.number}</label>
            <span className="text-lg font-bold text-primary">{number}</span>
          </div>
          <input
            type="range"
            min={1}
            max={200}
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* Step-by-step explanation */}
      {show.includes('steps') && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Zo reken je het uit:</h2>
          <StepExplanation steps={displaySteps} />
        </div>
      )}
    </LessonStep>
  );
}

function PercentageFreePlay() {
  const [percentage, setPercentage] = useState(25);
  const [number, setNumber] = useState(80);

  const result = (percentage / 100) * number;
  const steps = percentOfNumberSteps(percentage, number);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.percentageVanGetal.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        Hoeveel is <span className="font-semibold text-primary">{percentage}%</span> van{' '}
        <span className="font-semibold">{number}</span>?
      </p>

      <div className="flex justify-center mb-8">
        <FillingBar percentage={percentage} total={number} result={result} />
      </div>

      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2 font-medium">{t.percentageVanGetal.quickButtons}</p>
        <div className="flex gap-2">
          {QUICK_PERCENTAGES.map((p) => (
            <button
              key={p}
              onClick={() => setPercentage(p)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                percentage === p
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p}%
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5 mb-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">{t.percentageVanGetal.percentage}</label>
            <span className="text-lg font-bold text-primary">{percentage}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">{t.percentageVanGetal.number}</label>
            <span className="text-lg font-bold text-primary">{number}</span>
          </div>
          <input
            type="range"
            min={1}
            max={200}
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Zo reken je het uit:</h2>
        <StepExplanation steps={steps} />
      </div>
    </div>
  );
}

export default function PercentageVanGetalPage() {
  return (
    <LessonShell
      tabPath="/percentage-van-getal"
      renderLesson={(_lessonId, stepIndex, onAdvance) => (
        <PercentageLesson stepIndex={stepIndex} onAdvance={onAdvance} />
      )}
    >
      <PercentageFreePlay />
    </LessonShell>
  );
}
