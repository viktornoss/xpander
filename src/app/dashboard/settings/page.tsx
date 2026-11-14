'use client';

import React, { useState } from 'react';
import { 
  User, 
  Key, 
  CreditCard, 
  ShieldCheck, 
  Copy, 
  Check, 
  Save, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const [copiedKey, setCopiedKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(currentUser?.name || 'Kovács Tamás');
  const [company, setCompany] = useState(currentUser?.company || 'TechVentures Kft.');
  const [phone, setPhone] = useState(currentUser?.phone || '+36 30 456 7890');

  const apiKey = currentUser?.apiKey || 'nx_live_9a8b7c6d5e4f3a2b1c0d_sec';

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Profil & Rendszerbeállítások</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Kezeld a fiók adataidat, API hozzáféréseidet és előfizetésedet.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profiladatok sikeresen frissítve!</span>
        </div>
      )}

      {/* Subscription Card */}
      <div className="rounded-3xl glass-panel p-6 border border-neon-purple/30 bg-gradient-to-r from-neon-purple/10 to-transparent space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-purple/20 text-neon-purple flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Jelenlegi Csomag: {currentUser?.plan || 'Growth'}</div>
              <div className="text-xs text-gray-400">Következő elszámolás: 2026. április 15. • 59.000 Ft/hó</div>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-fit">
            Aktív Előfizetés
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs border-t border-white/10">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Havi Token Keret</span>
            <span className="text-white font-mono font-bold">750,000 / 1,000,000</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Munkafolyamat Futás</span>
            <span className="text-white font-mono font-bold">14,280 / 50,000</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Dedikált Támogatás</span>
            <span className="text-emerald-400 font-bold">Slack + 4h SLA</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-neon-blue" />
          <span>Fiókadatok</span>
        </h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">Név</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">Cégnév</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">E-mail cím</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || 'tamas@techventures.hu'}
                className="w-full px-4 py-2.5 rounded-xl bg-nexus-900/50 border border-white/5 text-gray-400 text-xs cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">Telefonszám</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-nexus-950 bg-neon-blue hover:opacity-90 transition-all flex items-center gap-1.5 shadow-neon-blue/20 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Módosítások Mentése</span>
            </button>
          </div>
        </form>
      </div>

      {/* API Key Box */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-neon-cyan" />
          <span>zentrion.ai API Hozzáférési Kulcs</span>
        </h2>
        <p className="text-xs text-gray-400">
          Ezzel a kulccsal indíthatsz külső rendszerekből autonóm munkafolyamatokat az zentrion.ai Gatewayen keresztül.
        </p>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-nexus-900 border border-white/10">
          <input
            type="password"
            readOnly
            value={apiKey}
            className="flex-1 bg-transparent text-xs text-neon-cyan font-mono focus:outline-none"
          />
          <button
            onClick={copyApiKey}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-1 transition-colors"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Másolva' : 'Másolás'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}

