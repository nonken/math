'use client';

import { useState, useEffect } from 'react';
import type { LessonStepDef } from '@/lib/lessons';

// Reactions for lesson 1 (pizza exploration)
const pizzaReactions: Record<number, string> = {
  0: '0/4 \u2014 Je hebt niks gegeten!',
  1: '1/4 \u2014 E\u00e9n stuk! ',
  2: '2/4 \u2014 De helft!',
  3: '3/4 \u2014 Bijna alles!',
  4: '4/4 \u2014 Alles op!',
};

interface LessonStepProps {
  step: LessonStepDef;
  onComplete: () => void;
  // For slider-based interactions
  numerator?: number;
  denominator?: number;
  percentage?: number;
  // For tracking tried values
  triedValues?: number[];
  onTriedValue?: (value: number) => void;
  // Current pizza reaction (lesson 1)
  showPizzaReaction?: boolean;
  // Children = the interactive content (sliders, viz, etc.)
  children?: React.ReactNode;
}

export function LessonStep({
  step,
  onComplete,
  numerator,
  denominator,
  percentage,
  triedValues,
  showPizzaReaction,
  children,
}: LessonStepProps) {
  const [showHint, setShowHint] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [isAhaVisible, setIsAhaVisible] = useState(false);

  // Show hint after 10 seconds
  useEffect(() => {
    if (!step.hint) return;
    setShowHint(false);
    const timer = setTimeout(() => setShowHint(true), 10000);
    return () => clearTimeout(timer);
  }, [step.id, step.hint]);

  // Check if the target is met for slider interactions
  const isTargetMet = (() => {
    if (!step.target && !step.requireAllValues) return false;

    // For "require all values" steps (lesson 1 exploration)
    if (step.requireAllValues && triedValues) {
      return step.requireAllValues.every((v) => triedValues.includes(v));
    }

    // For percentage-only targets (like "make 50%")
    if (step.target?.percentage !== undefined && percentage !== undefined) {
      return Math.abs(percentage - step.target.percentage) < 0.5;
    }

    // For numerator + denominator targets
    if (step.target?.numerator !== undefined && step.target?.denominator !== undefined) {
      return numerator === step.target.numerator && denominator === step.target.denominator;
    }

    return false;
  })();

  const handleInputSubmit = () => {
    if (!step.target?.answer) return;
    const normalized = inputValue.trim().toLowerCase().replace(/\s/g, '');
    const target = step.target.answer.toLowerCase().replace(/\s/g, '');
    if (normalized === target) {
      setInputError(false);
      onComplete();
    } else {
      setInputError(true);
    }
  };

  // Show aha animation when target is first met
  useEffect(() => {
    if (isTargetMet && step.ahaText) {
      setIsAhaVisible(true);
    }
  }, [isTargetMet, step.ahaText]);

  return (
    <div className="space-y-4">
      {/* Tutor speech bubble */}
      <div className="bg-primary-light rounded-2xl p-4 relative">
        <div className="absolute -top-2 left-6 w-4 h-4 bg-primary-light rotate-45" />
        <p className="text-sm text-gray-800 leading-relaxed relative z-10">
          {step.tutorText}
        </p>
      </div>

      {/* Pizza reaction (lesson 1) */}
      {showPizzaReaction && numerator !== undefined && pizzaReactions[numerator] && (
        <div className="text-center text-sm font-medium text-primary animate-pulse">
          {pizzaReactions[numerator]}
        </div>
      )}

      {/* Interactive content (sliders, visualizations) */}
      {children}

      {/* Input field for text-based challenges */}
      {step.interaction === 'input' && (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setInputError(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
            placeholder="Typ je antwoord..."
            className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-semibold focus:outline-none transition-colors ${
              inputError
                ? 'border-error bg-error-light'
                : 'border-gray-200 focus:border-primary'
            }`}
          />
          <button
            onClick={handleInputSubmit}
            disabled={!inputValue.trim()}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-40"
          >
            Check
          </button>
        </div>
      )}
      {inputError && (
        <p className="text-sm text-error">Dat klopt niet helemaal. Probeer het nog eens!</p>
      )}

      {/* Hint */}
      {showHint && step.hint && !isTargetMet && (
        <p className="text-xs text-gray-400 italic animate-fade-in">
          {step.hint}
        </p>
      )}

      {/* Aha moment */}
      {isAhaVisible && step.ahaText && isTargetMet && (
        <div className="bg-filled-light border border-filled/20 rounded-2xl p-4 text-center animate-fade-in">
          <p className="text-sm font-semibold text-filled">{step.ahaText}</p>
        </div>
      )}

      {/* Progress / Next button */}
      {step.type === 'intro' || step.interaction === 'input' ? (
        // Intro steps: always show next button (unless it's an input step - handled above)
        step.interaction !== 'input' && (
          <button
            onClick={onComplete}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Volgende &rarr;
          </button>
        )
      ) : (
        // Interactive steps: show next button only when target is met
        isTargetMet && (
          <button
            onClick={onComplete}
            className="w-full py-3 rounded-xl bg-filled text-white font-semibold hover:bg-emerald-600 transition-colors animate-fade-in"
          >
            {step.type === 'challenge' ? 'Goed zo! Volgende \u2192' : 'Volgende \u2192'}
          </button>
        )
      )}

      {/* Tried values indicator for explore steps */}
      {step.requireAllValues && triedValues && (
        <div className="flex justify-center gap-1.5">
          {step.requireAllValues.map((v) => (
            <div
              key={v}
              className={`w-3 h-3 rounded-full transition-colors ${
                triedValues.includes(v)
                  ? 'bg-filled'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
