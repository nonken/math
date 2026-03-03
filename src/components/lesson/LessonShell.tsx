'use client';

import { lessons } from '@/lib/lessons';
import { useJourney } from '@/hooks/useJourney';
import { LessonComplete } from './LessonComplete';

interface LessonShellProps {
  tabPath: string;
  // Render function: receives lesson info when in lesson mode
  renderLesson: (lessonId: number, stepIndex: number, onAdvance: () => void) => React.ReactNode;
  // Free-play content shown after all lessons are complete
  children: React.ReactNode;
}

export function LessonShell({ tabPath, renderLesson, children }: LessonShellProps) {
  const {
    getActiveLessonForTab,
    areAllTabLessonsComplete,
    getLessonProgress,
    advanceStep,
  } = useJourney();

  const activeLessonId = getActiveLessonForTab(tabPath);
  const allComplete = areAllTabLessonsComplete(tabPath);

  // All lessons done = free-play mode
  if (allComplete) {
    return <>{children}</>;
  }

  // No active lesson (shouldn't happen, but fallback)
  if (activeLessonId === null) {
    return <>{children}</>;
  }

  const lesson = lessons.find((l) => l.id === activeLessonId);
  if (!lesson) return <>{children}</>;

  const progress = getLessonProgress(activeLessonId);
  const currentStep = progress.step;
  const totalSteps = lesson.steps.length;

  // Lesson just completed (edge case: completed but still on this tab)
  if (progress.completed) {
    const nextLesson = lessons.find((l) => l.id === activeLessonId + 1);
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <LessonComplete
          title={lesson.title}
          message={nextLesson ? `Volgende: ${nextLesson.title}` : undefined}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Lesson header */}
      <div className="mb-4 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-gray-900">
            Les {activeLessonId}: {lesson.title}
          </h1>
          <span className="text-xs text-gray-400 font-medium">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {lesson.steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i < currentStep
                  ? 'bg-filled animate-scale-pop'
                  : i === currentStep
                    ? 'bg-primary animate-gentle-pulse'
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lesson step content */}
      {renderLesson(activeLessonId, currentStep, () => advanceStep(activeLessonId))}
    </div>
  );
}
