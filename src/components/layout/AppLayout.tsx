import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useState, useEffect } from 'react';

export default function AppLayout() {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Auto-close sidebar on mobile when navigating
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile Sidebar & Desktop Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed TopBar */}
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
