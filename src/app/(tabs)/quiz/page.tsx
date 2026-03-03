'use client';

import { useState, useCallback } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useJourney } from '@/hooks/useJourney';
import { generateQuestion, checkAnswer } from '@/lib/quiz/questionGenerator';
import type { QuizQuestion } from '@/lib/quiz/questionTypes';
import type { SkillKey } from '@/lib/progress/types';
import { PieChart } from '@/components/viz/PieChart';
import { PercentageBar } from '@/components/viz/PercentageBar';
import { VisualFader } from '@/components/shared/VisualFader';
import { LessonShell } from '@/components/lesson/LessonShell';
import { LessonStep } from '@/components/lesson/LessonStep';
import { lessons } from '@/lib/lessons';
import { t } from '@/lib/i18n';

type Phase = 'idle' | 'question' | 'feedback';

function QuizLesson({
  stepIndex,
  onAdvance,
}: {
  stepIndex: number;
  onAdvance: () => void;
}) {
  const lesson = lessons.find((l) => l.id === 7);
  if (!lesson) return null;
  const step = lesson.steps[stepIndex];
  if (!step) return null;

  return (
    <LessonStep step={step} onComplete={onAdvance}>
      <div className="text-center py-4">
        <div className="text-5xl mb-2">&#129504;</div>
      </div>
    </LessonStep>
  );
}

function QuizFreePlay() {
  const { progress, recordAnswer } = useProgress();
  const [phase, setPhase] = useState<Phase>('idle');
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [recentSkills, setRecentSkills] = useState<SkillKey[]>([]);

  const nextQuestion = useCallback(() => {
    const skillMasteries: Partial<Record<SkillKey, number>> = {};
    for (const [key, val] of Object.entries(progress.skills)) {
      skillMasteries[key as SkillKey] = val.masteryLevel;
    }
    const q = generateQuestion(progress.quiz.currentDifficulty, recentSkills, skillMasteries);
    setQuestion(q);
    setAnswer('');
    setPhase('question');
  }, [progress, recentSkills]);

  const handleSubmit = useCallback(() => {
    if (!question || !answer.trim()) return;
    const correct = checkAnswer(question, answer);
    setIsCorrect(correct);
    recordAnswer(question.skill, correct, question.difficulty);
    setRecentSkills((prev) => [...prev.slice(-4), question.skill]);
    setPhase('feedback');
  }, [question, answer, recordAnswer]);

  const handleOptionSelect = useCallback(
    (option: string) => {
      if (!question) return;
      const correct = checkAnswer(question, option);
      setAnswer(option);
      setIsCorrect(correct);
      recordAnswer(question.skill, correct, question.difficulty);
      setRecentSkills((prev) => [...prev.slice(-4), question.skill]);
      setPhase('feedback');
    },
    [question, recordAnswer]
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.quiz.title}</h1>

      {/* Stats bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-3 text-center">
          <div className="text-xs text-gray-500">{t.quiz.streak}</div>
          <div className="text-2xl font-bold text-accent">{progress.quiz.currentStreak}</div>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-3 text-center">
          <div className="text-xs text-gray-500">{t.quiz.bestStreak}</div>
          <div className="text-2xl font-bold text-gray-700">{progress.quiz.bestStreak}</div>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-3 text-center">
          <div className="text-xs text-gray-500">{t.quiz.difficulty}</div>
          <div className="text-2xl font-bold text-primary">{progress.quiz.currentDifficulty}</div>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-3 text-center">
          <div className="text-xs text-gray-500">{t.quiz.score}</div>
          <div className="text-2xl font-bold text-filled">
            {progress.quiz.totalQuestions > 0
              ? Math.round((progress.quiz.totalCorrect / progress.quiz.totalQuestions) * 100)
              : 0}
            %
          </div>
        </div>
      </div>

      {/* Idle state */}
      {phase === 'idle' && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">&#129504;</div>
          <p className="text-gray-600 mb-6">
            Test je kennis over breuken, decimalen en procenten!
          </p>
          <button
            onClick={nextQuestion}
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            {t.quiz.start}
          </button>
        </div>
      )}

      {/* Question */}
      {phase === 'question' && question && (
        <div className="space-y-6">
          {question.visual && (
            <VisualFader skill={question.skill}>
              <div className="flex justify-center">
                {question.visual.type === 'pie' &&
                  question.visual.numerator !== undefined &&
                  question.visual.denominator !== undefined && (
                    <PieChart
                      numerator={question.visual.numerator}
                      denominator={question.visual.denominator}
                      size={120}
                      showLabels={false}
                    />
                  )}
                {question.visual.type === 'percentage' &&
                  question.visual.percentage !== undefined && (
                    <PercentageBar
                      percentage={question.visual.percentage}
                      showLabel={false}
                      width={280}
                    />
                  )}
              </div>
            </VisualFader>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-lg font-semibold text-gray-900 mb-4">{question.prompt}</p>

            {question.format === 'multipleChoice' && question.options ? (
              <div className="grid grid-cols-2 gap-2">
                {question.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className="py-3 px-4 rounded-xl border-2 border-gray-200 text-sm font-semibold hover:border-primary hover:bg-primary-light transition-all"
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Typ je antwoord..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold focus:outline-none focus:border-primary"
                  autoFocus
                />
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-40"
                >
                  {t.quiz.checkAnswer}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feedback */}
      {phase === 'feedback' && question && (
        <div className="space-y-4">
          <div
            className={`rounded-2xl p-5 text-center ${
              isCorrect ? 'bg-filled-light' : 'bg-error-light'
            }`}
          >
            <div className="text-3xl mb-1">{isCorrect ? '\ud83c\udf89' : '\ud83e\udd14'}</div>
            <p className={`font-bold text-lg ${isCorrect ? 'text-filled' : 'text-error'}`}>
              {isCorrect ? t.quiz.correct : t.quiz.incorrect}
            </p>
            {!isCorrect && (
              <p className="text-sm text-gray-600 mt-1">
                Het goede antwoord is: <span className="font-bold">{question.correctAnswer}</span>
              </p>
            )}
          </div>

          {!isCorrect && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">{t.quiz.hereIsWhy}</p>
              <p className="text-sm text-gray-600">{question.explanation}</p>

              {question.visual && (
                <div className="flex justify-center mt-4">
                  {question.visual.type === 'pie' &&
                    question.visual.numerator !== undefined &&
                    question.visual.denominator !== undefined && (
                      <PieChart
                        numerator={question.visual.numerator}
                        denominator={question.visual.denominator}
                        size={100}
                      />
                    )}
                  {question.visual.type === 'percentage' &&
                    question.visual.percentage !== undefined && (
                      <PercentageBar percentage={question.visual.percentage} width={240} />
                    )}
                </div>
              )}
            </div>
          )}

          <button
            onClick={nextQuestion}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            {t.quiz.nextQuestion}
          </button>
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <LessonShell
      tabPath="/quiz"
      renderLesson={(_lessonId, stepIndex, onAdvance) => (
        <QuizLesson stepIndex={stepIndex} onAdvance={onAdvance} />
      )}
    >
      <QuizFreePlay />
    </LessonShell>
  );
}
