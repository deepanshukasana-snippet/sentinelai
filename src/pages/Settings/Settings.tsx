import { useAuth } from '../../contexts/AuthContext';
import { Settings as SettingsIcon, Shield, Trash2 } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  const handleDeleteAccount = async () => {
    if (confirm("Are you absolutely sure? This will delete all your passwords forever.")) {
      // Production app would call an edge function or RPC to delete user auth record
      alert("Account deletion requested. (Demo)");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-blue-500" /> Settings
        </h1>
        <p className="text-gray-400 mt-1">Manage your account preferences and security protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Account Profile */}
          <section className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-3">User Profile</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Email Address</p>
                <p className="text-lg font-medium text-white">{user?.email}</p>
                <div className="inline-flex mt-2 items-center gap-1.5 px-2.5 py-1 rounded bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                  <Shield className="w-3 h-3" /> Account Verified
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column - Data & Danger Zone */}
        <div className="space-y-6">

          <section className="glass-panel p-6 border-red-500/20 bg-red-500/5">
            <h3 className="text-lg font-semibold text-red-500 mb-4 border-b border-red-500/20 pb-3 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Danger Zone
            </h3>
            <p className="text-xs text-red-400/80 mb-4 leading-relaxed">
              Permanently delete your account and all associated encrypted credentials. This action cannot be undone.
            </p>
            <button 
              onClick={handleDeleteAccount}
              className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-xl text-sm font-medium text-red-400 transition-colors"
            >
              Delete Account
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
