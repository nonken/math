'use client';

interface MathDisplayProps {
  numerator: number;
  denominator: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: { num: 'text-sm', line: 'w-6', den: 'text-sm' },
  md: { num: 'text-lg', line: 'w-8', den: 'text-lg' },
  lg: { num: 'text-2xl', line: 'w-12', den: 'text-2xl' },
};

export function MathDisplay({ numerator, denominator, size = 'md' }: MathDisplayProps) {
  const cls = sizeClasses[size];

  return (
    <span className="inline-flex flex-col items-center mx-1">
      <span className={`${cls.num} font-bold text-primary leading-tight`}>{numerator}</span>
      <span className={`${cls.line} h-0.5 bg-primary rounded-full my-0.5`} />
      <span className={`${cls.den} font-bold text-primary leading-tight`}>{denominator}</span>
    </span>
  );
}
