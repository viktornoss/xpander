'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Calendar, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Bot,
  ExternalLink,
  Download,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Video
} from 'lucide-react';
import Link from 'next/link';
import Robot3DAvatar from '@/components/voice/Robot3DAvatar';

export type TourLanguage = 'hu' | 'en';

export interface TourChapter {
  id: string;
  stepNumber: number;
  badge: { hu: string; en: string };
  title: { hu: string; en: string };
  subtitle: { hu: string; en: string };
  tagline: { hu: string; en: string };
  narrationText: { hu: string; en: string };
  features: { hu: string[]; en: string[] };
  accentIcon: any;
  contentType: 'video' | 'voice' | 'services' | 'workflow' | 'audit' | 'appointment' | 'contact';
}

export const TOUR_CHAPTERS: TourChapter[] = [
  {
    id: 'intro',
    stepNumber: 1,
    contentType: 'video',
    badge: {
      hu: 'VÁLLALATI PLATFORM & VIDEÓ',
      en: 'ENTERPRISE PLATFORM & VIDEO'
    },
    title: {
      hu: 'Xpander.ai — AUTOMATE. INNOVATE. SCALE.',
      en: 'Xpander.ai — AUTOMATE. INNOVATE. SCALE.'
    },
    subtitle: {
      hu: 'Autonóm Vállalati AI Infrastruktúra és Folyamatautomatizáció',
      en: 'Autonomous Enterprise AI Infrastructure & Process Automation'
    },
    tagline: {
      hu: 'Zéró Make.com, zéró n8n — 100% saját natív TypeScript motor.',
      en: 'Zero Make.com, zero n8n — 100% proprietary native TypeScript engine.'
    },
    narrationText: {
      hu: 'Üdvözöllek az Xpander.ai interaktív bemutatóján! Cégünk olyan autonóm mesterséges intelligencia infrastruktúrát épít vállalkozásoknak, amely leveszi a monoton adminisztráció, az adatrögzítés és a lassú ügyfélszolgálat terheit a csapatod válláról. Nálunk nincsenek külső felhős havidíjak: száz százalékban saját fejlesztésű, nagyvállalati motorral dolgozunk.',
      en: 'Welcome to Xpander.ai’s interactive tour. We build autonomous enterprise AI infrastructure that completely eliminates manual data entry, repetitive administration, and slow customer response times. With zero third-party platform fees, everything is powered by our native, high-performance engine.'
    },
    accentIcon: Sparkles,
    features: {
      hu: [
        'Havi 120-250 munkaóra megtakarítás a csapatodnak',
        '0 Ft Make.com vagy n8n felhő előfizetési díj',
        'Banki szintű adatbiztonság és GDPR megfelelés'
      ],
      en: [
        '120 to 250 hours saved per month',
        '$0 Make.com or n8n cloud subscription fees',
        'Bank-grade enterprise security and GDPR compliance'
      ]
    }
  },
  {
    id: 'voice-ai',
    stepNumber: 2,
    contentType: 'voice',
    badge: {
      hu: '3D VOICE AI MUNKATÁRS',
      en: '3D VOICE AI COLLEAGUE'
    },
    title: {
      hu: '3D Voice AI & Élő Beszédfelismerő Asszisztens',
      en: '3D Voice AI & Real-Time Speech Assistant'
    },
    subtitle: {
      hu: 'Valós Időben Beszélő és Tárgyaló Autonóm AI Munkatárs',
      en: 'Autonomous Colleague Speaking and Negotiating in Real Time'
    },
    tagline: {
      hu: 'Természetes beszédhang, azonnali reakcióidő, nulla szaggatás.',
      en: 'Natural human cadence, instant reaction time, zero latency.'
    },
    narrationText: {
      hu: 'Ez itt a 3D Voice AI ügynökünk. Ő nem egy egyszerű gépelő robot, hanem egy valós időben beszélő és tárgyaló autonóm munkatárs. Azonnal megérti a beszédet, és ha félbeszakítod vagy közbeszólsz, udvariasan megáll, végighallgat, majd intelligens választ ad a céged saját tudásbázisa alapján.',
      en: 'Meet our 3D Voice AI agent. This is not a simple chatbot, but a fully autonomous colleague that speaks, listens, and negotiates in real time. It naturally understands voice input, respects interruptions, and instantly provides accurate answers trained on your company’s own knowledge base.'
    },
    accentIcon: Bot,
    features: {
      hu: [
        'Valós idejű 3D beszédartikuláció és szájmozgás',
        'Azonnali közbeszólás-kezelés és aktív hallgatás',
        'Automatikus leadek és jegyzetek rögzítése a CRM-ben'
      ],
      en: [
        'Real-time 3D speech articulation and lip synchronization',
        'Instant barge-in handling and active listening',
        'Automated lead capture and CRM note generation'
      ]
    }
  },
  {
    id: 'services',
    stepNumber: 3,
    contentType: 'services',
    badge: {
      hu: '7 VÁLLALATI MEGOLDÁS',
      en: '7 ENTERPRISE SYSTEMS'
    },
    title: {
      hu: '7 Alapvető Üzleti Rendszer Automatizálása',
      en: 'Automating 7 Core Business Systems'
    },
    subtitle: {
      hu: 'Email Triage, Kétirányú CRM és Számlázási Szinkron',
      en: 'Email Triage, Two-Way CRM & Invoicing Synchronization'
    },
    tagline: {
      hu: 'HubSpot, MiniCRM, Salesforce, Számlázz.hu és Billingo integráció.',
      en: 'Seamless integration with HubSpot, MiniCRM, Salesforce, and ERPs.'
    },
    narrationText: {
      hu: 'Rendszerünk hét alapvető üzleti folyamatot kapcsol össze: automatizálja a beérkező ajánlatkérések feldolgozását, kétirányú valós idejű szinkront tart a CRM rendszereddel, számlákat állít ki, és a nap huszonnégy órájában kiszolgálja az ügyfeleidet a saját belső dokumentumaidból tanulva.',
      en: 'Our platform seamlessly automates seven core business pillars: incoming lead triage and qualification, bidirectional real-time CRM synchronization with HubSpot and Salesforce, autonomous invoicing, and 24/7 customer support trained directly on your internal documents.'
    },
    accentIcon: Layers,
    features: {
      hu: [
        'Bejövő emailek kategorizálása és választervezet készítés',
        'Kétirányú szinkronizáció MiniCRM, HubSpot és Salesforce felé',
        'Automatikus számlakiállítás jóváhagyási lépéssel'
      ],
      en: [
        'Smart email categorization and draft generation',
        'Two-way sync with HubSpot, MiniCRM, and Salesforce',
        'Autonomous invoice generation with approval safeguard'
      ]
    }
  },
  {
    id: 'workflow-editor',
    stepNumber: 4,
    contentType: 'workflow',
    badge: {
      hu: 'XPANDERFLOW ENGINE',
      en: 'XPANDERFLOW ENGINE'
    },
    title: {
      hu: 'XpanderFlow Vizuális Munkafolyamat Szerkesztő',
      en: 'XpanderFlow Visual Workflow Orchestrator'
    },
    subtitle: {
      hu: 'Valós Idejű Villogó Kábelek és Élő Adatáramlás Tesztelés',
      en: 'Real-Time Illuminated Wires and Live Data Packet Testing'
    },
    tagline: {
      hu: 'Kódolás nélküli tervezés, valós idejű telemetria és azonnali hibakezelés.',
      en: 'No-code visual orchestration, live telemetry, and instant failover.'
    },
    narrationText: {
      hu: 'Itt láthatod az XpanderFlow vizuális munkafolyamat-szerkesztőnket. Kódolás nélkül köthetsz össze webhookokat, GPT-4o döntési elágazásokat és adatbázis műveleteket. Teszteléskor a képernyőn a kábelek valós időben felvillannak, pontosan mutatva az adatok áramlását a rendszereid között.',
      en: 'This is our XpanderFlow visual workflow editor. You can design sophisticated pipelines without coding, connecting webhooks, GPT-4o decision nodes, and database actions. During testing, cables illuminate in real time to show live data packets pulsing through your business systems.'
    },
    accentIcon: Zap,
    features: {
      hu: [
        'Valós idejű vezeték-animációk és energia-csomagok',
        'Kétirányú hibakezelő biztonsági ágak (Failover)',
        'Azonnali végrehajtási telemetria 22 milliszekundum alatt'
      ],
      en: [
        'Live illuminated wire animations with energy packets',
        'Dual-branch safety error handling and automatic failover',
        'Sub-22ms lightning-fast execution telemetry'
      ]
    }
  },
  {
    id: 'audit',
    stepNumber: 5,
    contentType: 'audit',
    badge: {
      hu: 'INGYENES AUDIT & ROI',
      en: 'FREE PROCESS AUDIT & ROI'
    },
    title: {
      hu: 'Ingyenes AI Folyamat-Audit & ROI Kalkulátor',
      en: 'Free AI Process Audit & ROI Calculator'
    },
    subtitle: {
      hu: '2 Perc Alatt Mérhető Megtérülés és Diagnosztikai Jelentés',
      en: 'Measurable ROI & Executive Diagnostic Report in 2 Minutes'
    },
    tagline: {
      hu: 'Kiszámoljuk a céged pontos óra- és költségmegtakarítását.',
      en: 'We calculate your exact monthly time and cost savings.'
    },
    narrationText: {
      hu: 'Az ingyenes AI Folyamat-Auditunk mindössze négy egyszerű kérdésből áll. Két perc alatt pontosan kiszámoljuk, hogy a te céged havonta hány munkaórát és forintot takaríthat meg, és egy kattintással elküldjük a komplett vezetői megvalósítási tervet az emailedre.',
      en: 'Our free AI Process Audit takes only two minutes and four simple questions. It precisely calculates how many working hours and expenses your company can save every month, delivering a complete implementation roadmap directly to your inbox.'
    },
    accentIcon: BarChart3,
    features: {
      hu: [
        '4 lépéses interaktív audit varázsló',
        'Valós idejű ROI és munkaóra-megtakarítás számítás',
        'Azonnali email tervezet kiküldés és vezetői összefoglaló'
      ],
      en: [
        '4-step frictionless interactive audit wizard',
        'Real-time ROI and operational hour savings model',
        'Instant executive blueprint delivered to your email'
      ]
    }
  },
  {
    id: 'appointment',
    stepNumber: 6,
    contentType: 'appointment',
    badge: {
      hu: 'NAPTÁR & SMS',
      en: 'CALENDAR & SMS'
    },
    title: {
      hu: 'Intelligens Időpontfoglaló & Naptárkezelés',
      en: 'Smart Appointment Booking & Calendar Automation'
    },
    subtitle: {
      hu: 'Valós Email és SMS Értesítések Küldése Automatikusan',
      en: 'Real Email and SMS Dispatch with Zero Calendar Friction'
    },
    tagline: {
      hu: 'Nincs több elfelejtett megbeszélés és üresjárat a naptárban.',
      en: 'No more forgotten meetings or scheduling back-and-forth.'
    },
    narrationText: {
      hu: 'Az ügyfeleid közvetlenül tudnak időpontot foglalni a naptáradba. Az autonóm ügynök azonnal kiküldi a hivatalos visszaigazoló emailt a naptárbejegyzéssel, és SMS emlékeztetőt küld a megbeszélés előtt. Így egyetlen értékes tárgyalás sem marad el.',
      en: 'Clients can book meetings directly into your calendar. The autonomous agent immediately dispatches confirmation emails with calendar invites and sends SMS reminders before the meeting, eliminating no-shows and scheduling friction.'
    },
    accentIcon: Calendar,
    features: {
      hu: [
        'Valós idejű idősáv ellenőrzés és ütközésmentes foglalás',
        'Azonnali visszaigazoló email küldés mellékelt naptárfájllal',
        'Automatikus SMS emlékeztető 24 órával a tárgyalás előtt'
      ],
      en: [
        'Real-time slot conflict resolution and live booking',
        'Instant confirmation email with calendar attachment',
        'Automated SMS reminders sent 24 hours prior'
      ]
    }
  },
  {
    id: 'guarantee',
    stepNumber: 7,
    contentType: 'contact',
    badge: {
      hu: 'KAPCSOLAT & GARANCIA',
      en: 'CONTACT & GUARANTEE'
    },
    title: {
      hu: '99.98% SLA & Lépj Kapcsolatba Velünk!',
      en: '99.98% SLA & Get In Touch With Us!'
    },
    subtitle: {
      hu: 'Készen Állsz a Skálázásra? Kezdjük El Most!',
      en: 'Ready to Scale? Let’s Elevate Your Business Today!'
    },
    tagline: {
      hu: '30 napos pénzvisszafizetési garancia és azonnali kapcsolatfelvétel.',
      en: '30-day money-back guarantee and immediate contact.'
    },
    narrationText: {
      hu: 'Minden bevezetésünkre kilencvenkilenc egész kilencvennyolc százalékos rendelkezésre állást és harminc napos kérdés nélküli pénzvisszafizetési garanciát vállalunk. Készen állsz a skálázásra? Töltsd ki a lenti űrlapot, és munkatársunk azonnal felveszi veled a kapcsolatot!',
      en: 'Every deployment is backed by our 99.98% uptime SLA and a 30-day money-back guarantee. Ready to scale your business? Fill out the form below, and our team will get in touch with you immediately!'
    },
    accentIcon: ShieldCheck,
    features: {
      hu: [
        '99.98% SLA folyamatos monitorozással',
        '30 napos 100% pénzvisszafizetési garancia',
        'Azonnali kapcsolatfelvételi és audit lehetőség'
      ],
      en: [
        '99.98% SLA with 24/7 autonomous monitoring',
        '30-day 100% no-questions-asked money-back guarantee',
        'Instant contact and executive consultation opportunity'
      ]
    }
  }
];

