export const TAB_ROUTES = [
  { path: '/verken', label: 'Verken', icon: '🔍' },
  { path: '/percentage-van-getal', label: '% van getal', icon: '%' },
  { path: '/vermomming', label: 'Vermomming', icon: '🎭' },
  { path: '/omrekenen', label: 'Omrekenen', icon: '↔' },
  { path: '/quiz', label: 'Quiz', icon: '🧠' },
] as const;

export const COLORS = {
  filled: '#10b981',
  filledLight: '#d1fae5',
  unfilled: '#e5e7eb',
  primary: '#2563eb',
  primaryLight: '#dbeafe',
  accent: '#f59e0b',
  error: '#ef4444',
  errorLight: '#fee2e2',
} as const;

export const QUICK_PERCENTAGES = [10, 25, 50, 75] as const;

export const MAX_DENOMINATOR_EXPLORE = 12;
export const MAX_DENOMINATOR_QUIZ = 20;
