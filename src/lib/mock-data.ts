import { 
  UserProfile, 
  AutomationItem, 
  ChatbotConfig, 
  ServiceOrder, 
  AppNotification, 
  AutomationLog,
  ServiceDetail 
} from '@/types';

export const INITIAL_SERVICES: ServiceDetail[] = [
  {
    id: 'srv-1',
    slug: 'ai-chatbot',
    title: 'AI Intelligens Chatbot',
    badge: 'Legnépszerűbb',
    shortDesc: '24/7 autonóm weboldali és ügyfélszolgálati asszisztens, amely azonnal válaszol és leadeket gyűjt.',
    heroHeadline: 'Alakítsd át a weboldal látogatóit elégedett fizető ügyfelekké 24/7 AI Chatbottal',
    detailedDesc: 'A cég specifikus tudásbázisára (PDF, Notion, weboldal, CRM) betanított, hallucinációmentes intelligens asszisztens. Nem egyszerű döntési fa: megérti az összetett ügyféligényeket, kezeli a kifogásokat, beágyazott űrlapokat tölt ki és azonnal időpontot egyeztet.',
    iconName: 'Bot',
    deliverables: [
      'Egyedi kontextus- és tudásbázis integráció (RAG)',
      'Weboldal widget (Tailwind/React vagy script tag)',
      'Lead gyűjtés és azonnali CRM szinkronizáció',
      'Emberi operátorhoz való zökkenőmentes átadás (Human-in-the-loop)',
      'Heti konverziós és beszélgetés-elemző riport'
    ],
    businessBenefits: [
      '85%-kal gyorsabb ügyfélválaszidő (azonnali < 2 mp)',
      '3.4x több begyűjtött és minősített érdeklődő',
      '0 felesleges éjszakai vagy hétvégi kiesés',
      'Többnyelvű támogatás több mint 95 nyelven azonnal'
    ],
    techStack: ['OpenAI GPT-4o', 'LangChain', 'Pinecone Vector DB', 'Next.js', 'XpanderFlow Engine'],
    pricingNote: 'Kezdve 290.000 Ft-tól egyszeri implementáció vagy havi konstrukció',
    demoType: 'chat'
  },
  {
    id: 'srv-2',
    slug: 'customer-support',
    title: 'AI Customer Support Rendszer',
    badge: 'Költségcsökkentő',
    shortDesc: 'Többcsatornás intelligens ticket-kezelés és automatikus problémamegoldás ügyfélszolgálatoknak.',
    heroHeadline: 'Automatizáld az ügyfélszolgálati megkeresések 70%-át minőségromlás nélkül',
    detailedDesc: 'A beérkező panaszokat, kérdéseket és megkereséseket automatikusan kategorizálja, kinyeri a megrendelésszámot, lekérdezi az ERP/webshop adatbázisát, és azonnal részletes választ vagy státuszfrissítést küld az ügyfélnek.',
    iconName: 'Headphones',
    deliverables: [
      'Email, Zendesk, Freshdesk vagy Intercom integráció',
      'Webshop & ERP API összeköttetés (pl. csomagkövetés, számla)',
      'Intelligens prioritás- és hangulatelemzés (Sentiment Analysis)',
      'Automatizált válasz-jóváhagyási felület operátoroknak',
      'Minőségbiztosítási audit naplózás'
    ],
    businessBenefits: [
      '70%-kal csökkenő ismétlődő ügyfélszolgálati terhelés',
      'Nincs várakozási idő a csomagstátusz és számlakérdések esetén',
      'Konzisztens, udvarias és pontos válaszok minden csatornán',
      'Az emberi ügyfélszolgálat a stratégiai ügyfelekre fókuszálhat'
    ],
    techStack: ['OpenAI API', 'XpanderFlow TS Engine', 'Zendesk / Intercom API', 'Supabase Vector'],
    pricingNote: 'Kezdve 420.000 Ft-tól folyamatmérettől függően',
    demoType: 'crm'
  },
  {
    id: 'srv-3',
    slug: 'email-automation',
    title: 'Intelligens E-mail Automatizáció',
    badge: 'Időmegtakarítás',
    shortDesc: 'Bejövő e-mailek automatikus szortírozása, információ-kinyerés és kontextus-alapú választervezés.',
    heroHeadline: 'Változtasd a túlcsorduló postaládát önműködő, rendezett munkaállomássá',
    detailedDesc: 'Nem kell többé órákat tölteni a céges postaládák válogatásával. Az AI átolvassa a beérkező üzeneteket és csatolmányokat (PDF árajánlatkérések, számlák), beazonosítja a feladót, a szándékot, és automatikusan előkészíti a pontos választ vagy elindítja a megfelelő belső folyamatot.',
    iconName: 'Mail',
    deliverables: [
      'Gmail / Outlook 365 kétirányú AI integráció',
      'Csatolmányfeldolgozás (PDF, számlák, műszaki specifikációk)',
      'Intelligens címkézés és mappa-archiválás',
      'Automatikus válasz-piszkozat készítés (Drafting) jóváhagyásra',
      'Sürgős riasztások továbbítása Slack / Teams csatornákra'
    ],
    businessBenefits: [
      'Napi 2-3 óra adminisztráció megtakarítása munkatársanként',
      '0 elveszett vagy megválaszolatlan árajánlatkérés',
      'Azonnali belső értesítés a kiemelt ügyfelek leveleiről',
      'Pontos és professzionális céges hangnem minden levélben'
    ],
    techStack: ['Microsoft Graph API', 'Gmail REST API', 'OpenAI GPT-4o', 'XpanderFlow Core'],
    pricingNote: 'Kezdve 240.000 Ft-tól',
    demoType: 'email'
  },
  {
    id: 'srv-4',
    slug: 'lead-generation',
    title: 'Autonóm Lead Generation',
    badge: 'Bevételnövelő',
    shortDesc: 'B2B célcsoport-kutatás, adatenrichment, jégtörő személyre szabás és hideg megkeresési rendszerek.',
    heroHeadline: 'Állandó, kiszámítható ügyféláramlás intelligens B2B AI kutatással és outreach-csel',
    detailedDesc: 'Autonóm rendszerünk felkutatja az ideális ügyfélprofilodnak (ICP) megfelelő cégeket, kigyűjti a döntéshozók elérhetőségeit, elemzi a cégük aktuális híreit és igényeit, majd hiper-perszonalizált megkereséseket fogalmaz meg emberi pontossággal.',
    iconName: 'Zap',
    deliverables: [
      'Célpiac és ICP digitális profilozás',
      'Automatizált LinkedIn & cégadatbázis kutató modul',
      'Email validáció és domain hírnév védelem',
      'Döntéshozó-specifikus személyre szabott üzenetgenerálás',
      'Pozitív válaszok automatikus naptárba terelése'
    ],
    businessBenefits: [
      '3-5x magasabb válaszadási arány a sablonlevelekhez képest',
      'Automatizált pipeline-építés kézi adatbányászat nélkül',
      'Folyamatos heti 15-30 minősített tárgyalási lehetőség',
      'Skálázható új piacokra lépés minimális költséggel'
    ],
    techStack: ['Apollo API', 'Hunter.io', 'OpenAI GPT-4o', 'Instantly / Smartlead', 'XpanderFlow Engine'],
    pricingNote: 'Kezdve 380.000 Ft-tól + opcionális sikerdíj',
    demoType: 'lead'
  },
  {
    id: 'srv-5',
    slug: 'crm-automation',
    title: 'CRM & Pipeline Automatizáció',
    badge: 'Rendszerépítés',
    shortDesc: 'HubSpot, Salesforce és Pipedrive adatfrissítés, deal követés és automata feladatkiosztás.',
    heroHeadline: 'Tartsd a CRM rendszeredet 100%-ban naprakészen emberi kézi adatrögzítés nélkül',
    detailedDesc: 'Az értékesítők idejük 40%-át adminisztrációval töltik. AI rendszerünk az emailekből, hívásjegyzetekből és naptári eseményekből automatikusan frissíti az ügyfél adatlapokat, mozgatja a dealeket a csővezetékben és emlékeztetőket hoz létre.',
    iconName: 'Database',
    deliverables: [
      'HubSpot, Pipedrive vagy Salesforce API szinkronizáció',
      'Hívásjegyzet és meeting összegző AI pipeline',
      'Automatikus deal-státusz és valószínűség számítás',
      'Inaktív ügyfelek visszamelegítő (re-engagement) szekvenciái',
      'Vezetői heti pipeline analitika és bevétel-előrejelzés'
    ],
    businessBenefits: [
      '100%-ban tiszta, hiánytalan ügyféladatbázis',
      'Az értékesítők végre csak az eladással foglalkoznak',
      'Nincs több elfelejtett follow-up vagy elveszett érdeklődő',
      'Valós idejű vezetői rálátás az eladási ciklusra'
    ],
    techStack: ['HubSpot API', 'Pipedrive REST API', 'Whisper AI', 'XpanderFlow TS Core', 'Supabase'],
    pricingNote: 'Kezdve 350.000 Ft-tól meglévő CRM struktúrához',
    demoType: 'crm'
  },
  {
    id: 'srv-6',
    slug: 'appointment-booking',
    title: 'AI Időpontfoglaló & Naptárkezelő',
    badge: 'Automatikus Naptár',
    shortDesc: 'Komplex naptáregyeztetés és lemondás/újrafoglalás kezelés természetes emberi nyelven.',
    heroHeadline: 'Töltsd meg a naptárad minősített ügyféltalálkozókkal oda-vissza emailezés nélkül',
    detailedDesc: 'Ne küldözgess linkeket olyan ügyfeleknek, akik személyes figyelmet várnak. Az AI asszisztens természetes nyelven egyeztet az ügyféllel, figyelembe veszi az időzónákat, felméri a felkészültséget, kiküldi a meghívót és sms/email emlékeztetőt küld a megjelenési arány maximalizálásáért.',
    iconName: 'Calendar',
    deliverables: [
      'Google Naptár és Microsoft Outlook mély integráció',
      'Előzetes igényfelmérő kérdések intelligens kiértékelése',
      'SMS és WhatsApp automata találkozó emlékeztetők',
      'No-show kezelés és automatikus újraidőzítés',
      'Videóhívás (Google Meet, Zoom) linkek azonnali generálása'
    ],
    businessBenefits: [
      'Akár 92%-os megjelenési arány az automatikus emlékeztetőkkel',
      'Megszűnik a nehézkes "Mikor érsz rá?" levélváltás',
      'Csak azokkal ülsz le tárgyalni, akik valóban a célcsoportodba tartoznak',
      '24 órás foglalási lehetőség külföldi partnereknek is'
    ],
    techStack: ['Google Calendar API', 'Twilio SMS', 'Calendly / Cal.com API', 'XpanderFlow Engine'],
    pricingNote: 'Kezdve 190.000 Ft-tól',
    demoType: 'booking'
  },
  {
    id: 'srv-7',
    slug: 'ai-agents',
    title: 'Autonóm AI Munkatársak (Agents)',
    badge: 'Csúcstechnológia',
    shortDesc: 'Önálló döntéshozatalra képes többügynökös (Multi-Agent) rendszerek komplex vállalati feladatokra.',
    heroHeadline: 'Vezess be autonóm digitális munkatársakat, akik éjjel-nappal önállóan dolgoznak',
    detailedDesc: 'A jövő vállalata ágensekkel skálázódik. Egy AI kutató ágens információt gyűjt, egy elemző ágens kiértékeli a kockázatokat, egy szövegíró ágens megírja az összefoglalót, egy műveleti ágens pedig elküldi a riportot a vezetőségnek. Teljesen autonóm, monitorozott digitális munkaerő.',
    iconName: 'Cpu',
    deliverables: [
      'Egyedi Multi-Agent architektúra tervezése (LangGraph / CrewAI)',
      'Eszközhasználat (Tool Calling): webkeresés, adatbázis lekérdezés, PDF export',
      'Hibakezelési és önkorrekciós mechanizmusok',
      'Biztonsági jóváhagyási korlátok és emberi felügyelet',
      'Valós idejű futási naplózás és végrehajtási telemetria'
    ],
    businessBenefits: [
      'Összetett többórás kutatási folyamatok lefutása percek alatt',
      'Fáradhatatlan, 99.9%-os megbízhatóságú autonóm döntési láncok',
      'Drasztikus költségelőny a hagyományos outsourcinggal szemben',
      'Azonnali skálázhatóság: 1 ágensről 50-re egy kattintással'
    ],
    techStack: ['LangGraph', 'CrewAI', 'OpenAI o1 / GPT-4o', 'XpanderFlow Native Nodes', 'Docker'],
    pricingNote: 'Konzultáció és egyedi ajánlat alapján',
    demoType: 'agent'
  }
];

