'use client';

import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const { addOrder } = useAuth();
  const [orderedPlan, setOrderedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planName: 'Starter' | 'Growth' | 'Enterprise', price: string) => {
    addOrder({
      serviceId: `pkg-${planName.toLowerCase()}`,
      serviceTitle: `${planName} Csomag Implementáció`,
      packageType: planName,
      price: price,
      notes: `Főoldalról kiválasztva (${billingCycle === 'yearly' ? 'Éves kedvezményes' : 'Havi'} ciklus).`
    });
    setOrderedPlan(planName);
    setTimeout(() => setOrderedPlan(null), 3500);
  };

  return (
    <section id="pricing" className="py-24 relative bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Transzparens, Megtérülés-alapú Árazás</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Válassz Csomagot a Skálázáshoz
          </h2>
          <p className="text-neutral-400 text-base leading-relaxed font-normal">
            Minden csomagunk tartalmazza a teljes tervezést, tesztelést, integrációt és a 30 napos pénzvisszafizetési garanciát.
          </p>

          {/* Billing Switcher */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-neutral-500'}`}>
              Havi fizetés
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-neutral-900 border border-white/20 p-1 relative transition-colors cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-white' : 'text-neutral-500'}`}>
              Éves elszámolás
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-black font-extrabold">
                -20% megtakarítás
              </span>
            </span>
          </div>
        </div>

        {/* Feedback alert if order created */}
        {orderedPlan && (
          <div className="mb-8 max-w-lg mx-auto p-4 rounded-2xl bg-white/10 border border-white/20 text-white text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Sikeresen rögzítve a Dashboardon: <strong>{orderedPlan} Csomag</strong>!</span>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Starter */}
          <div className="rounded-3xl glass-card-3d p-8 flex flex-col justify-between shadow-xl scroll-reveal-scale">
            <div className="glass-rim-top" />
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Starter</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/15">
                  Kisebb cégeknek
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-6">
                Ideális első AI rendszer bevezetéséhez és azonnali időmegtakarításhoz.
              </p>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {billingCycle === 'yearly' ? '240.000 Ft' : '290.000 Ft'}
                  </span>
                  <span className="text-xs text-neutral-400">/ egyszeri díj</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  + {billingCycle === 'yearly' ? '28.000 Ft/hó' : '35.000 Ft/hó'} üzemeltetés
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-6 mb-8 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>1 db egyedi AI Chatbot VAGY Email Automatizáció</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Saját webhook & API integráció meglévő weboldalhoz</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Havi 5,000 feldolgozott feladat / üzenet</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Teljes Ügyfél-Dashboard hozzáférés</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Email & jegykezelő támogatás (24h)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('Starter', '240.000 Ft')}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Starter Csomag Kiválasztása</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Growth (Featured - Elevated in Luxury Black & White) */}
          <div className="rounded-3xl glass-card-3d p-8 border-2 border-white/40 shadow-2xl relative flex flex-col justify-between scale-105 z-10 scroll-reveal-scale">
            <div className="glass-rim-top" />
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-[11px] font-black uppercase tracking-wider text-black shadow-md">
              Legnépszerűbb Választás
            </div>

            <div>
              <div className="flex justify-between items-center mb-4 mt-2">
                <h3 className="text-2xl font-bold text-white">Growth / Pro</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                  Skálázódó KKV
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-6">
                Komplett AI automatizációs ökoszisztéma többcsatornás integrációval.
              </p>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {billingCycle === 'yearly' ? '460.000 Ft' : '540.000 Ft'}
                  </span>
                  <span className="text-xs text-neutral-400">/ egyszeri díj</span>
                </div>
                <div className="text-xs text-white font-semibold mt-1">
                  + {billingCycle === 'yearly' ? '59.000 Ft/hó' : '75.000 Ft/hó'} üzemeltetés
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-6 mb-8 text-xs text-neutral-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0 font-bold" />
                  <span><strong>Akár 3 összekapcsolt AI rendszer</strong> (Bot + CRM + Email)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>OpenAI GPT-4o RAG tudásbázis közvetlen szinkron</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Havi 50,000 feladat & ZentrionFlow munkafolyamat futás</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Kétirányú HubSpot / Pipedrive / Google Naptár szinkron</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Dedikált Slack csatorna & 4 órás prioritási SLA</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('Growth', '460.000 Ft')}
              className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <span>Growth Csomag Megrendelése</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>

          {/* Card 3: Enterprise */}
          <div className="rounded-3xl glass-card-3d p-8 flex flex-col justify-between shadow-xl scroll-reveal-scale">
            <div className="glass-rim-top" />
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Enterprise</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/15">
                  Nagyvállalati
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-6">
                Egyedi autonóm Multi-Agent hálózatok, saját szerver infrastruktúrával.
              </p>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white font-mono">Egyedi</span>
                  <span className="text-xs text-neutral-400">/ specifikáció szerint</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Kezdve 890.000 Ft-tól
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-6 mb-8 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Korlátlan autonóm AI ágensek (Multi-Agent hálózat)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Dedikált ZentrionFlow TS szerver és privát felhő</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Egyedi LLM finetuning & lokális modell támogatás</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Helyszíni vagy online munkatársi tréning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>24/7 telefonos SLA & dedikált mérnök</span>
                </div>
              </div>
            </div>

            <a
              href="#contact"
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center justify-center gap-2"
            >
              <span>Egyedi Ajánlat Kérése</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
