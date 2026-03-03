'use client';

import { TabBar } from '@/components/layout/TabBar';
import { JourneyProvider } from '@/hooks/useJourney';

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <JourneyProvider>
      <div className="min-h-screen lg:pl-56">
        <TabBar />
        <main className="pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    </JourneyProvider>
  );
}