export const DEMO_CLIENT: UserProfile = {
  id: 'usr-client-001',
  name: 'Kovács Tamás',
  email: 'tamas.kovacs@techventures.hu',
  role: 'client',
  company: 'TechVentures Innovációs Kft.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  plan: 'Growth',
  createdAt: '2026-01-15',
  phone: '+36 30 456 7890',
  apiKey: 'nx_live_9a8b7c6d5e4f3a2b1c0d_sec',
  plainPassword: 'ClientPassword2026!',
  status: 'active',
  lastLogin: '2026-03-14 11:32'
};

export const DEMO_ADMIN: UserProfile = {
  id: 'usr-admin-001',
  name: 'Nagy Viktor',
  email: 'xpander-automation.ai@outlook.hu',
  role: 'admin',
  company: 'xpander.ai Automation HQ',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  plan: 'Enterprise',
  createdAt: '2025-10-01',
  phone: '+36 1 800 9999',
  apiKey: 'nx_admin_master_supersecret_key_88',
  plainPassword: 'XpanderAdmin2026!',
  status: 'active',
  lastLogin: '2026-03-14 15:40'
};

export const INITIAL_AUTOMATIONS: AutomationItem[] = [
  {
    id: 'auto-101',
    userId: 'usr-client-001',
    title: 'Weboldali Értékesítési AI Chatbot',
    description: 'Beszélgetésekből leadek minősítése és időpontfoglalás a Google Naptárba.',
    category: 'chatbot',
    status: 'active',
    trigger: 'Natív Webhook / Látogatói interakció',
    actionsCount: 5,
    lastRun: '12 perce',
    totalRuns: 4280,
    successRate: 99.8,
    nativeWebhookUrl: '/api/engine/webhook/wf-lead-qualifier',
    workflowId: 'wf-lead-qualifier',
    nextScheduled: 'Folyamatos 24/7'
  },
  {
    id: 'auto-102',
    userId: 'usr-client-001',
    title: 'Bejövő Ajánlatkérő Email Szortírozás',
    description: 'Info@ postaláda olvasása, melléklet PDF kinyerés és árajánlat draft generálás.',
    category: 'email',
    status: 'active',
    trigger: 'Új bejövő email trigger (Gmail REST)',
    actionsCount: 7,
    lastRun: '47 perce',
    totalRuns: 1194,
    successRate: 98.9,
    nativeWebhookUrl: '/api/engine/webhook/wf-support-triage',
    workflowId: 'wf-support-triage',
    nextScheduled: '5 percenként'
  },
  {
    id: 'auto-103',
    userId: 'usr-client-001',
    title: 'HubSpot CRM Napi Kétirányú Szinkron',
    description: 'Új ügyfelek adatlapjának gazdagítása és deal mozgatás.',
    category: 'crm',
    status: 'active',
    trigger: 'CRON időzítő (Minden este 22:00)',
    actionsCount: 11,
    lastRun: 'Tegnap 22:00',
    totalRuns: 312,
    successRate: 100.0,
    nativeWebhookUrl: '/api/engine/webhook/wf-lead-qualifier',
    workflowId: 'wf-lead-qualifier',
    nextScheduled: 'Ma 22:00'
  },
  {
    id: 'auto-104',
    userId: 'usr-client-001',
    title: 'B2B LinkedIn Célcsoport Kutató Ágens',
    description: 'Heti 100 releváns döntéshozó azonosítása és személyre szabott jégtörő mondatok írása.',
    category: 'leads',
    status: 'paused',
    trigger: 'Kézi indítás / Heti időzítés',
    actionsCount: 6,
    lastRun: '3 napja',
    totalRuns: 48,
    successRate: 96.2,
    nativeWebhookUrl: '/api/engine/webhook/wf-lead-qualifier',
    workflowId: 'wf-lead-qualifier',
    nextScheduled: 'Szüneteltetve'
  }
];

