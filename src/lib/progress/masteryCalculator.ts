import type { AnswerRecord, SkillKey } from './types';

export function calculateMastery(skill: SkillKey, recentAnswers: AnswerRecord[]): number {
  const skillAnswers = recentAnswers
    .filter((a) => a.skill === skill)
    .slice(-10);

  if (skillAnswers.length < 3) return 0;

  const correctRate = skillAnswers.filter((a) => a.correct).length / skillAnswers.length;
  const avgDifficulty = skillAnswers.reduce((s, a) => s + a.difficulty, 0) / skillAnswers.length;

  return Math.round(correctRate * avgDifficulty);
}

function countTrailingCorrect(answers: AnswerRecord[]): number {
  let count = 0;
  for (let i = answers.length - 1; i >= 0; i--) {
    if (answers[i].correct) count++;
    else break;
  }
  return count;
}

function countTrailingWrong(answers: AnswerRecord[]): number {
  let count = 0;
  for (let i = answers.length - 1; i >= 0; i--) {
    if (!answers[i].correct) count++;
    else break;
  }
  return count;
}

export function calculateNewDifficulty(
  currentDifficulty: number,
  recentAnswers: AnswerRecord[]
): number {
  const last10 = recentAnswers.slice(-10);
  if (last10.length < 3) return currentDifficulty;

  const correctRate = last10.filter((a) => a.correct).length / last10.length;
  const lastConsecutiveCorrect = countTrailingCorrect(last10);
  const lastConsecutiveWrong = countTrailingWrong(last10);

  let newDifficulty = currentDifficulty;

  // Increase difficulty
  if (lastConsecutiveCorrect >= 5) {
    newDifficulty = Math.min(10, currentDifficulty + 2);
  } else if (lastConsecutiveCorrect >= 3 && correctRate >= 0.8) {
    newDifficulty = Math.min(10, currentDifficulty + 1);
  }

  // Decrease difficulty
  if (lastConsecutiveWrong >= 3) {
    newDifficulty = Math.max(1, currentDifficulty - 2);
  } else if (correctRate < 0.4 && last10.length >= 5) {
    newDifficulty = Math.max(1, currentDifficulty - 1);
  }

  return newDifficulty;
}
