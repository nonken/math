'use client';

import { COLORS } from '@/lib/constants';

interface FractionBarProps {
  numerator: number;
  denominator: number;
  height?: number;
  showLabel?: boolean;
}

export function FractionBar({ numerator, denominator, height = 40, showLabel = true }: FractionBarProps) {
  if (denominator === 0) return null;

  const vw = 240;
  const segmentWidth = vw / denominator;

  return (
    <div className="flex flex-col items-center w-full">
      <svg viewBox={`0 0 ${vw} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <rect x={0} y={0} width={vw} height={height} rx={6} fill={COLORS.unfilled} />
        {Array.from({ length: denominator }).map((_, i) => (
          <rect
            key={i}
            x={i * segmentWidth + 1}
            y={1}
            width={segmentWidth - 2}
            height={height - 2}
            rx={i === 0 ? 5 : i === denominator - 1 ? 5 : 0}
            fill={i < numerator ? COLORS.filled : 'transparent'}
            className="transition-all duration-300"
          />
        ))}
        {Array.from({ length: denominator - 1 }).map((_, i) => (
          <line
            key={`line-${i}`}
            x1={(i + 1) * segmentWidth}
            y1={0}
            x2={(i + 1) * segmentWidth}
            y2={height}
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>
      {showLabel && (
        <span className="text-sm font-medium text-gray-600 mt-1">
          {numerator} van {denominator} delen
        </span>
      )}
    </div>
  );
}
