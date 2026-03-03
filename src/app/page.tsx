'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JourneyProvider, useJourney } from '@/hooks/useJourney';

function HomeRedirect() {
  const router = useRouter();
  const { getCurrentTab } = useJourney();

  useEffect(() => {
    router.replace(getCurrentTab());
  }, [router, getCurrentTab]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-gray-400">Laden...</div>
    </div>
  );
}

export default function Home() {
  return (
    <JourneyProvider>
      <HomeRedirect />
    </JourneyProvider>
  );
}
