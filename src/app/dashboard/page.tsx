'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Activity, 
  Clock, 
  TrendingUp, 
  Zap, 
  Play, 
  CheckCircle2, 
  Bot, 
  MessageSquare, 
  ShoppingBag, 
  ArrowRight, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ClientDashboardOverview() {
  const { 
    currentUser, 
    automations, 
    chatbots, 
    orders, 
    logs, 
    toggleAutomationStatus, 
    runAutomationTest 
  } = useAuth();

  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const activeAutomationsCount = automations.filter(a => a.status === 'active').length;
  const totalRuns = automations.reduce((acc, curr) => acc + curr.totalRuns, 0);

  const handleRunTest = async (id: string) => {
    setTestingId(id);
    setTestResult(null);
    const res = await runAutomationTest(id);
    setTestingId(null);
    setTestResult(res.message);
    setTimeout(() => setTestResult(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-neon-blue/15 via-nexus-900 to-neon-purple/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-neon-blue">
              Ügyfél Vezérlőpult • {currentUser?.company || 'TechVentures Kft.'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Üdvözlünk újra, {currentUser?.name || 'Kovács Tamás'}!
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
              Rendszereid a háttérben zavartalanul működnek. Ebben a hónapban becsült <strong>136 munkaórát</strong> takarítottál meg automatizációval.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/automations"
              className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-95 transition-all shadow-neon-blue/20 shadow-md flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Automatizációk Kezelése</span>
            </Link>
          </div>
        </div>
      </div>

      {testResult && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Active automations */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Aktív Rendszerek</span>
            <div className="w-8 h-8 rounded-xl bg-neon-blue/15 text-neon-blue flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {activeAutomationsCount} <span className="text-xs font-normal text-gray-400">/ {automations.length}</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Minden motor trigger éles</span>
          </div>
        </div>

        {/* Card 2: Total tasks */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Lefutott Feladatok</span>
            <div className="w-8 h-8 rounded-xl bg-neon-purple/15 text-neon-purple flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalRuns.toLocaleString('hu-HU')}
          </div>
          <div className="text-[11px] text-neon-purple flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18% növekedés előző héthez</span>
          </div>
        </div>

        {/* Card 3: Chatbot conversations */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">AI Chatbot Ügyfelek</span>
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/15 text-neon-cyan flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            2,465
          </div>
          <div className="text-[11px] text-neon-cyan font-medium">
            Átlagos válaszidő: <strong>1.1 mp</strong>
          </div>
        </div>

        {/* Card 4: Hours saved */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Megtakarított Idő</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            136 <span className="text-xs font-normal text-gray-400">munkaóra</span>
          </div>
          <div className="text-[11px] text-gray-400 font-medium">
            Becsült bérköltség: ~ 612.000 Ft
          </div>
        </div>

      </div>

      {/* Main Grid: Active Automations + Chatbots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 cols: Active Automations list */}
        <div className="lg:col-span-8 rounded-3xl glass-panel p-6 border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Aktív AI Munkafolyamatok</h2>
              <p className="text-xs text-gray-400">Automatikus saját TypeScript és OpenAI integrációk valós időben</p>
            </div>
            <Link
              href="/dashboard/automations"
              className="text-xs text-neon-blue hover:underline font-semibold flex items-center gap-1"
            >
              <span>Összes kezelése</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {automations.map((auto) => (
              <div
                key={auto.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{auto.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      auto.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {auto.status === 'active' ? 'Aktív' : 'Szünetel'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1">{auto.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1">
                    <span>Trigger: <strong className="text-gray-300">{auto.trigger}</strong></span>
                    <span>Lefutások: <strong className="text-white font-mono">{auto.totalRuns}</strong></span>
                    <span>Utolsó futás: <strong className="text-gray-300">{auto.lastRun}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleRunTest(auto.id)}
                    disabled={testingId === auto.id}
                    className="px-3 py-1.5 rounded-xl bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/30 text-neon-blue text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    title="Azonnali tesztelés a natív motoron keresztül"
                  >
                    <Play className={`w-3.5 h-3.5 ${testingId === auto.id ? 'animate-spin' : ''}`} />
                    <span>{testingId === auto.id ? 'Fut...' : 'Teszt'}</span>
                  </button>

                  <button
                    onClick={() => toggleAutomationStatus(auto.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      auto.status === 'active'
                        ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                        : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    {auto.status === 'active' ? 'Szüneteltetés' : 'Bekapcsolás'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 cols: Chatbots & Orders Summary */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Chatbots widget */}
          <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-neon-purple" />
                <span>AI Chatbotjaid</span>
              </h3>
              <Link href="/dashboard/chatbots" className="text-[11px] text-neon-purple hover:underline">
                Kezelő →
              </Link>
            </div>

            <div className="space-y-3">
              {chatbots.map((bot) => (
                <div key={bot.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{bot.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                      {bot.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Modell: <span className="text-neon-blue font-mono">{bot.model}</span> • Tudásbázis: {bot.knowledgeBaseFilesCount} fájl
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 pt-1 border-t border-white/5">
                    <span>{bot.totalConversations} beszélgetés</span>
                    <span className="text-emerald-400">★ {bot.satisfactionScore} elégedettség</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders widget */}
          <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-neon-blue" />
                <span>Megrendelt Rendszerek</span>
              </h3>
              <Link href="/dashboard/orders" className="text-[11px] text-neon-blue hover:underline">
                Részletek →
              </Link>
            </div>

            <div className="space-y-2.5">
              {orders.slice(0, 3).map((ord) => (
                <div key={ord.id} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-white">
                    <span className="truncate">{ord.serviceTitle}</span>
                    <span className="text-neon-blue font-mono shrink-0 ml-2">{ord.price}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Státusz: <strong className="text-amber-400 uppercase">{ord.status}</strong></span>
                    <span>{ord.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/services"
              className="block text-center py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 transition-colors"
            >
              + Új Szolgáltatás Igénylése
            </Link>
          </div>

        </div>

      </div>

      {/* Execution Logs */}
      <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Valós Idejű Végrehajtási Napló (Telemetry Logs)</span>
          </h2>
          <span className="text-[11px] text-gray-400 font-mono">Legutóbbi események</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-nexus-900 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-400">{log.timestamp}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                  {log.status.toUpperCase()} ({log.executionTimeMs} ms)
                </span>
                <span className="text-white font-sans font-medium">{log.automationTitle}:</span>
                <span className="text-gray-300 font-sans text-xs">{log.payloadSummary}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

