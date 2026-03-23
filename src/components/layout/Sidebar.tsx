import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Lock, ShieldAlert, Settings, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Vault', href: '/vault', icon: Lock },
  { name: 'Security Insights', href: '/insights', icon: ShieldAlert },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-surface border-r border-gray-800 flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
          <Shield className="w-6 h-6 text-blue-500" />
          <span className="font-bold text-lg tracking-tight">Sentinel AI</span>
        </Link>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
          Menu
        </div>
        
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "text-white bg-white/5" 
                  : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-md"></div>
              )}
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110",
                isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"
              )} />
              {item.name}
            </Link>
          );
        })}
      </div>

    </div>
  );
}
