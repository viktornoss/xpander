'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  User, 
  Filter, 
  Edit3, 
  Save, 
  Sparkles,
  DollarSign,
  XCircle,
  AlertTriangle,
  RefreshCw,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ServiceOrder } from '@/types';

const PAYMENT_STATUS_CONFIG = {
  unpaid: {
    label: '❌ Nincs kifizetve',
    shortLabel: 'Nem fizetve',
    color: 'text-red-400',
    bg: 'bg-red-500/15 border-red-500/30',
    dot: 'bg-red-500',
  },
  paid: {
    label: '✅ Kifizetve',
    shortLabel: 'Kifizetve',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15 border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  refunded: {
    label: '🔄 Visszatérítve',
    shortLabel: 'Visszatérítve',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15 border-amber-500/30',
    dot: 'bg-amber-500',
  },
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, updateOrderPaymentStatus } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => {
    const statusMatch = filterStatus === 'all' ? true : o.status === filterStatus;
    const paymentMatch = filterPayment === 'all' ? true : (o.paymentStatus || 'unpaid') === filterPayment;
    return statusMatch && paymentMatch;
  });

  // Payment summary stats
  const stats = useMemo(() => {
    const total = orders.length;
    const paid = orders.filter(o => (o.paymentStatus || 'unpaid') === 'paid').length;
    const unpaid = orders.filter(o => (o.paymentStatus || 'unpaid') === 'unpaid').length;
    const refunded = orders.filter(o => o.paymentStatus === 'refunded').length;
    return { total, paid, unpaid, refunded };
  }, [orders]);

  const handleStatusChange = (orderId: string, status: ServiceOrder['status']) => {
    updateOrderStatus(orderId, status);
    setMessage(`Rendelés állapota frissítve: ${status.toUpperCase()}`);
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePaymentToggle = (orderId: string, currentPaymentStatus: string) => {
    const nextStatus: ServiceOrder['paymentStatus'] = 
      currentPaymentStatus === 'paid' ? 'unpaid' : 'paid';
    updateOrderPaymentStatus(orderId, nextStatus);
    setMessage(nextStatus === 'paid' 
      ? '✅ Megrendelés KIFIZETETTNEK jelölve!' 
      : '❌ Fizetési jelölés visszavonva.'
    );
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRefund = (orderId: string) => {
    updateOrderPaymentStatus(orderId, 'refunded');
    setMessage('🔄 Megrendelés VISSZATÉRÍTETTNEK jelölve.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveNotes = (orderId: string) => {
    const ord = orders.find(o => o.id === orderId);
    if (ord) {
      updateOrderStatus(orderId, ord.status, editNotes);
    }
    setEditingOrderId(null);
    setMessage('Mérnöki megjegyzés mentve!');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Megrendelések & Fizetések
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Kezeld az ügyfelek megrendeléseit, jelöld ki a fizetési státuszokat és frissítsd a fázisokat.
          </p>
        </div>
      </div>

      {/* Payment Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl glass-panel p-4 border border-white/10 space-y-1">
          <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Összes rendelés</div>
          <div className="text-2xl font-black text-white">{stats.total}</div>
        </div>
        <div className="rounded-2xl glass-panel p-4 border border-emerald-500/20 space-y-1">
          <div className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Kifizetve
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.paid}</div>
        </div>
        <div className="rounded-2xl glass-panel p-4 border border-red-500/20 space-y-1">
          <div className="text-[10px] uppercase font-bold text-red-500 tracking-wider flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Nem fizetve
          </div>
          <div className="text-2xl font-black text-red-400">{stats.unpaid}</div>
        </div>
        <div className="rounded-2xl glass-panel p-4 border border-amber-500/20 space-y-1">
          <div className="text-[10px] uppercase font-bold text-amber-500 tracking-wider flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Visszatérítve
          </div>
          <div className="text-2xl font-black text-amber-400">{stats.refunded}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status filter */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Fejlesztési Fázis:</span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Összes' },
              { id: 'pending', label: '🟡 Igény rögzítve' },
              { id: 'in_progress', label: '🔵 Fejlesztés' },
              { id: 'review', label: '🟣 Tesztelés' },
              { id: 'completed', label: '🟢 Élesítve' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === f.id
                    ? 'bg-neon-purple text-white shadow-neon-purple/20 shadow'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payment filter */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Fizetés Szűrő:</span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Mind', color: '' },
              { id: 'paid', label: '✅ Kifizetve', color: 'text-emerald-400' },
              { id: 'unpaid', label: '❌ Nem fizetve', color: 'text-red-400' },
              { id: 'refunded', label: '🔄 Visszatérítve', color: 'text-amber-400' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterPayment(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterPayment === f.id
                    ? 'bg-white/20 text-white border border-white/30'
                    : `bg-white/5 ${f.color || 'text-gray-400'} hover:text-white border border-white/10`
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            Nincs a szűrőnek megfelelő megrendelés.
          </div>
        )}

        {filteredOrders.map((ord) => {
          const ps = ord.paymentStatus || 'unpaid';
          const psConfig = PAYMENT_STATUS_CONFIG[ps as keyof typeof PAYMENT_STATUS_CONFIG] || PAYMENT_STATUS_CONFIG.unpaid;
          
          return (
            <div
              key={ord.id}
              className={`rounded-3xl glass-panel p-6 border transition-all space-y-4 ${
                ps === 'paid' 
                  ? 'border-emerald-500/25 hover:border-emerald-500/40' 
                  : ps === 'refunded' 
                    ? 'border-amber-500/25 hover:border-amber-500/40'
                    : 'border-red-500/20 hover:border-red-500/35'
              }`}
            >
              {/* Top row: title + payment badge + status */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-white">{ord.serviceTitle}</h3>
                    <span className="text-xs font-mono font-bold text-neon-blue px-2 py-0.5 rounded bg-neon-blue/10">
                      {ord.packageType}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {ord.price}
                    </span>

                    {/* Payment Status Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${psConfig.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${psConfig.dot} ${ps === 'unpaid' ? 'animate-pulse' : ''}`}></span>
                      <span className={psConfig.color}>{psConfig.shortLabel}</span>
                      {ord.paidAt && ps === 'paid' && (
                        <span className="text-[9px] text-emerald-300/70 font-normal ml-1">({ord.paidAt})</span>
                      )}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Ügyfél: <strong className="text-white">{ord.clientName}</strong> ({ord.clientCompany}) • Azonosító: <span className="font-mono">{ord.id}</span>
                  </div>
                </div>

                {/* Status + Payment Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Payment toggle button */}
                  {ps !== 'paid' ? (
                    <button
                      onClick={() => handlePaymentToggle(ord.id, ps)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Kifizetve ✓</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePaymentToggle(ord.id, ps)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 font-bold text-xs flex items-center gap-1.5 border border-white/10 hover:border-red-500/30 transition-all cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Visszajelölés (Nem fizetve)</span>
                    </button>
                  )}

                  {ps === 'paid' && (
                    <button
                      onClick={() => handleRefund(ord.id)}
                      className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 font-bold text-xs flex items-center gap-1 border border-amber-500/20 transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Visszatérítve</span>
                    </button>
                  )}

                  {/* Dev status selector */}
                  <select
                    value={ord.status}
                    onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-nexus-900 border border-neon-purple/40 text-white text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="pending">🟡 Új Igény (Pending)</option>
                    <option value="in_progress">🔵 Fejlesztés alatt</option>
                    <option value="review">🟣 Tesztelés / Ellenőrzés</option>
                    <option value="completed">🟢 Élesítve & Átadva</option>
                  </select>
                </div>
              </div>

              {/* Engineer & Notes row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Hozzárendelt AI Mérnök</span>
                  <div className="text-white font-medium">{ord.assignedEngineer || 'Tolnai Viktor (Admin / Lead)'}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Várható Átadás Dátuma</span>
                  <div className="text-white font-mono">{ord.deliveryDate || '2026-03-25'}</div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Belső Fejlesztési Jegyzet</span>
                    {editingOrderId !== ord.id && (
                      <button
                        onClick={() => {
                          setEditingOrderId(ord.id);
                          setEditNotes(ord.notes || '');
                        }}
                        className="text-neon-purple text-[10px] hover:underline"
                      >
                        Szerkesztés
                      </button>
                    )}
                  </div>

                  {editingOrderId === ord.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg bg-nexus-900 border border-white/20 text-white text-xs"
                      />
                      <button
                        onClick={() => handleSaveNotes(ord.id)}
                        className="px-2.5 py-1 rounded-lg bg-neon-purple text-white text-xs font-bold"
                      >
                        Mentés
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-300 italic text-[11px] truncate">
                      {ord.notes || 'Nincs külön megjegyzés'}
                    </div>
                  )}
                </div>
              </div>

              {/* PayPal quick link for unpaid orders */}
              {ps === 'unpaid' && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#001428]/60 border border-[#0070ba]/30 text-xs">
                  <CreditCard className="w-4 h-4 text-[#38bdf8] shrink-0" />
                  <span className="text-[#7dd3fc]">
                    PayPal fogadó fiók: <strong className="text-white font-mono">2viktornosss@gmail.com</strong>
                  </span>
                  <a
                    href="https://paypal.me/2viktornosss"
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto px-3 py-1.5 rounded-lg bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-[10px] flex items-center gap-1 transition-all"
                  >
                    PayPal Ellenőrzés
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
