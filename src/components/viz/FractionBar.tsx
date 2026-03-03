'use client';

import { COLORS } from '@/lib/constants';

interface FractionBarProps {
  numerator: number;
  denominator: number;
  height?: number;
  width?: number;
  showLabel?: boolean;
}

export function FractionBar({ numerator, denominator, height = 40, width = 240, showLabel = true }: FractionBarProps) {
  if (denominator === 0) return null;

  const segmentWidth = width / denominator;

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <rect x={0} y={0} width={width} height={height} rx={6} fill={COLORS.unfilled} />
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
        {/* Divider lines */}
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
