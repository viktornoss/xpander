'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RotateCcw, 
  CheckCircle2, 
  Key, 
  Settings, 
  X, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Check,
  Cpu,
  Mic,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';
import MarkdownMessage from '@/components/chat/MarkdownMessage';
import ZentrionLogo from '@/components/brand/ZentrionLogo';
import { useVoiceAi } from '@/components/voice/VoiceAiContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

const SAMPLE_PROMPTS = [
  'Mennyi idő alatt áll élesbe egy projekt?',
  'Milyen garanciát és SLA-t vállaltok?',
  'Miért jobb a saját motorotok, mint a Make vagy az n8n?',
  'Hogyan működik a számlázás automatizáció (Billingo, Számlázz.hu)?',
  'Írj nekem egy B2B ajánlatkérő email sablont!',
  'Milyen nyelveken tud kommunikálni a chatbot?'
];

export default function LiveChatbotSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: `Üdvözöllek az **zentrion.ai** felületén! 👋\n\nÉn az zentrion.ai dedikált AI asszisztense vagyok. Kérdezz bátran:\n- Hogyan tudjuk a manuális folyamataidat kiváltani **saját ZentrionFlow TypeScript motorunkkal** és autonóm AI agentekkel,\n- Miként működik a céges tudásbázisra épülő **RAG Chatbotunk**,\n- Vagy kérj tőlem egy **azonnali folyamattervezetet / email sablont** a cégedre szabva!\n\nMilyen területen szeretnél időt és költséget megtakarítani?`,
      timestamp: 'Most'
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [keySavedFeedback, setKeySavedFeedback] = useState(false);
  const [activeModel, setActiveModel] = useState<'nexus-cognitive' | 'gpt-4o'>('nexus-cognitive');

  const { openVoiceAi } = useVoiceAi();
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('nexus_openai_key') || '';
      if (storedKey) {
        setApiKey(storedKey);
        setActiveModel('gpt-4o');
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  const saveApiKey = (newKey: string) => {
    const trimmed = newKey.trim();
    setApiKey(trimmed);
    if (typeof window !== 'undefined') {
      if (trimmed) {
        localStorage.setItem('nexus_openai_key', trimmed);
        setActiveModel('gpt-4o');
      } else {
        localStorage.removeItem('nexus_openai_key');
        setActiveModel('nexus-cognitive');
      }
    }
    setKeySavedFeedback(true);
    setTimeout(() => setKeySavedFeedback(false), 2000);
  };

  // Simulate realistic word-by-word streaming for real AI sensation
  const streamTextIntoMessage = useCallback((fullText: string, messageId: string) => {
    const words = fullText.split(' ');
    let currentIdx = 0;
    const batchSize = 3; // 3 words at a time for fast, natural cadence

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      currentIdx += batchSize;
      const partialText = words.slice(0, currentIdx).join(' ');

      setMessages(prev =>
        prev.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              content: partialText,
              isStreaming: currentIdx < words.length
            };
          }
          return msg;
        })
      );

      if (currentIdx >= words.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setMessages(prev =>
          prev.map(msg => (msg.id === messageId ? { ...msg, content: fullText, isStreaming: false } : msg))
        );
      }
    }, 18);
  }, []);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    // Placeholder message for streaming
    const botMessageId = `bot_${Date.now()}`;
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
          model: apiKey ? 'gpt-4o' : undefined,
          systemPrompt: `Te az zentrion.ai Automation Agency hivatalos és intelligens szakértő asszisztense vagy.
A céged vállalati AI rendszereket, RAG chatbotokat, saját fejlesztésű TypeScript munkafolyamat motort (ZentrionFlow) és autonóm ágenseket épít B2B vállalkozásoknak.
Válaszolj mint egy Senior AI Solutions Architect: barátságosan, professzionálisan, strukturáltan (használj félkövér kiemelést és listajeleket), és adj konkrét gyakorlati tippeket!`
        })
      });

      const data = await response.json();
      const fullReply = data.reply || 'Köszönöm a kérdésed! Szívesen segítünk a folyamatok felmérésében.';

      // Insert placeholder and start typewriter stream
      setMessages(prev => [...prev, botPlaceholder]);
      setIsLoading(false);
      streamTextIntoMessage(fullReply, botMessageId);

    } catch {
      setIsLoading(false);
      setMessages(prev => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          role: 'assistant',
          content: 'Sajnálom, pillanatnyi hiba történt a kapcsolatban. Kérlek próbáld meg újra, vagy írj közvetlenül nekünk az alábbi űrlapon!',
          timestamp: new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setMessages([
      {
        id: 'm1',
        role: 'assistant',
        content: 'Üdvözöllek újra! Milyen kérdésed van az zentrion.ai automatizációkkal vagy a saját TypeScript motorral kapcsolatban?',
        timestamp: 'Most'
      }
    ]);
  };

  return (
    <section id="ai-chat" className="py-28 relative bg-black text-white scroll-mt-20 overflow-hidden">
      {/* Top section divider */}
      <div className="section-divider mb-20" />

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto scroll-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>Valós Idejű AI Interakció</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase">
            <span className="text-shimmer">Próbáld ki</span> az Zentrion.ai Chatbotot!
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed">
            Tegyél fel egy kérdést folyamatokról, árakról, vagy kérj azonnali munkafolyamat-tervezetet vagy sablont. Úgy válaszol, mint egy tapasztalt AI vezető mérnök.
          </p>
        </div>

        {/* Chat Window Container */}
        <div className="rounded-3xl glass-spotlight border border-white/15 shadow-2xl overflow-hidden flex flex-col scroll-reveal-scale">
          <div className="glass-rim-top" />
          
          {/* Chat Window Top Bar */}
          <div className="px-6 py-4 bg-[#111111] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/10 p-[1px]">
                  <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">Zentrion.ai Asszisztens</span>
                  {apiKey ? (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      OpenAI GPT-4o (Aktív Kulcs)
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15 flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      Zentrion Cognitive Mesh v2
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Online • Intelligens kontextus-kezelés és streaming</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={openVoiceAi}
                className="p-2 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-all border border-white/15 bg-white/10 text-white hover:bg-white/20 font-bold cursor-pointer"
                title="Hangalapú AI Asszisztens Megnyitása"
              >
                <Mic className="w-3.5 h-3.5 text-white animate-pulse" />
                <span className="hidden sm:inline">Voice Mód</span>
              </button>

              <button
                onClick={() => setShowSettingsModal(true)}
                className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors border cursor-pointer ${
                  apiKey 
                    ? 'border-white/20 bg-white/15 text-white' 
                    : 'border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
                title="AI Beállítások / Saját OpenAI Kulcs"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-medium">
                  {apiKey ? 'OpenAI Aktív' : 'API Kulcs'}
                </span>
              </button>

              <button
                onClick={handleReset}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                title="Beszélgetés újrakezdése"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Újrakezdés</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="p-6 h-[420px] overflow-y-auto space-y-4 text-xs leading-relaxed">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 space-y-2 ${
                      isUser
                        ? 'bg-white text-black font-semibold shadow-md'
                        : 'bg-[#141414] border border-white/10 text-neutral-200'
                    }`}
                  >
                    {isUser ? (
                      <div className="text-[13px] whitespace-pre-wrap leading-relaxed text-black font-semibold">
                        {msg.content}
                      </div>
                    ) : (
                      <MarkdownMessage content={msg.content} isStreaming={msg.isStreaming} />
                    )}

                    <div className={`text-[10px] ${isUser ? 'text-black/60' : 'text-neutral-500'} text-right`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-white/15 text-white flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 justify-start animate-in fade-in">
                <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-[#141414] border border-white/10 rounded-2xl px-4 py-3 text-xs text-neutral-400 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span>Az AI elemzi a kérdést és fogalmazza a választ...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-6 py-2.5 bg-black border-t border-white/5 overflow-x-auto flex items-center gap-2 no-scrollbar">
            <span className="text-[11px] text-neutral-400 font-semibold whitespace-nowrap">
              Javasolt kérdések:
            </span>
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 hover:text-white border border-white/10 text-neutral-300 text-xs whitespace-nowrap transition-colors disabled:opacity-50 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSubmit} className="p-4 bg-[#111111] border-t border-white/10 flex items-center gap-2 sm:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Kérdezz bármit (pl. Hogyan automatizálhatom a számlázást és az emaileket?)..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-black border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-white placeholder:text-neutral-500"
            />
            <button
              type="button"
              onClick={openVoiceAi}
              title="Hangalapú AI (Voice AI) Indítása"
              className="p-3 sm:px-4 sm:py-3 rounded-2xl bg-white/5 hover:bg-white/15 text-white border border-white/15 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-white animate-pulse" />
              <span className="hidden sm:inline text-xs font-semibold">Beszéd</span>
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 sm:px-6 py-3 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:bg-neutral-200 transition-all disabled:opacity-40 shrink-0 cursor-pointer"
            >
              <span className="hidden sm:inline">Küldés</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-300 pt-2">
          <div className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <span><strong>Természetes válaszadás:</strong> Folyamattervezés, árak és kód sablonok</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <span><strong>Valós streaming:</strong> Szóról szóra legépelt, életszerű AI interakció</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <span><strong>Opcionális OpenAI kulcs:</strong> Saját GPT-4o-val is azonnal összeköthető</span>
          </div>
        </div>

      </div>

      {/* AI Settings / OpenAI Key Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="max-w-md w-full glass-panel border border-neon-purple/40 rounded-3xl p-6 bg-nexus-950 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-neon-purple/20 text-neon-purple flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Motor Beállítások</h3>
                  <p className="text-xs text-gray-400">Válassz motort vagy adj meg saját OpenAI kulcsot</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-300">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Alapértelmezett mód:</span>
                  <span className="px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple font-mono font-bold">
                    zentrion Cognitive v2
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  API kulcs nélkül is teljes értékűen válaszol: ismeri a folyamatokat, árakat, készít sablonokat és munkafolyamat terveket.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-white">
                  Saját OpenAI API Kulcs (Opcionális):
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full px-4 py-3 rounded-2xl bg-nexus-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-neon-purple"
                />
                <p className="text-[11px] text-gray-500">
                  A kulcsod csak a böngésződ memóriájában és helyi tárhelyében tárolódik.
                </p>
              </div>

              {keySavedFeedback && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Beállítások sikeresen elmentve!</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              {apiKey ? (
                <button
                  onClick={() => saveApiKey('')}
                  className="px-4 py-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
                >
                  Kulcs törlése
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 border border-white/10"
                >
                  Mégse
                </button>
                <button
                  onClick={() => {
                    saveApiKey(apiKey);
                    setShowSettingsModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple shadow-md"
                >
                  Mentés és Alkalmazás
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
