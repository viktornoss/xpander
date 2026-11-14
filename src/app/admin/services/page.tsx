'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Bot, Edit2, CheckCircle2, ArrowRight } from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/mock-data';
import { ServiceDetail } from '@/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceDetail[]>(INITIAL_SERVICES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSavePrice = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, pricingNote: editPrice } : s));
    setEditingId(null);
    setMessage('Szolgáltatás alapára frissítve!');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Szolgáltatás-Katalógus & Árlista
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Kezeld a weboldalon és az ügyfél-dashboardon megjelenő 7 kiemelt AI csomagot.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="rounded-3xl glass-panel p-6 border border-white/10 hover:border-neon-purple/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-neon-purple uppercase font-mono">{srv.slug}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                  {srv.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{srv.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-2">{srv.shortDesc}</p>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Árazási megjegyzés:</span>
                {editingId === srv.id ? (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="px-2 py-0.5 rounded bg-nexus-900 border border-white/20 text-white text-xs w-36"
                    />
                    <button
                      onClick={() => handleSavePrice(srv.id)}
                      className="px-2 py-0.5 rounded bg-neon-purple text-white text-xs font-bold"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-neon-blue font-bold font-mono">{srv.pricingNote}</span>
                    <button
                      onClick={() => {
                        setEditingId(srv.id);
                        setEditPrice(srv.pricingNote);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <Link
                href={`/services/${srv.slug}`}
                className="block text-center py-2 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Nyilvános Oldal Megtekintése →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

