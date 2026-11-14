'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, TrendingUp, Clock } from 'lucide-react';

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
    <section id="calculator" className="py-24 relative bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300">
            <Calculator className="w-3.5 h-3.5 text-white" />
            <span>Interaktív Megtakarítás Kalkulátor</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Számold Ki a Céged AI Megtérülését
          </h2>
          <p className="text-neutral-400 text-base leading-relaxed font-normal">
            Mozgasd a csúszkákat és nézd meg, mennyi időt és költséget éget el a céged a manuális feladatokon!
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="rounded-3xl glass-spotlight border border-white/15 p-6 sm:p-10 shadow-2xl relative overflow-hidden scroll-reveal-scale">
          <div className="glass-rim-top" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Controls / Sliders */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Slider 1: Employees */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-neutral-300">Adminisztrációt vagy ügyfélszolgálatot végzők:</span>
                  <span className="text-white font-bold font-mono text-base px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/15">
                    {employees} fő
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>1 munkatárs</span>
                  <span>40 munkatárs</span>
                </div>
              </div>

              {/* Slider 2: Hours per week */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-neutral-300">Manuális feladatokra fordított idő munkatársonként:</span>
                  <span className="text-white font-bold font-mono text-base px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/15">
                    {hoursPerWeek} óra / hét
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>2 óra (alap adatrögzítés)</span>
                  <span>25 óra (folyamatos másolgatás)</span>
                </div>
              </div>

              {/* Slider 3: Hourly wage */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-neutral-300">Átlagos órabérköltség (bruttó + közteher):</span>
                  <span className="text-white font-bold font-mono text-base px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/15">
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
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>2.500 Ft/óra</span>
                  <span>12.000 Ft/óra</span>
                </div>
              </div>

            </div>

            {/* Right Results Display */}
            <div className="lg:col-span-6 rounded-2xl bg-[#111111] border border-white/10 p-6 sm:p-8 space-y-6">
              
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold flex items-center justify-between border-b border-white/10 pb-3">
                <span>Becsült Megtakarítási Eredmény</span>
                <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">ROI: {roiPercentage}%</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                    <Clock className="w-3.5 h-3.5 text-white" />
                    <span>Havi megspórolt idő:</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {monthlySavedHours} <span className="text-xs font-normal text-neutral-400">óra/hó</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                    <span>Havi bérköltség:</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {(monthlySavings / 1000000).toFixed(2)}M <span className="text-xs font-normal text-neutral-400">Ft</span>
                  </div>
                </div>
              </div>

              {/* Big Yearly Box */}
              <div className="p-5 rounded-2xl bg-neutral-900 border border-white/15 text-center space-y-1">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
                  Becsült Első Éves Nettó Pénzügyi Előny:
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {netFirstYearBenefit.toLocaleString('hu-HU')} Ft
                </div>
                <p className="text-[11px] text-neutral-400">
                  Felszabaduló tőke, amit növekedésre és fejlesztésre fordíthatsz.
                </p>
              </div>

              {/* CTA button */}
              <a
                href="#contact"
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Személyre Szabott Audit Kérése</span>
                <ArrowRight className="w-4 h-4" />
              </a>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
