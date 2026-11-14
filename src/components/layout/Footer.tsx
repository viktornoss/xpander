'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';
import ZentrionLogo from '@/components/brand/ZentrionLogo';
import { INITIAL_SERVICES } from '@/lib/mock-data';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-neutral-400 relative overflow-hidden">
      {/* Subtle monochrome ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-white/[0.02] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <ZentrionLogo size="lg" showSubtitle subtitleText="Enterprise AI Platform" linkToHome />
            
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              B2B vállalkozások skálázása autonóm AI agentekkel, RAG chatbotokkal és a saját TypeScript munkafolyamat-motorral. Autonóm digitális munkaerő a modern gazdaságban.
            </p>

            {/* Tech Badges in monochrome */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
                Hivatalos Integrációs Architektúra
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> OpenAI GPT-4o
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                  ZentrionFlow TS Engine
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                  Supabase DB
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                  Next.js App
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">AI Szolgáltatások</h4>
            <ul className="space-y-2 text-sm">
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
              <li>
                <Link 
                  href="/services" 
                  className="text-white font-semibold hover:underline inline-flex items-center gap-1 pt-1"
                >
                  Mind a 7 szolgáltatás →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Dashboards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">SaaS Platform</h4>
            <ul className="space-y-2 text-sm">
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
                <Link href="/admin" className="hover:text-white font-medium transition-colors flex items-center gap-1">
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
                  Új Fiók Létrehozása
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Audit */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Kapcsolat & Audit</h4>
            <p className="text-sm text-neutral-400">
              Kérj ingyenes 20 perces folyamat-auditot, és megtudod, hol takaríthatsz meg legtöbb időt.
            </p>
            <div className="pt-1">
              <Link
                href="/audit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-white hover:bg-neutral-200 shadow-md transition-all"
              >
                <span>Ingyenes AI Folyamat-Audit</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </Link>
            </div>
            <div className="pt-2 text-xs text-neutral-400 space-y-1">
              <div>
                Email:{' '}
                <a href="mailto:xpander-automation.ai@outlook.hu" className="text-neutral-300 hover:text-white transition-colors">
                  xpander-automation.ai@outlook.hu
                </a>
              </div>
              <div>Tel: +36 1 800 9999</div>
              <div>Iroda: 1054 Budapest, Szabadság tér 7.</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} Zentrion.ai Enterprise Systems. Minden jog fenntartva.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-6">
            <Link href="/adatvedelem" className="hover:text-white transition-colors">Adatvédelmi tájékoztató</Link>
            <Link href="/aszf" className="hover:text-white transition-colors">ÁSZF</Link>
            <Link href="/sla" className="hover:text-white transition-colors">SLA Garanciák</Link>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Rendszerek működése: 99.98%
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
