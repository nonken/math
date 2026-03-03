'use client';

import { useState } from 'react';
import { FillingBar } from '@/components/viz/FillingBar';
import { PercentageInsight, BuildingBlocksCard } from '@/components/shared/PercentageInsight';
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

  const show = step.showComponents ?? [];

  // For challenge steps, fix the number
  const targetNumber = step.id === '4-challenge1' ? 120 : step.id === '4-challenge2' ? 70 : number;
  const displayNumber = step.type === 'challenge' ? targetNumber : number;
  const displayResult = (percentage / 100) * displayNumber;

  // For the intro step showing 50% of 80
  const isFixedDemo = show.includes('fillingBar-50-80');
  const demoPercentage = isFixedDemo ? 50 : percentage;
  const demoNumber = isFixedDemo ? 80 : displayNumber;
  const demoResult = (demoPercentage / 100) * demoNumber;

  return (
    <LessonStep
      step={step}
      onComplete={onAdvance}
      percentage={percentage}
    >
      {/* Filling bar */}
      {(show.includes('fillingBar') || isFixedDemo) && (
        <div className="flex justify-center mb-4">
          <FillingBar
            percentage={isFixedDemo ? 50 : percentage}
            total={isFixedDemo ? 80 : displayNumber}
            result={isFixedDemo ? 40 : displayResult}
          />
        </div>
      )}

      {/* Building blocks reference card */}
      {show.includes('buildingBlocks') && (
        <div className="mb-4">
          <BuildingBlocksCard />
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
      {show.includes('numberSlider') && (
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

      {/* Intuitive insight (replaces dry StepExplanation) */}
      {show.includes('insight') && (
        <PercentageInsight
          percentage={isFixedDemo ? 50 : percentage}
          total={isFixedDemo ? 80 : displayNumber}
        />
      )}
    </LessonStep>
  );
}

function PercentageFreePlay() {
  const [percentage, setPercentage] = useState(25);
  const [number, setNumber] = useState(80);

  const result = (percentage / 100) * number;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.percentageVanGetal.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        Hoeveel is <span className="font-semibold text-primary">{percentage}%</span> van{' '}
        <span className="font-semibold">{number}</span>?
      </p>

      <div className="flex justify-center mb-6">
        <FillingBar percentage={percentage} total={number} result={result} />
      </div>

      {/* Building blocks reference */}
      <div className="mb-6">
        <BuildingBlocksCard />
      </div>

      {/* Quick-tap buttons */}
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

      {/* Sliders */}
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

      {/* Intuitive insight */}
      <PercentageInsight percentage={percentage} total={number} />
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
