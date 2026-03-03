'use client';

interface LessonCompleteProps {
  title: string;
  message?: string;
  onContinue?: () => void;
}

export function LessonComplete({ title, message, onContinue }: LessonCompleteProps) {
  return (
    <div className="text-center py-8 space-y-4">
      <div className="text-5xl">&#127881;</div>
      <h2 className="text-xl font-bold text-gray-900">
        {title} voltooid!
      </h2>
      {message && (
        <p className="text-sm text-gray-600">{message}</p>
      )}
      {onContinue && (
        <button
          onClick={onContinue}
          className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Ga verder &rarr;
        </button>
      )}
    </div>
  );
}
