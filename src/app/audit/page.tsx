'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingChatWidget from '@/components/chat/FloatingChatWidget';
import ScrollAnimationProvider from '@/components/effects/ScrollAnimationProvider';
import Robot3DAvatar from '@/components/voice/Robot3DAvatar';
import ZentrionLogo from '@/components/brand/ZentrionLogo';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Calendar, 
  ExternalLink, 
  Mail, 
  Phone, 
  Layers,
  Zap,
  Activity,
  Workflow
} from 'lucide-react';

const INDUSTRIES = [
  { id: 'ecommerce', name: 'E-kereskedelem & Webshop', icon: '🛒', desc: 'Shopify, Unas, WooCommerce rendelések' },
  { id: 'b2b_services', name: 'B2B Szolgáltatás & Ügynökség', icon: '💼', desc: 'Leadkezelés, árajánlatok, tanácsadás' },
  { id: 'logistics', name: 'Gyártás, Logisztika & Nagyker', icon: '🏭', desc: 'Raktárkezelés, fuvarszervezés, ERP' },
  { id: 'realestate', name: 'Ingatlan & Építőipar', icon: '🏢', desc: 'Érdeklődők szűrése, megtekintések' },
  { id: 'finance', name: 'Pénzügy, Könyvelés & Jog', icon: '📊', desc: 'Bizonylatok, szerződések, számlák' },
  { id: 'healthcare', name: 'Egészségügy & Klinika', icon: '🏥', desc: 'Páciens időpontok, emlékeztetők' },
  { id: 'tech', name: 'IT, SaaS & Szoftverfejlesztés', icon: '💻', desc: 'Onboarding, API-k, Support 0-24' }
];

const PAIN_POINTS = [
  { id: 'slow_leads', label: 'Beérkező leadek / ajánlatkérések lassú megválaszolása (órák vagy napok telnek el)', icon: '⏱️' },
  { id: 'manual_data', label: 'Manuális adatmásolás táblázatokba, CRM-be vagy számlázóba', icon: '📋' },
  { id: 'invoicing', label: 'Ismétlődő számlakiállítás, díjbekérők és fizetési emlékeztetők küldözgetése', icon: '🧾' },
  { id: 'appointments', label: 'Időpont-egyeztetés oda-vissza emailekkel és elmaradó emlékeztetők', icon: '📅' },
  { id: 'support_247', label: 'Ügyfélszolgálati kérdések 0-24 kezelése (ugyanarra válaszolgatás)', icon: '💬' },
  { id: 'proposals', label: 'Egyedi B2B árajánlatok és szerződések lassú, manuális összeállítása', icon: '📄' },
  { id: 'isolated_tools', label: 'Különálló szoftverszigetek: a rendszerek nem beszélgetnek egymással', icon: '🔗' }
];

const COMMON_TOOLS = [
  'Gmail / Google Workspace', 'Microsoft Outlook', 'Billingo', 'Számlázz.hu',
  'HubSpot', 'Pipedrive', 'MiniCRM', 'Google Drive / Sheets',
  'Shopify', 'WooCommerce', 'Unas', 'Slack / Teams'
];

