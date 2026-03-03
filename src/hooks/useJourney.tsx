'use client';

import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { lessons, tabLessons } from '@/lib/lessons';

export interface LessonProgress {
  step: number;
  completed: boolean;
}

export interface JourneyState {
  currentLesson: number;
  lessonProgress: Record<number, LessonProgress>;
  unlockedTabs: string[];
  triedValues: Record<string, number[]>;
}

const DEFAULT_JOURNEY: JourneyState = {
  currentLesson: 1,
  lessonProgress: {
    1: { step: 0, completed: false },
  },
  unlockedTabs: ['/verken'],
  triedValues: {},
};

interface JourneyContextValue {
  journey: JourneyState;
  isTabUnlocked: (tabPath: string) => boolean;
  isLessonCompleted: (lessonId: number) => boolean;
  getLessonProgress: (lessonId: number) => LessonProgress;
  getActiveLessonForTab: (tabPath: string) => number | null;
  areAllTabLessonsComplete: (tabPath: string) => boolean;
  advanceStep: (lessonId: number) => void;
  recordTriedValue: (stepId: string, value: number) => void;
  getTriedValues: (stepId: string) => number[];
  resetJourney: () => void;
  getCurrentTab: () => string;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [journey, setJourney] = useLocalStorage<JourneyState>('math-journey', DEFAULT_JOURNEY);

  const isTabUnlocked = useCallback(
    (tabPath: string) => journey.unlockedTabs.includes(tabPath),
    [journey.unlockedTabs]
  );

  const isLessonCompleted = useCallback(
    (lessonId: number) => journey.lessonProgress[lessonId]?.completed ?? false,
    [journey.lessonProgress]
  );

  const getLessonProgress = useCallback(
    (lessonId: number): LessonProgress =>
      journey.lessonProgress[lessonId] ?? { step: 0, completed: false },
    [journey.lessonProgress]
  );

  const getActiveLessonForTab = useCallback(
    (tabPath: string): number | null => {
      const lessonIds = tabLessons[tabPath];
      if (!lessonIds) return null;
      for (const id of lessonIds) {
        if (!journey.lessonProgress[id]?.completed) return id;
      }
      return null;
    },
    [journey.lessonProgress]
  );

  const areAllTabLessonsComplete = useCallback(
    (tabPath: string): boolean => {
      const lessonIds = tabLessons[tabPath];
      if (!lessonIds) return true;
      return lessonIds.every((id) => journey.lessonProgress[id]?.completed);
    },
    [journey.lessonProgress]
  );

  const advanceStep = useCallback(
    (lessonId: number) => {
      setJourney((prev) => {
        const lesson = lessons.find((l) => l.id === lessonId);
        if (!lesson) return prev;

        const current = prev.lessonProgress[lessonId] ?? { step: 0, completed: false };
        const nextStep = current.step + 1;
        const isComplete = nextStep >= lesson.steps.length;

        const newProgress = {
          ...prev.lessonProgress,
          [lessonId]: {
            step: isComplete ? current.step : nextStep,
            completed: isComplete,
          },
        };

        let newUnlockedTabs = [...prev.unlockedTabs];
        let newCurrentLesson = prev.currentLesson;

        if (isComplete) {
          if (lesson.unlocksTab && !newUnlockedTabs.includes(lesson.unlocksTab)) {
            newUnlockedTabs.push(lesson.unlocksTab);
          }

          const nextLesson = lessons.find((l) => l.id === lessonId + 1);
          if (nextLesson) {
            newCurrentLesson = nextLesson.id;
            if (!newProgress[nextLesson.id]) {
              newProgress[nextLesson.id] = { step: 0, completed: false };
            }
          }
        }

        return {
          ...prev,
          currentLesson: newCurrentLesson,
          lessonProgress: newProgress,
          unlockedTabs: newUnlockedTabs,
        };
      });
    },
    [setJourney]
  );

  const recordTriedValue = useCallback(
    (stepId: string, value: number) => {
      setJourney((prev) => {
        const existing = prev.triedValues[stepId] ?? [];
        if (existing.includes(value)) return prev;
        return {
          ...prev,
          triedValues: {
            ...prev.triedValues,
            [stepId]: [...existing, value],
          },
        };
      });
    },
    [setJourney]
  );

  const getTriedValues = useCallback(
    (stepId: string): number[] => journey.triedValues[stepId] ?? [],
    [journey.triedValues]
  );

  const resetJourney = useCallback(() => {
    setJourney(DEFAULT_JOURNEY);
  }, [setJourney]);

  const getCurrentTab = useCallback(() => {
    const lesson = lessons.find((l) => l.id === journey.currentLesson);
    return lesson?.tab ?? '/verken';
  }, [journey.currentLesson]);

  const value: JourneyContextValue = {
    journey,
    isTabUnlocked,
    isLessonCompleted,
    getLessonProgress,
    getActiveLessonForTab,
    areAllTabLessonsComplete,
    advanceStep,
    recordTriedValue,
    getTriedValues,
    resetJourney,
    getCurrentTab,
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney(): JourneyContextValue {
  const ctx = useContext(JourneyContext);
  if (!ctx) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return ctx;
}
