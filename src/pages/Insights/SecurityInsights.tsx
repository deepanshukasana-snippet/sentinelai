import { useEffect, useState, useMemo } from 'react';
import { usePasswords } from '../../hooks/usePasswords';
import { generateSecurityInsights } from '../../lib/groq';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Zap, Activity, Loader2 } from 'lucide-react';

const COLORS = {
  Strong: '#22c55e', // green-500
  Medium: '#eab308', // yellow-500
  Weak: '#ef4444'    // red-500
};

export default function SecurityInsights() {
  const { passwords, loading } = usePasswords();
  const [insightData, setInsightData] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const pieData = useMemo(() => {
    let strong = 0, medium = 0, weak = 0;
    passwords.forEach(p => {
      if (p.strength === 'Strong') strong++;
      else if (p.strength === 'Medium') medium++;
      else weak++;
    });
    return [
      { name: 'Strong', value: strong },
      { name: 'Medium', value: medium },
      { name: 'Weak', value: weak },
    ].filter(d => d.value > 0);
  }, [passwords]);

  useEffect(() => {
    if (passwords.length > 0) {
      setAnalyzing(true);
      const simplified = passwords.map(p => ({ website: p.website, strength: p.strength }));
      generateSecurityInsights(simplified).then(res => {
        setInsightData(res);
        setAnalyzing(false);
      });
    }
  }, [passwords]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Security Insights</h1>
        <p className="text-gray-400 mt-1">Holistic AI analysis of your entire password vault.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 text-gray-500">Loading vault data...</div>
      ) : passwords.length === 0 ? (
        <div className="glass-panel p-12 text-center text-gray-400">
          Your vault is empty. Add passwords to generate AI insights.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Section */}
          <div className="glass-panel p-6 lg:col-span-1 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-6 w-full pb-2 border-b border-gray-800">
              Vault Composition
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1F26', borderColor: '#374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#E5E7EB' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full space-y-3 mt-4">
              {pieData.map(d => (
                <div key={d.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[d.name as keyof typeof COLORS] }} />
                    <span className="text-gray-300">{d.name} Passwords</span>
                  </div>
                  <span className="font-mono text-white">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none"></div>
              
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Groq AI Assessment
              </h3>
              
              {analyzing ? (
                <div className="h-32 flex flex-col justify-center items-center text-blue-500 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p className="text-sm text-gray-400">Analyzing vault posture...</p>
                </div>
              ) : insightData ? (
                <p className="text-gray-300 leading-relaxed text-sm lg:text-base">
                  {insightData.assessment || "Your vault has been analyzed by Sentinel AI. Review the recommendations below to improve your security posture."}
                </p>
              ) : (
                <p className="text-gray-500 text-sm">Could not generate AI assessment.</p>
              )}
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
                Top Recommendations
              </h3>

              {analyzing ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-10 bg-surface-hover rounded animate-pulse w-full"></div>
                  ))}
                </div>
              ) : insightData && insightData.recommendations ? (
                <div className="space-y-4">
                  {insightData.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface-hover border border-gray-800/50">
                      <div className="p-1 rounded bg-blue-500/10 shrink-0 mt-0.5">
                        <Activity className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-sm text-gray-200">{rec}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No recommendations available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
