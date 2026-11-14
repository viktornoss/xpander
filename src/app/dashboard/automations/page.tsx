'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Play, 
  CheckCircle2, 
  Plus, 
  Workflow, 
  Zap, 
  Copy, 
  Check,
  Edit3,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { INITIAL_WORKFLOWS } from '@/lib/engine/templates';

export default function AutomationsPage() {
  const { automations, toggleAutomationStatus, runAutomationTest } = useAuth();
  const [testingId, setTestingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleTest = async (id: string) => {
    setTestingId(id);
    const res = await runAutomationTest(id);
    setTestingId(null);
    setMessage(res.message);
    setTimeout(() => setMessage(null), 4000);
  };

  const copyWebhook = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Saját Automatizációk & Munkafolyamatok
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            TypeScript-alapú natív ZentrionFlow motorunk által futtatott folyamatok és elágazások.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/integrations"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Workflow className="w-4 h-4 text-neon-blue" />
            <span>API Kapcsolatok</span>
          </Link>

          <Link
            href="/dashboard/builder"
            className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-95 transition-all shadow-neon-blue/20 shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Új Vizuális Workflow</span>
          </Link>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Automations Cards */}
      <div className="space-y-4">
        {automations.map((auto) => {
          const matchingWf = INITIAL_WORKFLOWS.find(w => w.name.includes(auto.title) || w.id.includes(auto.category)) || INITIAL_WORKFLOWS[0];
          const nativeWebhookUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/engine/webhook/${matchingWf.id}`;

          return (
            <div
              key={auto.id}
              className="rounded-3xl glass-panel p-6 border border-white/10 hover:border-neon-purple/40 transition-all space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{auto.title}</h3>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      auto.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {auto.status === 'active' ? 'Fut / Aktív' : 'Szüneteltetve'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">{auto.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5">
                  <Link
                    href={`/dashboard/builder/${matchingWf.id}`}
                    className="px-3.5 py-2 rounded-xl bg-neon-purple/15 hover:bg-neon-purple/25 border border-neon-purple/30 text-neon-purple font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Vizuális Szerkesztő</span>
                  </Link>

                  <button
                    onClick={() => handleTest(auto.id)}
                    disabled={testingId === auto.id}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-nexus-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 shadow-neon-blue/20 shadow-md disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 ${testingId === auto.id ? 'animate-spin' : ''}`} />
                    <span>{testingId === auto.id ? 'Fut...' : 'Teszt'}</span>
                  </button>

                  <button
                    onClick={() => toggleAutomationStatus(auto.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      auto.status === 'active'
                        ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                        : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    {auto.status === 'active' ? 'Szüneteltetés' : 'Bekapcsolás'}
                  </button>
                </div>
              </div>

              {/* Metrics & Details bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-400 pt-1">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Trigger Forrás</span>
                  <span className="text-white font-medium">{auto.trigger}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Összes lefutás</span>
                  <span className="text-white font-mono font-bold">{auto.totalRuns.toLocaleString('hu-HU')}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Sikerességi arány</span>
                  <span className="text-emerald-400 font-mono font-bold">{auto.successRate}%</span>
                </div>
                <div>
                  <Link
                    href={`/dashboard/automations/${matchingWf.id}/runs`}
                    className="inline-flex items-center gap-1 text-neon-blue hover:underline font-bold text-[11px] mt-2"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Futtatási előzmények megtekintése →</span>
                  </Link>
                </div>
              </div>

              {/* Webhook endpoint URL */}
              <div className="p-3 rounded-xl bg-nexus-900 border border-white/5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-gray-400 truncate">
                  <Workflow className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                  <span className="text-gray-400 text-[11px]">Saját Webhook:</span>
                  <code className="text-neon-cyan font-mono text-[11px] truncate">{nativeWebhookUrl}</code>
                </div>
                <button
                  onClick={() => copyWebhook(nativeWebhookUrl)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] flex items-center gap-1 shrink-0"
                >
                  {copiedUrl === nativeWebhookUrl ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Másolva</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Másolás</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
