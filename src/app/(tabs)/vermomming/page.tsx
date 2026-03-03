'use client';

import { useState } from 'react';
import { fractionFamilies } from '@/lib/math/families';
import { FamilyChain } from '@/components/viz/FamilyChain';
import { t } from '@/lib/i18n';

function FamilyCard({ family }: { family: typeof fractionFamilies[number] }) {
  const [tryNumber, setTryNumber] = useState(120);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: family.color }}
          />
          <span className="font-semibold text-gray-900">{family.name}</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Visual chain */}
          <FamilyChain family={family} />

          {/* Explanation */}
          <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
            {family.explanation}
          </p>

          {/* Try it yourself */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              {t.vermomming.tryIt}: {t.vermomming.whatIs}... {t.vermomming.of}{' '}
              <span className="font-bold text-primary">{tryNumber}</span>?
            </p>

            <input
              type="range"
              min={10}
              max={500}
              value={tryNumber}
              onChange={(e) => setTryNumber(Number(e.target.value))}
              className="w-full mb-3"
            />

            <div className="grid grid-cols-2 gap-2">
              {family.members.map((member, i) => {
                const result = (member.percent / 100) * tryNumber;
                const resultStr = result % 1 === 0
                  ? result.toFixed(0)
                  : parseFloat(result.toFixed(2)).toString();
                return (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-lg p-2 text-center"
                  >
                    <div className="text-xs text-gray-500">
                      {member.fraction[0]}/{member.fraction[1]} van {tryNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      = {member.percentDisplay} van {tryNumber}
                    </div>
                    <div className="font-bold text-lg" style={{ color: family.color }}>
                      {resultStr}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VermommingPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.vermomming.title}</h1>
      <p className="text-gray-500 text-sm mb-6">{t.vermomming.subtitle}</p>

      <div className="space-y-3">
        {fractionFamilies.map((family) => (
          <FamilyCard key={family.id} family={family} />
        ))}
      </div>
    </div>
  );
}
