export interface LessonStepDef {
  id: string;
  tutorText: string;
  interaction?: 'slider' | 'tap' | 'input';
  target?: {
    numerator?: number;
    denominator?: number;
    percentage?: number;
    answer?: string;
    };
  hint?: string;
  ahaText?: string;
  showComponents?: string[];
  // If true, this step auto-advances when the target is met (no button needed)
  autoAdvance?: boolean;
  // For lesson 1: require trying all values
  requireAllValues?: number[];
  // For flexible matching: accept any of these numerators (for "make 50%" where 1/2, 2/4, 3/6 all work)
  acceptNumerators?: number[];
  // Special step types
  type?: 'explore' | 'challenge' | 'intro';
}

export interface LessonDef {
  id: number;
  tab: string; // tab path e.g. '/verken'
  title: string;
  steps: LessonStepDef[];
  // Which tabs unlock after completing this lesson
  unlocksTab?: string;
}

export const lessons: LessonDef[] = [
  // ===== LESSON 1: Wat is een breuk? (Verken tab) =====
  {
    id: 1,
    tab: '/verken',
    title: 'Wat is een breuk?',
    steps: [
      {
        id: '1-intro',
        type: 'intro',
        tutorText: 'Stel je voor: een pizza in 4 stukken. Je eet er 1 op. Dan heb je 1/4 gegeten!',
        showComponents: ['pie'],
      },
      {
        id: '1-explore',
        type: 'explore',
        tutorText: 'Schuif de teller om te zien hoeveel stukken je eet. De pizza heeft 4 stukken.',
        interaction: 'slider',
        showComponents: ['pie', 'numeratorSlider'],
        requireAllValues: [0, 1, 2, 3, 4],
        hint: 'Probeer alle waarden van 0 tot 4!',
      },
      {
        id: '1-done',
        type: 'intro',
        tutorText: 'Super! Je snapt nu wat een breuk is: het bovenste getal (teller) zegt hoeveel stukken je pakt, en het onderste getal (noemer) zegt in hoeveel stukken het verdeeld is.',
        ahaText: 'Teller = hoeveel je pakt. Noemer = hoeveel stukken er zijn!',
      },
    ],
  },

  // ===== LESSON 2: Meer stukken (Verken tab) =====
  {
    id: 2,
    tab: '/verken',
    title: 'Meer stukken',
    steps: [
      {
        id: '2-intro',
        type: 'intro',
        tutorText: 'Wat als je de pizza in meer stukken snijdt? Nu kun je ook de noemer veranderen!',
        showComponents: ['pie', 'numeratorSlider', 'denominatorSlider'],
      },
      {
        id: '2-guided',
        type: 'explore',
        tutorText: 'Zet de noemer op 8. Hoeveel stukken moet je eten voor de helft?',
        interaction: 'slider',
        target: { numerator: 4, denominator: 8 },
        showComponents: ['pie', 'numeratorSlider', 'denominatorSlider'],
        hint: 'Zet de noemer op 8 en probeer de teller...',
      },
      {
        id: '2-aha',
        type: 'intro',
        tutorText: '4/8 is hetzelfde als 2/4 en als 1/2. Het taartje ziet er precies hetzelfde uit!',
        ahaText: 'Hetzelfde deel, maar andere getallen! Dat noemen we gelijkwaardige breuken.',
        showComponents: ['pie'],
      },
      {
        id: '2-challenge',
        type: 'challenge',
        tutorText: 'Jouw beurt! Maak de helft met 6 stukken.',
        interaction: 'slider',
        target: { numerator: 3, denominator: 6 },
        showComponents: ['pie', 'numeratorSlider', 'denominatorSlider'],
        hint: 'Als je 6 stukken hebt, hoeveel is dan de helft?',
      },
    ],
  },

  // ===== LESSON 3: Drie vermommingen (Verken tab) =====
  {
    id: 3,
    tab: '/verken',
    title: 'Drie vermommingen',
    unlocksTab: '/percentage-van-getal',
    steps: [
      {
        id: '3-intro',
        type: 'intro',
        tutorText: 'Een getal kan drie vermommingen hebben: een breuk, een decimaal, en een percentage. Ze zeggen allemaal hetzelfde!',
        showComponents: ['pie', 'fractionBar', 'percentageBar', 'equivalence'],
      },
      {
        id: '3-guided',
        type: 'explore',
        tutorText: 'Zet 3/4 in. Kijk naar het taartje, de balk, en het percentage \u2014 ze zeggen allemaal hetzelfde!',
        interaction: 'slider',
        target: { numerator: 3, denominator: 4 },
        showComponents: ['pie', 'fractionBar', 'percentageBar', 'equivalence', 'numeratorSlider', 'denominatorSlider'],
        hint: 'Zet de teller op 3 en de noemer op 4.',
      },
      {
        id: '3-aha',
        type: 'intro',
        tutorText: 'Zie je? 3/4 = 0,75 = 75%. Drie manieren om hetzelfde te zeggen!',
        ahaText: '\u00be = 0,75 = 75% \u2014 \u00e9\u00e9n getal, drie vermommingen!',
        showComponents: ['pie', 'fractionBar', 'percentageBar', 'equivalence'],
      },
      {
        id: '3-challenge',
        type: 'challenge',
        tutorText: 'Welke breuk is 50%? Stel het in met de schuifjes!',
        interaction: 'slider',
        target: { percentage: 50 },
        acceptNumerators: [1, 2, 3, 4, 5, 6],
        showComponents: ['pie', 'fractionBar', 'percentageBar', 'equivalence', 'numeratorSlider', 'denominatorSlider'],
        hint: 'Welke breuk geeft precies de helft? Probeer 1/2, of 2/4, of 3/6...',
      },
      {
        id: '3-complete',
        type: 'intro',
        tutorText: 'Fantastisch! Je hebt de basis van breuken onder de knie. Tijd voor het volgende onderwerp!',
        ahaText: 'Verken is nu vrij om mee te spelen. En er is een nieuw tabblad!',
      },
    ],
  },

  // ===== LESSON 4: % van een getal (% van getal tab) =====
  {
    id: 4,
    tab: '/percentage-van-getal',
    title: '% van een getal',
    unlocksTab: '/vermomming',
    steps: [
      {
        id: '4-intro',
        type: 'intro',
        tutorText: 'Korting! Een spel kost \u20ac80. Je krijgt 50% korting. Hoeveel betaal je?',
        showComponents: ['fillingBar'],
      },
      {
        id: '4-guided',
        type: 'explore',
        tutorText: 'Zet het percentage op 50 en het getal op 80. Kijk hoe de balk zich vult!',
        interaction: 'slider',
        target: { percentage: 50 },
        showComponents: ['fillingBar', 'percentageSlider', 'numberSlider', 'steps'],
        hint: 'Schuif het percentage naar 50%.',
      },
      {
        id: '4-aha',
        type: 'intro',
        tutorText: '50% van 80 = 40. Dus je betaalt \u20ac40! Het trucje: vind eerst 1%, dan vermenigvuldig.',
        ahaText: 'Trucje: 1% = getal \u00f7 100. Dan vermenigvuldig je met het percentage!',
        showComponents: ['fillingBar', 'steps'],
      },
      {
        id: '4-quicktap',
        type: 'intro',
        tutorText: 'Deze 4 procenten moet je uit je hoofd kennen: 10%, 25%, 50% en 75%. Probeer ze met de snelknoppen!',
        showComponents: ['fillingBar', 'percentageSlider', 'numberSlider', 'quickButtons', 'steps'],
      },
      {
        id: '4-challenge1',
        type: 'challenge',
        tutorText: 'Hoeveel is 25% van 120? Stel het in!',
        interaction: 'slider',
        target: { percentage: 25 },
        showComponents: ['fillingBar', 'percentageSlider', 'numberSlider', 'steps'],
        hint: 'Zet het percentage op 25 en het getal op 120.',
      },
      {
        id: '4-challenge2',
        type: 'challenge',
        tutorText: 'En hoeveel is 10% van 70?',
        interaction: 'slider',
        target: { percentage: 10 },
        showComponents: ['fillingBar', 'percentageSlider', 'numberSlider', 'steps'],
        hint: 'Zet het percentage op 10 en het getal op 70.',
      },
      {
        id: '4-complete',
        type: 'intro',
        tutorText: 'Top! Je kunt nu procenten van getallen uitrekenen. Op naar de vermommingen!',
        ahaText: 'Nieuw tabblad ontgrendeld: Vermomming!',
      },
    ],
  },

  // ===== LESSON 5: De vermommingen (Vermomming tab) =====
  {
    id: 5,
    tab: '/vermomming',
    title: 'De vermommingen',
    unlocksTab: '/omrekenen',
    steps: [
      {
        id: '5-intro',
        type: 'intro',
        tutorText: 'Sommige procenten zien er lelijk uit... maar het zijn eigenlijk mooie breuken! Laten we ze ontmaskeren.',
      },
      {
        id: '5-halving',
        type: 'intro',
        tutorText: 'De halverings-familie: begin bij 1/2 = 50%. Halveer steeds: 1/4 = 25%, 1/8 = 12\u00bd%.',
        showComponents: ['family-halving'],
      },
      {
        id: '5-thirds',
        type: 'intro',
        tutorText: '33\u2153%? Dat is gewoon 1/3! Verdeel iets in 3 gelijke stukken. 2/3 = 66\u2154%.',
        showComponents: ['family-thirds'],
      },
      {
        id: '5-fifths',
        type: 'intro',
        tutorText: 'De vijfden zijn makkelijk: 1/5 = 20%, 2/5 = 40%, 3/5 = 60%, 4/5 = 80%.',
        showComponents: ['family-fifths'],
      },
      {
        id: '5-eighths',
        type: 'intro',
        tutorText: 'De achtsten: 1/8 = 12\u00bd%, 3/8 = 37\u00bd%, 5/8 = 62\u00bd%, 7/8 = 87\u00bd%.',
        showComponents: ['family-eighths'],
      },
      {
        id: '5-challenge',
        type: 'challenge',
        tutorText: 'Welke breuk verbergt zich achter 25%?',
        interaction: 'input',
        target: { answer: '1/4' },
        hint: 'Denk aan de halverings-familie...',
      },
      {
        id: '5-challenge2',
        type: 'challenge',
        tutorText: 'En welke breuk is 60%?',
        interaction: 'input',
        target: { answer: '3/5' },
        hint: 'Denk aan de vijfden-familie...',
      },
      {
        id: '5-complete',
        type: 'intro',
        tutorText: 'Je kent nu alle breukenfamilies! Op naar het omrekenen.',
        ahaText: 'Nieuw tabblad ontgrendeld: Omrekenen!',
      },
    ],
  },

  // ===== LESSON 6: Omrekenen (Omrekenen tab) =====
  {
    id: 6,
    tab: '/omrekenen',
    title: 'Omrekenen',
    unlocksTab: '/quiz',
    steps: [
      {
        id: '6-intro',
        type: 'intro',
        tutorText: 'Nu kun je zelf omrekenen tussen breuken en procenten. Eerst: van breuk naar procent!',
        showComponents: ['fractionToPercent'],
      },
      {
        id: '6-ftp-guided',
        type: 'explore',
        tutorText: 'Hoe maak je van 3/4 een percentage? Zet de teller op 3 en de noemer op 4. Kijk naar de stappen!',
        interaction: 'slider',
        target: { numerator: 3, denominator: 4 },
        showComponents: ['fractionToPercent', 'arrowDiagram', 'steps', 'numeratorSlider', 'denominatorSlider'],
        hint: 'Deel 3 door 4 = 0,75. Keer 100 = 75%.',
      },
      {
        id: '6-ftp-aha',
        type: 'intro',
        tutorText: '3 \u00f7 4 = 0,75. Dan \u00d7 100 = 75%. Zo simpel is het! Deel de teller door de noemer, en vermenigvuldig met 100.',
        ahaText: 'Breuk \u2192 procent: deel teller door noemer, \u00d7 100!',
        showComponents: ['fractionToPercent', 'arrowDiagram', 'steps'],
      },
      {
        id: '6-ptf-intro',
        type: 'intro',
        tutorText: 'Nu andersom: van procent naar breuk. Hoe maak je van 60% een breuk?',
        showComponents: ['percentToFraction'],
      },
      {
        id: '6-ptf-guided',
        type: 'explore',
        tutorText: 'Zet het percentage op 60. Schrijf het als 60/100 en vereenvoudig!',
        interaction: 'slider',
        target: { percentage: 60 },
        showComponents: ['percentToFraction', 'arrowDiagram', 'steps', 'percentSlider'],
        hint: 'Schuif naar 60%. 60/100 = 3/5.',
      },
      {
        id: '6-ptf-aha',
        type: 'intro',
        tutorText: '60% = 60/100. De GGD van 60 en 100 is 20. Dus 60\u00f720 / 100\u00f720 = 3/5!',
        ahaText: 'Procent \u2192 breuk: schrijf als ../100, dan vereenvoudig!',
        showComponents: ['percentToFraction', 'arrowDiagram', 'steps'],
      },
      {
        id: '6-complete',
        type: 'intro',
        tutorText: 'Je kunt nu omrekenen! Tijd voor de quiz!',
        ahaText: 'Nieuw tabblad ontgrendeld: Quiz!',
      },
    ],
  },

  // ===== LESSON 7: Quiz intro =====
  {
    id: 7,
    tab: '/quiz',
    title: 'Klaar voor de quiz!',
    steps: [
      {
        id: '7-intro',
        type: 'intro',
        tutorText: 'Je hebt alles geleerd over breuken, procenten en vermommingen. Tijd om het te testen!',
      },
      {
        id: '7-start',
        type: 'intro',
        tutorText: 'De quiz past zich aan jouw niveau aan. Begin makkelijk, en het wordt steeds moeilijker. Succes!',
        ahaText: 'Druk op "Start de quiz" om te beginnen!',
      },
    ],
  },
];

// Map: which tab has which lesson IDs
export const tabLessons: Record<string, number[]> = {
  '/verken': [1, 2, 3],
  '/percentage-van-getal': [4],
  '/vermomming': [5],
  '/omrekenen': [6],
  '/quiz': [7],
};

// Map: which lesson unlocks which tab
export const lessonUnlocks: Record<number, string> = {};
for (const lesson of lessons) {
  if (lesson.unlocksTab) {
    lessonUnlocks[lesson.id] = lesson.unlocksTab;
  }
}
