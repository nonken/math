import type { SkillKey } from '@/lib/progress/types';

export type QuestionFormat = 'multipleChoice' | 'freeInput';

export interface QuizQuestion {
  id: string;
  skill: SkillKey;
  difficulty: number;
  format: QuestionFormat;
  prompt: string;
  correctAnswer: string;
  acceptableAnswers: string[]; // All valid string representations
  options?: string[]; // For multiple choice
  explanation: string;
  // Visual hint data
  visual?: {
    type: 'pie' | 'bar' | 'percentage';
    numerator?: number;
    denominator?: number;
    percentage?: number;
  };
}