interface WebsiteTourPresentationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WebsiteTourPresentation({ isOpen, onClose }: WebsiteTourPresentationProps) {
  const [lang, setLang] = useState<TourLanguage>('hu');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [chapterDurationSec, setChapterDurationSec] = useState(16);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  // Fast Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextChapterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const langRef = useRef<TourLanguage>('hu');

  isPlayingRef.current = isPlaying;
  langRef.current = lang;

  const currentChapter = TOUR_CHAPTERS[currentChapterIndex];

  // Stop currently playing audio
  const stopAudio = useCallback(() => {
    if (nextChapterTimeoutRef.current) {
      clearTimeout(nextChapterTimeoutRef.current);
      nextChapterTimeoutRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Play Studio MP3 voiceover
  const playChapterAudio = useCallback((stepNum: number, currentLanguage: TourLanguage) => {
    stopAudio();

    if (isMuted) {
      setIsSpeaking(false);
      return;
    }

    const audioUrl = `/audio/tour/${currentLanguage}-${stepNum}.mp3`;
    const audio = new Audio(audioUrl);
    audio.muted = isMuted;
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setChapterDurationSec(Math.ceil(audio.duration));
      }
    };

    audio.ontimeupdate = () => {
      setCurrentTimeSec(Math.floor(audio.currentTime));
    };

    audio.onplay = () => {
      setIsSpeaking(true);
      setIsPlaying(true);
    };

    audio.onpause = () => {
      setIsSpeaking(false);
    };

    audio.onended = () => {
      setIsSpeaking(false);
      // Wait a natural 1.2s human breath pause before advancing
      if (isPlayingRef.current) {
        nextChapterTimeoutRef.current = setTimeout(() => {
          if (isPlayingRef.current) {
            setCurrentChapterIndex(prev => {
              if (prev + 1 < TOUR_CHAPTERS.length) {
                const nextIdx = prev + 1;
                setCurrentTimeSec(0);
                playChapterAudio(TOUR_CHAPTERS[nextIdx].stepNumber, langRef.current);
                return nextIdx;
              } else {
                setIsPlaying(false);
                return prev;
              }
            });
          }
        }, 1200);
      }
    };

    audio.play().catch((err) => {
      console.warn('Audio auto-play blocked or failed, user interaction needed:', err);
      setIsSpeaking(false);
    });
  }, [isMuted, stopAudio]);

  // Jump to specific chapter
  const goToChapter = useCallback((index: number) => {
    stopAudio();
    setCurrentChapterIndex(index);
    setCurrentTimeSec(0);

    if (isPlayingRef.current) {
      playChapterAudio(TOUR_CHAPTERS[index].stepNumber, langRef.current);
    }
  }, [stopAudio, playChapterAudio]);

  // Switch Language
  const switchLanguage = (newLang: TourLanguage) => {
    if (newLang === lang) return;
    setLang(newLang);
    langRef.current = newLang;

    stopAudio();
    if (isPlaying) {
      playChapterAudio(currentChapter.stepNumber, newLang);
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (nextChapterTimeoutRef.current) {
        clearTimeout(nextChapterTimeoutRef.current);
      }
      setIsSpeaking(false);
    } else {
      setIsPlaying(true);
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
        setIsSpeaking(true);
      } else {
        playChapterAudio(currentChapter.stepNumber, lang);
      }
    }
  };

