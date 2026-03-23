import { Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="h-16 bg-surface/80 backdrop-blur-sm border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search passwords..." 
            className="w-full bg-background border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-500"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block font-sans rounded bg-surface border border-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500 font-medium">⌘</kbd>
            <kbd className="hidden sm:inline-block font-sans rounded bg-surface border border-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500 font-medium">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-6">
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute 1 top-0 right-0 w-2 h-2 rounded-full bg-red-500 border border-surface"></span>
        </button>

        <div className="h-6 w-px bg-gray-800"></div>

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
            className="ml-2 text-gray-500 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