export const INITIAL_CHATBOTS: ChatbotConfig[] = [
  {
    id: 'bot-1',
    userId: 'usr-client-001',
    name: 'TechVentures Termék & Sales Asszisztens',
    status: 'online',
    model: 'gpt-4o',
    systemPrompt: 'Te a TechVentures Kft. professzionális és közvetlen AI asszisztense vagy. Célod a szolgáltatások bemutatása és az érdeklődők időpontfoglalásra terelése.',
    welcomeMessage: 'Üdvözöllek! Miben segíthetek a TechVentures megoldásaival kapcsolatban? Kérdezz bátran!',
    totalConversations: 1845,
    avgResponseTime: '1.2 mp',
    satisfactionScore: 4.9,
    knowledgeBaseFilesCount: 8,
    accentColor: '#38bdf8'
  },
  {
    id: 'bot-2',
    userId: 'usr-client-001',
    name: 'Ügyfélszolgálati Ticket Kezelő Bot',
    status: 'training',
    model: 'gpt-4o-mini',
    systemPrompt: 'Te a belső műszaki ügyfélszolgálat első vonala vagy. Azonosítsd a hibaüzeneteket és ha nem tudod megoldani, irányítsd át a mérnökökhöz.',
    welcomeMessage: 'Szia! Műszaki kérdésed vagy hibajelentésed van? Írd le a hibát, és segítek!',
    totalConversations: 620,
    avgResponseTime: '0.9 mp',
    satisfactionScore: 4.7,
    knowledgeBaseFilesCount: 14,
    accentColor: '#a855f7'
  }
];

