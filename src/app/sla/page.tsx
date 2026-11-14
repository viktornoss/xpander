'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Activity, Clock, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SlaPage() {
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
                <Activity className="w-6 h-6 text-neon-cyan" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Service Level Agreement (SLA)
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Vállalati Rendelkezésre Állás & Műszaki Garanciák • Zentrion.ai
                </p>
              </div>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-3xl font-extrabold text-white">99.98%</div>
              <div className="text-xs font-semibold text-neon-blue uppercase tracking-wider">Éves Uptime Garancia</div>
              <p className="text-[11px] text-gray-400">Folyamatos 24/7 backend motor monitorozás és automatikus failover.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-3xl font-extrabold text-white">&lt; 1 Óra</div>
              <div className="text-xs font-semibold text-neon-purple uppercase tracking-wider">Kritikus Reakcióidő</div>
              <p className="text-[11px] text-gray-400">Dedikált ügyeleti mérnök azonnali beavatkozással leállás esetén.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-3xl font-extrabold text-white">100%</div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Pénzvisszafizetés</div>
              <p className="text-[11px] text-gray-400">30 napos feltétel nélküli garancia minden új bevezetésre.</p>
            </div>
          </div>

          {/* Legal and Technical SLA Terms */}
          <div className="space-y-10 text-sm leading-relaxed text-gray-300">
            
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-neon-cyan">1.</span> Hatály és Cél
              </h2>
              <p>
                Jelen Szolgáltatási Szint Megállapodás (SLA) határozza meg az <strong>Zentrion.ai</strong> által biztosított infrastruktúra és az egyedileg épített ZentrionFlow munkafolyamatok rendelkezésre állási követelményeit, a hibaelhárítás határidőit és a kötbérfeltételeket.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-neon-cyan">2.</span> Hibasúlyossági Szintek és Reakcióidők
              </h2>
              <div className="overflow-x-auto border border-white/10 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="p-3 font-semibold">Prioritás</th>
                      <th className="p-3 font-semibold">Meghatározás</th>
                      <th className="p-3 font-semibold">Reakcióidő (SLA)</th>
                      <th className="p-3 font-semibold">Megoldási Időablak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="p-3 font-bold text-rose-400">P1 - Kritikus</td>
                      <td className="p-3">Teljes folyamatleállás, a chatbot vagy webhook nem válaszol</td>
                      <td className="p-3 font-bold text-white">&lt; 1 óra</td>
                      <td className="p-3 font-bold text-white">&lt; 4 óra</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-400">P2 - Magas</td>
                      <td className="p-3">Részleges funkciókiesés (pl. lassabb CRM szinkron, nem kritikus webhook)</td>
                      <td className="p-3 font-bold text-white">&lt; 2 óra</td>
                      <td className="p-3 font-bold text-white">&lt; 8 óra</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-blue-400">P3 - Normál</td>
                      <td className="p-3">Kisebb konfigurációs kérés, nem kritikus sablonmódosítás</td>
                      <td className="p-3 font-bold text-white">&lt; 4 óra</td>
                      <td className="p-3 font-bold text-white">&lt; 24 óra</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-neon-cyan">3.</span> Tervezett Karbantartás
              </h2>
              <p>
                A tervezett rendszerkarbantartásokat a Szolgáltató kizárólag alacsony forgalmú időszakokban (jellemzően vasárnap 02:00 és 05:00 óra között) hajtja végre, és legalább 48 órával korábban értesíti az ügyfél technikai kapcsolattartóját. A tervezett karbantartás nem számít bele a nem tervezett leállási időbe.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-neon-cyan">4.</span> Kötbér és Jóváírási Garancia
              </h2>
              <p>
                Amennyiben a havi rendelkezésre állás 99.98% alá esik a Szolgáltatónak felróható okból, az Ügyfél az alábbi jóváírásra jogosult a havi üzemeltetési díjból:
              </p>
              <ul className="text-xs space-y-1.5 list-disc pl-5 text-gray-300">
                <li><strong>99.0% – 99.8% között:</strong> 15% díjkedvezmény a következő havi számlából.</li>
                <li><strong>95.0% – 99.0% között:</strong> 30% díjkedvezmény a következő havi számlából.</li>
                <li><strong>95.0% alatt:</strong> 100% havi díjvisszatérítés.</li>
              </ul>
            </section>

          </div>

          {/* Footer banner */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400 text-center sm:text-left">
              Technikai támogatásra vagy SLA kérdésre van szükséged?
              <br />
              <strong className="text-white">zentrion-automation.ai@outlook.hu</strong>
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
