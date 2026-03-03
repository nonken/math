import { simplify, fractionToPercent, formatMixedFraction } from '@/lib/math/fractions';
import { fractionFamilies } from '@/lib/math/families';
import type { SkillKey } from '@/lib/progress/types';
import type { QuizQuestion, QuestionFormat } from './questionTypes';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// Difficulty → denominator range
function denomRange(difficulty: number): number[] {
  if (difficulty <= 2) return [2, 4, 5];
  if (difficulty <= 4) return [2, 3, 4, 5, 8, 10];
  if (difficulty <= 6) return [2, 3, 4, 5, 6, 8, 10, 12];
  return [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 16, 20];
}

function formatForAnswer(difficulty: number): QuestionFormat {
  if (difficulty <= 2) return 'multipleChoice';
  if (difficulty <= 4) return Math.random() > 0.5 ? 'multipleChoice' : 'freeInput';
  return 'freeInput';
}

function generateWrongPercents(correct: number, count: number): string[] {
  const wrongs = new Set<string>();
  const correctStr = correct % 1 === 0 ? correct.toFixed(0) : parseFloat(correct.toFixed(2)).toString();

  while (wrongs.size < count) {
    const offset = randomInt(1, 3) * (Math.random() > 0.5 ? 10 : 5) * (Math.random() > 0.5 ? 1 : -1);
    const wrong = correct + offset;
    if (wrong > 0 && wrong <= 100 && wrong !== correct) {
      const wrongStr = wrong % 1 === 0 ? wrong.toFixed(0) : parseFloat(wrong.toFixed(2)).toString();
      if (wrongStr !== correctStr) {
        wrongs.add(wrongStr + '%');
      }
    }
  }
  return Array.from(wrongs);
}

function generateWrongFractions(correctNum: number, correctDen: number, count: number): string[] {
  const wrongs = new Set<string>();
  const correctStr = `${correctNum}/${correctDen}`;

  while (wrongs.size < count) {
    const n = randomInt(1, correctDen);
    const d = correctDen + randomInt(-2, 2);
    if (d > 1 && n <= d) {
      const [sn, sd] = simplify(n, d);
      const str = `${sn}/${sd}`;
      if (str !== correctStr) {
        wrongs.add(str);
      }
    }
  }
  return Array.from(wrongs);
}

// Generate: "What percentage is n/d?"
function genFractionToPercent(difficulty: number): QuizQuestion {
  const denoms = denomRange(difficulty);
  const d = denoms[randomInt(0, denoms.length - 1)];
  const n = randomInt(1, d);
  const percent = fractionToPercent(n, d);
  const percentStr = formatMixedFraction(percent);
  const format = formatForAnswer(difficulty);

  const correctAnswer = percentStr + '%';
  const acceptableAnswers = [
    correctAnswer,
    percent.toFixed(0) + '%',
    parseFloat(percent.toFixed(2)).toString() + '%',
    percentStr,
    percent.toFixed(0),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const options = format === 'multipleChoice'
    ? shuffle([correctAnswer, ...generateWrongPercents(percent, 3)])
    : undefined;

  return {
    id: uid(),
    skill: 'fractionToPercent',
    difficulty,
    format,
    prompt: `Welk percentage is ${n}/${d}?`,
    correctAnswer,
    acceptableAnswers,
    options,
    explanation: `${n}/${d} = ${n} ÷ ${d} = ${parseFloat((n / d).toFixed(4))} = ${percentStr}%`,
    visual: { type: 'pie', numerator: n, denominator: d },
  };
}

// Generate: "What fraction is X%?"
function genPercentToFraction(difficulty: number): QuizQuestion {
  const denoms = denomRange(difficulty);
  const d = denoms[randomInt(0, denoms.length - 1)];
  const n = randomInt(1, d);
  const [sn, sd] = simplify(n, d);
  const percent = fractionToPercent(n, d);
  const percentStr = formatMixedFraction(percent);
  const format = formatForAnswer(difficulty);

  const correctAnswer = `${sn}/${sd}`;
  const acceptableAnswers = [correctAnswer, `${n}/${d}`];

  const options = format === 'multipleChoice'
    ? shuffle([correctAnswer, ...generateWrongFractions(sn, sd, 3)])
    : undefined;

  return {
    id: uid(),
    skill: 'percentToFraction',
    difficulty,
    format,
    prompt: `Welke breuk is ${percentStr}%?`,
    correctAnswer,
    acceptableAnswers,
    options,
    explanation: `${percentStr}% = ${percentStr}/100 = ${sn}/${sd} (vereenvoudigd)`,
    visual: { type: 'pie', numerator: sn, denominator: sd },
  };
}

// Generate: "What is X% of Y?"
function genPercentOfNumber(difficulty: number): QuizQuestion {
  const percents = difficulty <= 3
    ? [10, 25, 50, 75]
    : difficulty <= 6
      ? [5, 10, 15, 20, 25, 30, 40, 50, 60, 75]
      : [5, 10, 12.5, 15, 20, 25, 30, 33.3, 37.5, 40, 50, 60, 62.5, 66.7, 75, 80, 87.5, 90];

  const p = percents[randomInt(0, percents.length - 1)];
  const maxNum = difficulty <= 3 ? 100 : difficulty <= 6 ? 200 : 500;
  const y = randomInt(2, maxNum / 10) * 10; // Keep numbers round-ish
  const result = (p / 100) * y;
  const resultStr = result % 1 === 0 ? result.toFixed(0) : parseFloat(result.toFixed(2)).toString();
  const format = formatForAnswer(difficulty);

  const correctAnswer = resultStr;
  const acceptableAnswers = [resultStr, result.toFixed(0), parseFloat(result.toFixed(4)).toString()];

  let options: string[] | undefined;
  if (format === 'multipleChoice') {
    const wrongs = new Set<string>();
    while (wrongs.size < 3) {
      const offset = randomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1) * (y / 10);
      const wrong = result + offset;
      if (wrong > 0) {
        const wrongStr = wrong % 1 === 0 ? wrong.toFixed(0) : parseFloat(wrong.toFixed(2)).toString();
        if (wrongStr !== resultStr) wrongs.add(wrongStr);
      }
    }
    options = shuffle([correctAnswer, ...Array.from(wrongs)]);
  }

  return {
    id: uid(),
    skill: 'percentOfNumber',
    difficulty,
    format,
    prompt: `Hoeveel is ${formatMixedFraction(p)}% van ${y}?`,
    correctAnswer,
    acceptableAnswers,
    options,
    explanation: `${formatMixedFraction(p)}% van ${y} = ${y} ÷ 100 × ${formatMixedFraction(p)} = ${resultStr}`,
    visual: { type: 'percentage', percentage: p },
  };
}

