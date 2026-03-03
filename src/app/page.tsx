'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJourney } from '@/hooks/useJourney';

export default function Home() {
  const router = useRouter();
  const { getCurrentTab } = useJourney();

  useEffect(() => {
    router.replace(getCurrentTab());
  }, [router, getCurrentTab]);

  return null;
}
