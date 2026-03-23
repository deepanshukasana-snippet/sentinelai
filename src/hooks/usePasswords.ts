import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { encryptDemo, decryptDemo } from '../lib/encryption';
import { useAuth } from '../contexts/AuthContext';

export interface PasswordEntry {
  id: string;
  website: string;
  username: string;
  encrypted_password?: string;
  decrypted_password?: string;
  strength: 'Weak' | 'Medium' | 'Strong';
  created_at: string;
}

export function usePasswords() {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPasswords = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('passwords')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching passwords", error);
    } else if (data) {
      const decrypted = data.map(p => ({
        ...p,
        decrypted_password: decryptDemo(p.encrypted_password)
      }));
      setPasswords(decrypted);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPasswords();
  }, [fetchPasswords]);

  const addPassword = async (entry: Omit<PasswordEntry, 'id' | 'created_at' | 'decrypted_password' | 'encrypted_password'> & { plainText: string }) => {
    if (!user) return null;
    
    const encrypted = encryptDemo(entry.plainText);
    
    const { data, error } = await supabase
      .from('passwords')
      .insert({
        user_id: user.id,
        website: entry.website,
        username: entry.username,
        encrypted_password: encrypted,
        strength: entry.strength
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding password", error);
      return null;
    }

    if (data) {
      const newEntry = { ...data, decrypted_password: entry.plainText };
      setPasswords([newEntry, ...passwords]);
      return newEntry;
    }
  };

  const deletePassword = async (id: string) => {
    const { error } = await supabase
      .from('passwords')
      .delete()
      .eq('id', id);

    if (!error) {
      setPasswords(passwords.filter(p => p.id !== id));
    }
    return !error;
  };

  return { passwords, loading, addPassword, deletePassword, refresh: fetchPasswords };
}
