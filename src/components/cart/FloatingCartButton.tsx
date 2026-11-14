'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function FloatingCartButton() {
  const { totalItems, totalAmountFormatted, openCart, isOpen } = useCart();

  if (totalItems === 0 || isOpen) return null;

  return (
    <div className="fixed bottom-6 right-24 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={openCart}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-white text-black font-extrabold text-xs shadow-2xl hover:scale-105 transition-all border border-white/20"
        title="Kosár megnyitása"
        aria-label="Kosár megnyitása"
      >
        <div className="relative">
          <ShoppingBag className="w-4 h-4 text-black" />
          <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-black text-[10px] font-black flex items-center justify-center animate-pulse">
            {totalItems}
          </span>
        </div>
        <span className="font-mono font-bold hidden sm:inline">{totalAmountFormatted}</span>
      </button>
    </div>
  );
}

