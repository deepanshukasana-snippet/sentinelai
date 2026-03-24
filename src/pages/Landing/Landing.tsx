import { Link } from 'react-router-dom';
import { Shield, Lock, Zap, Activity, ArrowRight, Github } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none animate-pulse duration-[10000ms]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none animate-pulse duration-[8000ms] delay-1000"></div>

      {/* Top Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">Sentinel AI</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-primary bg-gradient-primary-hover text-white shadow-lg shadow-blue-500/25 transition-all outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center mt-12 sm:mt-24 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Zap className="w-3.5 h-3.5" /> Next-Gen Password Security
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          The password manager <br className="hidden sm:block" />
          built for the <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AI era.</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Sentinel AI intelligently analyzes your vault, generates uncrackable credentials, and automatically secures your digital identity using advanced machine learning models.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Link 
            to="/register" 
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2 transition-all shadow-xl shadow-white/10 group"
          >
            Create Free Account 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-surface border border-gray-800 hover:bg-surface-hover text-white flex items-center justify-center transition-all"
          >
            Sign In to Vault
          </Link>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full mt-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="glass-panel p-8 text-left group hover:border-blue-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Impenetrable Vault</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your credentials are encrypted heavily before they ever leave your device. Zero-knowledge architecture ensures total privacy.
            </p>
          </div>
          
          <div className="glass-panel p-8 text-left group hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-time Insights</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Instantly know your vault's health with live dashboards. Spot weak or reused passwords before they become a breach.
            </p>
          </div>
          
          <div className="glass-panel p-8 text-left group hover:border-green-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Groq AI Powered</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Leverage the blistering speed of Llama 3 via Groq for deep, holistic security assessments and smart password recommendations.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/60 bg-surface/30 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">© {new Date().getFullYear()} Sentinel AI.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}                                                                   


