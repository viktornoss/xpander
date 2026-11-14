'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import ZentrionLogo from '@/components/brand/ZentrionLogo';
import { INITIAL_SERVICES } from '@/lib/mock-data';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-neutral-400 relative overflow-hidden">
      {/* Top section divider */}
      <div className="section-divider" />

      {/* Subtle monochrome ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-white/[0.02] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <ZentrionLogo size="lg" showSubtitle subtitleText="Enterprise AI Platform" linkToHome />
            
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              B2B vállalkozások skálázása autonóm AI agentekkel, RAG chatbotokkal és a saját TypeScript munkafolyamat-motorral. Autonóm digitális munkaerő a modern gazdaságban.
            </p>

            {/* Live Operational Status */}
            <div className="pt-2 flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-mono text-neutral-300">
                Minden AI Rendszer Aktív & Optimális (SLA 99.98%)
              </span>
            </div>

            {/* Tech Badges in monochrome */}
            <div className="pt-3">
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold block mb-2.5">
                Hivatalos Integrációs Architektúra
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> OpenAI GPT-4o
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-[11px]">
                  ZentrionFlow TS Engine
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-[11px]">
                  Supabase DB
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-[11px]">
                  Next.js App
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">AI Szolgáltatások</h4>
            <ul className="space-y-2.5 text-sm">
              {INITIAL_SERVICES.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link 
                    href={`/services/${s.slug}`}
                    className="hover:text-white transition-colors block py-0.5"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link 
                  href="/services" 
                  className="text-white font-bold hover:underline inline-flex items-center gap-1 text-xs"
                >
                  Mind a 7 szolgáltatás →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Dashboards */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">SaaS Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Ügyfél-Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/automations" className="hover:text-white transition-colors">
                  Aktív Automatizációk
                </Link>
              </li>
              <li>
                <Link href="/dashboard/chatbots" className="hover:text-white transition-colors">
                  AI Chatbot Kezelő
                </Link>
              </li>
              <li>
                <Link href="/dashboard/orders" className="hover:text-white transition-colors">
                  Megrendelések & Státusz
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white font-semibold transition-colors flex items-center gap-1.5 text-white">
                  <Shield className="w-3.5 h-3.5 text-white" /> Admin Portál
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Bejelentkezés
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Új Fiók Regisztráció
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Audit */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Kapcsolat & Audit</h4>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Kérj ingyenes 20 perces folyamat-auditot, és megtudod, hol takaríthatsz meg legtöbb időt és költséget.
            </p>
            <div className="pt-1">
              <Link
                href="/audit"
                className="btn-premium inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-black bg-white shadow-lg cursor-pointer"
              >
                <span>Ingyenes AI Audit</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </Link>
            </div>
            <div className="pt-3 text-xs text-neutral-400 space-y-1.5">
              <div>
                Email:{' '}
                <a href="mailto:xpander-automation.ai@outlook.hu" className="text-white hover:underline transition-colors font-semibold">
                  xpander-automation.ai@outlook.hu
                </a>
              </div>
              <div>Tel: +36 1 800 9999</div>
              <div>Iroda: 1054 Budapest, Szabadság tér 7.</div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Zentrion.ai Corporation. Minden jog fenntartva.</p>
          <div className="flex items-center gap-6 text-neutral-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Adatkezelési Tájékoztató</Link>
            <Link href="/terms" className="hover:text-white transition-colors">ÁSZF</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Sütik</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
