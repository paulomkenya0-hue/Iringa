import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import type { AppRole } from '@/types/navigation';

interface AppLayoutProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
  userRole: AppRole;
  userName: string;
  onSignOut: () => void;
  children: ReactNode;
}

export default function AppLayout({
  activePage,
  onNavigate,
  userRole,
  userName,
  onSignOut,
  children,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (pageId: string) => {
    onNavigate(pageId);
    setSidebarOpen(false);
  };

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashibodi',
    universities: 'Usimamizi wa Vyuo',
    members: 'Usimamizi wa Wanachama',
    users: 'Usimamizi wa Watumiaji',
    roles: 'Majukumu na Ruhusa',
    events: 'Usimamizi wa Matukio',
    attendance: 'Mahudhurio ya Matukio',
    reports: 'Riporti za Kiutawala',
    audit: 'Kumbukumbu za Ukaguzi',
    settings: 'Mipangilio ya Mfumo',
    notifications: 'Kituo cha Arifa',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        userRole={userRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          pageTitle={pageTitles[activePage] || 'Dashibodi'}
          userRole={userRole}
          userName={userName}
          onMenuClick={() => setSidebarOpen(true)}
          onSignOut={onSignOut}
        />

        <main className="flex-1 p-4 lg:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
