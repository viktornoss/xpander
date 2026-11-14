'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  User, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { INITIAL_SERVICES } from '@/lib/mock-data';

export default function ClientOrdersPage() {
  const { orders, addOrder, currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // New order form state
  const [selectedServiceId, setSelectedServiceId] = useState(INITIAL_SERVICES[0].id);
  const [packageType, setPackageType] = useState<'Starter' | 'Growth' | 'Enterprise'>('Growth');
  const [notes, setNotes] = useState('');

  const myOrders = orders.filter(o => o.userId === currentUser?.id || o.clientName === currentUser?.name);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const service = INITIAL_SERVICES.find(s => s.id === selectedServiceId) || INITIAL_SERVICES[0];
    
    addOrder({
      serviceId: service.id,
      serviceTitle: service.title,
      packageType,
      price: packageType === 'Starter' ? '240.000 Ft' : packageType === 'Growth' ? '460.000 Ft' : '890.000 Ft',
      notes
    });

    setModalOpen(false);
    setNotes('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">Élesítve / Kész</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue border border-neon-blue/30 text-[10px] font-bold uppercase">Fejlesztés alatt</span>;
      case 'review':
        return <span className="px-2.5 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30 text-[10px] font-bold uppercase">Tesztelés alatt</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase">Igény rögzítve</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Megrendelések & AI Rendszerek Állapota
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Kövesd nyomon az igényelt automatizációk szállítási fázisait és mérnöki előrehaladását.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-95 transition-all shadow-neon-blue/20 shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Új Rendszer Megrendelése</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {myOrders.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border border-white/10 space-y-3">
            <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-base font-bold text-white">Még nincs leadott megrendelésed</h3>
            <p className="text-xs text-gray-400">Válassz a 7 vállalati AI szolgáltatásunk közül az induláshoz!</p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20"
            >
              Szolgáltatás igénylése
            </button>
          </div>
        ) : (
          myOrders.map((ord) => (
            <div
              key={ord.id}
              className="rounded-3xl glass-panel p-6 border border-white/10 hover:border-neon-blue/30 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{ord.serviceTitle}</h3>
                    {getStatusBadge(ord.status)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Megrendelés azonosító: <span className="font-mono text-gray-300">{ord.id}</span> • Csomag: <strong className="text-neon-purple">{ord.packageType}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-extrabold text-white font-mono">{ord.price}</div>
                  <div className="text-[11px] text-gray-400">Rögzítve: {ord.createdAt}</div>
                </div>
              </div>

              {/* Progress & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-300 pt-1">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Felelős Mérnök</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <User className="w-3.5 h-3.5 text-neon-blue" />
                    <span>{ord.assignedEngineer || 'Kijelölés alatt'}</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Várható Átadás</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-neon-purple" />
                    <span>{ord.deliveryDate || 'Egyeztetés alatt'}</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Megjegyzés / Specifikáció</span>
                  <span className="text-gray-400 italic text-[11px] line-clamp-1">{ord.notes || 'Nincs külön megjegyzés'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Order Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-nexus-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6 relative animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white">Új AI Rendszer Megrendelése</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                Bezárás ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300">Válassz Szolgáltatást *</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue"
                >
                  {INITIAL_SERVICES.map(s => (
                    <option key={s.id} value={s.id}>{s.title} ({s.pricingNote})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300">Csomagtípus</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Starter', 'Growth', 'Enterprise'] as const).map(pkg => (
                    <button
                      key={pkg}
                      type="button"
                      onClick={() => setPackageType(pkg)}
                      className={`py-2 rounded-xl border text-xs font-semibold ${
                        packageType === pkg 
                          ? 'bg-neon-blue text-nexus-950 border-neon-blue font-bold' 
                          : 'bg-white/5 border-white/10 text-gray-300'
                      }`}
                    >
                      {pkg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300">Különleges igény vagy meglévő szoftverek</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Pl. HubSpot CRM-hez szeretnénk kapcsolni, 1500 lead havonta..."
                  className="w-full p-3 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-95 transition-all shadow-neon-blue/20 shadow-md"
                >
                  Megrendelés Leadása
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

