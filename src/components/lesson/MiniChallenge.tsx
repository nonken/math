'use client';

import { useState } from 'react';

interface MiniChallengeProps {
  question: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
  hint?: string;
  onComplete: () => void;
}

export function MiniChallenge({
  question,
  correctAnswer,
  acceptableAnswers,
  hint,
  onComplete,
}: MiniChallengeProps) {
  const [answer, setAnswer] = useState('');
  const [showError, setShowError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const checkAnswer = () => {
    const normalized = answer.trim().toLowerCase().replace(/\s/g, '');
    const allAcceptable = [
      correctAnswer.toLowerCase().replace(/\s/g, ''),
      ...(acceptableAnswers?.map((a) => a.toLowerCase().replace(/\s/g, '')) ?? []),
    ];

    if (allAcceptable.includes(normalized)) {
      setIsCorrect(true);
      setShowError(false);
      setTimeout(onComplete, 1000);
    } else {
      setShowError(true);
      setShowHint(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-accent/30 p-5 space-y-3">
      <p className="text-sm font-semibold text-gray-800">{question}</p>

      {isCorrect ? (
        <div className="bg-filled-light rounded-xl p-3 text-center">
          <span className="text-filled font-bold">Goed zo!</span>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setShowError(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              placeholder="Typ je antwoord..."
              className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-semibold focus:outline-none ${
                showError
                  ? 'border-error bg-error-light'
                  : 'border-gray-200 focus:border-primary'
              }`}
            />
            <button
              onClick={checkAnswer}
              disabled={!answer.trim()}
              className="px-5 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-amber-600 transition-colors disabled:opacity-40"
            >
              Check
            </button>
          </div>

          {showError && (
            <p className="text-xs text-error">Dat klopt niet helemaal. Probeer het nog eens!</p>
          )}

          {showHint && hint && (
            <p className="text-xs text-gray-400 italic">{hint}</p>
          )}
        </>
      )}
    </div>
  );
}
