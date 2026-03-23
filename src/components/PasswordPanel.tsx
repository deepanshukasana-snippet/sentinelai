import { useEffect, useState } from 'react';
import { X, Copy, ExternalLink, Loader2, AlertCircle, Trash2, Check } from 'lucide-react';
import { usePasswords } from '../hooks/usePasswords';
import type { PasswordEntry } from '../hooks/usePasswords';
import { analyzePassword } from '../lib/groq';
import { cn } from '../lib/utils';

export default function PasswordPanel({ entry, onClose }: { entry: PasswordEntry | null, onClose: () => void }) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { deletePassword } = usePasswords();

  useEffect(() => {
    if (entry && entry.decrypted_password) {
      setIsAnalyzing(true);
      analyzePassword(entry.decrypted_password).then(res => {
        setAnalysis(res);
        setIsAnalyzing(false);
      });
    } else {
      setAnalysis(null);
    }
  }, [entry]);

  if (!entry) return null;

  const handleCopy = () => {
    if (entry.decrypted_password) {
      navigator.clipboard.writeText(entry.decrypted_password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this password?')) {
      await deletePassword(entry.id);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm glass-panel border-r-0 border-y-0 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Item Details</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-surface rounded-full border border-gray-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
            {/* Header info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center text-2xl font-bold uppercase text-gray-300">
                {entry.website.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{entry.website}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  {entry.username}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 py-2 rounded-lg bg-surface border border-gray-800 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Password'}
              </button>
              <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-surface border border-gray-800 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                <ExternalLink className="w-4 h-4" /> Go to site
              </button>
            </div>

            {/* AI Analysis */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">AI Security Analysis</h4>
              
              {isAnalyzing ? (
                <div className="bg-surface/50 rounded-xl p-6 border border-gray-800 flex flex-col items-center justify-center text-blue-400 min-h-[160px]">
                  <Loader2 className="w-6 h-6 animate-spin mb-3" />
                  <span className="text-xs font-medium uppercase tracking-widest text-gray-400">Groq analyzing...</span>
                </div>
              ) : analysis ? (
                <div className="bg-[#0B0F14] rounded-xl p-5 border border-gray-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Strength Indicator</span>
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-surface",
                      analysis.strength === 'Strong' ? "text-green-500" :
                      analysis.strength === 'Medium' ? "text-yellow-500" : "text-red-500"
                    )}>
                      {analysis.strength}
                    </span>
                  </div>
                  
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        analysis.strength === 'Strong' ? "bg-green-500 w-[90%]" :
                        analysis.strength === 'Medium' ? "bg-yellow-500 w-[50%]" : "bg-red-500 w-[20%]"
                      )}
                    />
                  </div>

                  <div className="pt-2 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-400">Time to crack:</span>
                      <span className="text-sm font-mono text-white">{analysis.crackTime}</span>
                    </div>

                    {analysis.suggestions && analysis.suggestions.length > 0 && (
                      <div className="bg-surface p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-2 mb-2 text-yellow-500">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs font-semibold">Recommendations</span>
                        </div>
                        <ul className="space-y-1.5 pl-5 list-disc text-xs text-gray-300">
                          {analysis.suggestions.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Could not complete analysis.</div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-800 flex justify-end">
               <button 
                onClick={handleDelete}
                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
