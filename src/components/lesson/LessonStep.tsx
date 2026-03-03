'use client';

import { useState, useEffect } from 'react';
import type { LessonStepDef } from '@/lib/lessons';

// Reactions for lesson 1 (pizza exploration)
const pizzaReactions: Record<number, { text: string; special?: boolean }> = {
  0: { text: '0/4 — Je hebt niks gegeten!' },
  1: { text: '1/4 — Eén stuk! ' },
  2: { text: '2/4 — De helft!' },
  3: { text: '3/4 — Bijna alles!' },
  4: { text: '4/4 — Alles op! 🎉', special: true },
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
  const [isShaking, setIsShaking] = useState(false);
  const [isAhaVisible, setIsAhaVisible] = useState(false);
  const [prevNumerator, setPrevNumerator] = useState(numerator);

  // Show hint after 10 seconds
  useEffect(() => {
    if (!step.hint) return;
    setShowHint(false);
    const timer = setTimeout(() => setShowHint(true), 10000);
    return () => clearTimeout(timer);
  }, [step.id, step.hint]);

  // Track numerator changes for pizza reaction animation
  useEffect(() => {
    setPrevNumerator(numerator);
  }, [numerator]);

  const reactionChanged = numerator !== prevNumerator;

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
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
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
      <div className="tutor-bubble rounded-2xl p-4 relative animate-slide-up-bounce">
        <div className="absolute -top-2 left-6 w-4 h-4 tutor-bubble rotate-45" />
        <p className="text-sm text-gray-800 leading-relaxed relative z-10">
          {step.tutorText}
        </p>
      </div>

      {/* Pizza reaction (lesson 1) */}
      {showPizzaReaction && numerator !== undefined && pizzaReactions[numerator] && (
        <div
          key={numerator}
          className={`text-center font-semibold ${
            pizzaReactions[numerator].special
              ? 'text-2xl text-celebration animate-bounce-in'
              : 'text-base text-primary animate-slide-up-bounce'
          }`}
        >
          {pizzaReactions[numerator].text}
        </div>
      )}

      {/* Interactive content (sliders, visualizations) */}
      {children}

      {/* Input field for text-based challenges */}
      {step.interaction === 'input' && (
        <div className={`flex gap-2 ${isShaking ? 'animate-shake' : ''}`}>
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
            className="px-6 py-3 rounded-xl btn-primary text-white font-semibold text-sm disabled:opacity-40"
          >
            Check
          </button>
        </div>
      )}
      {inputError && (
        <p className="text-sm text-error animate-fade-in">Dat klopt niet helemaal. Probeer het nog eens!</p>
      )}

      {/* Hint */}
      {showHint && step.hint && !isTargetMet && (
        <div className="animate-fade-in animate-float bg-amber-50 border border-amber-200/50 rounded-xl px-3 py-2 flex items-start gap-2">
          <span className="text-base leading-none mt-0.5">💡</span>
          <p className="text-xs text-amber-700 italic">
            {step.hint}
          </p>
        </div>
      )}

      {/* Aha moment */}
      {isAhaVisible && step.ahaText && isTargetMet && (
        <div className="bg-filled-light border-2 border-filled/30 rounded-2xl p-4 text-center animate-bounce-in animate-pulse-glow">
          <p className="text-sm font-bold text-filled">{step.ahaText}</p>
        </div>
      )}

      {/* Progress / Next button */}
      {step.type === 'intro' || step.interaction === 'input' ? (
        // Intro steps: always show next button (unless it's an input step - handled above)
        step.interaction !== 'input' && (
          <button
            onClick={onComplete}
            className="w-full py-3 rounded-xl btn-primary text-white font-semibold"
          >
            Volgende &rarr;
          </button>
        )
      ) : (
        // Interactive steps: show next button only when target is met
        isTargetMet && (
          <button
            onClick={onComplete}
            className="w-full py-3 rounded-xl btn-success text-white font-semibold animate-bounce-in animate-pulse-glow"
          >
            {step.type === 'challenge' ? 'Goed zo! Volgende →' : 'Volgende →'}
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
                  ? 'bg-filled animate-scale-pop'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
