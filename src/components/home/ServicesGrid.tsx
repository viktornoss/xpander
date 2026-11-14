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
  ShoppingBag,
  ArrowUpRight
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
    <section id="services" className="py-28 relative bg-black text-white">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 aurora-bg pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-20 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Kulcsrakész & Egyedi AI Megoldások</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[0.95]">
            Vállalati AI<br />
            <span className="text-shimmer">Szolgáltatásaink</span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
            Nem sablonokat adunk el, hanem éles, működő, önjáró AI infrastruktúrát építünk saját TypeScript motorral. Mindegyik szolgáltatásunkhoz interaktív élő demó tartozik.
          </p>
          <div className="section-divider max-w-xs mx-auto" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {INITIAL_SERVICES.map((service, idx) => (
            <div
              key={service.id}
              style={{ transitionDelay: `${(idx % 3) * 100}ms` }}
              className={`service-card flex flex-col justify-between group scroll-reveal-scale ${
                idx === 6 ? 'md:col-span-2 lg:col-span-3' : ''
              }`}
            >
              {/* Animated top rim */}
              <div className="glass-rim-top" />
              
              <div>
                {/* Top card row: icon + badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/25 group-hover:scale-110 transition-all duration-500">
                    {iconMap[service.iconName] || <Bot className="w-5 h-5 text-white" />}
                  </div>
                  {service.badge && (
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 text-neutral-300 border border-white/10 uppercase tracking-wider group-hover:bg-white/10 group-hover:text-white transition-all">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-extrabold text-white mb-2.5 group-hover:text-shimmer transition-all duration-500">
                  {service.title}
                </h3>
                <p className="text-sm text-neutral-400 mb-6 leading-relaxed group-hover:text-neutral-300 transition-colors">
                  {service.shortDesc}
                </p>

                {/* Deliverables preview */}
                <div className="space-y-2.5 mb-6 border-t border-white/5 pt-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block mb-2">
                    Főbb Funkciók
                  </span>
                  {service.deliverables.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <div className="w-4 h-4 rounded-full bg-white/10 border border-white/15 flex items-center justify-center mt-0.5 shrink-0 group-hover:bg-white/20 transition-colors">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-5 border-t border-white/8 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/services/${service.slug}#demo`}
                    className="btn-premium inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-xs transition-all border border-white/10 hover:border-white/20"
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
                    className="btn-premium inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-black hover:bg-neutral-100 font-bold text-xs transition-all shadow-[0_4px_15px_rgba(255,255,255,0.1)] cursor-pointer"
                  >
                    <ShoppingBag className="w-3 h-3 text-black" />
                    <span>Kosárba</span>
                  </button>
                </div>

                <Link
                  href={`/services/${service.slug}`}
                  className="btn-ghost inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors py-1 px-1"
                >
                  <span>Részletek</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
