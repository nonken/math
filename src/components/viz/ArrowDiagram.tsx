'use client';

interface ArrowStep {
  value: string;
  operation?: string;
}

interface ArrowDiagramProps {
  steps: ArrowStep[];
}

export function ArrowDiagram({ steps }: ArrowDiagramProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap justify-center py-4">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-1">
          {/* Value box */}
          <div className={`px-3 py-2 rounded-xl font-bold text-sm ${
            i === steps.length - 1
              ? 'bg-filled text-white'
              : i === 0
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-800'
          }`}>
            {step.value}
          </div>

          {/* Arrow with operation */}
          {step.operation && i < steps.length - 1 && (
            <div className="flex flex-col items-center mx-1">
              <span className="text-[10px] text-gray-500 whitespace-nowrap">{step.operation}</span>
              <svg width="24" height="12" viewBox="0 0 24 12" className="text-gray-400">
                <line x1="0" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="2" />
                <polygon points="18,2 24,6 18,10" fill="currentColor" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
