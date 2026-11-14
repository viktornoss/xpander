'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  MessageSquare, 
  Settings, 
  Send, 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Database,
  Flame
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ChatbotConfig } from '@/types';

export default function ChatbotsDashboardPage() {
  const { chatbots, updateChatbot } = useAuth();
  const [selectedBotId, setSelectedBotId] = useState<string>(chatbots[0]?.id || 'bot-1');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeBot = chatbots.find(b => b.id === selectedBotId) || chatbots[0];

  // Editable fields
  const [systemPrompt, setSystemPrompt] = useState(activeBot?.systemPrompt || '');
  const [welcomeMessage, setWelcomeMessage] = useState(activeBot?.welcomeMessage || '');
  const [model, setModel] = useState<ChatbotConfig['model']>(activeBot?.model || 'gpt-4o');

  // Interactive preview chat state
  const [previewMessages, setPreviewMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: activeBot?.welcomeMessage || 'Szia! Miben segíthetek?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Sync states when changing active bot
  const handleSelectBot = (bot: ChatbotConfig) => {
    setSelectedBotId(bot.id);
    setSystemPrompt(bot.systemPrompt);
    setWelcomeMessage(bot.welcomeMessage);
    setModel(bot.model);
    setPreviewMessages([{ role: 'assistant', text: bot.welcomeMessage }]);
  };

  const handleSaveConfig = () => {
    if (!activeBot) return;
    updateChatbot({
      ...activeBot,
      systemPrompt,
      welcomeMessage,
      model,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSendPreviewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    setPreviewMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: previewMessages.map(m => ({ role: m.role, content: m.text })).concat([{ role: 'user', content: userText }]),
          systemPrompt: systemPrompt,
          model: model
        })
      });
      const data = await res.json();
      setPreviewMessages(prev => [...prev, { role: 'assistant', text: data.reply || 'Köszönöm a kérdésed! Segíthetek még valamiben?' }]);
    } catch {
      setPreviewMessages(prev => [...prev, { role: 'assistant', text: 'Nem sikerült választ generálni.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const embedCode = `<script async src="https://cdn.xpander.ai/widget.js" data-bot-id="${activeBot?.id}" data-theme="dark"></script>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Chatbot Kezelő & Konfiguráció
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Finomhangold a céges asszisztenseid tudását, modelljét és teszteld őket élőben.
          </p>
        </div>

        {/* Bot selector pills */}
        <div className="flex items-center gap-2">
          {chatbots.map((b) => (
            <button
              key={b.id}
              onClick={() => handleSelectBot(b)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedBotId === b.id
                  ? 'bg-neon-blue text-nexus-950 font-bold shadow-neon-blue/30 shadow'
                  : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>A chatbot beállításai sikeresen mentve lettek!</span>
        </div>
      )}

      {/* Main Grid: Config on Left, Live Simulator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 cols: Config editor */}
        <div className="lg:col-span-7 rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neon-blue/20 text-neon-blue flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{activeBot?.name}</h2>
                <div className="text-xs text-gray-400">
                  Státusz: <span className="text-emerald-400 font-semibold">{activeBot?.status}</span> • {activeBot?.totalConversations} lefolytatott beszélgetés
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveConfig}
              className="px-4 py-2 rounded-xl bg-neon-blue text-nexus-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 transition-all shadow-neon-blue/20 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Mentés</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* AI Model selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300 flex items-center justify-between">
                <span>Alkalmazott AI Modell</span>
                <span className="text-neon-purple font-mono">OpenAI / Claude</span>
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue"
              >
                <option value="gpt-4o">OpenAI GPT-4o (Legjobb pontosság és RAG tudás)</option>
                <option value="gpt-4o-mini">OpenAI GPT-4o Mini (Ultra-gyors válaszidő & költséghatékony)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Kiváló szövegezés & kódolás)</option>
              </select>
            </div>

            {/* Welcome message */}
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">Üdvözlő Üzenet (Welcome Prompt)</label>
              <input
                type="text"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue"
              />
            </div>

            {/* System prompt */}
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">Rendszerutasítás & Céges Szerep (System Prompt)</label>
              <textarea
                rows={5}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue font-mono leading-relaxed"
              />
            </div>

            {/* Knowledge base info */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-neon-purple" />
                <div>
                  <div className="font-bold text-white">Csatolt Céges Tudásbázis</div>
                  <div className="text-[11px] text-gray-400">8 db PDF dokumentum, termékkatalógus és GYIK betanítva</div>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
                Dokumentum feltöltése
              </button>
            </div>

            {/* Embed snippet code */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-neon-cyan" />
                  Weboldal Widget Beágyazó Kód
                </span>
                <button
                  onClick={copyEmbed}
                  className="text-neon-blue hover:underline flex items-center gap-1 text-[11px]"
                >
                  {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSnippet ? 'Másolva!' : 'Kód másolása'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-nexus-950 border border-white/10 text-[11px] font-mono text-neon-cyan overflow-x-auto">
                {embedCode}
              </pre>
            </div>

          </div>
        </div>

        {/* Right 5 cols: Live Interactive Simulator */}
        <div className="lg:col-span-5 rounded-3xl glass-panel p-6 border border-white/10 flex flex-col h-[580px]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white">Élő Tesztelő Ablak</span>
            </div>
            <button
              onClick={() => setPreviewMessages([{ role: 'assistant', text: welcomeMessage }])}
              className="text-[10px] text-gray-400 hover:text-white"
            >
              Beszélgetés törlése
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {previewMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-neon-blue text-nexus-950 font-medium'
                    : 'bg-white/10 text-gray-200 border border-white/10'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-400 rounded-2xl px-4 py-2 text-xs animate-pulse">
                  Gépelés folyamatban...
                </div>
              </div>
            )}
          </div>

          {/* Input field */}
          <form onSubmit={handleSendPreviewChat} className="pt-3 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Teszteld a botot egy kérdéssel..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="px-4 py-2.5 rounded-xl bg-neon-blue text-nexus-950 font-bold text-xs flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}

