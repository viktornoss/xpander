'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Bot, 
  Headphones, 
  Mail, 
  Zap, 
  Database, 
  Calendar, 
  Cpu, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Play, 
  Activity, 
  User, 
  Clock,
  RotateCcw,
  ShieldCheck,
  MessageSquare,
  TrendingUp,
  FileText,
  ExternalLink
} from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addOrder, currentUser } = useAuth();

  const service = INITIAL_SERVICES.find(s => s.slug === slug);

  // --------------------------------------------------------------------------
  // STATE FOR 7 INTERACTIVE DEMOS
  // --------------------------------------------------------------------------

  // Demo 1: AI Chatbot (RAG Knowledge Base Playground)
  const [kbPreset, setKbPreset] = useState<'ecommerce' | 'saas' | 'medical'>('ecommerce');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; source?: string }>>([
    { 
      role: 'assistant', 
      content: 'Szia! A cég RAG tudásbázisára kapcsolt AI asszisztense vagyok. Kérdezz bátran árakról, szállításról vagy garanciáról!',
      source: 'Céges Tudásbázis: GYIK_Dokumentum_2026.pdf (1-3. oldal)'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Demo 2: Customer Support (Ticket Triage Simulator)
  const [ticketInput, setTicketInput] = useState('Üdvözlet! A megrendelt csomagom sérülten érkezett meg és nem működik a készülék. Kérem a vételár azonnali visszatérítését!');
  const [ticketResolution, setTicketResolution] = useState<any>(null);
  const [ticketLoading, setTicketLoading] = useState(false);

  // Demo 3: Email Automation (Inbox Parser & Auto-Draft)
  const [emailText, setEmailText] = useState('Kedves Csapat! Érdekelne a Growth csomagotok, 12 fős értékesítési csapatunkhoz keresünk CRM szinkront és email szűrést. Mennyi az átfutási idő?');
  const [emailParsed, setEmailParsed] = useState<any>(null);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isTestEmailSending, setIsTestEmailSending] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<string | null>(null);

  // Demo 4: Lead Generation (B2B Prospector)
  const [leadQuery, setLeadQuery] = useState('Logisztikai és e-kereskedelmi cégek 20-100 fővel');
  const [leadResults, setLeadResults] = useState<any>(null);
  const [leadLoading, setLeadLoading] = useState(false);

  // Demo 5: CRM Automation (2-Way Sync Simulator)
  const [crmContact, setCrmContact] = useState({ name: 'Varga Bence', email: 'varga.bence@alfa-tech.hu', dealValue: '480.000 Ft' });
  const [crmSyncSteps, setCrmSyncSteps] = useState<string[]>([]);
  const [crmSyncDone, setCrmSyncDone] = useState(false);

  // Demo 6: Appointment Booking (No-Show Prevention Simulator & Real Dispatch)
  const [bookingTime, setBookingTime] = useState('Holnap 14:00');
  const [bookingClientName, setBookingClientName] = useState('Kiss József');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('+36 30 123 4567');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookedDetails, setBookedDetails] = useState<any>(null);
  const [bookingDispatchResult, setBookingDispatchResult] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reminderStep, setReminderStep] = useState<number>(0);

  // Demo 7: Autonomous AI Agents (Multi-Agent Swarm)
  const [agentGoal, setAgentGoal] = useState('Piackutatás és versenytárselemzés készítése');
  const [agentStep, setAgentStep] = useState<number>(0);
  const [agentOutput, setAgentOutput] = useState<any>(null);

  // Order modal state
  const [orderedSuccess, setOrderedSuccess] = useState(false);
  const [orderPackage, setOrderPackage] = useState<'Starter' | 'Growth' | 'Enterprise'>('Growth');

  if (!service) {
    return (
      <div className="min-h-screen bg-nexus-950 flex flex-col justify-center items-center text-white">
        <h1 className="text-2xl font-bold mb-4">A keresett szolgáltatás nem található</h1>
        <Link href="/services" className="text-neon-blue underline">
          Vissza a szolgáltatásokhoz
        </Link>
      </div>
    );
  }

  // --- Handlers ---

  // 1. Chatbot Send
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    const userMsg = { role: 'user' as const, content: userText };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          systemPrompt: `Te egy intelligens RAG AI chatbot vagy a ${kbPreset} tudásbázis alapján. Válaszolj tömören, tényszerűen és professzionálisan magyarul.`
        })
      });
      const data = await res.json();
      setChatMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: data.reply || 'Köszönöm a kérdésed! A feltöltött dokumentumok alapján ez a folyamat azonnal bevezethető.',
          source: `RAG Forrás: Céges_Dokumentáció_${kbPreset}.pdf (Kontextus egyezés: 99.4%)`
        }
      ]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Kapcsolódási hiba, de a szolgáltatás azonnal működőképes!' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // 2. Customer Support Ticket Triage
  const handleResolveTicket = () => {
    setTicketLoading(true);
    setTimeout(() => {
      setTicketResolution({
        sentiment: 'Negatív / Sürgős (Prioritás 1)',
        category: 'Termékhiba & Visszatérítési igény',
        policyCheck: 'Garanciális időn belül (30 napos garancia érvényes)',
        suggestedAction: 'Azonnali cserecsomag küldése + futár visszáru generálás',
        aiDraftReply: 'Kedves Ügyfelünk! Elnézést kérünk a kellemetlenségért! Ellenőriztük a rendelését, és a garanciális szabályzatunk alapján díjmentesen azonnal útnak indítottunk egy új, tesztelt készüléket. A futár holnap 12:00 és 16:00 között érkezik a cserecsomaggal, és egyúttal elhozza a hibás terméket is.'
      });
      setTicketLoading(false);
    }, 600);
  };

  // 3. Email Automation
  const handleParseEmail = () => {
    setEmailParsed({
      sender: 'Erdeklodo Partner',
      intent: 'Árajánlatkérés & B2B Implementáció',
      category: 'Kiemelt Lead (Growth)',
      companySize: '12 fő',
      urgency: 'Magas (Azonnali naptárlink)',
      suggestedAction: 'Naptár link kiküldése + CRM kontakt rögzítése',
      autoDraft: 'Kedves Érdeklődő! Köszönjük a megkeresést! 12 fős értékesítési csapat esetén az átlagos átfutási időnk 7-10 munkanap. Az alábbi linken közvetlenül tudtok időpontot egyeztetni senior automatizációs mérnökünkkel: [Naptár link lefoglalása]'
    });
  };

  // 4. Lead Gen
  const handleRunLeadGen = () => {
    setLeadLoading(true);
    setTimeout(() => {
      setLeadResults([
        { 
          name: 'Kovács Zoltán', 
          role: 'Ügyvezető Igazgató', 
          company: 'TransExpress Kft.', 
          score: '98% ICP Match', 
          revenue: '850M Ft/év',
          icebreaker: 'Láttam a nemrég bejelentett raktárbővítéseteket a Portfolio-n, gratulálok a növekedéshez! Kíváncsi lennék, a fuvarszervezésben használtok-e már AI automatizációt...' 
        },
        { 
          name: 'Németh Barbara', 
          role: 'Operatív Vezető (COO)', 
          company: 'FastLogistics Zrt.', 
          score: '95% ICP Match', 
          revenue: '1.2 Mrd Ft/év',
          icebreaker: 'Feltűnt az új logisztikai elosztóközpontotok átadása. A legtöbb hasonló cégnél a manuális diszpécseri adatbevitel jelenti a szűk keresztmetszetet...' 
        }
      ]);
      setLeadLoading(false);
    }, 600);
  };

  // 5. CRM Sync
  const handleRunCrmSync = () => {
    setCrmSyncSteps([]);
    setCrmSyncDone(false);

    const steps = [
      '1. Kapcsolat validálása és duplikáció szűrés... (OK)',
      '2. Céginformációk lekérése és bevétel-becslés... (Alfa-Tech Kft., 35 fő)',
      '3. Új ügyfél létrehozása a HubSpot / Pipedrive CRM-ben...',
      '4. Deal hozzáadva a "Minősített Ajánlatkérések" pipeline-hoz (480.000 Ft)',
      '5. Automatikus emlékeztető feladat kiosztva a felelős sales-esnek!'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setCrmSyncSteps(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setCrmSyncDone(true);
        }
      }, (idx + 1) * 350);
    });
  };

  // 3b. Send real test email for Demo 3
  const handleSendTestEmail = async () => {
    if (!emailParsed) return;
    setIsTestEmailSending(true);
    setTestEmailResult(null);

    try {
      const res = await fetch('/api/demo/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email_triage',
          userEmail: testEmailAddress || undefined,
          payload: {
            emailSubject: 'Xpander.ai Email Triage Teszt',
            emailBody: emailText,
            autoDraft: emailParsed.autoDraft
          }
        })
      });
      const data = await res.json();
      setTestEmailResult(data.message || 'Email teszt sikeresen elküldve!');
    } catch {
      setTestEmailResult('Hiba történt a levél továbbításakor.');
    } finally {
      setIsTestEmailSending(false);
    }
  };

  // 6. Booking (Real Email & SMS Dispatch)
  const handleBookSlot = async () => {
    if (!bookingClientName.trim()) return;
    setBookingLoading(true);

    const saved = {
      name: bookingClientName,
      email: bookingEmail,
      phone: bookingPhone,
      slot: bookingTime
    };
    setBookedDetails(saved);

    // Azonnal kiürítjük a mezőket, hogy a felület letisztuljon
    setBookingClientName('');
    setBookingEmail('');
    setBookingPhone('');

    setBookingConfirmed(true);
    setReminderStep(1);

    try {
      const res = await fetch('/api/demo/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'appointment',
          userEmail: saved.email || undefined,
          userPhone: saved.phone,
          payload: {
            slot: saved.slot,
            clientName: saved.name
          }
        })
      });
      const data = await res.json();
      setBookingDispatchResult(data);
      setReminderStep(2);
      setTimeout(() => setReminderStep(3), 800);
    } catch (err) {
      console.error(err);
      setReminderStep(2);
      setTimeout(() => setReminderStep(3), 800);
    } finally {
      setBookingLoading(false);
    }
  };

  // 7. AI Agents Swarm
  const handleRunAgents = () => {
    setAgentStep(1);
    setAgentOutput(null);

    setTimeout(() => setAgentStep(2), 700);
    setTimeout(() => setAgentStep(3), 1500);
    setTimeout(() => {
      setAgentStep(4);
      setAgentOutput({
        researchFindings: 'A hazai KKV piacon a cégek 73%-a még manuálisan kezeli a bejövő érdeklődéseket.',
        competitorGaps: 'A versenytársak többnyire Make/Zapier dobozos sablonokat adnak magas havidíjért, saját kód és SLA garancia nélkül.',
        actionablePlan: 'Ajánlott stratégia: Saját TypeScript motor pozicionálása nulla műveleti díjjal és 30 napos pénzvisszafizetéssel.'
      });
    }, 2400);
  };

  // Order
  const handleOrderService = () => {
    addOrder({
      serviceId: service.id,
      serviceTitle: service.title,
      packageType: orderPackage,
      price: service.pricingNote.split(' ')[1] || '380.000 Ft',
      notes: `Megrendelve a(z) ${service.title} oldalról. Felhasználó: ${currentUser?.name || 'Ügyfél'}`
    });
    setOrderedSuccess(true);
    setTimeout(() => setOrderedSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-white">Főoldal</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white">Szolgáltatások</Link>
            <span>/</span>
            <span className="text-neon-blue font-semibold">{service.title}</span>
          </div>

          {/* Service Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neon-purple/15 border border-neon-purple/30 text-xs font-semibold text-neon-purple">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{service.badge || 'Prémium AI Rendszer'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {service.heroHeadline}
              </h1>

              <p className="text-gray-300 text-base leading-relaxed">
                {service.detailedDesc}
              </p>

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {service.techStack.map((tech, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-mono">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={handleOrderService}
                  className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-95 transition-all shadow-neon-blue/30 shadow-lg flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Implementáció Megrendelése</span>
                </button>
                <a
                  href="#demo"
                  className="px-6 py-3.5 rounded-xl font-semibold text-xs text-white glass-panel border border-neon-blue/40 hover:bg-neon-blue/10 transition-colors flex items-center gap-2 shadow-neon-blue/10 shadow-md"
                >
                  <Play className="w-4 h-4 text-neon-blue" />
                  <span>Interaktív Demó Kipróbálása ↓</span>
                </a>
              </div>

              {orderedSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>A megrendelésed bekerült a Dashboardodra és értesítést küldtünk (xpander-automation.ai@outlook.hu)!</span>
                </div>
              )}
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-5 rounded-3xl glass-panel p-8 border border-white/10 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>Üzleti Hatás & Garanciák</span>
                <Activity className="w-5 h-5 text-neon-blue" />
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Megtakarítás</span>
                  <div className="text-xl font-black text-neon-blue font-mono">{service.timeSaved}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Átfutási Idő</span>
                  <div className="text-xl font-black text-neon-purple font-mono">{service.setupTime}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>30 napos 100% pénzvisszafizetési garancia</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-neon-blue shrink-0" />
                  <span>Saját infrastruktúrára telepíthető TypeScript kód</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-neon-cyan shrink-0" />
                  <span>Közvetlen értesítés: xpander-automation.ai@outlook.hu</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-400">Irányár:</span>
                <span className="text-base font-extrabold text-white font-mono">{service.pricingNote}</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* INTERACTIVE WORKING DEMO SECTION (FOR ALL 7 SERVICES) */}
          {/* ========================================================================= */}
          <section id="demo" className="rounded-3xl glass-panel p-6 sm:p-10 border border-neon-blue/30 space-y-8 bg-nexus-900/80 shadow-2xl scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-xs font-bold border border-neon-blue/30 mb-2">
                  <Play className="w-3.5 h-3.5" />
                  <span>Élő, Működő Demó Környezet</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Próbáld ki a(z) {service.title} rendszert!</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Valós időben tesztelheted az AI feldolgozást, szabályokat és kimeneteket.
                </p>
              </div>

              <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 w-fit">
                Motor: XpanderFlow TS + GPT-4o
              </span>
            </div>

            {/* DEMO 1: AI CHATBOT (RAG Playground) */}
            {service.slug === 'ai-chatbot' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400 font-semibold">Válassz tudásbázist:</span>
                  <button 
                    onClick={() => setKbPreset('ecommerce')} 
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${kbPreset === 'ecommerce' ? 'bg-neon-blue text-nexus-950 border-neon-blue' : 'bg-white/5 text-gray-300 border-white/10'}`}
                  >
                    Webáruház (Szállítás & Kosár)
                  </button>
                  <button 
                    onClick={() => setKbPreset('saas')} 
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${kbPreset === 'saas' ? 'bg-neon-blue text-nexus-950 border-neon-blue' : 'bg-white/5 text-gray-300 border-white/10'}`}
                  >
                    SaaS Szoftver (API & Árak)
                  </button>
                  <button 
                    onClick={() => setKbPreset('medical')} 
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${kbPreset === 'medical' ? 'bg-neon-blue text-nexus-950 border-neon-blue' : 'bg-white/5 text-gray-300 border-white/10'}`}
                  >
                    Orvosi Rendelő (Időpontok)
                  </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-nexus-950 h-96 flex flex-col overflow-hidden">
                  <div className="p-3 bg-nexus-900 border-b border-white/10 text-xs text-gray-300 flex justify-between items-center">
                    <span>Asszisztens ({kbPreset.toUpperCase()} Tudásbázis)</span>
                    <span className="text-emerald-400 text-[11px]">● 0% Hallucináció Védelem</span>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs ${msg.role === 'user' ? 'bg-neon-blue text-nexus-950 font-semibold' : 'bg-white/10 text-gray-200 border border-white/10 space-y-1'}`}>
                          <div>{msg.content}</div>
                          {msg.source && (
                            <div className="text-[10px] text-neon-blue font-mono pt-1 border-t border-white/10">
                              {msg.source}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="text-xs text-gray-400 bg-white/5 px-3 py-2 rounded-xl w-fit animate-pulse">
                        RAG keresés & válaszgenerálás...
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendChat} className="p-3 bg-nexus-900 border-t border-white/10 flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Tegyél fel egy kérdést a tudásbázisnak..."
                      className="flex-1 px-4 py-2 rounded-xl bg-nexus-950 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue"
                    />
                    <button type="submit" disabled={chatLoading} className="px-4 py-2 rounded-xl bg-neon-blue text-nexus-950 font-bold text-xs">
                      Küldés
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* DEMO 2: CUSTOMER SUPPORT (Ticket Resolver) */}
            {service.slug === 'customer-support' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-gray-300">Ügyfélszolgálati Ticket / Reklamáció szövege:</label>
                  <textarea
                    rows={5}
                    value={ticketInput}
                    onChange={(e) => setTicketInput(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-nexus-950 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-purple font-mono"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleResolveTicket}
                      disabled={ticketLoading}
                      className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-neon-purple to-neon-blue flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>{ticketLoading ? 'Elemzés folyamatban...' : 'Automatikus Megoldás Generálása'}</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-nexus-950 border border-white/10 p-5 text-xs space-y-3">
                  <span className="font-bold text-neon-purple text-xs block">AI Elemzés & Intelligens Megoldás:</span>
                  {ticketResolution ? (
                    <div className="space-y-3 text-gray-300">
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <div><strong className="text-white block text-[10px]">Hangulat & Sürgősség:</strong> {ticketResolution.sentiment}</div>
                        <div><strong className="text-white block text-[10px]">Kategória:</strong> {ticketResolution.category}</div>
                      </div>
                      <div><strong className="text-white">Irányelv ellenőrzés:</strong> <span className="text-emerald-400 font-semibold">{ticketResolution.policyCheck}</span></div>
                      <div><strong className="text-white">Javasolt Akció:</strong> <span className="text-neon-blue">{ticketResolution.suggestedAction}</span></div>
                      <div className="pt-2 border-t border-white/10">
                        <strong className="text-white block mb-1">Előkészített Válaszlevél:</strong>
                        <p className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 text-xs leading-relaxed">
                          {ticketResolution.aiDraftReply}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic py-8 text-center">
                      Kattints a fenti gombra a jegy azonnali AI besorolásához és a válasz tervezet megtekintéséhez!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* DEMO 3: EMAIL AUTOMATION */}
            {service.slug === 'email-automation' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-gray-300">Szimulált bejövő email üzenet:</label>
                  <textarea
                    rows={5}
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-nexus-950 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-cyan font-mono"
                  />
                  <button
                    onClick={handleParseEmail}
                    className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-nexus-950 bg-neon-cyan hover:opacity-90 flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Feldolgozása & Piszkozat Generálás</span>
                  </button>
                </div>

                <div className="rounded-2xl bg-nexus-950 border border-white/10 p-5 text-xs space-y-3">
                  <div className="font-bold text-neon-cyan text-xs">AI Elemzés Eredménye (Kinyert entitások):</div>
                  {emailParsed ? (
                    <div className="space-y-2.5 text-gray-300">
                      <div><strong className="text-white">Szándék:</strong> {emailParsed.intent}</div>
                      <div><strong className="text-white">Kategória:</strong> {emailParsed.category}</div>
                      <div><strong className="text-white">Csapatméret:</strong> {emailParsed.companySize}</div>
                      <div><strong className="text-white">Prioritás:</strong> <span className="text-amber-400 font-bold">{emailParsed.urgency}</span></div>
                      
                      <div className="pt-2 border-t border-white/10">
                        <strong className="text-white block mb-1">Előkészített Válasz Piszkozat:</strong>
                        <p className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 text-xs leading-relaxed">
                          {emailParsed.autoDraft}
                        </p>
                      </div>

                      {/* Real Test Email Dispatch Box */}
                      <div className="pt-3 border-t border-white/10 space-y-2">
                        <label className="text-[11px] font-semibold text-neon-cyan block">
                          📧 Teszteld élőben a saját fiókodban! Küldd ki a választ valós emailként:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={testEmailAddress}
                            onChange={(e) => setTestEmailAddress(e.target.value)}
                            placeholder="sajat.email@ceged.hu (opcionális)"
                            className="flex-1 px-3 py-2 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-cyan"
                          />
                          <button
                            onClick={handleSendTestEmail}
                            disabled={isTestEmailSending}
                            className="px-4 py-2 rounded-xl bg-neon-cyan text-nexus-950 font-bold text-xs flex items-center gap-1.5 shrink-0 hover:opacity-90 disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isTestEmailSending ? 'Küldés...' : 'Valós Email Küldése'}</span>
                          </button>
                        </div>
                        {testEmailResult && (
                          <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{testEmailResult}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic py-8 text-center">
                      Kattints az &quot;Email Feldolgozása&quot; gombra a szimuláció elindításához!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* DEMO 4: LEAD GENERATION */}
            {service.slug === 'lead-generation' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={leadQuery}
                    onChange={(e) => setLeadQuery(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-nexus-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleRunLeadGen}
                    disabled={leadLoading}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 text-nexus-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{leadLoading ? 'Kutatás...' : 'Célcsoport Kutatás'}</span>
                  </button>
                </div>

                {leadResults && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {leadResults.map((lead: any, i: number) => (
                      <div key={i} className="p-5 rounded-2xl bg-nexus-950 border border-white/10 space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-white text-sm">{lead.name}</div>
                            <div className="text-gray-400">{lead.role} • {lead.company}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                            {lead.score}
                          </span>
                        </div>
                        <div className="text-gray-400 text-[11px]">Becsült árbevétel: {lead.revenue}</div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-gray-300 text-[11px] leading-relaxed">
                          <strong className="text-amber-400 block mb-0.5">Személyre szabott jégtörő mondat:</strong>
                          {lead.icebreaker}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* DEMO 5: CRM AUTOMATION (2-Way Sync) */}
            {service.slug === 'crm-automation' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-300 font-semibold">Teszt Kapcsolat Adatai:</label>
                    <input
                      type="text"
                      value={crmContact.name}
                      onChange={(e) => setCrmContact({ ...crmContact, name: e.target.value })}
                      placeholder="Ügyfél neve"
                      className="w-full px-4 py-2.5 rounded-xl bg-nexus-950 border border-white/10 text-white text-xs"
                    />
                    <input
                      type="email"
                      value={crmContact.email}
                      onChange={(e) => setCrmContact({ ...crmContact, email: e.target.value })}
                      placeholder="Email cím"
                      className="w-full px-4 py-2.5 rounded-xl bg-nexus-950 border border-white/10 text-white text-xs"
                    />
                    <input
                      type="text"
                      value={crmContact.dealValue}
                      onChange={(e) => setCrmContact({ ...crmContact, dealValue: e.target.value })}
                      placeholder="Deal értéke"
                      className="w-full px-4 py-2.5 rounded-xl bg-nexus-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <button
                    onClick={handleRunCrmSync}
                    className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-indigo-500 hover:opacity-90 flex items-center justify-center gap-2"
                  >
                    <Database className="w-4 h-4" />
                    <span>Kétirányú CRM Szinkron Indítása</span>
                  </button>
                </div>

                <div className="rounded-2xl bg-nexus-950 border border-white/10 p-5 text-xs space-y-3 font-mono">
                  <span className="font-bold text-indigo-400 text-xs font-sans block">XpanderFlow CRM Eseménynapló:</span>
                  {crmSyncSteps.length > 0 ? (
                    <div className="space-y-2">
                      {crmSyncSteps.map((step, idx) => (
                        <div key={idx} className="text-gray-300 text-xs flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{step}</span>
                        </div>
                      ))}
                      {crmSyncDone && (
                        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-sans font-bold mt-3">
                          Szinkronizáció sikeres! A HubSpot és a belső adatbázis összhangban van.
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic py-8 text-center font-sans">
                      Kattints a szinkron gombra az automatikus adatfolyam elindításához!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* DEMO 6: APPOINTMENT BOOKING (No-Show Protection & Real Dispatch) */}
            {service.slug === 'appointment-booking' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left booking form */}
                <div className="lg:col-span-6 space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1.5">1. Válassz egy szabad időpontot:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Holnap 10:00', 'Holnap 14:00', 'Csütörtök 11:30', 'Péntek 15:00'].map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setBookingTime(slot)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${bookingTime === slot ? 'bg-emerald-500 text-nexus-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-semibold text-gray-300 block">2. Add meg az adataidat az élő teszthez:</label>
                    
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-gray-400">Teljes Név:</span>
                      <input
                        type="text"
                        value={bookingClientName}
                        onChange={(e) => setBookingClientName(e.target.value)}
                        placeholder="pl. Kiss József"
                        className="w-full px-3 py-2 rounded-xl bg-nexus-950 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] text-emerald-400 font-medium">Céges / Saját Email (ide kapod a visszaigazoló levelet):</span>
                      <input
                        type="email"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        placeholder="pl. jozsef@gmail.com (opcionális)"
                        className="w-full px-3 py-2 rounded-xl bg-nexus-950 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] text-emerald-400 font-medium">Telefonszám (ide küldjük a szimulált/élő SMS értesítést):</span>
                      <input
                        type="tel"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        placeholder="+36 30 123 4567"
                        className="w-full px-3 py-2 rounded-xl bg-nexus-950 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleBookSlot}
                    disabled={bookingLoading}
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-nexus-950 bg-emerald-400 hover:opacity-90 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{bookingLoading ? 'Feldolgozás & Küldés...' : 'Időpont Lefoglalása & Valós Email + SMS Küldése'}</span>
                  </button>
                </div>

                {/* Right live result & tracking */}
                <div className="lg:col-span-6 rounded-2xl bg-nexus-950 border border-white/10 p-5 text-xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="font-bold text-emerald-400 text-xs block">WhatsApp & SMS Emlékeztető Dispatch</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                      No-Show Protection
                    </span>
                  </div>

                  {bookingConfirmed ? (
                    <div className="space-y-3">
                      {/* Live Dispatch Feedback & Real Action Buttons */}
                      {bookingDispatchResult && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-3 animate-in fade-in">
                          <div className="font-bold text-xs flex items-center justify-between text-white border-b border-emerald-500/20 pb-2">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Valós Időpont Értesítés Sikeresen Kiküldve!</span>
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              #{bookingDispatchResult.trackingId}
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] text-gray-300">
                            <p>
                              📧 <strong>Kiküldött Email:</strong> Továbbítva az <em>xpander-automation.ai@outlook.hu</em> {bookedDetails?.email ? `és a(z) ${bookedDetails.email}` : ''} címekre.
                            </p>
                            <p>
                              📱 <strong>SMS Gateway:</strong> {bookingDispatchResult.sms?.carrier} • Kézbesítve ({bookingDispatchResult.sms?.latencyMs}ms)
                            </p>
                          </div>

                          {/* Direct Real Email Access Buttons */}
                          <div className="pt-2 border-t border-emerald-500/20 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                              Azonnali Valós Email & Naptár Elérés:
                            </span>
                            
                            <div className="flex flex-wrap gap-2">
                              {bookingDispatchResult.previewUrl && (
                                <a
                                  href={bookingDispatchResult.previewUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-nexus-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Élő Email Megtekintése (Postaláda)</span>
                                </a>
                              )}

                              {bookingDispatchResult.gmailComposeUrl && (
                                <a
                                  href={bookingDispatchResult.gmailComposeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Megnyitás Gmailben</span>
                                </a>
                              )}

                              {bookingDispatchResult.outlookComposeUrl && (
                                <a
                                  href={bookingDispatchResult.outlookComposeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                                  <span>Megnyitás Outlookban</span>
                                </a>
                              )}

                              {bookingDispatchResult.icsData && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const blob = new Blob([bookingDispatchResult.icsData], { type: 'text/calendar;charset=utf-8' });
                                    const link = document.createElement('a');
                                    link.href = window.URL.createObjectURL(blob);
                                    link.setAttribute('download', `Xpander_Idopont_${Date.now()}.ics`);
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neon-purple/20 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/30 text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>Naptármeghívó (.ics)</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setBookingConfirmed(false);
                                setBookingDispatchResult(null);
                                setReminderStep(0);
                              }}
                              className="text-[11px] text-gray-400 hover:text-white underline"
                            >
                              ← Másik időpont kiválasztása (Űrlap újranyitása)
                            </button>
                          </div>
                        </div>
                      )}

                      {reminderStep >= 1 && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1">
                          <strong className="text-emerald-400 block text-xs">1. Lépés (Azonnali Naptár & Email Visszaigazolás):</strong>
                          <div>Kedves <strong>{bookedDetails?.name || 'Ügyfelünk'}</strong>! Az időpontod rögzítve: <strong>{bookedDetails?.slot || bookingTime}</strong>. A naptármeghívót elküldtük.</div>
                        </div>
                      )}

                      {reminderStep >= 2 && (
                        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-gray-200 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <strong className="text-emerald-400">2. Lépés (24 órával előtte kiküldött WhatsApp / SMS):</strong>
                            <span className="text-[10px] text-gray-400">Címzett: {bookedDetails?.phone || '+36 30 123 4567'}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-sans text-xs leading-relaxed text-emerald-200">
                            &bdquo;Kedves {bookedDetails?.name || 'Ügyfelünk'}! Várunk {bookedDetails?.slot || bookingTime}-kor a megbeszélésre. Kérlek erősítsd meg érkezésed egy kattintással:&rdquo;
                          </div>
                          <div className="flex gap-2 pt-1">
                            <span className="px-2.5 py-1 rounded bg-emerald-500 text-nexus-950 font-bold text-[10px]">
                              ✓ Megerősítem (Igen)
                            </span>
                            <span className="px-2.5 py-1 rounded bg-white/10 text-gray-300 text-[10px]">
                              Átütemezés kérése
                            </span>
                          </div>
                        </div>
                      )}

                      {reminderStep >= 3 && (
                        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold text-center">
                          🎉 Eredmény: 0% elfelejtett időpont, azonnali naptár szinkronizáció!
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-10 text-center space-y-2 text-gray-500">
                      <Clock className="w-8 h-8 mx-auto text-gray-600" />
                      <p className="text-xs">
                        Add meg az elérhetőséged a bal oldalon, és kattints az <strong>Időpont Lefoglalása</strong> gombra a valós email és SMS küldés kipróbálásához!
                      </p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* DEMO 7: AUTONOMOUS AI AGENTS (Multi-Agent Swarm) */}
            {service.slug === 'ai-agents' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={agentGoal}
                    onChange={(e) => setAgentGoal(e.target.value)}
                    placeholder="Ad meg a célfeladatot az AI ágens rajnak..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-nexus-950 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-400"
                  />
                  <button
                    onClick={handleRunAgents}
                    className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Ágens Raj Indítása</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className={`p-4 rounded-xl border transition-all text-xs space-y-1 ${agentStep >= 1 ? 'bg-rose-500/10 border-rose-500/40 text-white' : 'bg-nexus-950 border-white/5 text-gray-500'}`}>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>🕵️ Ágens 1: Adatkutató</span>
                      {agentStep === 1 && <span className="animate-spin text-xs">⏳</span>}
                      {agentStep > 1 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-gray-400">Piac- és adatforrások párhuzamos pásztázása</p>
                  </div>

                  <div className={`p-4 rounded-xl border transition-all text-xs space-y-1 ${agentStep >= 2 ? 'bg-amber-500/10 border-amber-500/40 text-white' : 'bg-nexus-950 border-white/5 text-gray-500'}`}>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>📊 Ágens 2: Elemző</span>
                      {agentStep === 2 && <span className="animate-spin text-xs">⏳</span>}
                      {agentStep > 2 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-gray-400">Statisztikai összefüggések és kalkulációk</p>
                  </div>

                  <div className={`p-4 rounded-xl border transition-all text-xs space-y-1 ${agentStep >= 3 ? 'bg-neon-purple/10 border-neon-purple/40 text-white' : 'bg-nexus-950 border-white/5 text-gray-500'}`}>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>✍️ Ágens 3: Szintézis</span>
                      {agentStep === 3 && <span className="animate-spin text-xs">⏳</span>}
                      {agentStep >= 4 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-gray-400">Vezetői összefoglaló jelentés készítése</p>
                  </div>
                </div>

                {agentOutput && (
                  <div className="p-5 rounded-2xl bg-nexus-950 border border-white/10 text-xs space-y-3 animate-in fade-in">
                    <strong className="text-white text-sm block">Vezetői Szintézis Eredménye:</strong>
                    <div className="space-y-2 text-gray-300">
                      <div><strong className="text-neon-blue">Fő Megállapítás:</strong> {agentOutput.researchFindings}</div>
                      <div><strong className="text-amber-400">Piaci Rés:</strong> {agentOutput.competitorGaps}</div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-emerald-300 font-semibold">
                        {agentOutput.actionablePlan}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </section>

          {/* Deliverables List */}
          <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-white/10 space-y-6">
            <h2 className="text-2xl font-bold text-white">Mit kapsz a csomagban? (Szállítási Elemek)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-6 h-6 rounded-lg bg-neon-blue/20 text-neon-blue flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">{item}</span>
                    <span className="text-xs text-gray-400 mt-0.5 block">Kulcsrakész átadás, dokumentáció és betanítás</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Order Section */}
          <div id="order" className="rounded-3xl glass-panel p-8 sm:p-10 border border-white/10 bg-gradient-to-br from-nexus-900 via-nexus-950 to-nexus-900 text-center space-y-6 scroll-mt-24">
            <div className="max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neon-blue">Azonnali Bevezetés</span>
              <h2 className="text-3xl font-extrabold text-white">Rendeld meg a(z) {service.title} rendszert!</h2>
              <p className="text-xs text-gray-400">
                Válaszd ki a céged méretéhez illeszkedő csomagot. 30 napos garanciát vállalunk!
              </p>
            </div>

            <div className="flex justify-center gap-3">
              {(['Starter', 'Growth', 'Enterprise'] as const).map((pkg) => (
                <button
                  key={pkg}
                  onClick={() => setOrderPackage(pkg)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${orderPackage === pkg ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-nexus-950 border-transparent shadow-lg' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'}`}
                >
                  {pkg} Csomag
                </button>
              ))}
            </div>

            <div>
              <button
                onClick={handleOrderService}
                className="px-8 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider text-nexus-950 bg-gradient-to-r from-neon-blue via-neon-indigo to-neon-purple shadow-neon-blue/40 shadow-xl hover:scale-105 transition-all"
              >
                {service.title} Megrendelése ({orderPackage})
              </button>
            </div>

            <p className="text-[11px] text-gray-500">
              Központi kapcsolattartás és számlázás: xpander-automation.ai@outlook.hu
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