export const INITIAL_ORDERS: ServiceOrder[] = [
  {
    id: 'ord-901',
    userId: 'usr-client-001',
    clientName: 'Kovács Tamás',
    clientCompany: 'TechVentures Kft.',
    serviceId: 'srv-1',
    serviceTitle: 'AI Intelligens Chatbot',
    packageType: 'Growth',
    price: '380.000 Ft',
    status: 'completed',
    createdAt: '2026-01-20',
    deliveryDate: '2026-01-28',
    assignedEngineer: 'Molnár Balázs (Lead AI Dev)'
  },
  {
    id: 'ord-902',
    userId: 'usr-client-001',
    clientName: 'Kovács Tamás',
    clientCompany: 'TechVentures Kft.',
    serviceId: 'srv-3',
    serviceTitle: 'Intelligens E-mail Automatizáció',
    packageType: 'Growth',
    price: '290.000 Ft',
    status: 'completed',
    createdAt: '2026-02-05',
    deliveryDate: '2026-02-14',
    assignedEngineer: 'Farkas Dávid (Automation Eng)'
  },
  {
    id: 'ord-903',
    userId: 'usr-client-001',
    clientName: 'Kovács Tamás',
    clientCompany: 'TechVentures Kft.',
    serviceId: 'srv-7',
    serviceTitle: 'Autonóm AI Munkatársak (Agents)',
    packageType: 'Enterprise',
    price: '790.000 Ft',
    status: 'in_progress',
    createdAt: '2026-03-01',
    deliveryDate: '2026-03-20',
    notes: 'Egyedi LangGraph ágens kutatás és versenytárselemzés modul fejlesztése.',
    assignedEngineer: 'Nagy Viktor (Admin / Lead Arch)'
  },
  {
    id: 'ord-904',
    userId: 'usr-client-002',
    clientName: 'Szabó Péter',
    clientCompany: 'LogiGlobal Trans Kft.',
    serviceId: 'srv-2',
    serviceTitle: 'AI Customer Support Rendszer',
    packageType: 'Growth',
    price: '420.000 Ft',
    status: 'in_progress',
    createdAt: '2026-03-04',
    deliveryDate: '2026-03-22',
    assignedEngineer: 'Molnár Balázs'
  },
  {
    id: 'ord-905',
    userId: 'usr-client-003',
    clientName: 'Horváth Anna',
    clientCompany: 'Aura Med Dental Klinika',
    serviceId: 'srv-6',
    serviceTitle: 'AI Időpontfoglaló & Naptárkezelő',
    packageType: 'Starter',
    price: '240.000 Ft',
    status: 'pending',
    createdAt: '2026-03-10',
    deliveryDate: '2026-03-25',
    assignedEngineer: 'Kijelölésre vár'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'usr-client-001',
    title: 'Sikeres XpanderFlow munkafolyamat futás',
    message: 'A "HubSpot CRM Napi Kétirányú Szinkron" hiba nélkül lefutott a natív TS motoron.',
    type: 'success',
    timestamp: '1 órája',
    read: false,
    link: '/dashboard/automations'
  },
  {
    id: 'notif-2',
    userId: 'usr-client-001',
    title: 'Új megrendelés státusz: Fejlesztés alatt',
    message: 'Az "Autonóm AI Munkatársak (Agents)" fejlesztése elkezdődött. Várható átadás: Március 20.',
    type: 'info',
    timestamp: '5 órája',
    read: false,
    link: '/dashboard/orders'
  },
  {
    id: 'notif-3',
    userId: 'usr-client-001',
    title: 'Havi token keret 75%-a felhasználva',
    message: 'A Growth csomagod 750,000 / 1,000,000 GPT-4o tokenjénél tart. A rendszerek zavartalanul futnak.',
    type: 'warning',
    timestamp: 'Tegnap',
    read: true,
    link: '/dashboard/settings'
  }
];

