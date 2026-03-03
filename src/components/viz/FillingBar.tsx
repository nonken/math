'use client';

import { useEffect, useState } from 'react';
import { COLORS } from '@/lib/constants';

interface FillingBarProps {
  percentage: number;
  total: number;
  result: number;
  height?: number;
  width?: number;
}

export function FillingBar({ percentage, total, result, height = 48, width = 280 }: FillingBarProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const clampedPercent = Math.max(0, Math.min(100, percentage));
  const targetWidth = (clampedPercent / 100) * width;

  useEffect(() => {
    setAnimatedWidth(0);
    const timer = setTimeout(() => setAnimatedWidth(targetWidth), 50);
    return () => clearTimeout(timer);
  }, [targetWidth]);

  const resultStr = result % 1 === 0 ? result.toFixed(0) : parseFloat(result.toFixed(2)).toString();

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Total bar label */}
      <div className="flex justify-between w-full text-xs text-gray-500" style={{ width }}>
        <span>0</span>
        <span>{total}</span>
      </div>

      {/* The bar */}
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Background */}
          <rect x={0} y={0} width={width} height={height} rx={8} fill={COLORS.unfilled} />
          {/* Fill */}
          <rect
            x={0}
            y={0}
            width={animatedWidth}
            height={height}
            rx={8}
            fill={COLORS.filled}
            style={{ transition: 'width 0.8s ease-out' }}
          />
        </svg>
        {/* Result label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-lg" style={{ color: clampedPercent > 50 ? 'white' : '#374151' }}>
            {resultStr}
          </span>
        </div>
      </div>

      {/* Percentage label */}
      <div className="text-sm text-gray-600">
        <span className="font-semibold text-primary">{percentage}%</span> van{' '}
        <span className="font-semibold">{total}</span>
      </div>
    </div>
  );
}
