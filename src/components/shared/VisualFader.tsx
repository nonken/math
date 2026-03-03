'use client';

import { useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import type { SkillKey } from '@/lib/progress/types';
import { t } from '@/lib/i18n';

interface VisualFaderProps {
  skill: SkillKey;
  children: React.ReactNode;
  forceVisible?: boolean;
}

export function VisualFader({ skill, children, forceVisible = false }: VisualFaderProps) {
  const { getMasteryLevel } = useProgress();
  const mastery = getMasteryLevel(skill);
  const [manualShow, setManualShow] = useState(false);

  if (forceVisible || manualShow) {
    return (
      <div className="relative">
        {children}
        {manualShow && (
          <button
            onClick={() => setManualShow(false)}
            className="mt-1 text-xs text-gray-500 underline"
          >
            {t.mastery.hideHelp}
          </button>
        )}
      </div>
    );
  }

  // Mastery 0-2: full visibility
  if (mastery <= 2) {
    return <div>{children}</div>;
  }

  // Mastery 3-4: reduced opacity with encouragement
  if (mastery <= 4) {
    return (
      <div className="relative">
        <div
          className="transition-opacity duration-500"
          style={{ opacity: 0.7 - (mastery - 3) * 0.15 }}
        >
          {children}
        </div>
        <p className="text-xs text-gray-400 italic mt-1">
          {t.mastery.encouragement}
        </p>
      </div>
    );
  }

  // Mastery 5-6: ghosted with toggle
  if (mastery <= 6) {
    return (
      <div className="relative">
        <div
          className="transition-opacity duration-500"
          style={{ opacity: 0.3 - (mastery - 5) * 0.1 }}
        >
          {children}
        </div>
        <button
          onClick={() => setManualShow(true)}
          className="mt-1 text-xs text-primary underline"
        >
          {t.mastery.showHelp}
        </button>
      </div>
    );
  }

  // Mastery 7+: hidden, only toggle remains
  return (
    <div>
      <button
        onClick={() => setManualShow(true)}
        className="text-xs text-primary underline"
      >
        {t.mastery.showImage}
      </button>
    </div>
  );
}
