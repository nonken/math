import { TabBar } from '@/components/layout/TabBar';

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen lg:pl-56">
      <TabBar />
      <main className="pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
