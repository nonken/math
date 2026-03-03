export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function simplify(numerator: number, denominator: number): [number, number] {
  if (denominator === 0) return [numerator, denominator];
  const d = gcd(numerator, denominator);
  return [numerator / d, denominator / d];
}

export function fractionToDecimal(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return numerator / denominator;
}

export function fractionToPercent(numerator: number, denominator: number): number {
  return fractionToDecimal(numerator, denominator) * 100;
}

export function percentToFraction(percent: number): [number, number] {
  // Handle common repeating decimals
  const specialCases: Record<number, [number, number]> = {
    33.333333333333336: [1, 3],
    66.66666666666667: [2, 3],
    16.666666666666668: [1, 6],
    83.33333333333333: [5, 6],
    14.285714285714286: [1, 7],
    28.571428571428573: [2, 7],
    11.111111111111111: [1, 9],
  };

  for (const [key, value] of Object.entries(specialCases)) {
    if (Math.abs(percent - Number(key)) < 0.0001) return value;
  }

  // Handle percentages with .5 (like 12.5%, 37.5%)
  if (percent % 1 === 0.5 || percent % 1 === 0.25 || percent % 1 === 0.75) {
    const multiplied = percent * 4;
    return simplify(Math.round(multiplied), 400);
  }

  if (percent % 1 !== 0) {
    // Multiply to remove decimals
    const decimalPlaces = percent.toString().split('.')[1]?.length || 0;
    const factor = Math.pow(10, decimalPlaces);
    return simplify(Math.round(percent * factor), 100 * factor);
  }

  return simplify(Math.round(percent), 100);
}

export function decimalToFraction(decimal: number): [number, number] {
  return percentToFraction(decimal * 100);
}

export function formatFraction(numerator: number, denominator: number): string {
  return `${numerator}/${denominator}`;
}

export function formatMixedFraction(percent: number): string {
  // Format special percentages nicely
  if (Math.abs(percent - 33.333333333333336) < 0.01) return '33⅓';
  if (Math.abs(percent - 66.666666666666667) < 0.01) return '66⅔';
  if (Math.abs(percent - 16.666666666666668) < 0.01) return '16⅔';
  if (percent % 1 === 0.5) return `${Math.floor(percent)}½`;
  if (percent % 1 === 0.25) return `${Math.floor(percent)}¼`;
  if (percent % 1 === 0.75) return `${Math.floor(percent)}¾`;
  if (percent % 1 === 0) return percent.toString();
  return parseFloat(percent.toFixed(4)).toString();
}
