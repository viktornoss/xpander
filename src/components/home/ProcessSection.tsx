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
  Zap 
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
    desc: 'Munkatársaid végre az értékteremtő, stratégiai feladatokra és ügyféltárgyalásokra fókuszálhatnak a másolgatás helyett.',
    icon: <Clock className="w-5 h-5 text-white" />
  },
  {
    title: 'Azonnali ügyfélkiszolgálás 0-24 órában',
    desc: 'Nem veszítesz el érdeklődőket a késedelmes válaszok miatt. Az AI másodpercek alatt válaszol, szombat éjjel is.',
    icon: <Zap className="w-5 h-5 text-white" />
  },
  {
    title: 'Kiküszöbölt emberi hibák és adathiány',
    desc: 'A CRM adatok, számlaadatok és ügyféljegyzetek 100%-os pontossággal kerülnek rögzítésre és frissítésre.',
    icon: <ShieldCheck className="w-5 h-5 text-white" />
  },
  {
    title: 'Skálázható forgalomnövekedés',
    desc: 'Legyen napi 10 vagy 10,000 megkeresésed, az AI automatizációs rendszereink akadásmentesen kezelik a csúcsidőszakokat is.',
    icon: <TrendingUp className="w-5 h-5 text-white" />
  }
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 relative bg-black text-white border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300">
            <Workflow className="w-3.5 h-3.5 text-white" />
            <span>Kiszámítható, 4 Lépéses Metodológia</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Hogyan Működik az Együttműködés?
          </h2>
          <p className="text-neutral-400 text-base leading-relaxed font-normal">
            Nem kell értened a kódhoz vagy a gépi tanuláshoz. Mi a teljes technikai megvalósítást, integrációt és karbantartást elvégezzük.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              style={{ transitionDelay: `${idx * 100}ms` }}
              className="rounded-3xl p-6 glass-card-3d flex flex-col justify-between relative group shadow-xl scroll-reveal-scale"
            >
              <div className="glass-rim-top" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-white/30 group-hover:text-white transition-colors font-mono">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15">
                    {step.badge}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  {step.icon}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {benefits.map((b, i) => (
            <div 
              key={i} 
              style={{ transitionDelay: `${i * 80}ms` }}
              className="p-6 rounded-2xl glass-card-3d space-y-3 scroll-reveal-scale"
            >
              <div className="glass-rim-top" />
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                {b.icon}
              </div>
              <h4 className="text-sm font-bold text-white">{b.title}</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
