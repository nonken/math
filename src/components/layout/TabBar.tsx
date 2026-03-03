'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TAB_ROUTES } from '@/lib/constants';
import { useJourney } from '@/hooks/useJourney';

export function TabBar() {
  const pathname = usePathname();
  const { isTabUnlocked } = useJourney();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:top-0 lg:bottom-auto lg:left-0 lg:right-auto lg:w-56 lg:h-screen lg:border-t-0 lg:border-r">
      <div className="flex lg:flex-col lg:pt-6 lg:gap-1">
        {TAB_ROUTES.map((tab) => {
          const isActive = pathname === tab.path;
          const unlocked = isTabUnlocked(tab.path);

          if (!unlocked) {
            return (
              <div
                key={tab.path}
                className="flex flex-1 flex-col items-center justify-center py-2 px-1 text-xs text-gray-300 lg:flex-row lg:flex-initial lg:justify-start lg:gap-3 lg:px-6 lg:py-3 lg:text-sm cursor-not-allowed"
              >
                <span className="text-lg lg:text-xl opacity-40">{tab.icon}</span>
                <span className="mt-0.5 lg:mt-0 flex items-center gap-1">
                  {tab.label}
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            );
          }

          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex flex-1 flex-col items-center justify-center py-2 px-1 text-xs transition-colors lg:flex-row lg:flex-initial lg:justify-start lg:gap-3 lg:px-6 lg:py-3 lg:text-sm ${
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-lg lg:text-xl">{tab.icon}</span>
              <span className="mt-0.5 lg:mt-0">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-primary rounded-full lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 lg:h-8 lg:w-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
