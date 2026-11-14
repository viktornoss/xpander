'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  Layers, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Workflow,
  ExternalLink,
  Mail
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GLOBAL_SYSTEM_STATS } from '@/lib/mock-data';

export default function AdminOverviewPage() {
  const { orders, users, automations, updateOrderStatus } = useAuth();
  const [statusUpdatedId, setStatusUpdatedId] = useState<string | null>(null);

  const handleQuickStatus = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
    setStatusUpdatedId(orderId);
    setTimeout(() => setStatusUpdatedId(null), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ügynökségi Főirányítópult & Metrikák
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Valós idejű telemetria, ügyfélmegrendelések és automatizációs infrastruktúra felügyelet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30 font-bold">
            MRR: {GLOBAL_SYSTEM_STATS.monthlyRecurringRevenue}
          </span>
        </div>
      </div>

      {/* Central Email Dispatcher Banner */}
      <div className="rounded-2xl glass-panel p-4 border border-neon-blue/30 bg-nexus-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neon-blue/20 text-neon-blue flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Központi Rendszer Értesítési Cím:</span>
              <span className="font-mono text-neon-blue text-xs font-bold">zentrion-automation.ai@outlook.hu</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Minden ajánlatkérés, hibariasztás és chatbot lead ide érkezik.
            </p>
          </div>
        </div>

        <Link
          href="/admin/notifications"
          className="px-3.5 py-1.5 rounded-xl bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/20 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <span>Értesítések Naplója & Teszt</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {statusUpdatedId && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Megrendelés státusza sikeresen frissítve az ügyfél számára!</span>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Havi Visszatérő Bevétel</span>
            <div className="w-8 h-8 rounded-xl bg-neon-purple/20 text-neon-purple flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {GLOBAL_SYSTEM_STATS.monthlyRecurringRevenue}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24% növekedés ebben a negyedévben</span>
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Aktív Ügyfelek</span>
            <div className="w-8 h-8 rounded-xl bg-neon-blue/20 text-neon-blue flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {users.filter(u => u.role === 'client').length} <span className="text-xs font-normal text-gray-400">cég</span>
          </div>
          <div className="text-[11px] text-neon-blue font-medium">
            100%-os megújítási arány
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Feldolgozott AI Feladat</span>
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/20 text-neon-cyan flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {GLOBAL_SYSTEM_STATS.tasksProcessedThisMonth.toLocaleString('hu-HU')}
          </div>
          <div className="text-[11px] text-gray-400 font-medium">
            Átlagos futási idő: <strong>418 ms</strong>
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">ZentrionFlow Motor & Szerver Uptime</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {GLOBAL_SYSTEM_STATS.systemUptimePercentage}%
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>184 / 187 webhook egészséges</span>
          </div>
        </div>

      </div>

      {/* Orders pipeline table */}
      <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Megrendelések & Implementációs Pipeline</h2>
            <p className="text-xs text-gray-400">Itt tudod adminisztrátorként léptetni a fázisokat az ügyfelek felé</p>
          </div>
          <Link href="/admin/orders" className="text-xs text-neon-purple hover:underline font-semibold">
            Összes megrendelés →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 uppercase font-semibold text-[10px]">
                <th className="pb-3">Ügyfél & Cég</th>
                <th className="pb-3">Szolgáltatás</th>
                <th className="pb-3">Csomag</th>
                <th className="pb-3">Ár</th>
                <th className="pb-3">Jelenlegi Státusz</th>
                <th className="pb-3 text-right">Státusz Módosítása</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-white">{ord.clientName}</div>
                    <div className="text-[11px] text-gray-400">{ord.clientCompany}</div>
                  </td>
                  <td className="py-3.5 text-gray-300 font-medium">{ord.serviceTitle}</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-semibold text-neon-blue">
                      {ord.packageType}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono font-bold text-white">{ord.price}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      ord.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : ord.status === 'in_progress'
                        ? 'bg-neon-blue/20 text-neon-blue'
                        : ord.status === 'review'
                        ? 'bg-neon-purple/20 text-neon-purple'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickStatus(ord.id, 'in_progress')}
                        className="px-2.5 py-1 rounded-lg bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue text-[11px] font-semibold"
                        title="Fejlesztés alatt"
                      >
                        Fejlesztés
                      </button>
                      <button
                        onClick={() => handleQuickStatus(ord.id, 'review')}
                        className="px-2.5 py-1 rounded-lg bg-neon-purple/10 hover:bg-neon-purple/20 text-neon-purple text-[11px] font-semibold"
                        title="Tesztelés alatt"
                      >
                        Teszt
                      </button>
                      <button
                        onClick={() => handleQuickStatus(ord.id, 'completed')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold"
                        title="Élesítve / Kész"
                      >
                        Élesítés
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

