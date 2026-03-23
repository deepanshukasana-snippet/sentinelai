import { useState, useMemo } from 'react';
import { ShieldAlert, KeyRound, AlertTriangle, Activity, Plus } from 'lucide-react';
import { usePasswords } from '../../hooks/usePasswords';
import AddPasswordModal from '../../components/AddPasswordModal';
import { cn } from '../../lib/utils';

export default function Dashboard() {
  const { passwords, loading } = usePasswords();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = useMemo(() => {
    let weak = 0;
    const passwordsObj: Record<string, number> = {};
    let reused = 0;

    passwords.forEach(p => {
      if (p.strength === 'Weak') weak++;
      if (p.decrypted_password) {
        passwordsObj[p.decrypted_password] = (passwordsObj[p.decrypted_password] || 0) + 1;
      }
    });

    Object.values(passwordsObj).forEach(count => {
      if (count > 1) reused++;
    });

    const total = passwords.length;
    let score = 100;
    if (total > 0) {
      score -= (weak / total) * 50;
      score -= (reused / total) * 30;
      score = Math.max(0, Math.round(score));
    } else {
      score = 0; // No score if empty
    }

    return { total, weak, reused, score };
  }, [passwords]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-1">Overview of your vault's security posture.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-primary bg-gradient-primary-hover px-4 py-2 sm:py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Add Password
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <StatCard 
          title="Total Passwords" 
          value={loading ? '-' : stats.total} 
          icon={KeyRound} 
          color="text-blue-500" 
        />
        <StatCard 
          title="Weak Passwords" 
          value={loading ? '-' : stats.weak} 
          icon={ShieldAlert} 
          color={stats.weak > 0 ? "text-red-500" : "text-green-500"} 
          alert={stats.weak > 0}
        />
        <StatCard 
          title="Reused Passwords" 
          value={loading ? '-' : stats.reused} 
          icon={AlertTriangle} 
          color={stats.reused > 0 ? "text-yellow-500" : "text-green-500"} 
          alert={stats.reused > 0}
        />
        <StatCard 
          title="Security Score" 
          value={loading ? '-' : `${stats.score}`} 
          icon={Activity} 
          color={stats.score > 80 ? "text-green-500" : stats.score > 50 ? "text-yellow-500" : "text-red-500"} 
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Security Insights</h2>
        {loading ? (
          <div className="glass-panel p-6 flex flex-col items-center justify-center text-gray-500 h-32">
            Loading insights...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.weak > 0 ? (
              <div className="glass-panel p-5 flex gap-4 items-start relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                <div className="p-2.5 rounded-lg bg-red-500/10 shrink-0">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">Upgrade Weak Passwords</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    You have {stats.weak} passwords that are highly vulnerable to attacks. Update them to improve your security score.
                  </p>
                </div>
              </div>
            ) : null}

            {stats.reused > 0 ? (
              <div className="glass-panel p-5 flex gap-4 items-start relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
                <div className="p-2.5 rounded-lg bg-yellow-500/10 shrink-0">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">Passowrd Reuse Detected</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {stats.reused} identical passwords found across different accounts. This creates a single point of failure.
                  </p>
                </div>
              </div>
            ) : null}

            {stats.weak === 0 && stats.reused === 0 && stats.total > 0 ? (
              <div className="glass-panel p-5 flex gap-4 items-start relative overflow-hidden md:col-span-2">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                <div className="p-2.5 rounded-lg bg-green-500/10 shrink-0">
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">Looking Good!</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Your vault is in great shape. No critical vulnerabilities found.
                  </p>
                </div>
              </div>
            ) : null}
            
            {stats.total === 0 ? (
              <div className="glass-panel p-8 flex flex-col items-center justify-center text-gray-400 text-center md:col-span-2">
                <KeyRound className="w-8 h-8 mb-3 opacity-20" />
                <p className="text-sm">Your vault is empty. Add a password to get started.</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <AddPasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, alert }: { title: string, value: string | number, icon: any, color: string, alert?: boolean }) {
  return (
    <div className={cn("glass-panel p-6 relative group transform hover:-translate-y-1 transition-all duration-300 z-10", alert && "border-red-500/30")}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className={cn("p-2 rounded-xl bg-surface transition-all duration-300 group-hover:scale-110 shadow-inner border border-gray-800")}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
      </div>
      {alert && (
        <div className="absolute right-0 top-0 w-24 h-24 bg-red-500/10 blur-2xl rounded-full pointer-events-none"></div>
      )}
    </div>
  );
}
