'use client';

const confettiDots = [
  { color: '#10b981', tx: '-60px', ty: '-80px', delay: '0s' },
  { color: '#2563eb', tx: '70px', ty: '-70px', delay: '0.1s' },
  { color: '#f59e0b', tx: '-80px', ty: '-30px', delay: '0.05s' },
  { color: '#f472b6', tx: '80px', ty: '-40px', delay: '0.15s' },
  { color: '#ef4444', tx: '-40px', ty: '-90px', delay: '0.08s' },
  { color: '#8b5cf6', tx: '50px', ty: '-85px', delay: '0.12s' },
  { color: '#10b981', tx: '-70px', ty: '-60px', delay: '0.18s' },
  { color: '#f59e0b', tx: '65px', ty: '-55px', delay: '0.03s' },
  { color: '#2563eb', tx: '-20px', ty: '-95px', delay: '0.13s' },
  { color: '#f472b6', tx: '30px', ty: '-90px', delay: '0.07s' },
];

interface LessonCompleteProps {
  title: string;
  message?: string;
  onContinue?: () => void;
}

export function LessonComplete({ title, message, onContinue }: LessonCompleteProps) {
  return (
    <div className="text-center py-8 space-y-5 relative overflow-hidden">
      {/* Confetti burst */}
      <div className="relative flex justify-center">
        <div className="relative">
          {confettiDots.map((dot, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: dot.color,
                '--tx': dot.tx,
                '--ty': dot.ty,
                animation: `confetti-burst 0.8s ease-out ${dot.delay} both`,
              } as React.CSSProperties}
            />
          ))}
          <div className="text-5xl animate-bounce-in">&#127881;</div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 animate-celebration-bounce delay-200">
        {title} voltooid!
      </h2>

      {/* Message */}
      {message && (
        <p className="text-sm text-gray-600 animate-slide-up-bounce delay-400">
          {message}
        </p>
      )}

      {/* Continue button */}
      {onContinue && (
        <div className="animate-slide-up-bounce delay-500">
          <button
            onClick={onContinue}
            className="px-8 py-3 rounded-xl btn-success text-white font-semibold text-base animate-pulse-glow"
          >
            Ga verder &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
