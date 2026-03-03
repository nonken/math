'use client';

import { COLORS } from '@/lib/constants';

interface PieChartProps {
  numerator: number;
  denominator: number;
  size?: number;
  showLabels?: boolean;
  animate?: boolean;
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
  return [
    'M', cx, cy,
    'L', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 1, end.x, end.y,
    'Z',
  ].join(' ');
}

export function PieChart({ numerator, denominator, size = 160, showLabels = true }: PieChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  if (denominator === 0) return null;

  // Special case: full circle
  if (numerator === denominator) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill={COLORS.filled} stroke="white" strokeWidth="2" />
        {showLabels && (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="bold" fill="white">
            {numerator}/{denominator}
          </text>
        )}
      </svg>
    );
  }

  // Special case: empty
  if (numerator === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill={COLORS.unfilled} stroke="white" strokeWidth="2" />
        {showLabels && (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="bold" fill="#9ca3af">
            0/{denominator}
          </text>
        )}
      </svg>
    );
  }

  const segments = [];
  for (let i = 0; i < denominator; i++) {
    const startAngle = (2 * Math.PI * i) / denominator - Math.PI / 2;
    const endAngle = (2 * Math.PI * (i + 1)) / denominator - Math.PI / 2;
    const isFilled = i < numerator;
    segments.push(
      <path
        key={i}
        d={describeArc(cx, cy, r, startAngle, endAngle)}
        fill={isFilled ? COLORS.filled : COLORS.unfilled}
        stroke="white"
        strokeWidth="2"
        className="transition-all duration-300"
      />
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments}
      {showLabels && (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="bold" fill={numerator > denominator / 2 ? 'white' : '#374151'}>
          {numerator}/{denominator}
        </text>
      )}
    </svg>
  );
}