// Generate: "Which fraction hides behind X%?"
function genUglyPercentage(difficulty: number): QuizQuestion {
  const allMembers = fractionFamilies.flatMap((f) =>
    f.members.filter((m) => m.percent % 1 !== 0 || (difficulty >= 3 && m.percent % 10 !== 0))
  );
  const member = allMembers[randomInt(0, allMembers.length - 1)];
  const format = formatForAnswer(difficulty);

  const correctAnswer = `${member.fraction[0]}/${member.fraction[1]}`;
  const acceptableAnswers = [correctAnswer];

  const options = format === 'multipleChoice'
    ? shuffle([correctAnswer, ...generateWrongFractions(member.fraction[0], member.fraction[1], 3)])
    : undefined;

  return {
    id: uid(),
    skill: 'uglyPercentages',
    difficulty,
    format,
    prompt: `Welke breuk verbergt zich achter ${member.percentDisplay}?`,
    correctAnswer,
    acceptableAnswers,
    options,
    explanation: `${member.percentDisplay} = ${member.fraction[0]}/${member.fraction[1]}. Dit komt uit de ${fractionFamilies.find((f) => f.members.includes(member))?.name || 'familie'}.`,
    visual: { type: 'pie', numerator: member.fraction[0], denominator: member.fraction[1] },
  };
}

// Generate: "Simplify n/d"
function genSimplify(difficulty: number): QuizQuestion {
  const denoms = denomRange(difficulty);
  const d = denoms[randomInt(0, denoms.length - 1)];
  const n = randomInt(1, d);
  const [sn, sd] = simplify(n, d);

  // Make sure there's actually something to simplify
  const multiplier = randomInt(2, difficulty <= 4 ? 3 : 5);
  const unsimpN = sn * multiplier;
  const unsimpD = sd * multiplier;
  const format = formatForAnswer(difficulty);

  const correctAnswer = `${sn}/${sd}`;
  const acceptableAnswers = [correctAnswer];

  const options = format === 'multipleChoice'
    ? shuffle([correctAnswer, ...generateWrongFractions(sn, sd, 3)])
    : undefined;

  return {
    id: uid(),
    skill: 'simplification',
    difficulty,
    format,
    prompt: `Vereenvoudig ${unsimpN}/${unsimpD}`,
    correctAnswer,
    acceptableAnswers,
    options,
    explanation: `GGD(${unsimpN}, ${unsimpD}) = ${multiplier}. Dus ${unsimpN}÷${multiplier} / ${unsimpD}÷${multiplier} = ${sn}/${sd}`,
    visual: { type: 'pie', numerator: sn, denominator: sd },
  };
}

type QuestionGenerator = (difficulty: number) => QuizQuestion;

const generators: { skill: SkillKey; gen: QuestionGenerator; minDifficulty: number }[] = [
  { skill: 'fractionToPercent', gen: genFractionToPercent, minDifficulty: 1 },
  { skill: 'percentToFraction', gen: genPercentToFraction, minDifficulty: 1 },
  { skill: 'percentOfNumber', gen: genPercentOfNumber, minDifficulty: 1 },
  { skill: 'uglyPercentages', gen: genUglyPercentage, minDifficulty: 2 },
  { skill: 'simplification', gen: genSimplify, minDifficulty: 2 },
];

export function generateQuestion(
  difficulty: number,
  recentSkills: SkillKey[] = [],
  skillMasteries: Partial<Record<SkillKey, number>> = {}
): QuizQuestion {
  // Filter to available generators for this difficulty
  const available = generators.filter((g) => g.minDifficulty <= difficulty);

  // Weight inversely by mastery (practice weak areas more)
  const weighted = available.map((g) => ({
    ...g,
    weight: Math.max(1, 10 - (skillMasteries[g.skill] || 0)),
  }));

  // Penalize recently used skills
  const last2 = recentSkills.slice(-2);
  weighted.forEach((w) => {
    if (last2.includes(w.skill)) w.weight *= 0.2;
  });

  // Weighted random selection
  const totalWeight = weighted.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * totalWeight;
  let selected = weighted[0];
  for (const w of weighted) {
    r -= w.weight;
    if (r <= 0) {
      selected = w;
      break;
    }
  }

  return selected.gen(difficulty);
}

export function checkAnswer(question: QuizQuestion, answer: string): boolean {
  const normalized = answer.trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
  return question.acceptableAnswers.some(
    (a) => a.trim().toLowerCase().replace(/\s+/g, '').replace(',', '.') === normalized
  );
}
