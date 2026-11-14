'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, TrendingUp, Clock, Sparkles, ShieldCheck } from 'lucide-react';

export default function RoiCalculator() {
  const [employees, setEmployees] = useState(5);
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [hourlyWage, setHourlyWage] = useState(4500);

  // Calculations
  const monthlySavedHours = Math.round(employees * hoursPerWeek * 4.3);
  const monthlySavings = Math.round(monthlySavedHours * hourlyWage);
  const yearlySavings = monthlySavings * 12;
  const estimatedInvestment = 380000;
  const netFirstYearBenefit = yearlySavings - estimatedInvestment;
  const roiPercentage = Math.round((yearlySavings / estimatedInvestment) * 100);

  return (
    <section id="calculator" className="py-28 relative bg-black text-white overflow-hidden">
      {/* Top section divider */}
      <div className="section-divider mb-20" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 backdrop-blur-md">
            <Calculator className="w-3.5 h-3.5 text-white" />
            <span>Interaktív Megtakarítás Kalkulátor</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase">
            <span className="text-shimmer">Számold Ki a Céged</span> AI Megtérülését
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto">
            Mozgasd a csúszkákat és láthatóvá válik, mennyi értékes munkaórát és bérköltséget takarít meg a vállalkozásod az automatizációval!
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="rounded-3xl glass-spotlight border border-white/15 p-6 sm:p-12 shadow-2xl relative overflow-hidden scroll-reveal-scale">
          <div className="glass-rim-top" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Controls / Sliders */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* Slider 1: Employees */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-neutral-300">Adminisztrációt vagy ügyfélszolgálatot végzők:</span>
                  <span className="text-white font-black font-mono text-base px-3 py-1 rounded-xl bg-white/10 border border-white/20 shadow-sm">
                    {employees} fő
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="w-full h-2.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-neutral-200 transition-all"
                />
                <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
                  <span>1 munkatárs</span>
                  <span>40 munkatárs</span>
                </div>
              </div>

              {/* Slider 2: Hours per week */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-neutral-300">Manuális feladatokra fordított idő / hét:</span>
                  <span className="text-white font-black font-mono text-base px-3 py-1 rounded-xl bg-white/10 border border-white/20 shadow-sm">
                    {hoursPerWeek} óra / hét
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-neutral-200 transition-all"
                />
                <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
                  <span>2 óra (alap adatrögzítés)</span>
                  <span>25 óra (folyamatos másolgatás)</span>
                </div>
              </div>

              {/* Slider 3: Hourly wage */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-neutral-300">Átlagos órabérköltség (bruttó + közteher):</span>
                  <span className="text-white font-black font-mono text-base px-3 py-1 rounded-xl bg-white/10 border border-white/20 shadow-sm">
                    {hourlyWage.toLocaleString('hu-HU')} Ft / óra
                  </span>
                </div>
                <input
                  type="range"
                  min="2500"
                  max="12000"
                  step="500"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(Number(e.target.value))}
                  className="w-full h-2.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-neutral-200 transition-all"
                />
                <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
                  <span>2.500 Ft/óra</span>
                  <span>12.000 Ft/óra</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Konzervatív, iparági statisztikák alapján validált képletek</span>
              </div>

            </div>

            {/* Right Results Display */}
            <div className="lg:col-span-6 rounded-3xl bg-[#0d0d0d] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <div className="glass-rim-top" />
              
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold flex items-center justify-between border-b border-white/10 pb-4">
                <span>Becsült Megtakarítási Mutatók</span>
                <span className="text-black font-mono font-black bg-white px-2.5 py-1 rounded-full text-xs shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-black" />
                  ROI: {roiPercentage}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-white" />
                    <span>Havi megspórolt idő:</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {monthlySavedHours} <span className="text-xs font-normal text-neutral-400">óra/hó</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                    <span>Havi bérköltség mentés:</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {(monthlySavings / 1000000).toFixed(2)}M <span className="text-xs font-normal text-neutral-400">Ft</span>
                  </div>
                </div>
              </div>

              {/* Big Yearly Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/20 text-center space-y-2 relative overflow-hidden">
                <span className="text-xs uppercase tracking-wider text-neutral-300 font-semibold block">
                  Becsült Első Éves Nettó Pénzügyi Előny:
                </span>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight text-shimmer">
                  {netFirstYearBenefit.toLocaleString('hu-HU')} Ft
                </div>
                <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                  Közvetlenül felszabaduló tőke, amit termékfejlesztésre, marketingre vagy profitra fordíthatsz.
                </p>
              </div>

              {/* CTA button */}
              <a
                href="#contact"
                className="w-full btn-premium py-4 rounded-xl font-black text-xs uppercase tracking-wider text-black bg-white flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <span>Személyre Szabott Audit Kérése</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </a>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
