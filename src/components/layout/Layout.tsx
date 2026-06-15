import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/papers': 'Academic Papers',
  '/listening': 'Listening Practice',
  '/reading': 'Reading Practice',
  '/favorites': 'My Favorites',
  '/history': 'History',
  '/settings': 'Settings',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onMenuToggle={() => setSidebarOpen(true)}
          title={pageTitles[window.location.pathname]}
        />

        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ setPageTitle: () => {} }} />
        </main>
      </div>
    </div>
  );
}
