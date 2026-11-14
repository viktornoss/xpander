'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Radio,
  Zap,
  Ear
} from 'lucide-react';
import XpanderLogo from '@/components/brand/XpanderLogo';
import Robot3DAvatar from '@/components/voice/Robot3DAvatar';

/**
 * Cleans text for natural, stutter-free human speech synthesis.
 * Strips all emojis, markdown symbols, and expands Hungarian/technical abbreviations phonetically.
 */
function cleanTextForNaturalSpeech(text: string): string {
  if (!text) return '';
  return text
    // 1. Remove all emojis (Standard Unicode Emoji blocks and pictographs)
    .replace(/[\p{Extended_Pictographic}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F1E0}-\u{1F1FF}]/gu, '')
    // 2. Remove markdown links [Label](url) -> keep Label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 3. Remove raw URLs
    .replace(/https?:\/\/\S+/g, '')
    // 4. Remove code blocks and inline backticks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // 5. Remove bold / italics asterisks and underscores
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
    // 6. Remove headings, bullet points, numbers, arrows, stars
    .replace(/^#+\s+/gm, '')
    .replace(/^[-*+•●▪■▶►✓✔✗✘✕★☆]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/---/g, '')
    .replace(/[•●▪■▶►✓✔✗✘✕★☆#_~]/g, '')
    // 7. Hungarian phonetic expansions for natural fluid pronunciation
    .replace(/\b240\.000\s*Ft\b/gi, '240 ezer forint')
    .replace(/\b380\.000\s*Ft\b/gi, '380 ezer forint')
    .replace(/\b(\d+)\.000\s*Ft\b/gi, '$1 ezer forint')
    .replace(/\bFt\b/gi, 'forint')
    .replace(/\b99[,.]98%/gi, '99 egész 98 százalék')
    .replace(/%/g, ' százalék')
    .replace(/\b24\/7\b/gi, 'éjjel-nappal')
    .replace(/\b\+36\s*1\s*800\s*9999\b/gi, 'plusz 36 1 800 9999')
    .replace(/\bXpanderFlow\b/gi, 'Ikszpander Fló')
    .replace(/\bxpander\.ai\b/gi, 'Ikszpander pont áj')
    .replace(/\bMake\.com\b/gi, 'Mék pont kom')
    .replace(/\bMake\s*\/\s*n8n\b/gi, 'Mék vagy en nyolc en')
    .replace(/\bn8n\b/gi, 'en nyolc en')
    .replace(/\bMake\b/gi, 'Mék')
    .replace(/\bRAG\b/gi, 'rág')
    .replace(/\bCRM\b/gi, 'cé-er-em')
    .replace(/\bAPI\b/gi, 'á-pé-i')
    .replace(/\bSLA\b/gi, 'essz-el-á')
    .replace(/\bROI\b/gi, 'er-o-i')
    .replace(/\bB2B\b/gi, 'bétúbé')
    .replace(/\bpl\.\b/gi, 'például')
    .replace(/\bkb\.\b/gi, 'körülbelül')
    .replace(/\bstb\.\b/gi, 'és így tovább')
    .replace(/\bdb\b/gi, 'darab')
    // 8. Punctuation smoothing (prevents micro-stutters in speech synthesis)
    .replace(/\//g, ' vagy ')
    .replace(/&/g, ' és ')
    .replace(/[;:–—]/g, ',')
    .replace(/,{2,}/g, ',')
    .replace(/\.{2,}/g, '.')
    // 9. Condense multiple spaces into single natural spaces
    .replace(/\s+/g, ' ')
    .trim();
}

interface VoiceAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'auto', name: 'Automatikus felismerés', flag: '🌍', bcp47: 'hu-HU' },
  { code: 'hu', name: 'Magyar (HU)', flag: '🇭🇺', bcp47: 'hu-HU' },
  { code: 'en', name: 'English (US)', flag: '🇬🇧', bcp47: 'en-US' },
  { code: 'de', name: 'Deutsch (DE)', flag: '🇩🇪', bcp47: 'de-DE' },
  { code: 'es', name: 'Español (ES)', flag: '🇪🇸', bcp47: 'es-ES' },
  { code: 'fr', name: 'Français (FR)', flag: '🇫🇷', bcp47: 'fr-FR' },
  { code: 'it', name: 'Italiano (IT)', flag: '🇮🇹', bcp47: 'it-IT' },
];

export default function VoiceAiModal({ isOpen, onClose }: VoiceAiModalProps) {
  const [selectedLang, setSelectedLang] = useState('auto');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [autoListen, setAutoListen] = useState(true);
  const [audioMuted, setAudioMuted] = useState(false);
  const [bargeInDetected, setBargeInDetected] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const [conversation, setConversation] = useState<VoiceMessage[]>([
    {
      id: 'vm-welcome',
      role: 'assistant',
      text: 'Szia! Az Xpander.ai Voice Agent demójában vagy. Kérdezz bátran bármiről élőszóban, és természetes hanggal válaszolok!',
      timestamp: 'Most'
    }
  ]);

  // Synchronous Refs to avoid stale closures in event listeners
  const isOpenRef = useRef(isOpen);
  const isSpeakingRef = useRef(false);
  const isThinkingRef = useRef(false);
  const autoListenRef = useRef(true);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startListeningRef = useRef<() => void>(() => {});
  const currentTranscriptRef = useRef('');

  useEffect(() => {
    isOpenRef.current = isOpen;
    autoListenRef.current = autoListen;
  }, [isOpen, autoListen]);

  // Load and cache natural voices with onvoiceschanged support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        const loaded = window.speechSynthesis.getVoices();
        if (loaded && loaded.length > 0) {
          setAvailableVoices(loaded);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Keyboard shortcut: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-scroll conversation history
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, liveTranscript, isThinking]);

  // Stop speaking immediately (used for manual cancel and barge-in)
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    isSpeakingRef.current = false;
  }, []);

  // Natural human speech synthesis
  const speakText = useCallback((textToSpeak: string, targetBcp47?: string) => {
    if (audioMuted || !synthRef.current) {
      // If audio is muted, return to listening after delay
      if (autoListenRef.current && isOpenRef.current) {
        setTimeout(() => startListeningRef.current(), 600);
      }
      return;
    }

    stopSpeaking();

    // Clean text thoroughly
    const cleanText = cleanTextForNaturalSpeech(textToSpeak);
    if (!cleanText) {
      if (autoListenRef.current && isOpenRef.current) {
        setTimeout(() => startListeningRef.current(), 600);
      }
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langCode = targetBcp47 || (selectedLang === 'auto' ? 'hu-HU' : SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.bcp47 || 'hu-HU');
    utterance.lang = langCode;
    utterance.rate = 1.0;  // Standard natural human cadence
    utterance.pitch = 1.0; // Natural balanced pitch

    // Select the highest quality natural/neural voice available
    const voices = availableVoices.length > 0 ? availableVoices : (synthRef.current?.getVoices() || []);
    const matchingVoices = voices.filter(v =>
      v.lang.replace('_', '-').toLowerCase().startsWith(langCode.slice(0, 2).toLowerCase())
    );

    const bestVoice = matchingVoices.sort((a, b) => {
      const getScore = (v: SpeechSynthesisVoice) => {
        const name = v.name.toLowerCase();
        if (name.includes('natural') || name.includes('online')) return 100;
        if (name.includes('neural')) return 90;
        if (name.includes('google')) return 85;
        if (name.includes('premium') || name.includes('enhanced')) return 70;
        return 10;
      };
      return getScore(b) - getScore(a);
    })[0];

    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      isSpeakingRef.current = true;
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      // Hands-free continuous loop: Resume listening immediately after speech finishes!
      if (autoListenRef.current && isOpenRef.current) {
        setTimeout(() => {
          if (!isSpeakingRef.current && !isThinkingRef.current) {
            startListeningRef.current();
          }
        }, 300);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      if (autoListenRef.current && isOpenRef.current) {
        setTimeout(() => startListeningRef.current(), 400);
      }
    };

    synthRef.current.speak(utterance);
  }, [audioMuted, selectedLang, availableVoices, stopSpeaking]);

  // Send query to AI backend
  const sendVoiceQuery = useCallback(async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    stopSpeaking();
    setLiveTranscript('');
    currentTranscriptRef.current = '';

    const userMsg: VoiceMessage = {
      id: `v_${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
    };

    setConversation(prev => [...prev, userMsg]);
    setIsThinking(true);
    isThinkingRef.current = true;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...conversation, userMsg].map(m => ({ role: m.role, content: m.text })),
          isVoiceMode: true, // Guarantees concise 1-2 sentence spoken answers
          systemPrompt: `Te az xpander.ai professzionális, emberi hangon beszélő Voice AI asszisztense vagy.
Beszélj 1-2 természetes, élő mondatban, barátságosan, közvetlenül, mint egy telefonos tanácsadó!
Soha ne használj felsorolást, markdown formázást vagy emojikat!`
        })
      });

      const data = await res.json();
      const reply = data.reply || 'Köszönöm a kérdésed! Miben segíthetek még?';

      const botMsg: VoiceMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
      };

      setConversation(prev => [...prev, botMsg]);
      setIsThinking(false);
      isThinkingRef.current = false;

      // Speak back the response
      speakText(reply);

    } catch (err) {
      console.warn('Voice AI API error:', err);
      setIsThinking(false);
      isThinkingRef.current = false;

      const fallbackReply = 'Elnézést, pillanatnyi hiba történt a hangfeldolgozásban. Kérlek ismételd meg!';
      const errMsg: VoiceMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        text: fallbackReply,
        timestamp: 'Most'
      };
      setConversation(prev => [...prev, errMsg]);
      speakText(fallbackReply);
    }
  }, [conversation, speakText, stopSpeaking]);

  // Start speech recognition with Barge-In and Auto-Debounce
  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    // Do not restart if already running
    if (recognitionRef.current && isListening) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Stay active continuously
      recognition.interimResults = true; // Real-time feedback

      const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang);
      recognition.lang = langConfig && langConfig.code !== 'auto' ? langConfig.bcp47 : 'hu-HU';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        const currentText = (final || interim).trim();

        // -------------------------------------------------------------
        // BARGE-IN INTERRUPTION: If user speaks while AI is talking,
        // instantly cancel speech synthesis and listen to the user!
        // -------------------------------------------------------------
        if (currentText.length > 0 && (isSpeakingRef.current || synthRef.current?.speaking)) {
          stopSpeaking();
          setBargeInDetected(true);
          setTimeout(() => setBargeInDetected(false), 2200);
        }

        if (currentText.length > 0) {
          setLiveTranscript(currentText);
          currentTranscriptRef.current = currentText;

          // Reset silence timer on every spoken syllable
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // 1200ms silence detection: When user pauses for 1.2s, auto-send query
          silenceTimerRef.current = setTimeout(() => {
            if (currentTranscriptRef.current.trim().length > 1 && !isThinkingRef.current) {
              const textToSend = currentTranscriptRef.current.trim();
              currentTranscriptRef.current = '';
              sendVoiceQuery(textToSend);
            }
          }, 1200);
        }
      };

      recognition.onerror = (event: any) => {
        // 'no-speech' is a normal idle timeout; keep continuous loop alive
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition warning:', event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Hands-free continuous loop: If modal is open and not speaking/thinking, restart automatically
        if (isOpenRef.current && autoListenRef.current && !isSpeakingRef.current && !isThinkingRef.current) {
          setTimeout(() => {
            if (isOpenRef.current && !isSpeakingRef.current && !isThinkingRef.current) {
              try {
                recognition.start();
              } catch {}
            }
          }, 250);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start error:', err);
      setIsListening(false);
    }
  }, [isListening, selectedLang, sendVoiceQuery, stopSpeaking]);

  useEffect(() => {
    startListeningRef.current = startListening;
  }, [startListening]);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
  }, []);

  // 100% Hands-free activation: Auto-start listening on modal open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        startListeningRef.current();
      }, 350);
      return () => clearTimeout(timer);
    } else {
      stopListening();
      stopSpeaking();
      setLiveTranscript('');
      currentTranscriptRef.current = '';
    }
  }, [isOpen, stopListening, stopSpeaking]);

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleManualSendNow = () => {
    if (liveTranscript.trim()) {
      sendVoiceQuery(liveTranscript.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200"
    >
      <div className="max-w-2xl w-full h-[680px] glass-panel border border-white/20 rounded-3xl p-5 sm:p-7 bg-[#0a0a0c]/95 flex flex-col justify-between shadow-[0_25px_80px_rgba(0,0,0,0.95)] relative overflow-hidden">
        
        {/* Dynamic Background Glow Ambiance */}
        <div className={`absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${
          isSpeaking 
            ? 'bg-white/15 scale-110' 
            : isListening 
              ? 'bg-cyan-500/20 scale-105' 
              : 'bg-white/5'
        }`} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
          <div className="flex items-center gap-3">
            <XpanderLogo size="sm" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20 flex items-center gap-1.5 shadow-sm">
                <Radio className={`w-3 h-3 ${isSpeaking || isListening ? 'animate-pulse text-white' : 'text-neutral-400'}`} />
                <span>3D Voice AI Studio</span>
              </span>
              <span className="text-[11px] text-neutral-400 hidden sm:inline">• Természetes beszéd & barge-in</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedLang}
                onChange={(e) => {
                  setSelectedLang(e.target.value);
                  stopListening();
                  setTimeout(() => startListeningRef.current(), 300);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-white"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mute Button */}
            <button
              onClick={() => {
                setAudioMuted(!audioMuted);
                if (!audioMuted) stopSpeaking();
              }}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                audioMuted 
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
                  : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
              }`}
              title={audioMuted ? 'Hang visszakapcsolása' : 'Hang elnémítása'}
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Ablak bezárása (Esc)"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Bezárás</span>
            </button>
          </div>
        </div>

        {/* Center: 3D Talking Robot Avatar & Speech Reactive Visualizer */}
        <div className="my-auto text-center space-y-4 relative z-10 py-1 flex flex-col items-center">
          
          {/* True 3D Interactive Three.js Robot */}
          <div className="relative">
            <Robot3DAvatar
              isSpeaking={isSpeaking}
              isListening={isListening}
              isThinking={isThinking}
              isMuted={audioMuted}
              size="md"
              className="cursor-pointer"
              onClick={toggleMic}
              showTelemetry={true}
            />
          </div>

          {/* Sleek Monochrome Waveform Bars */}
          <div className="flex items-center justify-center gap-1.5 h-8">
            {[35, 65, 95, 55, 80, 100, 70, 85, 60, 75, 45, 25].map((h, i) => {
              const activeHeight = isSpeaking || isListening 
                ? `${Math.max(16, (h * ((i % 3 === 0 ? 1.2 : 0.8))))}%` 
                : isThinking 
                  ? '35%' 
                  : '12%';

              const barColor = isSpeaking 
                ? 'bg-white shadow-[0_0_8px_#ffffff]' 
                : isListening 
                  ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' 
                  : isThinking 
                    ? 'bg-amber-400' 
                    : 'bg-white/20';

              return (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${barColor}`}
                  style={{ height: activeHeight }}
                />
              );
            })}
          </div>

          {/* Barge-in Feedback Pill */}
          {bargeInDetected && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/30 text-white text-xs font-bold animate-in fade-in zoom-in-95">
              <Ear className="w-3.5 h-3.5 animate-bounce" />
              <span>Közbeszólás észlelve – azonnal hallgatlak!</span>
            </div>
          )}

          {/* State Text & Live Spoken Transcript */}
          <div className="space-y-2 max-w-lg mx-auto min-h-[50px] w-full">
            <div className="text-xs font-bold uppercase tracking-wider">
              {isListening && !isSpeaking && (
                <span className="text-cyan-400 flex items-center justify-center gap-2 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Hallgatlak... Beszélj nyugodtan (bármikor közbeszólhatsz)!
                </span>
              )}
              {isSpeaking && (
                <span className="text-white flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  A 3D Robot válaszol (szólj bele bátran a megszakításhoz)...
                </span>
              )}
              {isThinking && (
                <span className="text-amber-400 flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  Válasz feldolgozása a neurális modellen...
                </span>
              )}
              {!isListening && !isSpeaking && !isThinking && (
                <span className="text-neutral-400">
                  Kattints a 3D robotra vagy a mikrofon gombra a beszélgetéshez
                </span>
              )}
            </div>

            {liveTranscript && (
              <div className="flex items-center justify-between gap-2 bg-white/5 p-3 rounded-2xl border border-white/20 animate-in fade-in">
                <p className="text-sm font-semibold text-white flex-1 text-left">
                  &bdquo;{liveTranscript}&rdquo;
                </p>
                <button
                  onClick={handleManualSendNow}
                  className="px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-1 hover:bg-neutral-200 transition-opacity cursor-pointer shrink-0 shadow"
                >
                  <Send className="w-3 h-3" />
                  <span>Küldés</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Conversation Preview & Controls Bar */}
        <div className="border-t border-white/10 pt-3 space-y-2.5 relative z-10">
          
          {/* Scrollable Dialogue History */}
          <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 text-xs">
            {conversation.slice(-3).map((msg) => (
              <div
                key={msg.id}
                className={`p-2.5 rounded-xl flex items-start gap-2.5 ${
                  msg.role === 'user' 
                    ? 'bg-white/10 border border-white/15 text-white ml-8' 
                    : 'bg-white/5 border border-white/10 text-gray-200 mr-8'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {msg.role === 'user' ? (
                    <User className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-neutral-300" />
                  )}
                </div>
                <div className="flex-1 leading-relaxed">
                  <p className="line-clamp-2">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoListen}
                  onChange={(e) => setAutoListen(e.target.checked)}
                  className="rounded border-white/20 bg-neutral-900 text-white focus:ring-0 cursor-pointer"
                />
                <span className="hidden sm:inline">100% Kéz nélküli folyamatos beszélgetés</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-500/30 transition-colors cursor-pointer"
                >
                  <span>Megállítás</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Bezárás</span>
              </button>

              <button
                onClick={toggleMic}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white shadow-rose-600/30 hover:bg-rose-500'
                    : 'bg-white text-black hover:bg-neutral-200 shadow-white/20'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Mikrofon Szünet</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Beszéd Indítása</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
