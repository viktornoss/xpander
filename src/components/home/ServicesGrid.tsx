'use client';

import React from 'react';
import Link from 'next/link';
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
  Play,
  ShoppingBag
} from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/mock-data';
import { useCart } from '@/lib/cart-context';

const iconMap: Record<string, React.ReactNode> = {
  Bot: <Bot className="w-5 h-5 text-white" />,
  Headphones: <Headphones className="w-5 h-5 text-white" />,
  Mail: <Mail className="w-5 h-5 text-white" />,
  Zap: <Zap className="w-5 h-5 text-white" />,
  Database: <Database className="w-5 h-5 text-white" />,
  Calendar: <Calendar className="w-5 h-5 text-white" />,
  Cpu: <Cpu className="w-5 h-5 text-white" />,
};

export default function ServicesGrid() {
  const { addToCart } = useCart();
  return (
    <section id="services" className="py-24 relative bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Kulcsrakész & Egyedi AI Megoldások</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Vállalati AI Szolgáltatásaink
          </h2>
          <p className="text-neutral-400 text-base leading-relaxed font-normal">
            Nem sablonokat adunk el, hanem éles, működő, önjáró AI infrastruktúrát építünk saját TypeScript motorral. Mindegyik szolgáltatásunkhoz interaktív élő demó tartozik.
          </p>
        </div>

        {/* Services Grid (Bento cards in white/black luxury) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {INITIAL_SERVICES.map((service, idx) => (
            <div
              key={service.id}
              style={{ transitionDelay: `${(idx % 3) * 120}ms` }}
              className={`rounded-3xl p-7 glass-card-3d flex flex-col justify-between relative group shadow-xl scroll-reveal-scale ${
                idx === 6 ? 'md:col-span-2 lg:col-span-3 bg-gradient-to-b from-[#141418] to-[#0a0a0c] border-white/20' : ''
              }`}
            >
              <div className="glass-rim-top" />
              <div>
                {/* Top card row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 group-hover:bg-white/10 transition-all">
                    {iconMap[service.iconName] || <Bot className="w-5 h-5 text-white" />}
                  </div>
                  {service.badge && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Title & Short Description */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                  {service.shortDesc}
                </p>

                {/* Deliverables preview */}
                <div className="space-y-2 mb-6 border-t border-white/5 pt-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                    Főbb Funkciók:
                  </span>
                  {service.deliverables.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-white mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/services/${service.slug}#demo`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-bold text-xs transition-all shadow-sm"
                  >
                    <Play className="w-3 h-3" />
                    <span>Demó</span>
                  </Link>

                  <button
                    onClick={() => {
                      const numeric = parseInt((service.pricingNote || '').replace(/[^0-9]/g, ''), 10) || 190000;
                      addToCart({
                        id: service.id,
                        title: service.title,
                        price: service.pricingNote || '190.000 Ft',
                        priceNumeric: numeric,
                        subtitle: service.shortDesc,
                        packageType: service.badge || 'Egyedi',
                        quantity: 1
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs transition-all shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-3 h-3 text-black" />
                    <span>Kosárba</span>
                  </button>
                </div>

                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                >
                  <span>Részletek</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
