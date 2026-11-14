'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bot, 
  User, 
  Radio, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Ear,
  Activity
} from 'lucide-react';
import Robot3DAvatar from '@/components/voice/Robot3DAvatar';
import { useVoiceAi } from '@/components/voice/VoiceAiContext';

/**
 * Strips emojis, markdown, and expands abbreviations for stutter-free Hungarian pronunciation.
 */
function cleanSpeechText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/^[-*+•●▪■▶►✓✔✗✘✕★☆]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/---/g, '')
    .replace(/[•●▪■▶►✓✔✗✘✕★☆#_~]/g, '')
    .replace(/\b240\.000\s*Ft\b/gi, '240 ezer forint')
    .replace(/\b380\.000\s*Ft\b/gi, '380 ezer forint')
    .replace(/\b(\d+)\.000\s*Ft\b/gi, '$1 ezer forint')
    .replace(/\bFt\b/gi, 'forint')
    .replace(/\b99[,.]98%/gi, '99 egész 98 százalék')
    .replace(/%/g, ' százalék')
    .replace(/\b24\/7\b/gi, 'éjjel-nappal')
    .replace(/\bZentrionFlow\b/gi, 'Ikszpander Fló')
    .replace(/\bzentrion\.ai\b/gi, 'Ikszpander pont áj')
    .replace(/\bMake\.com\b/gi, 'Mék pont kom')
    .replace(/\bn8n\b/gi, 'en nyolc en')
    .replace(/\bMake\b/gi, 'Mék')
    .replace(/\bRAG\b/gi, 'rág')
    .replace(/\bCRM\b/gi, 'cé-er-em')
    .replace(/\bAPI\b/gi, 'á-pé-i')
    .replace(/\bSLA\b/gi, 'essz-el-á')
    .replace(/\bpl\.\b/gi, 'például')
    .replace(/\bkb\.\b/gi, 'körülbelül')
    .replace(/\bstb\.\b/gi, 'és így tovább')
    .replace(/\s+/g, ' ')
    .trim();
}

const PRESET_QUESTIONS = [
  'Mit tud a Zentrion.ai AI ügynöke?',
  'Miért jobb a saját motor, mint a Make vagy n8n?',
  'Milyen árakkal dolgoztok?',
  'Hogyan működik az időpontfoglaló AI?'
];

export default function RobotVoiceShowcase() {
  const { openVoiceAi } = useVoiceAi();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [lastMessage, setLastMessage] = useState('Szia! Én vagyok a Zentrion.ai 3D Voice Ügynöke. Kérdezz tőlem bármit!');

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const clean = cleanSpeechText(text);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'hu-HU';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const huVoice = voices.find(v => v.lang.includes('hu') || v.name.includes('Hungarian'));
    if (huVoice) {
      utterance.voice = huVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsThinking(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsThinking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const handleAsk = async (question: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setIsThinking(true);
    setLastMessage(`„${question}” – Válasz előkészítése...`);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: question }]
        })
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const reply = data.reply || data.text || 'A Zentrion.ai vállalati folyamatautomatizálási platform zökkenőmentesen köti össze rendszereidet saját natív motorral.';
      
      setLastMessage(reply);
      speakText(reply);
    } catch {
      const fallback = 'A Zentrion.ai egyedi vállalati AI ügynököket és automatizált munkafolyamatokat épít natív TypeScript alapon, zéró külső függőséggel.';
      setLastMessage(fallback);
      speakText(fallback);
    }
  };

  const toggleInlineMic = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      openVoiceAi();
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      return;
    }

    try {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }

      const rec = new SpeechRecognition();
      rec.lang = 'hu-HU';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleAsk(transcript);
        }
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch {
      openVoiceAi();
    }
  };

  return (
    <section className="py-28 md:py-36 relative overflow-hidden bg-black text-white">
      {/* Top section divider */}
      <div className="section-divider mb-20" />

      {/* Dynamic Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-white/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        
        {/* Section Header with Scroll Reveal */}
        <div className="text-center max-w-3xl mx-auto space-y-5 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold tracking-wider text-neutral-300 backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>ZENTRION-VOICE-3D ENGINE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight">
            <span className="text-shimmer">Valós idejű 3D</span> Robot Voice Agent
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Nem pusztán hanghullámok: a Zentrion.ai 3D robotja valós időben artikulál és beszél, miközben azonnal válaszol minden kérdésedre.
          </p>
        </div>

        {/* The 3D Robot Interactive Station (Glass Spotlight Card) */}
        <div className="max-w-5xl mx-auto rounded-3xl glass-spotlight border border-white/15 p-6 sm:p-12 relative overflow-hidden shadow-2xl scroll-reveal-scale">
          <div className="glass-rim-top" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            
            {/* Left 3D Robot Display Station */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative">
              
              {/* Sci-Fi Hologram Pod Container with Corner Brackets */}
              <div className="relative p-3 rounded-3xl bg-white/[0.02] border border-white/10 shadow-2xl">
                {/* Tech corner tick accents */}
                <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/40" />
                <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/40" />
                <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/40" />
                <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/40" />

                <Robot3DAvatar
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  isThinking={isThinking}
                  size="lg"
                  onClick={toggleInlineMic}
                  showTelemetry={true}
                  className="cursor-pointer"
                />
              </div>

              {/* Status Pill below robot */}
              <div className="pt-5 text-center w-full max-w-xs">
                <button
                  onClick={toggleInlineMic}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : isSpeaking
                        ? 'bg-white text-black shadow-white/30'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Hallgatlak... (Kattints a stophoz)</span>
                    </>
                  ) : isSpeaking ? (
                    <>
                      <Volume2 className="w-4 h-4 animate-bounce" />
                      <span>Beszéd Megállítása</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Kattints & Beszélj a Robottal</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Interactive Speech Console & Preset Questions */}
            <div className="md:col-span-7 space-y-6 text-left">
              
              {/* Telemetry Status Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-2.5 text-xs font-mono text-neutral-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-white font-bold">ZENTRION-VOICE-v2</span>
                  <span>|</span>
                  <span className="text-emerald-400 font-mono">LATENCY: &lt; 18ms</span>
                </div>
                <button
                  onClick={openVoiceAi}
                  className="text-xs font-bold text-white hover:text-neutral-300 transition-colors flex items-center gap-1.5 group cursor-pointer"
                >
                  <span>Teljes Stúdió Megnyitása</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Active Spoken Speech Balloon */}
              <div className="rounded-2xl p-6 bg-white/[0.04] border border-white/15 relative shadow-inner">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                    <Bot className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                      <span className="font-bold text-neutral-300">3D Robot Válasza</span>
                      {isSpeaking && (
                        <span className="text-white font-bold flex items-center gap-1.5">
                          <Activity className="w-3 h-3 text-white animate-pulse" />
                          <span>Hangadás aktív</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white font-medium leading-relaxed">
                      {lastMessage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Sample Questions to Test Robot Talking */}
              <div className="space-y-3">
                <span className="text-xs text-neutral-400 font-semibold block">
                  Próbáld ki azonnal – kattints egy kérdésre, és nézd meg, ahogy a robot artikulálva válaszol:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRESET_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAsk(q)}
                      disabled={isThinking}
                      className="text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-xs text-neutral-200 hover:text-white transition-all duration-200 group flex items-center justify-between cursor-pointer disabled:opacity-50 shadow-sm"
                    >
                      <span className="font-medium pr-2">{q}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
