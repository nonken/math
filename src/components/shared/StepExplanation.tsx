'use client';

import type { ConversionStep } from '@/lib/math/conversions';

interface StepExplanationProps {
  steps: ConversionStep[];
  revealedSteps?: number; // How many steps to show (for progressive reveal)
}

export function StepExplanation({ steps, revealedSteps }: StepExplanationProps) {
  const visibleSteps = revealedSteps !== undefined ? steps.slice(0, revealedSteps) : steps;

  return (
    <div className="space-y-3">
      {visibleSteps.map((step, i) => (
        <div
          key={i}
          className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-3 transition-all duration-300"
        >
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600">{step.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">{step.expression}</code>
              <span className="text-gray-400">=</span>
              <span className="font-bold text-primary">{step.result}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
