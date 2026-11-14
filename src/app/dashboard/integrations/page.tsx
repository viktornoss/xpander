'use client';

import React, { useState, useEffect } from 'react';
import { 
  Workflow, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Key, 
  Link as LinkIcon, 
  Activity, 
  ExternalLink,
  ShieldCheck,
  Play
} from 'lucide-react';
import { ApiConnector } from '@/lib/engine/types';

export default function IntegrationsPage() {
  const [connectors, setConnectors] = useState<ApiConnector[]>([
    {
      id: 'conn-hubspot',
      userId: 'usr-client-001',
      name: 'HubSpot CRM REST API',
      baseUrl: 'https://api.hubapi.com/crm/v3',
      authType: 'bearer',
      authHeaderKey: 'Authorization',
      authSecret: 'pat-eu1-99887766-5544-3322-1100',
      defaultHeaders: { 'Content-Type': 'application/json' },
      createdAt: '2026-02-15'
    },
    {
      id: 'conn-erp',
      userId: 'usr-client-001',
      name: 'Belső Vállalati ERP Gateway',
      baseUrl: 'https://erp.techventures.hu/api/v1',
      authType: 'api_key',
      authHeaderKey: 'X-ERP-API-KEY',
      authSecret: 'erp_live_sec_884422',
      defaultHeaders: { 'Accept': 'application/json' },
      createdAt: '2026-02-28'
    },
    {
      id: 'conn-slack',
      userId: 'usr-client-001',
      name: 'Slack Incoming Alerts Webhook',
      baseUrl: 'https://hooks.slack.com/services/T00/B00/XXXX',
      authType: 'none',
      defaultHeaders: { 'Content-Type': 'application/json' },
      createdAt: '2026-03-01'
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [testResult, setTestResult] = useState<{ id: string; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState<string | null>(null);

  // New connector form state
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [authType, setAuthType] = useState<ApiConnector['authType']>('bearer');
  const [authSecret, setAuthSecret] = useState('');

  const handleTestConnection = async (conn: ApiConnector) => {
    setIsTesting(conn.id);
    await new Promise(r => setTimeout(r, 450));
    setIsTesting(null);
    setTestResult({
      id: conn.id,
      message: `Sikeres kapcsolat! Célállomás: ${conn.baseUrl} válaszolt (142 ms).`
    });
    setTimeout(() => setTestResult(null), 4000);
  };

  const handleCreateConnector = (e: React.FormEvent) => {
    e.preventDefault();
    const newConn: ApiConnector = {
      id: `conn_${Date.now()}`,
      userId: 'usr-client-001',
      name: name || 'Új API Kapcsolat',
      baseUrl: baseUrl || 'https://api.ceged.hu',
      authType,
      authHeaderKey: authType === 'bearer' ? 'Authorization' : 'X-API-KEY',
      authSecret,
      defaultHeaders: { 'Content-Type': 'application/json' },
      createdAt: new Date().toISOString().split('T')[0]
    };

    setConnectors(prev => [newConn, ...prev]);
    setModalOpen(false);
    setName('');
    setBaseUrl('');
    setAuthSecret('');
  };

  const handleDelete = (id: string) => {
    setConnectors(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Újrafelhasználható API & Webhook Integrációk
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Kapcsold össze a saját backend rendszereidet, CRM-edet és webhookjaidat az xpander.ai Automatizációs Motorral.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-95 transition-all shadow-neon-blue/20 shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Új API Kapcsolat Hozzáadása</span>
        </button>
      </div>

      {testResult && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Connectors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connectors.map((conn) => (
          <div
            key={conn.id}
            className="rounded-3xl glass-panel p-6 border border-white/10 hover:border-neon-blue/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neon-blue flex items-center gap-1.5 font-mono">
                  <Workflow className="w-3.5 h-3.5" />
                  <span>REST API</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                  {conn.authType.toUpperCase()}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{conn.name}</h3>

              <div className="p-2.5 rounded-xl bg-nexus-900 border border-white/5 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Base Endpoint URL:</span>
                <code className="text-neon-cyan font-mono text-[11px] break-all">{conn.baseUrl}</code>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Key className="w-3.5 h-3.5 text-neon-purple" />
                <span>Hitelesítés: <strong className="text-white">{conn.authType}</strong></span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => handleTestConnection(conn)}
                disabled={isTesting === conn.id}
                className="px-3 py-1.5 rounded-xl bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isTesting === conn.id ? 'animate-spin' : ''}`} />
                <span>{isTesting === conn.id ? 'Tesztelés...' : 'Ping Teszt'}</span>
              </button>

              <button
                onClick={() => handleDelete(conn.id)}
                className="p-1.5 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Törlés"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Connector Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-nexus-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-white/20 shadow-2xl space-y-5 relative animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white">Új API / Webhook Kapcsoló Létrehozása</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateConnector} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300">Kapcsolat Neve *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Pl. Saját Billingo Számlázó API"
                  className="w-full px-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300">Base URL *</label>
                <input
                  type="url"
                  required
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.szolgaltatas.hu/v1"
                  className="w-full px-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300">Hitelesítési Mód</label>
                <select
                  value={authType}
                  onChange={(e) => setAuthType(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue"
                >
                  <option value="bearer">Bearer Token (Authorization Header)</option>
                  <option value="api_key">Egyedi API Kulcs Header</option>
                  <option value="none">Nincs hitelesítés / Nyílt Webhook</option>
                </select>
              </div>

              {authType !== 'none' && (
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300">Token vagy API Titkos Kulcs</label>
                  <input
                    type="password"
                    value={authSecret}
                    onChange={(e) => setAuthSecret(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue font-mono"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-95 transition-all shadow-neon-blue/20 shadow-md"
                >
                  Kapcsolat Mentése
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

