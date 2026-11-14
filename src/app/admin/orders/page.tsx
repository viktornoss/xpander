'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  User, 
  Filter, 
  Edit3, 
  Save, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ServiceOrder } from '@/types';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => 
    filterStatus === 'all' ? true : o.status === filterStatus
  );

  const handleStatusChange = (orderId: string, status: ServiceOrder['status']) => {
    updateOrderStatus(orderId, status);
    setMessage(`Rendelés állapota frissítve: ${status.toUpperCase()}`);
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
            Megrendelések & Fejlesztési Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Kezeld az ügyfelek által leadott megrendeléseket, rendelj hozzájuk mérnököt és frissítsd a státuszokat.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Összes' },
            { id: 'pending', label: 'Igény rögzítve' },
            { id: 'in_progress', label: 'Fejlesztés' },
            { id: 'review', label: 'Tesztelés' },
            { id: 'completed', label: 'Élesítve' },
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

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((ord) => (
          <div
            key={ord.id}
            className="rounded-3xl glass-panel p-6 border border-white/10 hover:border-neon-purple/30 transition-all space-y-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{ord.serviceTitle}</h3>
                  <span className="text-xs font-mono font-bold text-neon-blue px-2 py-0.5 rounded bg-neon-blue/10">
                    {ord.packageType}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {ord.price}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Ügyfél: <strong className="text-white">{ord.clientName}</strong> ({ord.clientCompany}) • Azonosító: <span className="font-mono">{ord.id}</span>
                </div>
              </div>

              {/* Status Switcher for Admin */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-semibold mr-1">Fázis:</span>
                <select
                  value={ord.status}
                  onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-nexus-900 border border-neon-purple/40 text-white text-xs font-bold focus:outline-none"
                >
                  <option value="pending">🟡 Új Igény (Pending)</option>
                  <option value="in_progress">🔵 Fejlesztés alatt (In Progress)</option>
                  <option value="review">🟣 Tesztelés / Ügyfélellenőrzés (Review)</option>
                  <option value="completed">🟢 Élesítve & Átadva (Completed)</option>
                </select>
              </div>
            </div>

            {/* Engineer & Notes row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Hozzárendelt AI Mérnök</span>
                <div className="text-white font-medium">{ord.assignedEngineer || 'Nagy Viktor (Admin / Lead)'}</div>
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
          </div>
        ))}
      </div>

    </div>
  );
}