export const INITIAL_LOGS: AutomationLog[] = [
  {
    id: 'log-1',
    automationId: 'auto-101',
    automationTitle: 'Weboldali Értékesítési AI Chatbot',
    status: 'success',
    executionTimeMs: 412,
    timestamp: '2026-03-11 14:38:12',
    payloadSummary: 'Lead minősítés: "Kollár Tamás - B2B Webfejlesztés" -> Naptár link elküldve.'
  },
  {
    id: 'log-2',
    automationId: 'auto-102',
    automationTitle: 'Bejövő Ajánlatkérő Email Szortírozás',
    status: 'success',
    executionTimeMs: 1240,
    timestamp: '2026-03-11 14:02:45',
    payloadSummary: 'Email: info@alfa.hu -> Csatolmány feldolgozva (ajanlat_keres.pdf, 3 tétel) -> Piszkozat készítve.'
  },
  {
    id: 'log-3',
    automationId: 'auto-101',
    automationTitle: 'Weboldali Értékesítési AI Chatbot',
    status: 'success',
    executionTimeMs: 388,
    timestamp: '2026-03-11 13:50:09',
    payloadSummary: 'Gyors kérdés: "Mennyi az átfutási idő?" -> Válasz generálva tudásbázisból.'
  },
  {
    id: 'log-4',
    automationId: 'auto-103',
    automationTitle: 'HubSpot CRM Napi Kétirányú Szinkron',
    status: 'success',
    executionTimeMs: 4890,
    timestamp: '2026-03-10 22:00:15',
    payloadSummary: '38 ügyfél átnézve, 6 deal mozgatva a "Tárgyalás egyeztetve" szakaszba.'
  }
];

