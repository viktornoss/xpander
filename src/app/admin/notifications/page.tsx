'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface NotificationLog {
  id: string;
  type: 'contact_inquiry' | 'system_error' | 'chatbot_question' | 'order_created' | 'test_alert';
  subject: string;
  to: string;
  from: string;
  createdAt: string;
  status: 'sent' | 'queued' | 'simulated';
  metadata: Record<string, any>;
  preview: string;
}

export default function AdminNotificationsPage() {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetEmail, setTargetEmail] = useState('xpander-automation.ai@outlook.hu');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<NotificationLog | null>(null);
  const [isSending, setIsSending] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/alerts/system');
      const data = await res.json();
      setLogs(data.logs || []);
      if (data.targetEmail) {
        setTargetEmail(data.targetEmail);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const sendTestAlert = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/alerts/system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_alert' })
      });
      const data = await res.json();
      setActionFeedback(data.message || 'Teszt értesítés sikeresen elküldve!');
      setTimeout(() => setActionFeedback(null), 3500);
      await fetchLogs();
    } catch {
      setActionFeedback('Hiba a teszt kiküldésekor');
    } finally {
      setIsSending(false);
    }
  };

  const simulateErrorAlert = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/alerts/system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'XpanderFlow Engine Telemetria',
          message: 'Szimulált hiba: Időtúllépés külső REST API végponton (504 Gateway Timeout)',
          payload: { endpoint: 'https://crm.partner.hu/v2/contacts', timeoutMs: 15000 }
        })
      });
      const data = await res.json();
      setActionFeedback(data.message || 'Szimulált hiba riasztás kiküldve!');
      setTimeout(() => setActionFeedback(null), 3500);
      await fetchLogs();
    } catch {
      setActionFeedback('Hiba történt a riasztás küldésekor');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/15 border border-neon-blue/30 text-xs font-semibold text-neon-blue mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Központi Email & Hibajelző Dispatcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Email Értesítések & Rendszer Riasztások
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Minden bejövő kérdés, űrlapkitöltés, chatbot lead és rendszerhiba ide fut be valós időben.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
            title="Frissítés"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Frissítés</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Connected Master Email Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-neon-blue/30 bg-gradient-to-br from-nexus-900 via-nexus-950 to-nexus-900 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-neon-blue/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Csatlakoztatott Központi Fiók
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Aktív & Kézbesítésre Kész
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Mail className="w-7 h-7 text-neon-blue shrink-0" />
              <span className="font-mono text-neon-blue">{targetEmail}</span>
            </div>

            <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
              Az egész weboldal (Főoldali kapcsolatfelvétel, AI Chatbot kérdések, Szolgáltatás megrendelések, és a TypeScript motor futási hibái) közvetlenül ezzel a címmel van összekötve.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={sendTestAlert}
              disabled={isSending}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple text-nexus-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-blue/20 shadow-md hover:opacity-95 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Teszt Email Küldése</span>
            </button>

            <button
              onClick={simulateErrorAlert}
              disabled={isSending}
              className="px-5 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Hiba Riasztás Szimuláció</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dispatched Notification History */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden bg-nexus-950">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Kézbesített Értesítések Naplója</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              A rendszer által automatikusan kiküldött legutóbbi üzenetek és riasztások.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
            Összesen: {logs.length} db
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-500 space-y-3">
            <Mail className="w-8 h-8 mx-auto text-gray-600" />
            <p>Még nincs naplózott értesítés. Kattints a fenti &bdquo;Teszt Email Küldése&rdquo; gombra a kipróbáláshoz!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {logs.map((log) => {
              const isError = log.type === 'system_error';
              const isInquiry = log.type === 'contact_inquiry';
              const isChat = log.type === 'chatbot_question';

              return (
                <div 
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="p-4 sm:p-5 hover:bg-white/[0.03] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isError 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                        : isInquiry
                        ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                        : isChat
                        ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {isError ? <AlertTriangle className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isError ? 'bg-rose-500/20 text-rose-400' :
                          isInquiry ? 'bg-neon-blue/20 text-neon-blue' :
                          isChat ? 'bg-neon-purple/20 text-neon-purple' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {log.type}
                        </span>
                        <span className="font-semibold text-white">{log.subject}</span>
                      </div>
                      <p className="text-gray-400 line-clamp-1">{log.preview}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:shrink-0 text-gray-500 text-[11px] justify-between sm:justify-end">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.createdAt).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
                      {log.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="max-w-xl w-full glass-panel border border-neon-purple/40 rounded-3xl p-6 bg-nexus-950 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-neon-blue" />
                <h3 className="font-bold text-white text-sm">Értesítés Részletei</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-white/5"
              >
                Bezárás
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Tárgy:</span>
                <span className="font-bold text-white text-sm">{selectedLog.subject}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <span className="text-gray-400 block text-[10px]">Címzett:</span>
                  <span className="font-mono text-neon-blue font-semibold">{selectedLog.to}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Kiküldve:</span>
                  <span className="text-gray-200">{new Date(selectedLog.createdAt).toLocaleString('hu-HU')}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px] mb-1">Strukturált Adatok (Metadata):</span>
                <pre className="p-3 rounded-2xl bg-nexus-900 border border-white/10 text-gray-300 font-mono text-[11px] overflow-x-auto max-h-48">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-nexus-950 bg-neon-blue hover:opacity-90"
              >
                Rendben
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

