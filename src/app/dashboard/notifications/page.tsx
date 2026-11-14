'use client';

import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAuth();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-neon-blue" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Értesítések</h1>
          <p className="text-xs text-gray-400 mt-1">Automatizációk futási és rendelési állapotváltozásai.</p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neon-blue font-semibold transition-colors"
        >
          Összes megjelölése olvasottként
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              n.read
                ? 'glass-panel border-white/5 opacity-70'
                : 'glass-panel border-neon-purple/40 bg-gradient-to-r from-neon-purple/10 to-transparent'
            }`}
          >
            <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{n.title}</span>
                <span className="text-[11px] text-gray-400 font-mono">{n.timestamp}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

