import { gcd, simplify } from './fractions';

export interface ConversionStep {
  description: string;
  expression: string;
  result: string;
}

export function fractionToPercentSteps(numerator: number, denominator: number): ConversionStep[] {
  const decimal = numerator / denominator;
  const percent = decimal * 100;

  const decimalStr = decimal % 1 === 0
    ? decimal.toFixed(0)
    : parseFloat(decimal.toFixed(6)).toString();
  const percentStr = percent % 1 === 0
    ? percent.toFixed(0)
    : parseFloat(percent.toFixed(4)).toString();

  return [
    {
      description: `Deel de teller door de noemer`,
      expression: `${numerator} ÷ ${denominator}`,
      result: decimalStr,
    },
    {
      description: `Vermenigvuldig met 100`,
      expression: `${decimalStr} × 100`,
      result: `${percentStr}%`,
    },
  ];
}

export function percentToFractionSteps(percent: number): ConversionStep[] {
  const steps: ConversionStep[] = [];

  const percentStr = percent % 1 === 0
    ? percent.toFixed(0)
    : parseFloat(percent.toFixed(4)).toString();

  // Step 1: Write as fraction over 100
  let num = percent;
  let den = 100;

  // Handle decimals in percent
  if (percent % 1 !== 0) {
    const decimalPlaces = percent.toString().split('.')[1]?.length || 0;
    const factor = Math.pow(10, decimalPlaces);
    num = Math.round(percent * factor);
    den = 100 * factor;
    steps.push({
      description: 'Schrijf als breuk (verwijder de komma)',
      expression: `${percentStr}% = ${percentStr}/100`,
      result: `${num}/${den}`,
    });
  } else {
    steps.push({
      description: 'Schrijf als breuk over 100',
      expression: `${percentStr}%`,
      result: `${Math.round(percent)}/100`,
    });
    num = Math.round(percent);
  }

  // Step 2: Find GCD
  const d = gcd(num, den);
  if (d > 1) {
    steps.push({
      description: `Zoek de GGD van ${num} en ${den}`,
      expression: `GGD(${num}, ${den})`,
      result: `${d}`,
    });

    // Step 3: Simplify
    const [sNum, sDen] = simplify(num, den);
    steps.push({
      description: `Deel teller en noemer door ${d}`,
      expression: `${num}÷${d} / ${den}÷${d}`,
      result: `${sNum}/${sDen}`,
    });
  }

  return steps;
}

export function percentOfNumberSteps(percent: number, number: number): ConversionStep[] {
  const onePercent = number / 100;
  const result = onePercent * percent;

  const onePercentStr = onePercent % 1 === 0
    ? onePercent.toFixed(0)
    : parseFloat(onePercent.toFixed(4)).toString();
  const resultStr = result % 1 === 0
    ? result.toFixed(0)
    : parseFloat(result.toFixed(4)).toString();

  return [
    {
      description: `Vind 1% van ${number} (deel door 100)`,
      expression: `${number} ÷ 100`,
      result: onePercentStr,
    },
    {
      description: `Vermenigvuldig met ${percent}`,
      expression: `${onePercentStr} × ${percent}`,
      result: resultStr,
    },
    {
      description: 'Het antwoord',
      expression: `${percent}% van ${number}`,
      result: resultStr,
    },
  ];
}
