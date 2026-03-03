export interface FamilyMember {
  fraction: [number, number]; // [numerator, denominator]
  percent: number;
  percentDisplay: string;
}

export interface FractionFamily {
  id: string;
  name: string;
  explanation: string;
  color: string;
  members: FamilyMember[];
}

export const fractionFamilies: FractionFamily[] = [
  {
    id: 'halving',
    name: 'De halverings-familie',
    explanation:
      'Begin bij 100% (= 1 heel). Halveer steeds: 50%, 25%, 12½%, 6¼%. Elke stap is de helft van de vorige.',
    color: '#3b82f6', // blue
    members: [
      { fraction: [1, 2], percent: 50, percentDisplay: '50%' },
      { fraction: [1, 4], percent: 25, percentDisplay: '25%' },
      { fraction: [1, 8], percent: 12.5, percentDisplay: '12½%' },
      { fraction: [1, 16], percent: 6.25, percentDisplay: '6¼%' },
    ],
  },
  {
    id: 'thirds',
    name: 'De derden-familie',
    explanation:
      'Verdeel 100% in 3 gelijke stukken. Elk stuk is 33⅓%. Twee stukken = 66⅔%. De helft van een derde = 16⅔%.',
    color: '#8b5cf6', // purple
    members: [
      { fraction: [1, 3], percent: 100 / 3, percentDisplay: '33⅓%' },
      { fraction: [2, 3], percent: 200 / 3, percentDisplay: '66⅔%' },
      { fraction: [1, 6], percent: 100 / 6, percentDisplay: '16⅔%' },
      { fraction: [5, 6], percent: 500 / 6, percentDisplay: '83⅓%' },
    ],
  },
  {
    id: 'fifths',
    name: 'De vijfden-familie',
    explanation:
      '100% gedeeld door 5 = 20%. Dat is makkelijk! 2/5 = 40%, 3/5 = 60%, 4/5 = 80%. De vijfden-familie is de makkelijkste.',
    color: '#10b981', // green
    members: [
      { fraction: [1, 5], percent: 20, percentDisplay: '20%' },
      { fraction: [2, 5], percent: 40, percentDisplay: '40%' },
      { fraction: [3, 5], percent: 60, percentDisplay: '60%' },
      { fraction: [4, 5], percent: 80, percentDisplay: '80%' },
    ],
  },
  {
    id: 'eighths',
    name: 'De achtsten-familie',
    explanation:
      'Halveer 25% en je krijgt 12½%. Elke achtste = 12½%. Drie achtsten = 37½%, vijf = 62½%, zeven = 87½%.',
    color: '#f59e0b', // amber
    members: [
      { fraction: [1, 8], percent: 12.5, percentDisplay: '12½%' },
      { fraction: [3, 8], percent: 37.5, percentDisplay: '37½%' },
      { fraction: [5, 8], percent: 62.5, percentDisplay: '62½%' },
      { fraction: [7, 8], percent: 87.5, percentDisplay: '87½%' },
    ],
  },
];
