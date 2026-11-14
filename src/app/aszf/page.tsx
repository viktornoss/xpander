'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import XpanderLogo from '@/components/brand/XpanderLogo';
import { ShieldCheck, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AszfPage() {
  return (
    <div className="min-h-screen bg-black text-neutral-200 flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Breadcrumb & Header */}
          <div className="space-y-4 border-b border-white/10 pb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Vissza a főoldalra</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <FileText className="w-6 h-6 text-neon-blue" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Általános Szerződési Feltételek (ÁSZF)
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Hatályos: 2026. január 1-től visszavonásig • Xpander.ai Vállalati Rendszerek
                </p>
              </div>
            </div>
          </div>

          {/* Legal Content */}
          <div className="space-y-10 text-sm leading-relaxed text-gray-300">
            
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-neon-blue">1.</span> A Szolgáltató Adatai és Hatály
              </h2>
              <p>
                Jelen Általános Szerződési Feltételek (a továbbiakban: <strong>ÁSZF</strong>) az <strong>Xpander.ai</strong> (a továbbiakban: Szolgáltató) által nyújtott szoftverfejlesztési, autonóm AI ügynök (agent) tervezési, munkafolyamat-automatizálási (XpanderFlow) és RAG chatbot üzemeltetési szolgáltatások igénybevételének jogi feltételeit rögzíti.
              </p>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1.5 text-xs text-gray-300">
                <p><strong>Szolgáltató elnevezése:</strong> Xpander Automation & AI Systems</p>
                <p><strong>Központi kapcsolattartó email:</strong> xpander-automation.ai@outlook.hu</p>
                <p><strong>Székhely:</strong> 1054 Budapest, Szabadság tér 7. (Bank Center)</p>
                <p><strong>Hivatalos weboldal:</strong> https://xpander.ai</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-neon-blue">2.</span> A Szolgáltatás Tárgya és Technológiai Garanciák
              </h2>
              <p>
                A Szolgáltató vállalja B2B és vállalati ügyfelei részére egyedi, saját natív TypeScript motorra (XpanderFlow) épülő automatizációk, API-integrációk, intelligens email-feldolgozók, valamint mesterséges intelligenciára épülő döntéshozó és ügyfélszolgálati rendszerek kifejlesztését és karbantartását.
              </p>
              <ul className="space-y-2 pl-4 list-disc marker:text-neon-blue text-xs sm:text-sm text-gray-300">
                <li><strong>Függetlenségi garancia:</strong> A Szolgáltató rendszerei semmilyen külső korlátozott platformtól (mint például Make.com, n8n vagy Zapier) nem függnek; a végrehajtás saját dedikált backend motoron történik.</li>
                <li><strong>Saját API-k és webhookok:</strong> A munkafolyamatokhoz egyedi, titkosított webhook-végpontok és adatbázis-rekordok tartoznak.</li>
                <li><strong>OpenAI és LLM integráció:</strong> Az intelligens funkciók a hivatalos API végpontokon keresztül biztonságosan, adatmegőrzési tilalommal (Zero Data Retention) kerülnek feldolgozásra.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-neon-blue">3.</span> Szerződéskötés Menete, Audit és Megrendelés
              </h2>
              <p>
                A szerződés az Ügyfél által a weboldalon kezdeményezett Ingyenes AI Audit űrlap kitöltésével vagy egyedi ajánlat elfogadásával, valamint az erről szóló elektronikus visszaigazolással jön létre. Az ajánlatkérés díjmentes és semmilyen vásárlási kötelezettséggel nem jár.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-neon-blue">4.</span> Díjazás, Számlázás és 30 Napos Pénzvisszafizetési Garancia
              </h2>
              <p>
                A szolgáltatási csomagok (Starter, Growth, Enterprise) díjai fix vagy egyedi megállapodás szerint kerülnek elszámolásra. Az elszámolás forintban (HUF) vagy euróban (EUR) történik elektronikus számla ellenében.
              </p>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-300 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>30 Napos Kérdés Nélküli Pénzvisszafizetési Garancia:</strong> Amennyiben a bevezetett AI munkafolyamat vagy chatbot a megadott specifikációk szerint nem hozza a vállalt időmegtakarítást, a megrendelő az átadástól számított 30 napon belül a teljes bevezetési díj 100%-os visszatérítésére jogosult.
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-neon-blue">5.</span> Titoktartás (NDA) és Szellemi Tulajdonjogok
              </h2>
              <p>
                A Szolgáltató szigorú titoktartási kötelezettséget vállal (NDA) az Ügyfél minden üzleti titkára, belső adatbázisára, ügyféladataira és munkafolyamataira vonatkozóan. Az átadott és kifizetett egyedi munkafolyamatok forráskódja és működési logikája a megrendelő kizárólagos tulajdonát képezi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-neon-blue">6.</span> Üzemeltetés és SLA Kapcsolat
              </h2>
              <p>
                A folyamatok folyamatos rendelkezésre állására, hibajavítási határidőire és műszaki biztonságára a különálló <Link href="/sla" className="text-neon-blue underline font-semibold">Service Level Agreement (SLA)</Link> dokumentumban rögzített feltételek az irányadók.
              </p>
            </section>

          </div>

          {/* Footer banner */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400 text-center sm:text-left">
              Kérdésed merült fel a szerződési feltételekkel kapcsolatban? Írj nekünk:
              <br />
              <strong className="text-white">xpander-automation.ai@outlook.hu</strong>
            </div>
            <Link
              href="/#contact"
              className="px-5 py-2.5 rounded-xl bg-white text-nexus-950 font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              Kapcsolatfelvétel
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
