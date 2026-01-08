import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen pb-24">
      <main className="mx-auto max-w-lg px-4 py-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
