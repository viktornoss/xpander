'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WebsiteTourPresentation, { TOUR_CHAPTERS } from '@/components/video/WebsiteTourPresentation';
import { Play, Sparkles, Bot, Layers, Zap, BarChart3, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TourPage() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-semibold text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Zentrion.ai Hivatalos Rendszerbemutató</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase">
            A Teljes Vállalati AI Rendszerünk Bemutatása
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Ismerd meg lépésről lépésre, hogyan veszi át az Zentrion.ai a monoton operatív feladatokat, hogyan működik a 3D Voice AI és a valós idejű munkafolyamat motorunk.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsPlayerOpen(true)}
              className="px-8 py-4 rounded-full bg-white text-black font-extrabold text-sm sm:text-base shadow-[0_0_35px_rgba(255,255,255,0.4)] hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-black text-black" />
              <span>Interaktív Videós Tour Indítása (Magyar Hanggal)</span>
            </button>
          </div>
        </div>

        {/* Chapters Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {TOUR_CHAPTERS.map((ch, idx) => {
            const Icon = ch.accentIcon;
            return (
              <div 
                key={ch.id}
                onClick={() => setIsPlayerOpen(true)}
                className="rounded-2xl p-6 bg-neutral-950/80 border border-white/10 hover:border-white/30 transition-all duration-300 group cursor-pointer space-y-4 hover:-translate-y-1 shadow-xl relative overflow-hidden"
              >
                <div className="glass-rim-top" />
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs text-neutral-400">
                    {idx + 1}. Fejezet • {ch.durationSec || 18}s
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    {ch.badge.hu}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight mt-1 group-hover:text-white transition-colors">
                    {ch.title.hu}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {ch.subtitle.hu}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  {ch.features.hu.map((f, i) => (
                    <div key={i} className="text-[11px] text-neutral-300 flex items-center gap-2">
                      <span className="text-white font-bold">✓</span>
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <Footer />

      {/* The Full Interactive Guided Tour Presentation Modal */}
      <WebsiteTourPresentation
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />
    </div>
  );
}

