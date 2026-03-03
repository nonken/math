'use client';

import type { FractionFamily } from '@/lib/math/families';
import { PieChart } from './PieChart';

interface FamilyChainProps {
  family: FractionFamily;
}

export function FamilyChain({ family }: FamilyChainProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {family.members.map((member, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <PieChart
                numerator={member.fraction[0]}
                denominator={member.fraction[1]}
                size={64}
                showLabels={false}
              />
              <div className="mt-1 text-center">
                <div className="text-xs font-bold" style={{ color: family.color }}>
                  {member.fraction[0]}/{member.fraction[1]}
                </div>
                <div className="text-[10px] text-gray-500">
                  {member.percentDisplay}
                </div>
              </div>
            </div>
            {i < family.members.length - 1 && (
              <svg width="20" height="12" viewBox="0 0 20 12" className="text-gray-300 flex-shrink-0">
                <line x1="0" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="2" />
                <polygon points="14,2 20,6 14,10" fill="currentColor" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
