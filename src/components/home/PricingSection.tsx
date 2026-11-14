'use client';

import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, ShoppingBag, Zap, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const { addToCart } = useCart();
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const handleSelectPlan = (planName: 'Starter' | 'Growth' | 'Enterprise', price: string) => {
    const numeric = parseInt(price.replace(/[^0-9]/g, ''), 10) || 0;
    addToCart({
      id: `pkg-${planName.toLowerCase()}-${billingCycle}`,
      title: `${planName} Csomag Implementáció`,
      packageType: planName,
      price: price,
      priceNumeric: numeric,
      subtitle: `${billingCycle === 'yearly' ? 'Éves kedvezményes' : 'Havi'} ciklus`,
      quantity: 1
    });
    setAddedNotice(planName);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  return (
    <section id="pricing" className="py-28 relative bg-black text-white overflow-hidden">
      {/* Top divider */}
      <div className="section-divider mb-20" />

      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>Transzparens, Megtérülés-alapú Árazás</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase">
            <span className="text-shimmer">Válassz Csomagot</span> a Skálázáshoz
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto">
            Minden csomagunk tartalmazza a teljes tervezést, tesztelést, közvetlen API integrációt és a 30 napos pénzvisszafizetési garanciát.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-neutral-500'}`}>
              Havi fizetés
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-7 rounded-full bg-neutral-900 border border-white/20 p-1 relative transition-colors cursor-pointer hover:border-white/40"
              aria-label="Fizetési ciklus váltása"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-out ${
                  billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-neutral-500'}`}>
              Éves elszámolás
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-black font-extrabold shadow-sm">
                -20% megtakarítás
              </span>
            </span>
          </div>
        </div>

        {/* Feedback alert if added to cart */}
        {addedNotice && (
          <div className="mb-8 max-w-lg mx-auto p-4 rounded-2xl bg-white/10 border border-white/20 text-white text-xs text-center flex items-center justify-center gap-2 animate-in fade-in zoom-in-95">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Sikeresen a kosárba helyezve: <strong>{addedNotice} Csomag</strong>!</span>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          
          {/* Card 1: Starter */}
          <div className="rounded-3xl service-card p-8 flex flex-col justify-between shadow-2xl scroll-reveal-scale relative group">
            <div className="glass-rim-top" />
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-neutral-200 transition-colors">Starter</h3>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-neutral-300 border border-white/15">
                  Kisebb cégeknek
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                Ideális első AI rendszer bevezetéséhez és azonnali, heti 15-20 órás adminisztrációs időmegtakarításhoz.
              </p>
              
              <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                    {billingCycle === 'yearly' ? '240.000 Ft' : '290.000 Ft'}
                  </span>
                  <span className="text-xs text-neutral-400 font-normal">/ egyszeri díj</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  <span>+ {billingCycle === 'yearly' ? '28.000 Ft/hó' : '35.000 Ft/hó'} üzemeltetés</span>
                </div>
              </div>

              <div className="space-y-3.5 border-t border-white/10 pt-6 mb-8 text-xs text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>1 db egyedi AI Chatbot <strong>VAGY</strong> Email Automatizáció</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Saját webhook & API integráció meglévő weboldalhoz</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Havi 5,000 feldolgozott feladat / üzenet</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Teljes Ügyfél-Dashboard hozzáférés</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Email & jegykezelő támogatás (24h SLA)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('Starter', billingCycle === 'yearly' ? '240.000 Ft' : '290.000 Ft')}
              className="w-full btn-ghost py-3.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer group-hover:border-white/40 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>Starter Kosárba & Rendelés</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: Growth (Featured - Elevated with Rotating Border & High-End Badge) */}
          <div className="rounded-3xl rotating-border p-8 shadow-2xl relative flex flex-col justify-between lg:-translate-y-4 z-10 scroll-reveal-scale">
            <div className="glass-rim-top" />
            
            {/* Top floating pill */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-[11px] font-black uppercase tracking-wider text-black shadow-lg flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-black fill-black" />
              <span>Legnépszerűbb Választás</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4 mt-2">
                <h3 className="text-2xl font-black text-white">Growth / Pro</h3>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white text-black font-extrabold shadow-sm">
                  Skálázódó KKV
                </span>
              </div>
              <p className="text-xs text-neutral-300 mb-6 leading-relaxed">
                Komplett AI automatizációs ökoszisztéma többcsatornás integrációval és azonnali megtérüléssel.
              </p>
              
              <div className="mb-6 p-4 rounded-2xl bg-white/[0.06] border border-white/15">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                    {billingCycle === 'yearly' ? '460.000 Ft' : '540.000 Ft'}
                  </span>
                  <span className="text-xs text-neutral-300 font-normal">/ egyszeri díj</span>
                </div>
                <div className="text-xs text-white font-semibold mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>+ {billingCycle === 'yearly' ? '59.000 Ft/hó' : '75.000 Ft/hó'} üzemeltetés</span>
                </div>
              </div>

              <div className="space-y-3.5 border-t border-white/15 pt-6 mb-8 text-xs text-neutral-100">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0 font-bold" />
                  <span><strong>Akár 3 összekapcsolt AI rendszer</strong> (Bot + CRM + Email)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>OpenAI GPT-4o RAG tudásbázis közvetlen szinkron</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Havi 50,000 feladat & ZentrionFlow futás</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Kétirányú HubSpot / Pipedrive / Google Naptár szinkron</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Dedikált Slack csatorna & 4 órás prioritási SLA</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('Growth', billingCycle === 'yearly' ? '460.000 Ft' : '540.000 Ft')}
              className="w-full btn-premium py-4 rounded-xl text-xs font-black uppercase tracking-wider text-black bg-white flex items-center justify-center gap-2 shadow-2xl cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              <span>Growth Kosárba & Rendelés</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>

          {/* Card 3: Enterprise */}
          <div className="rounded-3xl service-card p-8 flex flex-col justify-between shadow-2xl scroll-reveal-scale relative group">
            <div className="glass-rim-top" />
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-neutral-200 transition-colors">Enterprise</h3>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-neutral-300 border border-white/15">
                  Nagyvállalati
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                Egyedi autonóm Multi-Agent hálózatok, saját szerver infrastruktúrával és végtelen skálázással.
              </p>
              
              <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white font-mono tracking-tight">890.000 Ft</span>
                  <span className="text-xs text-neutral-400 font-normal">/ induló díj</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  <span>Egyedi havi üzemeltetési és SLA megállapodás</span>
                </div>
              </div>

              <div className="space-y-3.5 border-t border-white/10 pt-6 mb-8 text-xs text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Korlátlan autonóm AI ágensek (Multi-Agent hálózat)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Dedikált ZentrionFlow TS szerver és privát felhő</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Egyedi LLM finetuning & on-premise modell futtatás</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Helyszíni vagy online csapat-tréning & onboarding</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>24/7 telefonos SLA & dedikált vezető mérnök</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('Enterprise', '890.000 Ft')}
              className="w-full btn-ghost py-3.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer group-hover:border-white/40 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>Enterprise Kosárba & Rendelés</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