  // Initial trigger when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setCurrentChapterIndex(0);
      setCurrentTimeSec(0);
      const timeout = setTimeout(() => {
        playChapterAudio(TOUR_CHAPTERS[0].stepNumber, langRef.current);
      }, 400);
      return () => clearTimeout(timeout);
    } else {
      setIsPlaying(false);
      stopAudio();
    }
  }, [isOpen, playChapterAudio, stopAudio]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Toggle Mute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => {});
        setIsSpeaking(true);
      } else {
        playChapterAudio(currentChapter.stepNumber, lang);
      }
    } else {
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.muted = true;
      }
      setIsSpeaking(false);
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Handle Quick Contact Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || isSendingContact) return;

    setIsSendingContact(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          company: contactCompany,
          service: 'Xpander.ai Rendszerbemutató Érdeklődés',
          message: contactMsg || 'A videós bemutató után azonnali felkeresést kérek.'
        })
      });

      if (res.ok) {
        setContactSubmitted(true);
      }
    } catch (err) {
      console.error('Contact submission error:', err);
    } finally {
      setIsSendingContact(false);
    }
  };

  if (!isOpen) return null;

  const IconComponent = currentChapter.accentIcon;
  const progressPercent = Math.min(100, (currentTimeSec / Math.max(1, chapterDurationSec)) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200">
      
      {/* Presentation Theater Box */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-6xl rounded-3xl bg-[#09090b] border border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.18)] overflow-hidden flex flex-col max-h-[96vh]"
      >
        
        {/* Top Control Bar with Language Switcher */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-xs sm:text-sm tracking-wide">
                Xpander.ai • {lang === 'hu' ? 'Rendszerbemutató (3D Robot & Stúdió Hang)' : 'System Tour (3D Robot & Studio Voice)'}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-neutral-300 border border-white/15">
                {lang === 'hu' ? `Fejezet ${currentChapter.stepNumber} / ${TOUR_CHAPTERS.length}` : `Chapter ${currentChapter.stepNumber} of ${TOUR_CHAPTERS.length}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Language Switcher: HU / EN */}
            <div className="flex items-center p-0.5 rounded-full bg-white/10 border border-white/20">
              <button
                onClick={() => switchLanguage('hu')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  lang === 'hu' ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                🇭🇺 HU
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>

            <button
              onClick={toggleMute}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/15 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
              title={isMuted ? 'Hang bekapcsolása' : 'Némítás'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span className="hidden md:inline">
                {isMuted ? (lang === 'hu' ? 'Némítva' : 'Muted') : (lang === 'hu' ? 'Stúdió Hang' : 'Studio Voice')}
              </span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer"
              title="Teljes képernyő"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                stopAudio();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer ml-1"
              title="Bezárás"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Stage: 3D Talking Robot + Live Visual Presentation & Video */}
        <div className="relative flex-1 bg-black flex flex-col lg:flex-row overflow-hidden min-h-[490px] sm:min-h-[550px]">
          
          {/* Column 1 (Left): 3D Articulating Talking Robot Host */}
          <div className="w-full lg:w-[380px] bg-gradient-to-b from-[#0c0c10] to-black border-b lg:border-b-0 lg:border-r border-white/10 p-6 flex flex-col justify-between items-center shrink-0 relative overflow-hidden">
            
            {/* Ambient Spotlight behind robot */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/[0.08] rounded-full blur-3xl pointer-events-none" />

            {/* Robot Header Tag */}
            <div className="w-full flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-neutral-300 font-bold uppercase flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
                <span>{isSpeaking ? (lang === 'hu' ? '3D Robot Beszél' : '3D Robot Speaking') : (lang === 'hu' ? '3D Robot Készenlétben' : '3D Robot Standby')}</span>
              </span>

              <span className="text-[10px] font-mono text-neutral-400">
                WebGL 60 FPS
              </span>
            </div>

            {/* PROMINENT 3D TALKING ROBOT AVATAR (Interactive Three.js with moving mouth and jaw articulation) */}
            <div className="relative my-auto z-10 flex flex-col items-center">
              <div className="relative p-2 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/15 shadow-[0_0_50px_rgba(255,255,255,0.15)] group">
                <Robot3DAvatar
                  size="md"
                  isSpeaking={isSpeaking}
                  isListening={false}
                  isThinking={false}
                  isMuted={isMuted}
                  showTelemetry={false}
                  className="cursor-pointer"
                />
              </div>

              {/* Dynamic Soundwave Equalizer Banner */}
              <div className="mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/80 border border-white/15 backdrop-blur-md">
                <span className="text-[11px] font-bold text-white font-mono">Xpander AI Host</span>
                <span className="text-neutral-500">•</span>
                <div className="flex items-center gap-0.5">
                  <span className={`w-1 bg-white rounded-full transition-all duration-150 ${isSpeaking ? 'h-3 animate-pulse' : 'h-1'}`} />
                  <span className={`w-1 bg-white rounded-full transition-all duration-150 ${isSpeaking ? 'h-5 animate-pulse delay-75' : 'h-1'}`} />
                  <span className={`w-1 bg-white rounded-full transition-all duration-150 ${isSpeaking ? 'h-4 animate-pulse delay-150' : 'h-1'}`} />
                  <span className={`w-1 bg-white rounded-full transition-all duration-150 ${isSpeaking ? 'h-6 animate-pulse delay-100' : 'h-1'}`} />
                  <span className={`w-1 bg-white rounded-full transition-all duration-150 ${isSpeaking ? 'h-2 animate-pulse' : 'h-1'}`} />
                </div>
              </div>
            </div>

            {/* Live Subtitle Transcript Banner */}
            <div className="w-full z-10 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-left backdrop-blur-md">
              <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>{lang === 'hu' ? 'Élő Szinkronizált Szöveg' : 'Live Synchronized Subtitles'}</span>
                <span className="text-white font-bold">{formatTime(currentTimeSec)}</span>
              </div>
              <p className="text-xs text-white leading-relaxed line-clamp-3 font-medium">
                &ldquo;{currentChapter.narrationText[lang]}&rdquo;
              </p>
            </div>

          </div>

          {/* Column 2 (Center & Right): Dynamic Video & Content Stage */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto relative">
            
            {/* Top Chapter Pill & Stepper */}
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono font-bold shadow-lg backdrop-blur-md">
                <IconComponent className="w-4 h-4 text-white" />
                <span>{currentChapter.badge[lang]}</span>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex items-center gap-1.5">
                {TOUR_CHAPTERS.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => goToChapter(idx)}
                    className={`w-6 h-6 rounded-full text-[10px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                      idx === currentChapterIndex 
                        ? 'bg-white text-black shadow-md scale-110' 
                        : idx < currentChapterIndex 
                          ? 'bg-white/20 text-white hover:bg-white/30' 
                          : 'bg-white/5 text-neutral-500 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* DYNAMIC STAGE CONTENT BASED ON CHAPTER */}
            <div className="my-auto py-4 space-y-5">
              
              {/* Titles */}
              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {currentChapter.title[lang]}
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 font-medium mt-1">
                  {currentChapter.subtitle[lang]}
                </p>
              </div>

              {/* Content Type 1: Video Embed for Chapter 1 */}
              {currentChapter.contentType === 'video' && (
                <div className="rounded-2xl border border-white/20 overflow-hidden bg-black shadow-2xl relative group aspect-video max-h-64 sm:max-h-72 w-full flex items-center justify-center">
                  <img
                    src="/xpander-promo-video.gif"
                    alt="Xpander.ai Official Video"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-neutral-300">
                    <span className="font-mono font-bold flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                      <span>Xpander.ai Hivatalos Promóciós Videó</span>
                    </span>
                    <a
                      href="/xpander-promo-video.gif"
                      download="xpander-video.gif"
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] font-bold border border-white/20 transition-all"
                    >
                      HD Letöltés
                    </a>
                  </div>
                </div>
              )}

              {/* Content Type 2: 3D Voice AI Visual Telemetry */}
              {currentChapter.contentType === 'voice' && (
                <div className="rounded-2xl p-5 bg-gradient-to-br from-neutral-900 to-black border border-white/15 shadow-xl space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-400 uppercase">Valós Idejű Hangcsatorna</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
                      Duplex Audio Aktív
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-200">
                      <strong className="text-white">Ügyfél:</strong> „Szia! Szeretném automatizálni a beérkező árajánlatkéréseinket és a számlázást.”
                    </div>
                    <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-xs text-white">
                      <strong className="text-emerald-400">Xpander AI:</strong> „Természetesen! Kétirányú szinkront tudunk kiépíteni a CRM rendszered és a Számlázz.hu között, 0.00% hibaszázalékkal.”
                    </div>
                  </div>
                </div>
              )}

              {/* Content Type 3: Services Dashboard Visual */}
              {currentChapter.contentType === 'services' && (
                <div className="rounded-2xl border border-white/15 overflow-hidden shadow-2xl relative group aspect-video max-h-60 sm:max-h-64">
                  <img
                    src="/images/ads/xpander-ad-dashboard.jpg"
                    alt="Xpander Integrations Dashboard"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-4 text-xs font-mono text-white font-bold">
                    HubSpot • MiniCRM • Salesforce • Billingo • Számlázz.hu
                  </div>
                </div>
              )}

              {/* Content Type 4: Workflow Editor Animated Wires */}
              {currentChapter.contentType === 'workflow' && (
                <div className="rounded-2xl p-5 bg-[#0a0a0d] border border-white/15 shadow-xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400">XpanderFlow Csomagfolyam</span>
                    <span className="text-white font-bold">&lt; 22ms Telemetria</span>
                  </div>
                  {/* Visual Node Diagram */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] text-neutral-400">Trigger</div>
                      <div className="text-xs font-bold text-white mt-1">Webhook / Űrlap</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/10 border border-white/25 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                      <div className="text-[10px] text-emerald-400 font-bold">GPT-4o AI</div>
                      <div className="text-xs font-bold text-white mt-1">Lead Triage &gt;= 70</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] text-neutral-400">Művelet</div>
                      <div className="text-xs font-bold text-white mt-1">CRM Deal Készítés</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Type 5: Audit & ROI Preview */}
              {currentChapter.contentType === 'audit' && (
                <div className="rounded-2xl p-5 bg-gradient-to-tr from-neutral-950 to-neutral-900 border border-white/15 shadow-xl grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-2xl sm:text-3xl font-black text-white">180</div>
                    <div className="text-[10px] text-neutral-400 uppercase mt-0.5">Óra Megtakarítás / Hó</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 border border-white/20">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">1.26 M</div>
                    <div className="text-[10px] text-neutral-400 uppercase mt-0.5">Havi Megtakarítás (Ft)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-2xl sm:text-3xl font-black text-white">3.8x</div>
                    <div className="text-[10px] text-neutral-400 uppercase mt-0.5">Átlagos Ügyfél ROI</div>
                  </div>
                </div>
              )}

              {/* Content Type 6: Appointment & Notification Preview */}
              {currentChapter.contentType === 'appointment' && (
                <div className="rounded-2xl p-5 bg-neutral-950 border border-white/15 shadow-xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-400">Automatikus Értesítési Lánc</span>
                    <span className="text-emerald-400 font-bold">100% Kézbesítés</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-white" />
                        <span>Visszaigazoló Email</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">Naptár .ics csatolmánnyal azonnal kiküldve.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>SMS Emlékeztető</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">24 órával korábban kiküldött automata SMS.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Type 7: Frictionless Quick Contact & Lead Capture Form at the end! */}
              {currentChapter.contentType === 'contact' && (
                <div className="rounded-2xl p-5 bg-gradient-to-b from-[#111116] to-black border border-white/20 shadow-2xl space-y-4">
                  
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-white">
                        {lang === 'hu' ? 'Lépjünk Kapcsolatba! Ingyenes Konzultáció & Audit' : 'Get In Touch! Free Consultation & Audit'}
                      </h4>
                      <p className="text-xs text-neutral-400">
                        {lang === 'hu' ? 'Add meg az adataidat, és 2 órán belül felkeresünk.' : 'Leave your details and we will reach out within 2 hours.'}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
                      Garantált Válasz
                    </span>
                  </div>

                  {contactSubmitted ? (
                    <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                      <h5 className="text-sm font-bold text-white">
                        {lang === 'hu' ? 'Köszönjük! Az üzenetet megkaptuk.' : 'Thank you! Message received.'}
                      </h5>
                      <p className="text-xs text-neutral-300">
                        {lang === 'hu' ? 'Munkatársunk hamarosan felveszi veled a kapcsolatot a megadott címen.' : 'Our team will contact you shortly.'}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder={lang === 'hu' ? 'Teljes Neved *' : 'Your Full Name *'}
                          className="px-3.5 py-2 rounded-xl bg-black border border-white/15 text-white text-xs focus:outline-none focus:border-white placeholder:text-neutral-500"
                        />
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder={lang === 'hu' ? 'Email Címed *' : 'Your Email *'}
                          className="px-3.5 py-2 rounded-xl bg-black border border-white/15 text-white text-xs focus:outline-none focus:border-white placeholder:text-neutral-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder={lang === 'hu' ? 'Telefonszám (opcionális)' : 'Phone Number'}
                          className="px-3.5 py-2 rounded-xl bg-black border border-white/15 text-white text-xs focus:outline-none focus:border-white placeholder:text-neutral-500"
                        />
                        <input
                          type="text"
                          value={contactCompany}
                          onChange={(e) => setContactCompany(e.target.value)}
                          placeholder={lang === 'hu' ? 'Cégnév' : 'Company Name'}
                          className="px-3.5 py-2 rounded-xl bg-black border border-white/15 text-white text-xs focus:outline-none focus:border-white placeholder:text-neutral-500"
                        />
                      </div>

                      <input
                        type="text"
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        placeholder={lang === 'hu' ? 'Milyen folyamatot szeretnél automatizálni?' : 'What process would you like to automate?'}
                        className="w-full px-3.5 py-2 rounded-xl bg-black border border-white/15 text-white text-xs focus:outline-none focus:border-white placeholder:text-neutral-500"
                      />

                      <button
                        type="submit"
                        disabled={isSendingContact}
                        className="w-full py-2.5 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5 text-black" />
                        <span>{isSendingContact ? (lang === 'hu' ? 'Küldés...' : 'Sending...') : (lang === 'hu' ? 'Ingyenes Audit & Felkeresés Kérése' : 'Request Free Audit & Consultation')}</span>
                      </button>
                    </form>
                  )}

                  {/* Direct Contact Links */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 pt-2 border-t border-white/10">
                    <span className="flex items-center gap-1.5 text-neutral-300">
                      <Mail className="w-3.5 h-3.5 text-white" />
                      <span>xpander-automation.ai@outlook.hu</span>
                    </span>
                    <Link
                      href="/services/appointment-booking"
                      onClick={() => {
                        stopAudio();
                        onClose();
                      }}
                      className="text-white hover:underline font-bold"
                    >
                      Közvetlen naptár időpontfoglalás →
                    </Link>
                  </div>

                </div>
              )}

              {/* Bullet Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                {currentChapter.features[lang].map((feat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5 text-xs text-neutral-300">
                    <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Bottom Stepper Scrubber inside Right Stage */}
            <div className="w-full pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span className="flex items-center gap-2 text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Fejezet {currentChapter.stepNumber} / {TOUR_CHAPTERS.length}</span>
              </span>
              <span>{formatTime(currentTimeSec)} / {formatTime(chapterDurationSec)}</span>
            </div>

          </div>

        </div>

        {/* Bottom Playback Control Bar & Timeline Scrubber */}
        <div className="px-6 py-4 bg-[#09090b] border-t border-white/10 shrink-0 space-y-3">
          
          {/* Progress Bar / Scrubber */}
          <div className="relative w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden cursor-pointer">
            <div 
              className="h-full bg-white transition-all duration-300 relative"
              style={{ width: `${progressPercent}%` }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
          </div>

          {/* Controls & Scrubber Labels */}
          <div className="flex items-center justify-between">
            
            {/* Play/Pause & Chapter Steppers */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => goToChapter(Math.max(0, currentChapterIndex - 1))}
                disabled={currentChapterIndex === 0}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white disabled:opacity-30 transition-all cursor-pointer"
                title={lang === 'hu' ? 'Előző fejezet' : 'Previous chapter'}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white text-black font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)] cursor-pointer"
                title={isPlaying ? (lang === 'hu' ? 'Szünet' : 'Pause') : (lang === 'hu' ? 'Lejátszás' : 'Play')}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-black text-black" /> : <Play className="w-4 h-4 fill-black text-black ml-0.5" />}
              </button>

              <button
                onClick={() => goToChapter(Math.min(TOUR_CHAPTERS.length - 1, currentChapterIndex + 1))}
                disabled={currentChapterIndex === TOUR_CHAPTERS.length - 1}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white disabled:opacity-30 transition-all cursor-pointer"
                title={lang === 'hu' ? 'Következő fejezet' : 'Next chapter'}
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => goToChapter(0)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-all cursor-pointer"
                title={lang === 'hu' ? 'Újrakezdés' : 'Restart'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total Elapsed Time / Duration */}
            <div className="font-mono text-xs text-neutral-400">
              <span className="text-white font-bold">{formatTime(currentTimeSec)}</span> / <span>{formatTime(chapterDurationSec)}</span>
            </div>

            {/* Final CTA Buttons & Downloads */}
            <div className="flex items-center gap-2 relative">
              
              {/* Download Assets Dropdown Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDownloadMenuOpen(prev => !prev)}
                  className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title={lang === 'hu' ? 'Videó, hang és logó letöltése' : 'Download video, audio, and logo'}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lang === 'hu' ? 'Letöltés' : 'Download'}</span>
                </button>

                {downloadMenuOpen && (
                  <div className="absolute right-0 bottom-full mb-3 w-72 rounded-2xl bg-black/95 border border-white/20 p-2.5 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase border-b border-white/10 mb-1 flex items-center justify-between">
                      <span>{lang === 'hu' ? 'Anyagok Letöltése' : 'Download Assets'}</span>
                      <span className="text-white">HD</span>
                    </div>

                    <a
                      href="/audio/tour/xpander-tour-complete-hungarian.mp3"
                      download="xpander-tour-magyar.mp3"
                      onClick={() => setDownloadMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 text-white text-xs font-semibold transition-all group"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="flex-1 truncate">
                        <div className="truncate">{lang === 'hu' ? 'Teljes Magyar Hang (MP3)' : 'Full Hungarian Voice (MP3)'}</div>
                        <div className="text-[10px] text-neutral-400 font-normal">780 KB • Stúdió hang</div>
                      </div>
                    </a>

                    <a
                      href="/audio/tour/xpander-tour-complete-english.mp3"
                      download="xpander-tour-english.mp3"
                      onClick={() => setDownloadMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 text-white text-xs font-semibold transition-all group"
                    >
                      <Volume2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <div className="flex-1 truncate">
                        <div className="truncate">{lang === 'hu' ? 'Teljes Angol Hang (MP3)' : 'Full English Voice (MP3)'}</div>
                        <div className="text-[10px] text-neutral-400 font-normal">750 KB • Studio voice</div>
                      </div>
                    </a>

                    <a
                      href="/xpander-promo-video.gif"
                      download="xpander-promo-video.gif"
                      onClick={() => setDownloadMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 text-white text-xs font-semibold transition-all group"
                    >
                      <Play className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="flex-1 truncate">
                        <div className="truncate">{lang === 'hu' ? 'Animált Promó Videó' : 'Animated Promo Video'}</div>
                        <div className="text-[10px] text-neutral-400 font-normal">HD GIF formátum</div>
                      </div>
                    </a>

                    <a
                      href="/xpander-logo.svg"
                      download="xpander-logo.svg"
                      onClick={() => setDownloadMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 text-white text-xs font-semibold transition-all group border-t border-white/10 pt-2"
                    >
                      <Sparkles className="w-4 h-4 text-white shrink-0" />
                      <div className="flex-1 truncate">
                        <div className="truncate">{lang === 'hu' ? 'Hivatalos Logó (Vektor SVG)' : 'Official Logo (Vector SVG)'}</div>
                        <div className="text-[10px] text-neutral-400 font-normal">Végtelen felbontás</div>
                      </div>
                    </a>

                    <a
                      href="/brand/xpander-app-icon-512.png"
                      download="xpander-icon-512.png"
                      onClick={() => setDownloadMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 text-white text-xs font-semibold transition-all group"
                    >
                      <Sparkles className="w-4 h-4 text-white shrink-0" />
                      <div className="flex-1 truncate">
                        <div className="truncate">{lang === 'hu' ? 'Hivatalos Ikon (512x512 PNG)' : 'Official Icon (512x512 PNG)'}</div>
                        <div className="text-[10px] text-neutral-400 font-normal">Nagyfelbontású PNG</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* Direct Jump to End Contact Button */}
              <button
                type="button"
                onClick={() => goToChapter(TOUR_CHAPTERS.length - 1)}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-white" />
                <span>{lang === 'hu' ? 'Kapcsolatfelvétel' : 'Contact Us'}</span>
              </button>

              <Link
                href="/audit"
                onClick={() => {
                  stopAudio();
                  onClose();
                }}
                className="px-5 py-2 rounded-full bg-white text-black font-extrabold text-xs flex items-center gap-1.5 shadow hover:bg-neutral-200 transition-all"
              >
                <span>{lang === 'hu' ? 'Ingyenes AI Audit' : 'Free AI Audit'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
