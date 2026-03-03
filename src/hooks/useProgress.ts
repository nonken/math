'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { calculateMastery, calculateNewDifficulty } from '@/lib/progress/masteryCalculator';
import { DEFAULT_PROGRESS, type ProgressData, type SkillKey } from '@/lib/progress/types';

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<ProgressData>('math-progress', DEFAULT_PROGRESS);

  const recordAnswer = useCallback(
    (skill: SkillKey, correct: boolean, difficulty: number) => {
      setProgress((prev) => {
        const newAnswer = {
          skill,
          correct,
          difficulty,
          timestamp: Date.now(),
        };

        const recentAnswers = [...prev.quiz.recentAnswers, newAnswer].slice(-50);

        // Update skill record
        const skillRecord = { ...prev.skills[skill] };
        skillRecord.attempts += 1;
        if (correct) skillRecord.correct += 1;
        skillRecord.masteryLevel = calculateMastery(skill, recentAnswers);

        // Update quiz stats
        const newStreak = correct ? prev.quiz.currentStreak + 1 : 0;
        const newDifficulty = calculateNewDifficulty(prev.quiz.currentDifficulty, recentAnswers);

        return {
          skills: {
            ...prev.skills,
            [skill]: skillRecord,
          },
          quiz: {
            totalQuestions: prev.quiz.totalQuestions + 1,
            totalCorrect: prev.quiz.totalCorrect + (correct ? 1 : 0),
            currentStreak: newStreak,
            bestStreak: Math.max(prev.quiz.bestStreak, newStreak),
            currentDifficulty: newDifficulty,
            recentAnswers,
          },
        };
      });
    },
    [setProgress]
  );

  const getMasteryLevel = useCallback(
    (skill: SkillKey): number => {
      return progress.skills[skill].masteryLevel;
    },
    [progress]
  );

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, [setProgress]);

  return { progress, recordAnswer, getMasteryLevel, resetProgress };
}