export default function AuditPage() {
  const [step, setStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState('');

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('B2B Szolgáltatás & Ügynökség');
  const [teamSize, setTeamSize] = useState('6-15 fő');
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([
    'Beérkező leadek / ajánlatkérések lassú megválaszolása (órák vagy napok telnek el)',
    'Manuális adatmásolás táblázatokba, CRM-be vagy számlázóba'
  ]);
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'Gmail / Google Workspace', 'Billingo', 'Google Drive / Sheets'
  ]);
  const [manualHoursPerWeek, setManualHoursPerWeek] = useState(18);
  const [hourlyWage, setHourlyWage] = useState(4800);
  const [primaryGoal, setPrimaryGoal] = useState('Időmegtakarítás és folyamatgyorsítás');

  // Contact Info for Report Dispatch
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportResult, setReportResult] = useState<any>(null);

  const togglePainPoint = (label: string) => {
    if (selectedPainPoints.includes(label)) {
      setSelectedPainPoints(selectedPainPoints.filter(p => p !== label));
    } else {
      setSelectedPainPoints([...selectedPainPoints, label]);
    }
  };

  const toggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter(t => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const handleStartAnalysis = () => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStepText('Munkafolyamat szűk keresztmetszetek és ismétlődő minták azonosítása...');

    setTimeout(() => {
      setScanProgress(45);
      setScanStepText('ZentrionFlow natív TypeScript csomópontok illesztése...');
    }, 700);

    setTimeout(() => {
      setScanProgress(80);
      setScanStepText('Megtérülési (ROI) ráta és autonóm AI architektúra optimalizálása...');
    }, 1400);

    setTimeout(() => {
      setScanProgress(100);
      setScanStepText('Riport elkészült!');
      setTimeout(() => {
        setIsScanning(false);
        setStep(4);
      }, 400);
    }, 2000);
  };

  const handleSendFullReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail) return;
    setIsSubmittingReport(true);

    try {
      const res = await fetch('/api/audit/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName || clientName + ' Cége',
          website,
          industry,
          teamSize,
          painPoints: selectedPainPoints,
          tools: selectedTools,
          manualHoursPerWeek,
          hourlyWage,
          primaryGoal,
          clientName,
          clientEmail,
          clientPhone
        })
      });

      const data = await res.json();
      setReportResult(data);
    } catch (err) {
      console.error('[AUDIT PAGE] Submit failed:', err);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Pre-calculated live metrics
  const weeklySaved = Math.round(manualHoursPerWeek * 0.72);
  const annualHoursSaved = weeklySaved * 50;
  const annualMoneySaved = annualHoursSaved * hourlyWage;
  const calculatedScore = Math.min(98, 75 + selectedPainPoints.length * 3 + (manualHoursPerWeek > 15 ? 8 : 4));

  return (
    <ScrollAnimationProvider>
      <div className="min-h-screen bg-black flex flex-col text-white selection:bg-white selection:text-black">
        <Navbar />

        <main className="flex-1 pt-12 pb-24 relative overflow-hidden">
          {/* Subtle Ambient Radial Spotlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-radial-gradient from-white/[0.06] via-white/[0.01] to-transparent blur-[140px] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
            
            {/* Page Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4 scroll-reveal">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold tracking-wider text-neutral-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>ZENTRION DIAGNOSTIC ENGINE v2</span>
                <span className="text-neutral-600">|</span>
                <span className="text-white font-extrabold">100% INGYENES</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-tight">
                Vállalati AI Folyamat-Audit
              </h1>

              <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Tudd meg 3 perc alatt, hogy a vállalkozásod pontosan mennyi munkaórát és bérköltséget spórolhat meg autonóm AI munkafolyamatokkal és saját natív TypeScript motorral.
              </p>

              {/* Progress Steps Indicator */}
              <div className="pt-4 flex items-center justify-center gap-2 sm:gap-3 text-xs font-bold font-mono">
                {[
                  { num: 1, label: 'Profil' },
                  { num: 2, label: 'Folyamatok' },
                  { num: 3, label: 'Költségek' },
                  { num: 4, label: 'Riport' }
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                      step === s.num
                        ? 'bg-white text-black font-extrabold shadow-lg scale-110'
                        : step > s.num
                          ? 'bg-neutral-800 text-white border border-white/20'
                          : 'bg-neutral-900 text-neutral-500 border border-white/10'
                    }`}>
                      {step > s.num ? '✓' : s.num}
                    </div>
                    <span className={`hidden sm:inline ${step === s.num ? 'text-white' : 'text-neutral-500'}`}>
                      {s.label}
                    </span>
                    {s.num < 4 && <span className="text-neutral-700">──</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Scanning Overlay Modal if Analysis is running */}
            {isScanning && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
                <div className="max-w-md w-full glass-card-3d p-8 rounded-3xl text-center space-y-6 border border-white/20 shadow-2xl">
                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-dashed border-white/30 animate-[spin_10s_linear_infinite]" />
                    <Cpu className="w-12 h-12 text-white animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                      Neurális Folyamat-Elemzés...
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      {scanStepText}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-white/10">
                    <div 
                      className="bg-white h-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>

                  <div className="text-[11px] font-mono text-neutral-500">
                    0 Make/n8n függőség • Saját ZentrionFlow Motor
                  </div>
                </div>
              </div>
            )}

            {/* WIZARD CARD CONTAINER */}
            <div className="rounded-3xl glass-spotlight border border-white/15 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="glass-rim-top" />

              {/* STEP 1: COMPANY PROFILE */}
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                      1. Lépés a 4-ből
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      Céged Profilja & Iparága
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Az AI motor az iparágad specifikus szűk keresztmetszeteit fogja elemezni.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-300">
                        Cégnév vagy Márkanév:
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="pl. Alpha Logistics Kft."
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/15 text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-300">
                        Weboldal URL (opcionális):
                      </label>
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="pl. www.alphalogistics.hu"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/15 text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Industry Picker */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-neutral-300 block">
                      Válaszd ki a céged fő iparágát:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {INDUSTRIES.map((ind) => (
                        <div
                          key={ind.id}
                          onClick={() => setIndustry(ind.name)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            industry === ind.name
                              ? 'bg-white text-black border-white shadow-lg font-bold'
                              : 'bg-neutral-900/80 border-white/10 text-neutral-300 hover:border-white/25 hover:bg-neutral-900'
                          }`}
                        >
                          <span className="text-2xl">{ind.icon}</span>
                          <div>
                            <div className={`text-xs font-bold leading-tight ${industry === ind.name ? 'text-black font-extrabold' : 'text-neutral-200'}`}>
                              {ind.name}
                            </div>
                            <div className={`text-[10px] mt-0.5 line-clamp-1 ${industry === ind.name ? 'text-neutral-800 font-medium' : 'text-neutral-500'}`}>
                              {ind.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Size */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300 block">
                      Hány fős a csapat jelenleg?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {['1 - 5 fő', '6 - 15 fő', '16 - 50 fő', '50+ fő'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setTeamSize(size)}
                          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            teamSize === size
                              ? 'bg-white text-black border-white shadow'
                              : 'bg-neutral-900 border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-800'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Next Step Button */}
                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <span>Tovább a Folyamatokhoz</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PAIN POINTS & TOOLS */}
              {step === 2 && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                      2. Lépés a 4-ből
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      Szűk Keresztmetszetek & Használt Eszközök
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Jelöld be azokat a feladatokat, ahol most a legtöbb időt és energiát veszítitek el.
                    </p>
                  </div>

                  {/* Pain Points Checkboxes */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-neutral-300 block">
                      Hol akadnak el vagy lassulnak le a munkafolyamatok? (Válassz ki legalább egyet):
                    </label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {PAIN_POINTS.map((item) => {
                        const isSelected = selectedPainPoints.includes(item.label);
                        return (
                          <div
                            key={item.id}
                            onClick={() => togglePainPoint(item.label)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-white/10 border-white text-white shadow-md'
                                : 'bg-neutral-900/60 border-white/10 text-neutral-300 hover:border-white/20 hover:bg-neutral-900'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{item.icon}</span>
                              <span className="text-xs font-medium">{item.label}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-white text-black border-white' : 'border-neutral-600'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Software Ecosystem */}
                  <div className="space-y-2.5 pt-2">
                    <label className="text-xs font-semibold text-neutral-300 block">
                      Milyen szoftvereket használtok a mindennapokban?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_TOOLS.map((tool) => {
                        const isSelected = selectedTools.includes(tool);
                        return (
                          <button
                            key={tool}
                            type="button"
                            onClick={() => toggleTool(tool)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white text-black border-white shadow'
                                : 'bg-neutral-900 border-white/15 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {tool}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 rounded-full font-semibold text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Vissza</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={selectedPainPoints.length === 0}
                      className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                    >
                      <span>Tovább a Költségbecsléshez</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: WORK HOURS & SALARIES */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                      3. Lépés a 4-ből
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      Időráfordítás & Megtakarítási Cél
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      A pontos ROI kalkulációhoz add meg a csapat heti manuális terheltségét.
                    </p>
                  </div>

                  {/* Slider 1: Hours */}
                  <div className="space-y-3 p-5 rounded-2xl bg-neutral-900/80 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-300">
                        Hány órát tölt a csapat heti szinten ezekkel a manuális feladatokkal?
                      </span>
                      <span className="text-base font-bold font-mono text-white px-3 py-1 rounded-lg bg-white/10 border border-white/20">
                        {manualHoursPerWeek} óra / hét
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="1"
                      value={manualHoursPerWeek}
                      onChange={(e) => setManualHoursPerWeek(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                      <span>5 óra (heti 1 nap része)</span>
                      <span>30 óra (fél munkaidő)</span>
                      <span>60+ óra (több kolléga)</span>
                    </div>
                  </div>

                  {/* Slider 2: Hourly Wage */}
                  <div className="space-y-3 p-5 rounded-2xl bg-neutral-900/80 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-300">
                        Átlagos órabérköltség (bruttó + közteher):
                      </span>
                      <span className="text-base font-bold font-mono text-white px-3 py-1 rounded-lg bg-white/10 border border-white/20">
                        {hourlyWage.toLocaleString('hu-HU')} Ft / óra
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3000"
                      max="12000"
                      step="500"
                      value={hourlyWage}
                      onChange={(e) => setHourlyWage(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                      <span>3.000 Ft/óra</span>
                      <span>6.500 Ft/óra (Senior)</span>
                      <span>12.000 Ft/óra (Menedzsment)</span>
                    </div>
                  </div>

                  {/* Primary Goal */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300 block">
                      Mi a legfőbb célotok az AI bevezetéssel?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'Időmegtakarítás és folyamatgyorsítás',
                        'Emberi hibák és adathiányok kizárása',
                        'Gyorsabb leadek és magasabb konverzió',
                        '0-24 órás autonóm ügyfélszolgálat'
                      ].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setPrimaryGoal(g)}
                          className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                            primaryGoal === g
                              ? 'bg-white text-black border-white shadow'
                              : 'bg-neutral-900 border-white/10 text-neutral-300 hover:text-white'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Preview Box */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-neutral-400 uppercase font-mono">Várható éves megtakarítás</div>
                      <div className="text-2xl font-black text-white font-mono mt-0.5">
                        ~{annualMoneySaved.toLocaleString('hu-HU')} Ft / év
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-neutral-400 uppercase font-mono">Megspórolt idő</div>
                      <div className="text-xl font-bold text-white font-mono mt-0.5">
                        {annualHoursSaved} óra / év
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded-full font-semibold text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Vissza</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleStartAnalysis}
                      className="px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all flex items-center gap-2.5 shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-black" />
                      <span>AI Audit Riport Generálása</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: FINAL AUDIT REPORT & BLUEPRINT */}
              {step === 4 && (
                <div className="space-y-10 animate-in fade-in duration-300">
                  
                  {/* Top Report Status Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-mono font-bold tracking-wider mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>AI AUDIT DIAGNOSZTIKA LEZÁRVA</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                        {companyName || 'Vállalkozásod'} AI Audit Eredménye
                      </h2>
                      <p className="text-xs text-neutral-400 mt-1 font-mono">
                        Iparág: {industry} • Csapatméret: {teamSize}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-900 border border-white/15 text-center shrink-0">
                      <div className="text-[10px] uppercase font-mono text-neutral-400 font-bold">Automatizálási Index</div>
                      <div className="text-3xl font-black text-white font-mono mt-0.5">
                        {calculatedScore} <span className="text-sm text-neutral-500 font-normal">/ 100</span>
                      </div>
                      <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                        Kiemelkedő Megtérülés
                      </span>
                    </div>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl glass-card-3d space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Clock className="w-4 h-4 text-white" />
                        <span>Havi időmegtakarítás:</span>
                      </div>
                      <div className="text-2xl font-extrabold text-white font-mono">
                        {weeklySaved * 4} <span className="text-xs font-normal text-neutral-400">óra / hó</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        ~{annualHoursSaved} óra évente
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl glass-card-3d space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <TrendingUp className="w-4 h-4 text-white" />
                        <span>Éves bérköltség-megtakarítás:</span>
                      </div>
                      <div className="text-2xl font-extrabold text-white font-mono">
                        {(annualMoneySaved / 1000000).toFixed(1)}M <span className="text-xs font-normal text-neutral-400">Ft / év</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        ~{Math.round(annualMoneySaved / 12).toLocaleString('hu-HU')} Ft / hó
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl glass-card-3d space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Zap className="w-4 h-4 text-white" />
                        <span>Becsült ROI Megtérülés:</span>
                      </div>
                      <div className="text-2xl font-extrabold text-white font-mono">
                        3 - 5 <span className="text-xs font-normal text-neutral-400">hét</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        A bevezetés után azonnali haszon
                      </div>
                    </div>
                  </div>

                  {/* 3 Personalized AI Blueprints */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                        <Workflow className="w-5 h-5 text-white" />
                        <span>Javasolt Személyre Szabott AI Munkafolyamatok</span>
                      </h3>
                      <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                        100% saját natív motor (0 Make/n8n díj)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Blueprint 1 */}
                      <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white font-bold">01. Blueprint</span>
                          <h4 className="text-sm font-bold text-white">Autonóm Lead & Ajánlat Triage</h4>
                          <p className="text-xs text-neutral-400 leading-relaxed">
                            A beérkező emailek elemzése, minősítése és rögzítése CRM-be, automata ajánlattervezettel.
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-[11px] text-neutral-400 font-mono">
                          Megtakarítás: <strong>Heti 6-10 óra</strong>
                        </div>
                      </div>

                      {/* Blueprint 2 */}
                      <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white font-bold">02. Blueprint</span>
                          <h4 className="text-sm font-bold text-white">Számlázási & CRM Kétirányú Szinkron</h4>
                          <p className="text-xs text-neutral-400 leading-relaxed">
                            Billingo / Számlázz.hu automatikus bizonylatgenerálás, díjbekérő kiküldés és banki jóváírás követés.
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-[11px] text-neutral-400 font-mono">
                          Megtakarítás: <strong>Heti 4-8 óra</strong>
                        </div>
                      </div>

                      {/* Blueprint 3 */}
                      <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white font-bold">03. Blueprint</span>
                          <h4 className="text-sm font-bold text-white">24/7 Céged Tudásbázisára Épülő Bot</h4>
                          <p className="text-xs text-neutral-400 leading-relaxed">
                            Céges dokumentációból táplálkozó, azonnal válaszoló chatbot és automata naptár-időpontkezelő.
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-[11px] text-neutral-400 font-mono">
                          Megtakarítás: <strong>Heti 8-15 óra</strong>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* DISPATCH FULL REPORT VIA EMAIL FORM */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/90 border border-white/20 space-y-6 relative overflow-hidden">
                    <div className="max-w-2xl space-y-2">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Mail className="w-5 h-5 text-white" />
                        <span>Kéred a Teljes Részletes Riportot Emailben & PDF-ben?</span>
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Add meg az elérhetőséged, és azonnal elküldjük a teljes audit dokumentációt a pontos folyamatábrákkal és a technológiai specifikációval!
                      </p>
                    </div>

                    {!reportResult ? (
                      <form onSubmit={handleSendFullReport} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-neutral-300 block mb-1">Neved:</label>
                            <input
                              type="text"
                              required
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder="Kovács Tamás"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs focus:outline-none focus:border-white"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-neutral-300 block mb-1">Email címed:</label>
                            <input
                              type="email"
                              required
                              value={clientEmail}
                              onChange={(e) => setClientEmail(e.target.value)}
                              placeholder="kovacs@ceged.hu"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs focus:outline-none focus:border-white"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-neutral-300 block mb-1">Telefonszámod:</label>
                            <input
                              type="tel"
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              placeholder="+36 30 123 4567"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs focus:outline-none focus:border-white"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                          <span className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                            <span>100% Adatvédelem • Garantált titoktartás (NDA) • Zéró spam</span>
                          </span>

                          <button
                            type="submit"
                            disabled={isSubmittingReport}
                            className="w-full sm:w-auto px-7 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
                          >
                            <Mail className="w-4 h-4 text-black" />
                            <span>{isSubmittingReport ? 'Riport kiküldése...' : 'Teljes Riport Ingyenes Kiküldése'}</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* Success confirmation with direct live preview links */
                      <div className="p-6 rounded-2xl bg-black border border-white/20 space-y-4 animate-in zoom-in-95">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white">
                              Hivatalos AI Audit Riport Sikeresen Rögzítve & Kiküldve!
                            </h4>
                            <p className="text-xs text-neutral-400">
                              A dokumentációt továbbítottuk a megadott címre ({clientEmail}) és az ügyeletes mérnökünknek (zentrion-automation.ai@outlook.hu).
                            </p>
                          </div>
                        </div>

                        {/* Live Email Preview Web Link */}
                        {reportResult.previewUrl && (
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs">
                            <span className="text-neutral-300">
                              Valós idejű webes email előnézet megtekintése:
                            </span>
                            <a
                              href={reportResult.previewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs flex items-center gap-1.5 hover:bg-neutral-200 transition-colors"
                            >
                              <span>Megnyitás</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}

                        {/* Direct Next Step: Book Consultation */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                          <span className="text-xs text-neutral-400">
                            Konzultálj a vezető AI mérnökünkkel a bevezetés lépéseiről:
                          </span>
                          <Link
                            href="/services/appointment-booking"
                            className="px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all flex items-center gap-2 shadow"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Időpontfoglalás a Megvalósításra</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reset Button to re-run audit */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setReportResult(null);
                      }}
                      className="text-xs text-neutral-500 hover:text-white transition-colors underline cursor-pointer"
                    >
                      Audit újrafuttatása más paraméterekkel
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>
        </main>

        <Footer />
        <FloatingChatWidget />
      </div>
    </ScrollAnimationProvider>
  );
}