export const ALL_USERS: UserProfile[] = [
  DEMO_CLIENT,
  DEMO_ADMIN,
  {
    id: 'usr-client-002',
    name: 'Szabó Péter',
    email: 'peter.szabo@logiglobal.hu',
    role: 'client',
    company: 'LogiGlobal Trans Kft.',
    plan: 'Growth',
    createdAt: '2026-02-10',
    phone: '+36 20 123 4567',
    plainPassword: 'LogiPass2026!',
    status: 'active',
    lastLogin: '2026-03-12 09:14'
  },
  {
    id: 'usr-client-003',
    name: 'Horváth Anna',
    email: 'anna@auramed.hu',
    role: 'client',
    company: 'Aura Med Dental Klinika',
    plan: 'Starter',
    createdAt: '2026-03-02',
    phone: '+36 70 987 6543',
    plainPassword: 'DentalSecret44$',
    status: 'active',
    lastLogin: '2026-03-14 08:45'
  },
  {
    id: 'usr-client-004',
    name: 'Bognár Zoltán',
    email: 'bognar@fintechsol.eu',
    role: 'client',
    company: 'Fintech Solutions Ltd.',
    plan: 'Enterprise',
    createdAt: '2025-11-18',
    phone: '+36 30 777 8899',
    plainPassword: 'FintechVault88&',
    status: 'active',
    lastLogin: '2026-03-13 17:20'
  }
];

export const GLOBAL_SYSTEM_STATS = {
  activeClientsCount: 42,
  totalAutomationsRunning: 187,
  tasksProcessedThisMonth: 1248900,
  systemUptimePercentage: 99.98,
  monthlyRecurringRevenue: '14.850.000 Ft',
  avgExecutionSpeedMs: 418,
  webhooksHealthy: 187,
  webhooksFailing: 0
};
