import { useState, useEffect } from 'react';
import { X, Key, Zap, Shield, Loader2 } from 'lucide-react';
import { analyzePassword } from '../lib/groq';
import { cn } from '../lib/utils';
import { usePasswords } from '../hooks/usePasswords';

interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddPasswordModal({ isOpen, onClose, onSuccess }: AddPasswordModalProps) {
  const { addPassword } = usePasswords();
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysis, setAnalysis] = useState<{ strength: string; crackTime: string; score: number; suggestions: string[] } | null>(null);

  useEffect(() => {
    // Debounce password analysis
    if (!password) {
      setAnalysis(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAnalyzing(true);
      const res = await analyzePassword(password);
      if (res) {
        setAnalysis({
          strength: res.strength || 'Weak',
          crackTime: res.crackTime || 'Unknown',
          score: res.score || (res.strength === 'Strong' ? 90 : res.strength === 'Medium' ? 50 : 20),
          suggestions: res.suggestions || [],
        });
      }
      setIsAnalyzing(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    await addPassword({
      website,
      username,
      plainText: password,
      strength: analysis?.strength as any || 'Weak'
    });
    
    setIsSaving(false);
    setWebsite('');
    setUsername('');
    setPassword('');
    setAnalysis(null);
    onSuccess?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg glass-panel relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-500 hover:text-white bg-surface rounded-full border border-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-500" />
            Add New Password
          </h2>
          <p className="text-sm text-gray-400 mt-1">Securely store a new credential in your vault.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-medium text-gray-300">Website or App</label>
              <input 
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                autoFocus
                className="input-field" 
                placeholder="e.g. twitter.com" 
              />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-xs font-medium text-gray-300">Username / Email</label>
              <input 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field" 
                placeholder="user@example.com" 
              />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-xs font-medium text-gray-300">Password</label>
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field" 
                placeholder="••••••••••••" 
              />
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="rounded-xl border border-gray-800 bg-black/40 p-4 relative overflow-hidden min-h-[120px]">
            {isAnalyzing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-400">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <span className="text-xs font-medium animate-pulse">Groq AI analyzing strength...</span>
              </div>
            ) : analysis ? (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className={cn(
                      "w-5 h-5",
                      analysis.strength === 'Strong' ? "text-green-500" :
                      analysis.strength === 'Medium' ? "text-yellow-500" : "text-red-500"
                    )} />
                    <span className="font-medium text-sm text-white">
                      {analysis.strength} Password
                    </span>
                  </div>
                  <span className="text-xs font-mono text-gray-400 bg-surface px-2 py-1 rounded-md border border-gray-800">
                    Crack time: {analysis.crackTime}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500",
                      analysis.strength === 'Strong' ? "bg-green-500 w-[90%]" :
                      analysis.strength === 'Medium' ? "bg-yellow-500 w-[50%]" : "bg-red-500 w-[20%]"
                    )}
                  />
                </div>

                {analysis.suggestions && analysis.suggestions.length > 0 && (
                  <div className="pt-2">
                    <h4 className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wider">
                      <Zap className="w-3 h-3" /> AI Suggestions
                    </h4>
                    <ul className="space-y-1.5">
                      {analysis.suggestions.slice(0, 2).map((s, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 flex-col gap-2">
                <Shield className="w-8 h-8 opacity-20" />
                <span className="text-xs text-center px-4 max-w-[250px]">
                  Type a password to receive real-time AI security insights powered by Groq.
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaving || !password}
              className="px-6 py-2 rounded-xl text-sm font-medium bg-gradient-primary bg-gradient-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
