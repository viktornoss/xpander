'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Lock, ArrowLeft, Database, Key } from 'lucide-react';
import Link from 'next/link';

export default function AdatvedelemPage() {
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
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Adatvédelmi és Adatkezelési Tájékoztató
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  GDPR & EU 2016/679 rendelet szerinti megfelelőség • Zentrion.ai Vállalati Biztonság
                </p>
              </div>
            </div>
          </div>

          {/* Legal Content */}
          <div className="space-y-10 text-sm leading-relaxed text-gray-300">
            
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">1.</span> Bevezetés és Adatkezelő
              </h2>
              <p>
                Az <strong>Zentrion.ai</strong> elkötelezett a felhasználók, megrendelők és ügyfelek személyes adatainak legmagasabb szintű védelme iránt. A jelen tájékoztató részletesen ismerteti, hogyan gyűjtjük, dolgozzuk fel és védjük a velünk megosztott adatokat.
              </p>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1 text-xs">
                <p><strong>Adatkezelő:</strong> Zentrion Automation & AI Systems</p>
                <p><strong>Adatvédelmi kapcsolattartó email:</strong> xpander-automation.ai@outlook.hu</p>
                <p><strong>Alkalmazandó jog:</strong> GDPR (EU 2016/679) és az információs önrendelkezési jogról szóló 2011. évi CXII. törvény (Infotv.).</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">2.</span> A Kezelt Személyes Adatok Köre és Célja
              </h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <strong className="text-white text-xs uppercase tracking-wider block">a) Kapcsolatfelvétel és AI Audit kérése</strong>
                  <p className="text-xs text-gray-400">Kezelt adatok: Név, céges email cím, cégnév, telefonszám, folyamat leírása.</p>
                  <p className="text-xs text-gray-400">Cél: Ajánlattétel, audit megbeszélés egyeztetése, kapcsolatfelvétel.</p>
                  <p className="text-xs text-gray-400">Jogalap: Az érintett önkéntes hozzájárulása (GDPR 6. cikk (1) a)).</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <strong className="text-white text-xs uppercase tracking-wider block">b) Vállalati regisztráció és Dashboard fiók</strong>
                  <p className="text-xs text-gray-400">Kezelt adatok: Teljes név, cég neve, belépési email cím, jelszó, telefonszám.</p>
                  <p className="text-xs text-gray-400">Cél: Vállalati profil biztosítása, munkafolyamatok kezelése, fiók-helyreállítás.</p>
                  <p className="text-xs text-gray-400">Jogalap: Szerződés teljesítése és jogos érdek (GDPR 6. cikk (1) b)).</p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">3.</span> AI Modellek és Adatvédelem (Zero-Retention Szabály)
              </h2>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <Database className="w-4 h-4 text-neon-blue" />
                  <span>Szigorú Adatvédelmi Garanciák AI Feldolgozás Esetén</span>
                </div>
                <p className="text-xs text-gray-300">
                  Az Zentrion.ai által használt OpenAI API és dedikált neurális hálók enterprise szintű szerződés keretében működnek.
                </p>
                <ul className="text-xs text-gray-300 space-y-1.5 list-disc pl-5">
                  <li><strong>Nincs modell tanítás az ügyfél adatain:</strong> Az Ügyfél dokumentumait, belső adatait és chat üzeneteit az OpenAI és a modellek NEM használják fel nyilvános modellek továbbképzésére.</li>
                  <li><strong>Titkosított adatátvitel:</strong> Minden adatátvitel TLS 1.3 titkosítással, AES-256 szintű adatbázis-védelmi protokollal történik.</li>
                  <li><strong>Zero Data Retention:</strong> Az API lekérések csak a válasz pillanatában élnek, utána megsemmisítésre kerülnek a gyorsítótárból.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">4.</span> Az Érintettek Jogai
              </h2>
              <p>
                Az Ügyfél bármikor kérelmezheti a Szolgáltatótól a rá vonatkozó személyes adatokhoz való hozzáférést, azok helyesbítését, törlését (az elfeledtetéshez való jog) vagy kezelésének korlátozását, valamint tiltakozhat a személyes adatok kezelése ellen.
              </p>
              <p className="text-xs text-gray-400">
                Kérelmedet az <strong>xpander-automation.ai@outlook.hu</strong> e-mail címre küldve legkésőbb 72 órán belül feldolgozzuk és teljesítjük.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">5.</span> Adatbiztonság és Értesítési Kötelezettség
              </h2>
              <p>
                A Szolgáltató minden szükséges technikai és szervezési intézkedést megtesz annak érdekében, hogy biztosítsa a személyes adatok biztonságát mind a hálózati kommunikáció, mind az adatok tárolása során. Esetleges adatvédelmi incidens esetén a Szolgáltató 72 órán belül értesíti a felügyeleti hatóságot (NAIH) és az érintetteket.
              </p>
            </section>

          </div>

          {/* Footer banner */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400 text-center sm:text-left">
              Adatvédelmi kérdésed vagy törlési kérésed van? Fordulj hozzánk:
              <br />
              <strong className="text-white">xpander-automation.ai@outlook.hu</strong>
            </div>
            <Link
              href="/#contact"
              className="px-5 py-2.5 rounded-xl bg-white text-nexus-950 font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              Kapcsolat
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
