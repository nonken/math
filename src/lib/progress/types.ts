export type SkillKey =
  | 'fractionReading'
  | 'fractionToDecimal'
  | 'fractionToPercent'
  | 'percentOfNumber'
  | 'uglyPercentages'
  | 'simplification'
  | 'percentToFraction';

export interface SkillRecord {
  attempts: number;
  correct: number;
  masteryLevel: number;
}

export interface AnswerRecord {
  skill: SkillKey;
  correct: boolean;
  difficulty: number;
  timestamp: number;
}

export interface QuizStats {
  totalQuestions: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  currentDifficulty: number;
  recentAnswers: AnswerRecord[];
}

export interface ProgressData {
  skills: Record<SkillKey, SkillRecord>;
  quiz: QuizStats;
}

export const DEFAULT_SKILL: SkillRecord = {
  attempts: 0,
  correct: 0,
  masteryLevel: 0,
};

export const DEFAULT_PROGRESS: ProgressData = {
  skills: {
    fractionReading: { ...DEFAULT_SKILL },
    fractionToDecimal: { ...DEFAULT_SKILL },
    fractionToPercent: { ...DEFAULT_SKILL },
    percentOfNumber: { ...DEFAULT_SKILL },
    uglyPercentages: { ...DEFAULT_SKILL },
    simplification: { ...DEFAULT_SKILL },
    percentToFraction: { ...DEFAULT_SKILL },
  },
  quiz: {
    totalQuestions: 0,
    totalCorrect: 0,
    currentStreak: 0,
    bestStreak: 0,
    currentDifficulty: 1,
    recentAnswers: [],
  },
};
