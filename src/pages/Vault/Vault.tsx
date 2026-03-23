import { useState } from 'react';
import { usePasswords } from '../../hooks/usePasswords';
import type { PasswordEntry } from '../../hooks/usePasswords';
import AddPasswordModal from '../../components/AddPasswordModal';
import PasswordPanel from '../../components/PasswordPanel';
import { Search, Plus, MoreHorizontal, ShieldAlert, Shield, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Vault() {
  const { passwords, loading } = usePasswords();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPasswords = passwords.filter(p => 
    p.website.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">My Vault</h1>
          <p className="text-gray-400 mt-1">All your secure credentials in one place.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-primary bg-gradient-primary-hover px-4 py-2 sm:py-2.5 rounded-xl text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Password
        </button>
      </div>

      <div className="glass-panel overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-800 bg-surface/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Filter vault..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0F14] border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading vault...</div>
          ) : filteredPasswords.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <Shield className="w-12 h-12 mb-4 opacity-20" />
              <p>No passwords found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-surface/30">
                  <th className="font-medium text-xs text-gray-400 uppercase tracking-wider py-3 px-6">App / Website</th>
                  <th className="font-medium text-xs text-gray-400 uppercase tracking-wider py-3 px-6">Username</th>
                  <th className="font-medium text-xs text-gray-400 uppercase tracking-wider py-3 px-6">Strength</th>
                  <th className="font-medium text-xs text-gray-400 uppercase tracking-wider py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredPasswords.map((p) => (
                  <tr 
                    key={p.id} 
                    onClick={() => setSelectedPassword(p)}
                    className="hover:bg-surface-hover cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-xs font-bold uppercase text-gray-300">
                          {p.website.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{p.website}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-400">{p.username}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        {p.strength === 'Strong' && <ShieldCheck className="w-4 h-4 text-green-500" />}
                        {p.strength === 'Medium' && <Shield className="w-4 h-4 text-yellow-500" />}
                        {p.strength === 'Weak' && <ShieldAlert className="w-4 h-4 text-red-500" />}
                        <span className={cn(
                          "text-xs font-medium",
                          p.strength === 'Strong' ? "text-green-500" :
                          p.strength === 'Medium' ? "text-yellow-500" : "text-red-500"
                        )}>{p.strength}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-gray-500 hover:text-white p-1 rounded transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddPasswordModal 
        isOpen={isModalOpen || !!editingEntry} 
        editingEntry={editingEntry}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
        }} 
      />
      <PasswordPanel 
        entry={selectedPassword} 
        onClose={() => setSelectedPassword(null)} 
        onEdit={() => {
          setEditingEntry(selectedPassword);
          setSelectedPassword(null);
        }}
      />
    </div>
  );
}
