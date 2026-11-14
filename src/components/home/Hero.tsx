'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Bot, 
  Zap, 
  CheckCircle2, 
  Play, 
  Activity, 
  ShieldCheck, 
  Clock, 
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  Lock
} from 'lucide-react';
import ZentrionLogo from '@/components/brand/ZentrionLogo';
import { useVoiceAi } from '@/components/voice/VoiceAiContext';
import WebsiteTourPresentation from '@/components/video/WebsiteTourPresentation';

export default function Hero() {
  const { openVoiceAi } = useVoiceAi();
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Dynamic 3D interactive mouse tracking / tilt state
  const [tilt, setTilt] = useState({ x: 12, y: -6 });
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Live simulation execution state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [opsCount, setOpsCount] = useState(12480);
  const [latency, setLatency] = useState('12.06 ms');
  const [growthPercent, setGrowthPercent] = useState('+29.4%');
  const [activeStepText, setActiveStepText] = useState('');

  // Dynamic waveform paths based on simulation stage
  const wavePaths: Record<number, { line: string; area: string; endY: number }> = {
    0: {
      line: 'M 0 50 Q 40 32, 80 42 T 160 22 T 230 32 T 300 8',
      area: 'M 0 50 Q 40 32, 80 42 T 160 22 T 230 32 T 300 8 L 300 60 L 0 60 Z',
      endY: 8,
    },
    1: {
      line: 'M 0 46 Q 35 16, 75 34 T 155 14 T 225 24 T 300 6',
      area: 'M 0 46 Q 35 16, 75 34 T 155 14 T 225 24 T 300 6 L 300 60 L 0 60 Z',
      endY: 6,
    },
    2: {
      line: 'M 0 40 Q 30 8, 70 26 T 145 8 T 220 16 T 300 4',
      area: 'M 0 40 Q 30 8, 70 26 T 145 8 T 220 16 T 300 4 L 300 60 L 0 60 Z',
      endY: 4,
    },
    3: {
      line: 'M 0 36 Q 28 4, 65 18 T 140 4 T 215 10 T 300 2',
      area: 'M 0 36 Q 28 4, 65 18 T 140 4 T 215 10 T 300 2 L 300 60 L 0 60 Z',
      endY: 2,
    },
    4: {
      line: 'M 0 32 Q 25 2, 60 12 T 135 2 T 210 6 T 300 2',
      area: 'M 0 32 Q 25 2, 60 12 T 135 2 T 210 6 T 300 2 L 300 60 L 0 60 Z',
      endY: 2,
    },
  };

  const currentWave = wavePaths[simStep] || wavePaths[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Relative offset from center: -1 to 1
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Dynamic 3D tilt: up to ±20 degrees following the mouse cursor
    const tiltX = -normY * 18;
    const tiltY = normX * 22;

    setTilt({ x: tiltX, y: tiltY });
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly return to default elegant resting isometric angle
    setTilt({ x: 12, y: -6 });
    setGlarePos({ x: 50, y: 50 });
  };

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    // Step 1: Webhook received & pipeline initiated
    setSimStep(1);
    setActiveStepText('⚡ [01/04] Webhook érkezett: Új B2B ajánlatkérés fogadva (10.84 ms)');
    setOpsCount(12680);
    setLatency('10.84 ms');
    setGrowthPercent('+32.8%');

    // Step 2: GPT-4o Triage Analysis (Wave Surge)
    setTimeout(() => {
      setSimStep(2);
      setActiveStepText('🧠 [02/04] GPT-4o Minősítés: VIP Automata Ajánlat elkészült (Score: 98)');
      setOpsCount(13240);
      setLatency('8.20 ms');
      setGrowthPercent('+39.4%');
    }, 850);

    // Step 3: CRM & Invoicing Synchronization (High speed)
    setTimeout(() => {
      setSimStep(3);
      setActiveStepText('🔄 [03/04] Kétirányú MiniCRM & Számlázz.hu szinkronizáció befejezve');
      setOpsCount(13890);
      setLatency('7.15 ms');
      setGrowthPercent('+46.2%');
    }, 1800);

    // Step 4: Finished with flying colors!
    setTimeout(() => {
      setSimStep(4);
      setActiveStepText('✅ [04/04] 14,280 művelet lefutva • Hibaarány: 0.00% • 0 Ft Make/n8n díj');
      setOpsCount(14280);
      setLatency('6.04 ms');
      setGrowthPercent('+52.4%');

      setTimeout(() => {
        setIsSimulating(false);
        setSimStep(0);
        setActiveStepText('');
      }, 4000);
    }, 2800);
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-18 md:pb-28 overflow-hidden bg-black text-white">
      {/* Subtle modern monochromatic ambient spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-radial-gradient from-white/[0.05] via-white/[0.01] to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Top Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Top Logo Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900/90 border border-white/10 text-xs font-semibold text-neutral-300 shadow-sm">
            <ZentrionLogo iconOnly size="sm" />
            <span className="font-extrabold text-white tracking-wide">Zentrion.ai</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400 font-medium">Enterprise AI Automation Platform</span>
          </div>

          {/* Main Headline: AUTOMATE. INNOVATE. SCALE. */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.98] uppercase">
            AUTOMATE.<br />
            INNOVATE.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500">
              SCALE.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
            A vállalkozásod folyamatainak intelligens automatizálása és stabil skálázása. Letisztult munkafolyamatok, zéró külső Make vagy n8n függőség, 100% saját natív TypeScript motor és valós idejű telemetria.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/audit"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-black bg-white hover:bg-neutral-200 transition-all text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95"
            >
              <span>Ingyenes AI Folyamat-Audit</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>

            <button
              onClick={openVoiceAi}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm sm:text-base flex items-center justify-center gap-2.5 group cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span>3D Voice AI Indítása</span>
            </button>

            <button
              onClick={() => setIsTourOpen(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-full font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 transition-all text-sm sm:text-base flex items-center justify-center gap-2.5 group cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 text-white fill-white group-hover:scale-110 transition-transform" />
              <span>Teljes Bemutató Videó (Hanggal)</span>
            </button>

            <Link
              href="/services/appointment-booking"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full font-semibold text-neutral-300 bg-neutral-900 border border-white/15 hover:bg-neutral-800 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-neutral-300" />
              <span>Időpontfoglalás</span>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs text-neutral-400">
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-black" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Client" />
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-black" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Client" />
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-black" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&q=80" alt="Client" />
            </div>
            <span>Több mint <strong>40+ hazai és nemzetközi cég</strong> választotta a Zentrion.ai motorját</span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* FEATURED SHOWCASE BENTO CARD (Matching the reference REDSUN design) */}
        {/* ========================================================================= */}
        <div className="rounded-3xl glass-spotlight border border-white/15 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden scroll-reveal-scale bg-[#08080a]">
          <div className="glass-rim-top" />
          
          {/* Subtle dark eclipse lens glow in background matching reference */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-white/[0.08] via-white/[0.02] to-transparent rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/[0.04] rounded-full blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            
            {/* Left Card: Exactly matching reference layout (Top mini pill + Bottom 3D floating glowing card) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Top Mini Card (Matches "Charts always ON!" in reference) */}
              <div className="rounded-2xl bg-neutral-950/80 border border-white/10 p-4 sm:p-5 backdrop-blur-xl shadow-xl flex items-center justify-between gap-4 transition-all hover:border-white/25">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white text-black flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                    <BarChart3 className="w-5 h-5 text-black stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                      <span>Charts always ON!</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Folyamatos 24/7 telemetria és autonóm felügyelet.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-neutral-200 border border-white/15">
                    Live
                  </span>
                </div>
              </div>

              {/* Bottom 3D Isometric Floating Glowing Card (Interactive tilt following mouse position) */}
              <div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative pt-2 pb-4 perspective-[1000px] group cursor-pointer select-none"
              >
                
                {/* Radiant underglow casting dynamic light onto dark ground */}
                <div 
                  className="absolute inset-x-8 bottom-0 h-28 bg-gradient-to-t from-white/25 via-white/10 to-transparent blur-2xl rounded-3xl pointer-events-none transition-all duration-500"
                  style={{
                    opacity: isHovered || isSimulating ? 1 : 0.75,
                    transform: `translate(${tilt.y * 1.2}px, ${-tilt.x * 0.6}px)`,
                  }}
                />

                {/* 3D Angled Glass Tile with physical tilt */}
                <div 
                  className="rounded-2xl p-6 bg-gradient-to-br from-neutral-900/95 via-neutral-950/95 to-black border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(255,255,255,0.14)] relative overflow-hidden transform-gpu"
                  style={{
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.025 : 1}, ${isHovered ? 1.025 : 1}, ${isHovered ? 1.025 : 1})`,
                    transformStyle: 'preserve-3d',
                    transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    willChange: 'transform',
                  }}
                >
                  {/* Glass specular rim */}
                  <div className="glass-rim-top" />
                  
                  {/* Dynamic Specular Sheen Layer that tracks cursor coordinates */}
                  <div 
                    className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-10"
                    style={{
                      background: isHovered 
                        ? `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.03) 42%, transparent 70%)`
                        : 'none',
                      opacity: isHovered ? 1 : 0,
                    }}
                  />

                  {/* Subtle inner radiant sheen */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/[0.08] rounded-full blur-2xl pointer-events-none" />

                  {/* Card Header & Metrics */}
                  <div className="flex items-start justify-between mb-4 relative z-20">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isSimulating ? 'bg-emerald-400 animate-ping' : 'bg-white'}`} />
                        <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                          ZentrionFlow Telemetria
                        </span>
                      </div>
                      <div className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight font-mono">
                        {opsCount.toLocaleString('hu-HU')} <span className="text-xs text-neutral-400 font-normal font-sans">művelet / nap</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black font-extrabold text-xs shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all ${isSimulating ? 'scale-110 shadow-[0_0_25px_rgba(255,255,255,0.9)]' : ''}`}>
                        <TrendingUp className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce' : ''}`} />
                        <span>{growthPercent}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block mt-1.5 font-mono">
                        {latency} válaszidő
                      </span>
                    </div>
                  </div>

                  {/* Glowing SVG Waveform Chart with live morphing surge */}
                  <div className="h-28 w-full flex items-end pt-2 relative overflow-hidden">
                    {/* Live Simulation Step Notification HUD Banner */}
                    {isSimulating && activeStepText && (
                      <div className="absolute top-0 left-0 right-0 z-30 px-3 py-1.5 rounded-lg bg-black/90 border border-white/30 backdrop-blur-md flex items-center justify-between text-[11px] font-mono shadow-2xl transition-all">
                        <span className="text-white font-bold truncate flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                          <span className="truncate">{activeStepText}</span>
                        </span>
                        <span className="text-[10px] text-neutral-300 font-bold shrink-0 ml-2 px-1.5 py-0.5 rounded bg-white/10 border border-white/20">
                          {simStep}/4 FÁZIS
                        </span>
                      </div>
                    )}

                    {/* Animated vertical scanline laser beam during simulation */}
                    {isSimulating && (
                      <div className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-10 animate-sweep-beam" />
                    )}

                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="glowArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity={isSimulating ? "0.45" : "0.3"} />
                          <stop offset="50%" stopColor="#ffffff" stopOpacity={isSimulating ? "0.18" : "0.08"} />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                        </linearGradient>
                        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Area Fill */}
                      <path
                        d={currentWave.area}
                        fill="url(#glowArea)"
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Glowing Main Line */}
                      <path
                        d={currentWave.line}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={isSimulating ? "3.5" : "3"}
                        strokeLinecap="round"
                        filter="url(#neonGlow)"
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Traveling Data Packet 1 */}
                      <circle r={isSimulating ? "4.5" : "3.5"} fill="#ffffff" filter="url(#neonGlow)">
                        <animateMotion
                          path={currentWave.line}
                          dur={isSimulating ? "0.9s" : "3.2s"}
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Traveling Data Packet 2 */}
                      <circle r={isSimulating ? "3.5" : "2.5"} fill="#ffffff" opacity={isSimulating ? "0.9" : "0.5"}>
                        <animateMotion
                          path={currentWave.line}
                          dur={isSimulating ? "0.9s" : "3.2s"}
                          begin={isSimulating ? "-0.45s" : "-1.6s"}
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Traveling Data Packet 3 (active only during simulation) */}
                      {isSimulating && (
                        <circle r="3" fill="#ffffff" opacity="0.85">
                          <animateMotion
                            path={currentWave.line}
                            dur="0.65s"
                            begin="-0.2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Radiant Endpoint Pulse */}
                      <circle 
                        cx="300" 
                        cy={currentWave.endY} 
                        r={isSimulating ? "6" : "4.5"} 
                        fill="#ffffff" 
                        className="animate-ping" 
                        opacity={isSimulating ? 0.9 : 0.6} 
                      />
                      <circle cx="300" cy={currentWave.endY} r="4" fill="#ffffff" />
                      {isSimulating && (
                        <circle cx="300" cy={currentWave.endY} r="9" fill="none" stroke="#ffffff" strokeWidth="1.5" className="animate-ping" opacity="0.4" />
                      )}
                    </svg>
                  </div>

                  {/* Progress bar during simulation */}
                  {isSimulating && (
                    <div className="mt-3 w-full bg-white/10 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-white h-full transition-all duration-300 shadow-[0_0_8px_white]"
                        style={{ width: `${(simStep / 4) * 100}%` }}
                      />
                    </div>
                  )}

                  {/* Footer Stats inside 3D Card */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 mt-4 text-center">
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Válaszidő</div>
                      <div className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">
                        {isSimulating ? `< ${latency}` : '< 22ms'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Hibaarány</div>
                      <div className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">
                        {isSimulating ? '0.00% [SLA OK]' : '0.00%'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Külső SaaS Díj</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-400 font-mono mt-0.5">
                        0 Ft
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Live Simulation Trigger Button */}
              <div className="pt-1">
                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
                    isSimulating 
                      ? 'bg-neutral-900 text-white border border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.2)]' 
                      : 'text-black bg-white hover:bg-neutral-200 hover:scale-[1.01] shadow-[0_10px_30px_rgba(255,255,255,0.15)]'
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-white' : 'fill-black'}`} />
                  <span>{isSimulating ? `Munkafolyamat Futtatása (${simStep}/4)...` : 'Munkafolyamat Élő Szimulációja'}</span>
                </button>
              </div>

            </div>

            {/* Right Side: Bold Typography & Action Link (matching reference layout!) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-semibold text-neutral-300">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Next-Gen Enterprise Engine</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.08]">
                Minden folyamatod kézben tartva a nap 24 órájában.
              </h2>

              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                Kiváltjuk a fárasztó manuális gépelést és adatmozgatást: beérkező leadek és emailek automatikus elemzése, kétirányú CRM szinkron, számlakiállítás és autonóm AI ügynökök.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-neutral-300 font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs shrink-0 font-black">
                    ✓
                  </div>
                  <span>Saját TypeScript motor külső havidíjak (Make/n8n) nélkül</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs shrink-0 font-black">
                    ✓
                  </div>
                  <span>99.98% garantált SLA rendelkezésre állás</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs shrink-0 font-black">
                    ✓
                  </div>
                  <span>30 napos pénzvisszafizetési garancia</span>
                </div>
              </div>

              {/* Minimal Clean Action Link (matching reference "See Doc →") */}
              <div className="pt-4">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-white font-bold text-sm sm:text-base hover:text-neutral-300 transition-colors group"
                >
                  <span className="border-b border-white pb-0.5 group-hover:border-neutral-400">
                    Összes szolgáltatás és élő demó megtekintése
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>

        {/* Stats Row in Stark Minimalist Monochrome */}
        <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-white/10">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              99.98%
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 font-medium">
              Garantált Rendszer Uptime
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              1,240,000+
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 font-medium">
              Havi Automatizált Művelet
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              3.8x
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 font-medium">
              Átlagos Ügyfél Megtérülés (ROI)
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              &lt; 2 mp
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 font-medium">
              Átlagos AI Válaszidő
            </div>
          </div>
        </div>

        {/* Interactive Guided Tour Presentation Modal */}
        <WebsiteTourPresentation
          isOpen={isTourOpen}
          onClose={() => setIsTourOpen(false)}
        />

      </div>
    </section>
  );
}
