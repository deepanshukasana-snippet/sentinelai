import { Search, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="h-16 bg-surface/80 backdrop-blur-sm border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 w-full">
      <div className="flex items-center flex-1 max-w-lg">
        <button 
          onClick={onMenuClick}
          aria-label="Toggle Navigation Menu"
          className="md:hidden mr-4 p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="relative group w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search passwords..." 
            className="w-full bg-background border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-500"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 hidden sm:flex">
            <kbd className="font-sans rounded bg-surface border border-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500 font-medium">⌘</kbd>
            <kbd className="font-sans rounded bg-surface border border-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500 font-medium">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4 sm:ml-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white truncate max-w-[150px]">
              {user?.email?.split('@')[0]}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-inner cursor-pointer" title={user?.email}>
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          
          <button 
            onClick={handleSignOut}
            aria-label="Sign Out"
            className="ml-1 sm:ml-2 text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
