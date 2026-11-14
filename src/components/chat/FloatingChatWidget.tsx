'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bot, 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw,
  Minimize2,
  Key,
  ShieldCheck,
  Mic,
  Volume2,
  VolumeX
} from 'lucide-react';
import MarkdownMessage from '@/components/chat/MarkdownMessage';
import { useVoiceAi } from '@/components/voice/VoiceAiContext';
import ZentrionLogo from '@/components/brand/ZentrionLogo';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export default function FloatingChatWidget() {
  const { openVoiceAi } = useVoiceAi();
  const [isOpen, setIsOpen] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: 'Szia! 👋 Az **zentrion.ai** asszisztense vagyok. Milyen folyamatot szeretnél automatizálni a cégedben?',
      timestamp: 'Most'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSpeakMessage = (msgId: string, textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = textToSpeak
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
      .replace(/[•●▪■▶►✓✔✗✘✕★☆#_]/g, '')
      .replace(/\//g, ' vagy ')
      .replace(/&/g, ' és ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'hu-HU';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoices = voices.filter(v => v.lang.toLowerCase().startsWith('hu'));
    const bestVoice = matchingVoices.sort((a, b) => {
      const getScore = (v: SpeechSynthesisVoice) => {
        const name = v.name.toLowerCase();
        if (name.includes('natural') || name.includes('online')) return 100;
        if (name.includes('neural')) return 90;
        if (name.includes('google')) return 80;
        return 10;
      };
      return getScore(b) - getScore(a);
    })[0];

    if (bestVoice) utterance.voice = bestVoice;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nexus_openai_key') || '';
      setApiKey(stored);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const streamText = useCallback((fullText: string, messageId: string) => {
    const words = fullText.split(' ');
    let currentIdx = 0;
    const batchSize = 3;

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      currentIdx += batchSize;
      const partial = words.slice(0, currentIdx).join(' ');

      setMessages(prev =>
        prev.map(m =>
          m.id === messageId
            ? { ...m, content: partial, isStreaming: currentIdx < words.length }
            : m
        )
      );

      if (currentIdx >= words.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setMessages(prev =>
          prev.map(m => (m.id === messageId ? { ...m, content: fullText, isStreaming: false } : m))
        );
      }
    }, 18);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    const botMessageId = `b_${Date.now()}`;
    const botPlaceholder: ChatMessage = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    };

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-openai-key': apiKey } : {})
        },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          apiKey: apiKey || undefined,
          systemPrompt: 'Te az zentrion.ai Agency szakértő lebegő weboldali asszisztense vagy. Válaszolj tömören, világosan, segítőkészen és strukturáltan.'
        })
      });

      const data = await response.json();
      const reply = data.reply || 'Köszönöm a kérdésed! Szívesen segítünk a folyamatokban.';

      setMessages(prev => [...prev, botPlaceholder]);
      setIsLoading(false);
      streamText(reply, botMessageId);

    } catch {
      setIsLoading(false);
      setMessages(prev => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          role: 'assistant',
          content: 'Hiba a kapcsolatban, kérlek próbáld újra!',
          timestamp: new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="mb-4 w-[360px] sm:w-[420px] h-[540px] rounded-3xl bg-[#0a0a0a] border border-white/15 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-[#111111] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <ZentrionLogo iconOnly size="sm" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Zentrion.ai Asszisztens</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white font-mono">
                    {apiKey ? 'GPT-4o' : 'Multi-Lingual'}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                  <span>Azonnal válaszol</span>
                  <span>•</span>
                  <span>Minden nyelven</span>
                  <span>•</span>
                  <span>Voice AI</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  openVoiceAi();
                }}
                className="px-2 py-1 rounded-lg text-white hover:bg-white/10 flex items-center gap-1 text-[11px] font-semibold border border-white/15 cursor-pointer"
                title="Hangalapú AI Indítása"
              >
                <Mic className="w-3.5 h-3.5 animate-pulse text-white" />
                <span className="hidden sm:inline">Voice</span>
              </button>
              <button
                onClick={() => setMessages([{ id: 'm1', role: 'assistant', content: 'Szia! Miben segíthetek?', timestamp: 'Most' }])}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer"
                title="Beszélgetés törlése"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer"
                title="Bezárás"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 leading-relaxed relative group ${
                      isUser
                        ? 'bg-white text-black font-semibold shadow-md'
                        : 'bg-[#141414] border border-white/10 text-neutral-200'
                    }`}
                  >
                    {!isUser && (
                      <button
                        onClick={() => handleSpeakMessage(m.id, m.content)}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-black border border-white/10 text-neutral-400 hover:text-white hover:border-white transition-colors cursor-pointer"
                        title={speakingMsgId === m.id ? 'Felolvasás leállítása' : 'Felolvasás'}
                      >
                        {speakingMsgId === m.id ? (
                          <VolumeX className="w-3 h-3 text-white animate-pulse" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                      </button>
                    )}
                    {isUser ? (
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    ) : (
                      <MarkdownMessage content={m.content} isStreaming={m.isStreaming} />
                    )}
                    <div className={`text-[9px] mt-1 ${isUser ? 'text-black/60' : 'text-neutral-500'} text-right`}>
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#141414] border border-white/10 text-neutral-400 rounded-2xl px-3.5 py-2 text-xs flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5 text-white animate-spin" />
                  <span>Az AI válaszol...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-[#111111] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Írj egy kérdést..."
              className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-white placeholder:text-neutral-500"
            />
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openVoiceAi();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer"
              title="Hangalapú AI indítása"
            >
              <Mic className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-3.5 py-2 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center hover:bg-neutral-200 disabled:opacity-40 transition-all cursor-pointer shadow"
            >
              <Send className="w-3.5 h-3.5 text-black" />
            </button>
          </form>

        </div>
      )}

      {/* Circular Floating Robot Button */}
      <div className="relative group">
        
        {/* Subtle tooltip speech bubble appearing on hover */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 hidden sm:flex items-center">
          <div className="px-3.5 py-1.5 rounded-full bg-black/90 border border-white/20 text-white text-xs font-bold whitespace-nowrap shadow-xl flex items-center gap-2 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>Zentrion AI Asszisztens</span>
          </div>
          <div className="w-2 h-2 bg-black/90 border-r border-t border-white/20 transform rotate-45 -ml-1" />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Chat bezárása' : 'AI Asszisztens megnyitása'}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black border-2 border-white/30 text-white shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_45px_rgba(255,255,255,0.6)] hover:border-white hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center overflow-visible group/btn"
        >
          {/* Animated radar halo rings */}
          <span className="absolute -inset-1 rounded-full border border-white/20 animate-ping opacity-75 pointer-events-none" />
          <span className="absolute -inset-2 rounded-full border border-white/10 pointer-events-none" />

          {/* Online green indicator badge */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black z-10 shadow-sm flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </span>

          {isOpen ? (
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 rotate-90 hover:rotate-180">
              <X className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
          ) : (
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform duration-300 group-hover/btn:scale-105">
              <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Antenna */}
                <line x1="24" y1="5" x2="24" y2="12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="24" cy="4.5" r="2.5" fill="#ffffff" className="animate-pulse" />

                {/* Ears */}
                <rect x="5" y="21" width="3" height="8" rx="1.5" fill="#ffffff" opacity="0.9" />
                <rect x="40" y="21" width="3" height="8" rx="1.5" fill="#ffffff" opacity="0.9" />

                {/* Head */}
                <rect x="8" y="12" width="32" height="26" rx="9" fill="#0f0f11" stroke="#ffffff" strokeWidth="2.2" />

                {/* Visor */}
                <rect x="12" y="17" width="24" height="11" rx="5.5" fill="#000000" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4" />

                {/* Eyes */}
                <ellipse cx="18" cy="22.5" rx="3.2" ry="3.5" fill="#ffffff" />
                <circle cx="16.8" cy="21.5" r="1.1" fill="#000000" />
                
                <ellipse cx="30" cy="22.5" rx="3.2" ry="3.5" fill="#ffffff" />
                <circle cx="28.8" cy="21.5" r="1.1" fill="#000000" />

                {/* Mouth speaker grille */}
                <line x1="18" y1="33" x2="30" y2="33" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
              </svg>
            </div>
          )}
        </button>
      </div>

    </div>
  );
}
