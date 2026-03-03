'use client';

import { COLORS } from '@/lib/constants';

interface PercentageBarProps {
  percentage: number;
  height?: number;
  width?: number;
  showLabel?: boolean;
  animate?: boolean;
}

export function PercentageBar({ percentage, height = 32, width = 240, showLabel = true, animate = true }: PercentageBarProps) {
  const clampedPercent = Math.max(0, Math.min(100, percentage));
  const fillWidth = (clampedPercent / 100) * width;
  const displayPercent = percentage % 1 === 0
    ? percentage.toFixed(0)
    : parseFloat(percentage.toFixed(2)).toString();

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          <rect x={0} y={0} width={width} height={height} rx={height / 2} fill={COLORS.unfilled} />
          <rect
            x={0}
            y={0}
            width={fillWidth}
            height={height}
            rx={height / 2}
            fill={COLORS.filled}
            className={animate ? 'transition-all duration-500 ease-out' : ''}
          />
        </svg>
        {showLabel && (
          <span
            className="absolute inset-0 flex items-center justify-center text-sm font-bold"
            style={{ color: clampedPercent > 50 ? 'white' : '#374151' }}
          >
            {displayPercent}%
          </span>
        )}
      </div>
    </div>
  );
}
