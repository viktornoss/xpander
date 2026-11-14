'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Bot, 
  Headphones, 
  Mail, 
  Zap, 
  Database, 
  Calendar, 
  Cpu, 
  ArrowRight, 
  Check, 
  Sparkles,
  Layers
} from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/mock-data';

const iconMap: Record<string, React.ReactNode> = {
  Bot: <Bot className="w-7 h-7 text-neon-blue" />,
  Headphones: <Headphones className="w-7 h-7 text-neon-purple" />,
  Mail: <Mail className="w-7 h-7 text-neon-cyan" />,
  Zap: <Zap className="w-7 h-7 text-amber-400" />,
  Database: <Database className="w-7 h-7 text-indigo-400" />,
  Calendar: <Calendar className="w-7 h-7 text-emerald-400" />,
  Cpu: <Cpu className="w-7 h-7 text-rose-400" />,
};

export default function ServicesIndexPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-xs font-semibold text-neon-blue">
              <Layers className="w-3.5 h-3.5" />
              <span>Vállalati AI Architektúrák</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              AI Automatizációs Szolgáltatásaink
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">
              Minden megoldásunk éles, integrált és azonnal mérhető eredményeket hoz. Kattints a szolgáltatásokra az interaktív kipróbáláshoz és a technikai részletekhez!
            </p>
          </div>

          {/* Grid of all 7 Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INITIAL_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="rounded-3xl glass-panel p-8 border border-white/10 hover:border-neon-purple/50 transition-all flex flex-col justify-between group shadow-xl relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {iconMap[srv.iconName] || <Bot className="w-7 h-7 text-neon-blue" />}
                    </div>
                    {srv.badge && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                        {srv.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    {srv.shortDesc}
                  </p>

                  <div className="space-y-2 mb-6 border-t border-white/10 pt-4 text-xs text-gray-300">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Kiemelt Szállítási Elemek:
                    </span>
                    {srv.deliverables.slice(0, 3).map((d, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-neon-blue mt-0.5 shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="text-[11px] text-gray-400 font-medium">
                    {srv.pricingNote}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/services/${srv.slug}#demo`}
                      className="py-2.5 rounded-xl font-bold text-xs text-nexus-950 bg-neon-blue hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-neon-blue/20 shadow-sm"
                    >
                      <span>🎮 Élő Demó</span>
                    </Link>
                    <Link
                      href={`/services/${srv.slug}`}
                      className="py-2.5 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-1.5 border border-white/10"
                    >
                      <span>Részletek</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

