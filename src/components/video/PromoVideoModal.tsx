'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Sparkles, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface PromoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PromoVideoModal({ isOpen, onClose }: PromoVideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);

  const scenes = [
    {
      time: '0:00 - 0:05',
      title: 'AUTOMATE. INNOVATE. SCALE.',
      desc: 'Autonóm AI rendszerek, amelyek 24/7 dolgoznak a céged helyett.',
    },
    {
      time: '0:05 - 0:10',
      title: '12,480+ MŰVELET / NAP',
      desc: 'Zéró Make.com, zéró n8n. 100% saját natív TypeScript motor.',
    },
    {
      time: '0:10 - 0:15',
      title: 'INGYENES AI FOLYAMAT-AUDIT',
      desc: 'Mérd fel vállalkozásod automatizálási potenciálját és ROI-ját.',
    }
  ];

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSceneIndex((prev) => (prev + 1) % scenes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen, scenes.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#09090b] border border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.15)] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              Xpander.ai • Hivatalos Promóciós Videó
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Screen Area */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
          
          {/* Animated Video Display (GIF/WebP) */}
          <img
            src="/xpander-promo-video.gif"
            alt="Xpander.ai Promotional Video"
            className="w-full h-full object-contain"
          />

          {/* Floating Specular Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Live Overlay Subtitle Pill */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 max-w-lg shadow-2xl">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-white" />
                <span>{scenes[sceneIndex].time} • Xpander Engine Telemetria</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                {scenes[sceneIndex].title}
              </h3>
              <p className="text-xs text-neutral-300 mt-0.5">
                {scenes[sceneIndex].desc}
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 pointer-events-auto">
              <a
                href="/xpander-promo-video.gif"
                download="xpander-promo-video.gif"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Videó Letöltése (HD)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls & CTA */}
        <div className="px-6 py-4 bg-[#0d0d10] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>Full HD 60fps</span>
            </span>
            <span>•</span>
            <span>Közösségi média és B2B hirdetésre optimalizálva</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/audit"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-white text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-neutral-200 transition-all"
            >
              <span>Ingyenes AI Audit Indítása</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

