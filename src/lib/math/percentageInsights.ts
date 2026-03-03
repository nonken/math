export interface InsightStep {
  label: string;
  calculation: string;
  result: string;
  highlight?: boolean;
}

export interface PercentageBreakdown {
  identity: string;
  fraction?: [number, number];
  steps: InsightStep[];
  tip?: string;
}

function fmt(n: number): string {
  if (n % 1 === 0) return n.toFixed(0);
  // Show up to 2 decimals, strip trailing zeros
  return parseFloat(n.toFixed(2)).toString();
}

export function getPercentageBreakdown(percentage: number, total: number): PercentageBreakdown {
  const result = (percentage / 100) * total;
  const r = fmt(result);

  // Edge cases
  if (percentage === 0) {
    return {
      identity: '0% = niks!',
      steps: [{ label: `0% van ${total}`, calculation: '', result: '0', highlight: true }],
    };
  }
  if (percentage === 100) {
    return {
      identity: '100% = alles',
      fraction: [1, 1],
      steps: [{ label: `Alles van ${total}`, calculation: '', result: fmt(total), highlight: true }],
    };
  }

  // === TIER 1: Direct shortcuts (the big three) ===

  if (percentage === 50) {
    return {
      identity: '50% = \u00bd = de helft',
      fraction: [1, 2],
      steps: [
        { label: `De helft van ${total}`, calculation: `${total} \u00f7 2`, result: r, highlight: true },
      ],
      tip: '50% \u2192 deel door 2',
    };
  }

  if (percentage === 25) {
    return {
      identity: '25% = \u00bc = een kwart',
      fraction: [1, 4],
      steps: [
        { label: `Een kwart van ${total}`, calculation: `${total} \u00f7 4`, result: r, highlight: true },
      ],
      tip: '25% \u2192 deel door 4',
    };
  }

  if (percentage === 10) {
    return {
      identity: '10% = 1/10 = een tiende',
      fraction: [1, 10],
      steps: [
        { label: `Een tiende van ${total}`, calculation: `${total} \u00f7 10`, result: r, highlight: true },
      ],
      tip: '10% \u2192 deel door 10 (schuif de komma!)',
    };
  }

  // === TIER 2: One step from the big three ===

  if (percentage === 75) {
    const q = total / 4;
    return {
      identity: '75% = \u00be = drie kwart',
      fraction: [3, 4],
      steps: [
        { label: 'Eerst een kwart (25%)', calculation: `${total} \u00f7 4`, result: fmt(q) },
        { label: 'Dan drie kwart', calculation: `3 \u00d7 ${fmt(q)}`, result: r, highlight: true },
      ],
      tip: '75% = 3 \u00d7 25%',
    };
  }

  if (percentage === 20) {
    const t10 = total / 10;
    return {
      identity: '20% = \u2155 = een vijfde',
      fraction: [1, 5],
      steps: [
        { label: 'Eerst 10%', calculation: `${total} \u00f7 10`, result: fmt(t10) },
        { label: 'Verdubbel', calculation: `2 \u00d7 ${fmt(t10)}`, result: r, highlight: true },
      ],
      tip: '20% = 2 \u00d7 10%',
    };
  }

  if (percentage === 5) {
    const t10 = total / 10;
    return {
      identity: '5% = de helft van 10%',
      fraction: [1, 20],
      steps: [
        { label: 'Eerst 10%', calculation: `${total} \u00f7 10`, result: fmt(t10) },
        { label: 'Halveer', calculation: `${fmt(t10)} \u00f7 2`, result: r, highlight: true },
      ],
      tip: '5% = 10% \u00f7 2',
    };
  }

  if (percentage === 1) {
    return {
      identity: '1% = 1/100',
      fraction: [1, 100],
      steps: [
        { label: `Een honderdste van ${total}`, calculation: `${total} \u00f7 100`, result: r, highlight: true },
      ],
      tip: '1% \u2192 deel door 100',
    };
  }

  // === TIER 3: Well-known compositions ===

  // 15% = 10% + 5%
  if (percentage === 15) {
    const t10 = total / 10;
    const t5 = t10 / 2;
    return {
      identity: '15% = 10% + 5%',
      steps: [
        { label: '10%', calculation: `${total} \u00f7 10`, result: fmt(t10) },
        { label: '+ 5% (helft van 10%)', calculation: `${fmt(t10)} \u00f7 2`, result: fmt(t5) },
        { label: 'Samen', calculation: `${fmt(t10)} + ${fmt(t5)}`, result: r, highlight: true },
      ],
    };
  }

  // 33% ≈ 1/3
  if (percentage === 33) {
    const third = total / 3;
    return {
      identity: '33% \u2248 \u2153 = een derde',
      fraction: [1, 3],
      steps: [
        { label: `Een derde van ${total}`, calculation: `${total} \u00f7 3`, result: fmt(third), highlight: true },
      ],
      tip: '33\u2153% = deel door 3',
    };
  }

  if (percentage === 66 || percentage === 67) {
    const third = total / 3;
    return {
      identity: '66\u2154% \u2248 \u2154 = twee derde',
      fraction: [2, 3],
      steps: [
        { label: 'Eerst een derde', calculation: `${total} \u00f7 3`, result: fmt(third) },
        { label: 'Dan twee derde', calculation: `2 \u00d7 ${fmt(third)}`, result: fmt(third * 2), highlight: true },
      ],
      tip: '66\u2154% = 2 \u00d7 (deel door 3)',
    };
  }

  // === TIER 4: Multiples of 10 ===
  if (percentage % 10 === 0 && percentage > 0 && percentage < 100) {
    const t10 = total / 10;
    const mult = percentage / 10;
    return {
      identity: `${percentage}% = ${mult} \u00d7 10%`,
      steps: [
        { label: 'Eerst 10%', calculation: `${total} \u00f7 10`, result: fmt(t10) },
        { label: `${mult} keer 10%`, calculation: `${mult} \u00d7 ${fmt(t10)}`, result: r, highlight: true },
      ],
    };
  }

  // === TIER 5: Tens + 5 (e.g., 35% = 3×10% + 5%, 45% = 4×10% + 5%) ===
  if (percentage % 5 === 0 && percentage > 0 && percentage < 100) {
    const tens = Math.floor(percentage / 10);
    const t10 = total / 10;
    const t5 = t10 / 2;
    const tensTotal = tens * t10;
    const steps: InsightStep[] = [];

    if (tens > 0) {
      steps.push({ label: `${tens} \u00d7 10%`, calculation: `${tens} \u00d7 ${fmt(t10)}`, result: fmt(tensTotal) });
    }
    steps.push({ label: '+ 5% (helft van 10%)', calculation: `+ ${fmt(t5)}`, result: fmt(t5) });
    steps.push({ label: 'Samen', calculation: `${fmt(tensTotal)} + ${fmt(t5)}`, result: r, highlight: true });

    return {
      identity: `${percentage}% = ${tens > 0 ? `${tens}\u00d710%` : ''} + 5%`,
      steps,
    };
  }

  // === FALLBACK: 1% method (still visual) ===
  const onePct = total / 100;
  return {
    identity: `${percentage}% = ${percentage} \u00d7 1%`,
    steps: [
      { label: 'Eerst 1%', calculation: `${total} \u00f7 100`, result: fmt(onePct) },
      { label: `${percentage} keer`, calculation: `${percentage} \u00d7 ${fmt(onePct)}`, result: r, highlight: true },
    ],
    tip: 'Voor elk percentage: vind 1%, dan vermenigvuldig!',
  };
}
