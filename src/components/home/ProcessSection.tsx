'use client';

import React from 'react';
import { 
  Search, 
  Cpu, 
  Workflow, 
  Activity, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Audit & Folyamatfeltárás',
    desc: 'Egy 30 perces mélyinterjú során feltárjuk a céged ismétlődő, időrabló kézi folyamatait, és azonosítjuk a legnagyobb megtérülést hozó AI lehetőségeket.',
    icon: <Search className="w-5 h-5 text-white" />,
    badge: '1-3. nap'
  },
  {
    number: '02',
    title: 'AI Architektúra & Prototípus',
    desc: 'Kidolgozzuk a testreszabott OpenAI RAG logikát, a saját TypeScript motor útvonalait és a biztonságos adatkapcsolatokat.',
    icon: <Cpu className="w-5 h-5 text-white" />,
    badge: '4-7. nap'
  },
  {
    number: '03',
    title: 'Integráció & Rendszerteszt',
    desc: 'Összekötjük a meglévő rendszereiddel (HubSpot, Gmail, Billingo, ERP), és szigorú terheléses és biztonsági teszteknek vetjük alá.',
    icon: <Workflow className="w-5 h-5 text-white" />,
    badge: '8-12. nap'
  },
  {
    number: '04',
    title: 'Élesítés & 24/7 Felügyelet',
    desc: 'A rendszert átadjuk a SaaS dashboardodon keresztül, valós idejű telemetriával monitorozzuk a futásokat és azonnali hibajavítást nyújtunk.',
    icon: <Activity className="w-5 h-5 text-white" />,
    badge: 'Folyamatos'
  }
];

const benefits = [
  {
    title: 'Havi 120-250 munkaóra megtakarítás',
    desc: 'Munkatársaid végre az értékteremtő, stratégiai feladatokra és ügyféltárgyalásokra fókuszálhatnak.',
    icon: <Clock className="w-5 h-5 text-white" />,
    stat: '250+',
    unit: 'óra/hó'
  },
  {
    title: 'Azonnali ügyfélkiszolgálás 0-24',
    desc: 'Nem veszítesz el érdeklődőket a késedelmes válaszok miatt. Az AI másodpercek alatt válaszol.',
    icon: <Zap className="w-5 h-5 text-white" />,
    stat: '< 2',
    unit: 'mp válasz'
  },
  {
    title: 'Kiküszöbölt emberi hibák',
    desc: 'A CRM adatok, számlaadatok és ügyféljegyzetek 100%-os pontossággal kerülnek rögzítésre.',
    icon: <ShieldCheck className="w-5 h-5 text-white" />,
    stat: '0.00%',
    unit: 'hibaarány'
  },
  {
    title: 'Skálázható forgalomnövekedés',
    desc: 'Legyen napi 10 vagy 10,000 megkeresésed, az AI rendszereink akadásmentesen kezelik.',
    icon: <TrendingUp className="w-5 h-5 text-white" />,
    stat: '∞',
    unit: 'skálázás'
  }
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-28 relative bg-black text-white overflow-hidden">
      {/* Section border line */}
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* Ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-radial-gradient from-white/[0.03] to-transparent blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-20 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300">
            <Workflow className="w-3.5 h-3.5 text-white" />
            <span>Kiszámítható, 4 Lépéses Metodológia</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[0.95]">
            Hogyan Működik az<br />
            <span className="text-shimmer">Együttműködés?</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
            Nem kell értened a kódhoz vagy a gépi tanuláshoz. Mi a teljes technikai megvalósítást, integrációt és karbantartást elvégezzük.
          </p>
        </div>

        {/* Animated Timeline Steps */}
        <div className="relative mb-24">
          {/* Horizontal connector line (desktop only) */}
          <div className="hidden lg:block absolute top-[40px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-[1px]">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                style={{ transitionDelay: `${idx * 150}ms` }}
                className="scroll-reveal-scale group"
              >
                <div className="relative flex flex-col items-center text-center space-y-5">
                  {/* Step Number Circle */}
                  <div className="timeline-dot animate-glow-ring">
                    <span className="text-sm font-black text-white font-mono">{step.number}</span>
                  </div>

                  {/* Badge */}
                  <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-white/5 text-neutral-300 border border-white/10 uppercase tracking-wider">
                    {step.badge}
                  </span>

                  {/* Icon */}
                  <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/25 group-hover:scale-110 transition-all duration-500">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-extrabold text-white group-hover:text-shimmer transition-all">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed max-w-[250px] group-hover:text-neutral-300 transition-colors">
                    {step.desc}
                  </p>

                  {/* Connector arrow (between steps on mobile/tablet) */}
                  {idx < 3 && (
                    <div className="lg:hidden pt-2 text-white/20">
                      <ArrowRight className="w-5 h-5 rotate-90" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Grid with Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, i) => (
            <div 
              key={i} 
              style={{ transitionDelay: `${i * 100}ms` }}
              className="service-card group scroll-reveal-scale !p-6"
            >
              <div className="glass-rim-top" />
              
              {/* Big stat number */}
              <div className="mb-4">
                <span className="text-3xl font-black text-white font-mono tracking-tight">
                  {b.stat}
                </span>
                <span className="text-xs text-neutral-500 font-bold ml-1.5 uppercase tracking-wider">
                  {b.unit}
                </span>
              </div>

              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500">
                {b.icon}
              </div>
              <h4 className="text-sm font-extrabold text-white mb-1.5">{b.title}</h4>
              <p className="text-xs text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors">{b.desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom section divider */}
      <div className="section-divider absolute bottom-0 left-0 right-0" />
    </section>
  );
}
