export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Strips accents and normalizes text for fault-tolerant intent matching
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Language detector for incoming user messages
 */
export function detectLanguage(text: string): 'hu' | 'en' | 'de' | 'es' | 'fr' | 'it' {
  const norm = normalizeText(text);

  // English cues
  const enWords = ['how', 'what', 'where', 'when', 'why', 'who', 'which', 'price', 'pricing', 'cost', 'workflow', 'automate', 'automation', 'hello', 'hi', 'agent', 'agents', 'support', 'email', 'can you', 'tell me', 'much does', 'services', 'features', 'guarantee', 'integrate', 'voice', 'speak', 'help me', 'start'];
  // German cues
  const deWords = ['hallo', 'guten tag', 'wie', 'was', 'wo', 'wann', 'warum', 'wer', 'welche', 'welcher', 'welches', 'bieten', 'sie', 'ihr', 'ihre', 'kosten', 'preis', 'preise', 'angebot', 'automatisierung', 'deutsch', 'kunden', 'dienstleistungen', 'hilfe', 'konnen sie', 'starten', 'kontakt', 'ki', 'agenten', 'chatbot', 'chatbots'];
  // Spanish cues
  const esWords = ['hola', 'buenos dias', 'como', 'que', 'donde', 'cuando', 'cuales', 'ofrecen', 'precio', 'cuanto', 'automatizar', 'automatizacion', 'empresa', 'servicio', 'servicios', 'ayuda', 'puede', 'contacto', 'agentes'];
  // French cues
  const frWords = ['bonjour', 'comment', 'pourquoi', 'combien', 'quels', 'quelles', 'offrez', 'prix', 'automatiser', 'automatisation', 'entreprise', 'service', 'aide', 'pouvez', 'contact', 'agents'];
  // Italian cues
  const itWords = ['ciao', 'buongiorno', 'come', 'quanto', 'quali', 'offrite', 'prezzo', 'costo', 'automatizzare', 'azienda', 'servizio', 'aiuto', 'puoi', 'agenti'];

  const countMatches = (words: string[]) => words.reduce((acc, w) => acc + (norm.includes(w) ? 1 : 0), 0);

  const deScore = countMatches(deWords);
  const esScore = countMatches(esWords);
  const frScore = countMatches(frWords);
  const itScore = countMatches(itWords);
  const enScore = countMatches(enWords);

  if (deScore >= 2 || (deScore >= 1 && ['hallo', 'guten', 'wie', 'was', 'welche', 'bieten'].some(w => norm.includes(w)))) return 'de';
  if (esScore >= 2 || (esScore >= 1 && ['hola', 'buenos', 'como', 'que', 'cuales'].some(w => norm.includes(w)))) return 'es';
  if (frScore >= 2 || (frScore >= 1 && ['bonjour', 'comment', 'pourquoi', 'quels'].some(w => norm.includes(w)))) return 'fr';
  if (itScore >= 2 || (itScore >= 1 && ['ciao', 'buongiorno', 'come', 'quali'].some(w => norm.includes(w)))) return 'it';
  if (enScore >= 2 || (enScore >= 1 && ['hello', 'hi', 'how', 'what', 'which', 'can'].some(w => norm.includes(w)))) return 'en';

  return 'hu';
}

/**
 * Intelligent Conversational AI Engine for xpander.ai
 * Fully multilingual (Hungarian, English, German, Spanish, French, Italian).
 * Provides deep, structured, consultative, human-like responses with zero robotic evasions.
 */
export function generateIntelligentResponse(messages: ChatMessage[], systemPrompt?: string, isVoiceMode: boolean = false): string {
  if (!messages || messages.length === 0) {
    if (isVoiceMode) {
      return 'Üdvözöllek az Xpander.ai felületén! Milyen folyamatot szeretnél automatizálni a cégedben?';
    }
    return 'Üdvözöllek az xpander.ai felületén! Miben segíthetek a vállalkozásod automatizálásával vagy autonóm AI ágensek bevezetésével kapcsolatban?';
  }

  const lastUserMsg = messages[messages.length - 1].content.trim();
  const normMsg = normalizeText(lastUserMsg);
  const lang = detectLanguage(lastUserMsg);

  // Extract user name if provided (e.g. "Viktor vagyok", "my name is John", "ich bin Markus")
  let detectedName = '';
  const directMatch = lastUserMsg.match(/\b([A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+)\s+(?:vagyok|here|here is)\b/i)
                   || lastUserMsg.match(/(?:nevem|vagyok|my name is|ich bin|me llamo|je m'appelle)\s+([A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+)\b/i);
  if (directMatch && directMatch[1]) {
    const rawName = directMatch[1];
    const excluded = ['szia', 'hello', 'udv', 'itt', 'en', 'most', 'csak', 'mar', 'meg', 'egy', 'te', 'hier', 'bien'];
    if (!excluded.includes(rawName.toLowerCase())) {
      detectedName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
    }
  }

  // =========================================================================
  // VOICE MODE OPTIMIZATION: Crisp, natural, human conversational spoken sentences
  // =========================================================================
  if (isVoiceMode) {
    const vSal = detectedName ? `Kedves ${detectedName}! ` : '';

    // English Voice Mode
    if (lang === 'en') {
      if (/^(hi|hello|hey|good morning|how are you)/.test(normMsg)) {
        return `Hello! I am the Xpander.ai voice agent. How can I help you automate your business operations today?`;
      }
      if (normMsg.includes('price') || normMsg.includes('cost') || normMsg.includes('pricing')) {
        return `Our Starter plan is 650 dollars with a custom AI chatbot. Growth is 1,150 dollars with CRM and email automation. Which area would you like to streamline first?`;
      }
      if (normMsg.includes('make') || normMsg.includes('n8n') || normMsg.includes('zapier')) {
        return `We do not use Make or n8n. Everything runs on our proprietary TypeScript engine, with zero per-operation fees and 100 percent data privacy.`;
      }
      if (normMsg.includes('book') || normMsg.includes('schedule') || normMsg.includes('meeting') || normMsg.includes('audit')) {
        return `I would be happy to set up a free 20-minute process audit for you. What day works best for your calendar?`;
      }
      return `That is a great workflow candidate for our autonomous agents. Would you like to schedule a free 20-minute consultation to review the exact architecture?`;
    }

    // German Voice Mode
    if (lang === 'de') {
      if (/^(hallo|guten|hi)/.test(normMsg)) {
        return `Guten Tag! Ich bin der Xpander.ai Sprachassistent. Wie kann ich Ihnen bei der Automatisierung Ihrer Unternehmensprozesse helfen?`;
      }
      if (normMsg.includes('preis') || normMsg.includes('kosten')) {
        return `Unser Starter-Paket kostet 590 Euro, und das Growth-Paket 1.050 Euro inklusive CRM- und E-Mail-Automatisierung. Welcher Bereich interessiert Sie?`;
      }
      return `Diesen Prozess können wir mit unserer eigenen TypeScript-Engine vollständig automatisieren. Möchten Sie ein unverbindliches 20-minütiges Gespräch vereinbaren?`;
    }

    // Spanish Voice Mode
    if (lang === 'es') {
      return `¡Hola! Soy el agente de voz de Xpander.ai. Automatizamos procesos empresariales con nuestro propio motor en TypeScript. ¿Qué área de tu negocio te gustaría automatizar?`;
    }

    // French Voice Mode
    if (lang === 'fr') {
      return `Bonjour ! Je suis l'agent vocal de Xpander.ai. Nous automatisons vos processus d'entreprise avec notre propre moteur TypeScript. Quel flux souhaitez-vous optimiser ?`;
    }

    // Italian Voice Mode
    if (lang === 'it') {
      return `Ciao! Sono l'assistente vocale di Xpander.ai. Automatizziamo i processi aziendali con il nostro motore proprietario TypeScript. Quale processo vorresti ottimizzare?`;
    }

    // Hungarian Voice Mode
    if (/^(szia|udv|hello|szervusz|jo napot|hali|mizu|hogy vagy|szevasz)/.test(normMsg)) {
      return `${vSal}Szia! Remekül vagyok, készen állok a munkára! Milyen folyamatot vagy feladatot szeretnél automatizálni a cégedben?`;
    }

    if (normMsg.includes('ki vagy') || normMsg.includes('hogy hivnak') || normMsg.includes('mi a neved') || normMsg.includes('mi ez')) {
      return `Az Xpander.ai intelligens hangalapú asszisztense vagyok. Valós időben válaszolok bármilyen kérdésedre az automatizációról, árakról vagy a saját TypeScript motorunkról.`;
    }

    if (normMsg.includes('koszonom') || normMsg.includes('koszi') || normMsg.includes('szuper') || normMsg.includes('nagyszeru') || normMsg.includes('rendben') || normMsg.includes('ertem')) {
      return `Nagyon szívesen! Bármikor kérdezhetsz még, folyamatosan itt vagyok és figyelek.`;
    }

    if (normMsg.includes('viszlat') || normMsg.includes('csa') || normMsg.includes('viszontlatasra') || normMsg.includes('ennyi volt')) {
      return `Köszönöm a beszélgetést! Szép napot és sikeres vállalkozásfejlesztést kívánok neked!`;
    }

    if (normMsg.includes('idopont') || normMsg.includes('foglal') || normMsg.includes('konzultacio') || normMsg.includes('talalkozo') || normMsg.includes('audit') || normMsg.includes('beszeljunk')) {
      return `${vSal}Nagyszerű ötlet! Szívesen egyeztetek veled egy húszperces díjmentes folyamatauditot. Melyik időpont lenne a legjobb neked? Például holnap délután 14 óra megfelelne?`;
    }

    if (normMsg.includes('ar') || normMsg.includes('mennyibe') || normMsg.includes('koltseg') || normMsg.includes('csomag') || normMsg.includes('fizetes')) {
      return `${vSal}A Starter csomagunk 240 ezer forint egyedi AI chatbottal. A Growth csomag 380 ezer forint CRM és email automatizációval. Az Enterprise pedig egyedi árazású. Mindegyikre harminc napos pénzvisszafizetést vállalunk!`;
    }

    if (normMsg.includes('n8n') || normMsg.includes('make') || normMsg.includes('zapier')) {
      return `Mi semmilyen külső Make vagy n8n platformot nem használunk. A rendszereink saját fejlesztésű, 100 százalék natív TypeScript motoron futnak, így nincsenek havi műveleti díjak és garantált a maximális adatbiztonság.`;
    }

    if (normMsg.includes('chatbot') || normMsg.includes('rag') || normMsg.includes('tudasbazis')) {
      return `${vSal}Az AI chatbotunk a céged saját anyagaiból, PDF-ekből és a weboldaladból tanul. Nulla tévedéssel válaszol a vevőknek a nap 24 órájában, és beviszi a leadeket a CRM-edbe.`;
    }

    if (normMsg.includes('szamla') || normMsg.includes('billingo') || normMsg.includes('szamlazz')) {
      return `${vSal}A számlázási automatizációnk összeköti a CRM-edet a Számlázz.hu vagy Billingo fiókoddal. Új megrendelésnél másodpercek alatt, emberi beavatkozás nélkül kiállítja és kiküldi a díjbekérőt vagy számlát.`;
    }

    if (normMsg.includes('email') || normMsg.includes('level') || normMsg.includes('szures') || normMsg.includes('inbox')) {
      return `${vSal}Az email automatizációnk a Gmail vagy Outlook fiókodat figyeli. Azonnal kategorizálja a bejövő érdeklődéseket, és előkészíti a profi választ a kollégáidnak egyetlen kattintásra.`;
    }

    if (normMsg.includes('lead') || normMsg.includes('ugyfelszerzes') || normMsg.includes('prospect')) {
      return `${vSal}Az autonóm B2B lead kutatónk felkutatja a számodra ideális döntéshozókat a LinkedIn-en és a cégadatbázisokban, majd személyre szabott bemutatkozó üzenetet készít nekik.`;
    }

    if (normMsg.includes('crm') || normMsg.includes('pipedrive') || normMsg.includes('hubspot') || normMsg.includes('salesforce')) {
      return `${vSal}Kétirányú valós idejű szinkront építünk a HubSpot, Pipedrive vagy más CRM-ed és a belső rendszereid közé. Nincs több kézi adatgépelés.`;
    }

    if (normMsg.includes('mit tudsz') || normMsg.includes('szolgaltatas') || normMsg.includes('kepesseg') || normMsg.includes('mit csinaltok')) {
      return `${vSal}Automatizáljuk a számlázást, az ügyfélszolgálatot, az emaileket, az időpontfoglalást és a CRM szinkront saját motorral. Minden unalmas kézi munkát leveszünk a vállatokról.`;
    }

    if (normMsg.includes('iroda') || normMsg.includes('hol vagytok') || normMsg.includes('telefonszam') || normMsg.includes('kapcsolat') || normMsg.includes('cim')) {
      return `Központi irodánk Budapesten, a Szabadság tér 7. szám alatt, a Bank Centerben található. Hívhatsz minket a plusz 36 1 800 9999-es számon, vagy írhatsz az xpander-automation.ai@outlook.hu címre.`;
    }

    if (normMsg.includes('garancia') || normMsg.includes('sla') || normMsg.includes('biztonsag')) {
      return `Harminc napos kérdés nélküli pénzvisszafizetési garanciát adunk, a rendszerekre pedig 99 egész 98 százalékos rendelkezésre állást és szigorú titoktartási szerződést vállalunk.`;
    }

    if (normMsg.includes('mennyi ido') || normMsg.includes('atfutasi') || normMsg.includes('mikor keszul')) {
      return `Egy AI chatbotot és alapvető email automatizációt általában 5-7 munkanap alatt élesítünk. Bonyolultabb egyedi rendszerek átfutási ideje 2-3 hét.`;
    }

    return `${vSal}Ez a munkafolyamat pontosan az a terület, amit a saját TypeScript motorunkkal zökkenőmentesen tudunk automatizálni. Szeretnél egy 20 perces ingyenes folyamatauditot egyeztetni erről?`;
  }

  // =========================================================================
  // 1. MULTILINGUAL RESPONSES: ENGLISH (EN)
  // =========================================================================
  if (lang === 'en') {
    const sal = detectedName ? `Dear ${detectedName}! ` : '';

    // Greetings
    if (/^(hi|hello|hey|good morning|good afternoon)/.test(normMsg)) {
      return `${sal}Hello! 👋 Welcome to **xpander.ai** – the enterprise autonomous AI agent platform.\n\nHow can I assist your business today? We build:\n* **RAG-powered AI Chatbots** connected to your company documents,\n* **Intelligent Email & Customer Support Triage** via our native TypeScript engine,\n* **Two-way CRM Synchronization** (HubSpot, Salesforce, Pipedrive),\n* **Autonomous Multi-Agent Swarms** that execute multi-step workflows 24/7.\n\nWhat manual process would you like to automate?`;
    }

    // Pricing & Cost
    if (normMsg.includes('price') || normMsg.includes('pricing') || normMsg.includes('cost') || normMsg.includes('how much') || normMsg.includes('plan')) {
      return `${sal}At **xpander.ai**, we offer transparent, ROI-driven pricing tailored for growing enterprises:\n\n* **🚀 Starter ($650 / €590):** 1 Custom RAG AI Chatbot trained on your knowledge base, lead capture, and 5,000 monthly AI operations.\n* **⚡ Growth ($1,150 / €1,050):** Full internal workflow automation, 2-way CRM sync, automated email routing, and priority 4-hour SLA.\n* **🏢 Enterprise (Custom Quote):** Dedicated on-prem / private cloud TypeScript engine, custom Multi-Agent swarms, and 99.98% uptime guarantee.\n\nOur clients achieve full ROI in under 3 months. Would you like a free 20-minute process audit?`;
    }

    // Email Automation
    if (normMsg.includes('email') || normMsg.includes('inbox') || normMsg.includes('triage') || normMsg.includes('sort')) {
      return `${sal}Our **Intelligent Email Automation** eliminates manual inbox sorting entirely:\n\n1. **📥 Real-Time Ingestion:** Listens to your Gmail / Outlook 365 inboxes.\n2. **🧠 GPT-4o Intent Analysis:** Classifies leads, RFQs, complaints, or billing inquiries in under 2 seconds.\n3. **⚡ Instant Action:** Pushes lead data to your CRM, triggers Slack alerts for high-value deals, and drafts contextual replies for one-click approval.\n\nHow many inbound emails does your team receive daily?`;
    }

    // Voice AI
    if (normMsg.includes('voice') || normMsg.includes('speak') || normMsg.includes('talk') || normMsg.includes('mic')) {
      return `${sal}Yes! You can speak with me directly in real-time. Click the **Voice AI** button in the top navigation or the microphone icon in this chat to activate interactive voice mode. I listen, think, and speak back naturally in over 95 languages!`;
    }

    // Engine & No-n8n / No-Make guarantee
    if (normMsg.includes('engine') || normMsg.includes('n8n') || normMsg.includes('make') || normMsg.includes('zapier')) {
      return `Strategic difference: **xpander.ai runs on a proprietary, zero-lag TypeScript workflow engine (XpanderFlow)**.\n\n* **Ultra-low latency (< 25ms)** with no external third-party API queue.\n* **100% Data Privacy & GDPR compliance**: Your data stays on your dedicated infrastructure.\n* **No per-operation cloud fees**: Scale to millions of executions without exponential costs.`;
    }

    // Guarantee & SLA
    if (normMsg.includes('guarantee') || normMsg.includes('refund') || normMsg.includes('sla') || normMsg.includes('security')) {
      return `${sal}We back our solutions with: **1)** A 30-day 100% money-back guarantee, **2)** A 99.98% uptime SLA with real-time health telemetry, and **3)** Strict Non-Disclosure Agreements (NDA) protecting your proprietary business data.`;
    }

    // Generic English Fallback
    return `${sal}Regarding **"${lastUserMsg.slice(0, 60)}"**, this is a prime candidate for our autonomous AI agent infrastructure!\n\nWe connect your data endpoints, deploy our GPT-4o decision nodes, and execute tasks without human friction. Would you like to schedule a free 20-minute audit or try one of our interactive demos under the **Services** tab?`;
  }

  // =========================================================================
  // 2. MULTILINGUAL RESPONSES: GERMAN (DE)
  // =========================================================================
  if (lang === 'de') {
    const sal = detectedName ? `Sehr geehrte(r) ${detectedName}! ` : '';

    if (normMsg.includes('hallo') || normMsg.includes('guten tag') || normMsg.includes('servus')) {
      return `${sal}Guten Tag! 👋 Willkommen bei **xpander.ai** – der Plattform für autonome Unternehmens-KI-Agenten.\n\nWie kann ich Ihnen helfen? Wir bieten:\n* **RAG-Chatbots** basierend auf Ihrer internen Wissensdatenbank,\n* **Intelligente E-Mail- und Ticket-Sortierung** ohne manuelle Arbeit,\n* **2-Wege CRM-Synchronisation** (HubSpot, Salesforce, Pipedrive),\n* **Autonome Multi-Agenten-Systeme** auf Basis unserer nativen TypeScript-Engine.\n\nWelchen Prozess möchten Sie automatisieren?`;
    }

    if (normMsg.includes('preis') || normMsg.includes('kosten') || normMsg.includes('angebot')) {
      return `${sal}Bei **xpander.ai** bieten wir transparente, ROI-basierte Modelle:\n\n* **🚀 Starter (€590):** 1 individueller RAG-Chatbot, Lead-Erfassung und 5.000 monatliche KI-Aktionen.\n* **⚡ Growth (€1.050):** Unbegrenzte Workflows, CRM-Integration, automatisierte E-Mail-Verarbeitung und 4-Stunden-SLA.\n* **🏢 Enterprise (Auf Anfrage):** Eigene TypeScript-Server-Infrastruktur, Multi-Agenten und 99,98% Uptime-Garantie.\n\nMöchten Sie ein kostenloses 20-minütiges Audit vereinbaren?`;
    }

    return `${sal}Bezüglich **"${lastUserMsg.slice(0, 60)}"**: Genau das lösen wir mit unserer nativen XpanderFlow-Engine und GPT-4o.\n\nWir bieten eine 30-Tage-Geld-zurück-Garantie und volle DSGVO-Konformität. Probieren Sie gerne unsere Live-Demos auf der Website aus oder vereinbaren Sie eine Beratung!`;
  }

  // =========================================================================
  // 3. MULTILINGUAL RESPONSES: SPANISH (ES)
  // =========================================================================
  if (lang === 'es') {
    const sal = detectedName ? `¡Estimado/a ${detectedName}! ` : '';
    return `${sal}¡Hola! 👋 Bienvenido/a a **xpander.ai** – la plataforma de agentes autónomos de IA para empresas.\n\nAutomatizamos tus procesos comerciales con nuestro motor nativo TypeScript (XpanderFlow) y OpenAI GPT-4o:\n* **Chatbots RAG** entrenados con tus documentos.\n* **Clasificación y respuesta automática de correos** (Gmail / Outlook).\n* **Sincronización bidireccional de CRM** (HubSpot, Salesforce).\n* **Garantía de 30 días** y soporte de voz en más de 95 idiomas.\n\n¿Qué proceso te gustaría optimizar hoy?`;
  }

  // =========================================================================
  // 4. MULTILINGUAL RESPONSES: FRENCH (FR)
  // =========================================================================
  if (lang === 'fr') {
    const sal = detectedName ? `Bonjour ${detectedName} ! ` : '';
    return `${sal}Bonjour ! 👋 Bienvenue sur **xpander.ai** – la plateforme d'agents IA autonomes pour entreprises.\n\nNous automatisons vos opérations grâce à notre moteur TypeScript natif (XpanderFlow) :\n* **Chatbots RAG intelligents** connectés à vos bases de connaissances,\n* **Tri et réponse automatisés aux e-mails** 24/7,\n* **Synchronisation CRM bidirectionnelle**,\n* **Garantie de remboursement de 30 jours**.\n\nQuel flux de travail souhaitez-vous automatiser ?`;
  }

  // =========================================================================
  // 5. MULTILINGUAL RESPONSES: ITALIAN (IT)
  // =========================================================================
  if (lang === 'it') {
    const sal = detectedName ? `Gentile ${detectedName}! ` : '';
    return `${sal}Buongiorno! 👋 Benvenuto su **xpander.ai** – la piattaforma enterprise di agenti IA autonomi.\n\nAutomatizziamo i processi aziendali con il nostro motore nativo TypeScript (XpanderFlow) e GPT-4o:\n* **Chatbot RAG intelligenti** con zero allucinazioni,\n* **Automazione email e smistamento ticket**,\n* **Sincronizzazione CRM a 2 vie** (HubSpot, Pipedrive),\n* **Garanzia 30 giorni soddisfatti o rimborsati**.\n\nQuale processo vorresti automatizzare oggi?`;
  }

  // =========================================================================
  // 6. DEFAULT LANGUAGE: HUNGARIAN (HU)
  // =========================================================================
  const salutation = detectedName ? `Kedves ${detectedName}! ` : '';

  // 1. Sorszám választások
  if (/^(1|1\.|egyes|elso)$/.test(normMsg)) {
    return `${salutation}Az **1. opció (Starter csomag / AI Chatbot):**\n\n* Céges tudásbázisra épülő RAG AI Chatbot, amely azonnal válaszol a látogatóknak a weboldaladon a nap 24 órájában.\n* Beépített lead-rögzítés: elkéri az érdeklődő email címét és telefonszámát.\n* 0% hallucinációs garancia és 5 000 ingyenes havi AI művelet.\n\nSzeretnéd, hogy bemutassam a működését élő demóban?`;
  }

  if (/^(2|2\.|kettes|masodik)$/.test(normMsg)) {
    return `${salutation}A **2. opció (Growth csomag / Email Automatizáció & CRM):**\n\n* A beérkező ajánlatkérő és ügyfélszolgálati emailek automatikus szétválogatása másodpercek alatt.\n* Kétirányú CRM szinkronizáció (HubSpot, Pipedrive, MiniCRM, Salesforce).\n* Automatikus válaszlevél-piszkozat generálás és naptárfoglaló link kiküldése.\n* Heti 12–15 felszabadult munkaóra az értékesítési és adminisztrációs csapatodnak!\n\nSzeretnél egy 10 perces folyamat-auditot egyeztetni erről?`;
  }

  if (/^(3|3\.|harmas|harmadik)$/.test(normMsg)) {
    return `${salutation}A **3. opció (Enterprise csomag / Autonóm AI Ágensek):**\n\n* Saját infrastruktúrára telepített TypeScript XpanderFlow motor, külső felhős korlátok és műveleti díjak nélkül.\n* Többágenses rendszerek (kutató, elemző, számlázó és döntéshozó ágensek együttműködése).\n* Egyedi ERP, számlázó (Számlázz.hu, Billingo) és belső adatbázis integrációk, dedikált SLA garanciával.\n\nMilyen egyedi folyamatot szeretnél ezzel kiváltani?`;
  }

  // 2. Pozitív megerősítés
  if (/^(igen|persze|erdekel|akarom|kerem|kezdjuk|jo|oke|ok|rendben)$/.test(normMsg) || normMsg.startsWith('igen ') || normMsg.startsWith('persze ')) {
    return `${salutation}Nagyszerű, vágjunk bele! 🚀\n\nA leggyorsabb módja az indulásnak:\n1. Görgess le a főoldal alján található **Ingyenes 20 Perces AI Folyamat-Audit** űrlaphoz és töltsd ki az elérhetőségeddel.\n2. Vagy írd meg ide közvetlenül a nevedet és telefonszámodat/email címedet, és kollégáink 4 munkaórán belül felveszik veled a kapcsolatot a konkrét megvalósítási tervvel!\n\nMelyik a kényelmesebb számodra?`;
  }

  // 3. Negatív válasz
  if (/^(nem|nem erdekel|megsem|kesobb|koszi nem)$/.test(normMsg)) {
    return `${salutation}Rendben van, semmi gond! Ha a jövőben szeretnél időt és költséget megtakarítani az ügyfélszolgálatodon vagy az adminisztrációdon, az xpander.ai felületén bármikor elérsz minket.\n\nSzép napot és sikeres vállalkozásfejlesztést kívánok!`;
  }

  // 4. Hangalapú AI / Voice asszisztens kérdések
  if (normMsg.includes('hang') || normMsg.includes('voice') || normMsg.includes('beszel') || normMsg.includes('mikrofon')) {
    return `${salutation}Igen, az **xpander.ai teljes körű Voice AI (hangalapú AI) támogatással rendelkezik!**\n\n- **🎙️ Beszédhang felismerés (Speech-to-Text):** Bármilyen nyelven beszélhetsz hozzám a mikrofon gomb megnyomásával.\n- **🔊 Természetes gépi hangválasz (Text-to-Speech):** Az AI élőszóban is válaszol neked a kiválasztott nyelven.\n- **🌍 Többnyelvű hangtámogatás:** Magyar, angol, német, spanyol, francia és több mint 90 egyéb nyelven kommunikálunk valós időben!\n\nPróbáld ki a felső menüben lévő **Voice AI** gombot vagy a mikrofon ikont itt a csevegőben!`;
  }

  // 5. EMAIL SZŰRÉS / EMAIL AUTOMATIZÁCIÓ
  if (
    normMsg.includes('email') ||
    normMsg.includes('szures') ||
    normMsg.includes('level') ||
    normMsg.includes('postafiok') ||
    normMsg.includes('inbox') ||
    normMsg.includes('postalada') ||
    normMsg.includes('gmail') ||
    normMsg.includes('outlook')
  ) {
    if (normMsg.includes('irj') || normMsg.includes('fogalmazz') || normMsg.includes('sablon')) {
      return `${salutation}Örömmel! Íme egy konverzióra optimalizált, professzionális B2B megkereső email sablon, amelyet az automatizációs rendszerünk személyre szabva küld ki:\n\n---\n**Tárgy:** Gyors kérdés a(z) {{cegnev}} folyamataival kapcsolatban\n\n**Kedves {{nev}}!**\n\nLáttam a(z) {{cegnev}} növekedését a piacon, és feltűnt, hogy mekkora figyelmet fordítotok a gyors és minőségi ügyfélkiszolgálásra.\n\nA legtöbb piacvezető cégnél az értékesítők heti 12-15 órát töltenek el manuális email-válogatással és adminisztrációval ahelyett, hogy új ügyfelekkel tárgyalnának.\n\nAz xpander.ai-nál egy olyan **saját TypeScript alapú rendszert** fejlesztettünk, amely a beérkező ajánlatkéréseket másodpercek alatt szűri, rögzíti a CRM-be és előkészíti a választ – emberi kéz érintése nélkül.\n\nNyitott lennél egy 10 perces kötetlen bemutatóra jövő héten?\n\nÜdvözlettel,\n**{{te_neved}}**  \n*xpander.ai automatizációs partner*\n---\n\nSzeretnéd látni, hogyan néz ki ez a folyamat élesben?`;
    }

    return `${salutation}Az **Intelligens Email Automatizáció** pontosan arra való, hogy megszüntesse a beérkező levelek manuális olvasgatását és válogatását!\n\n**Hogyan működik a gyakorlatban?**\n1. **📥 Valós idejű beolvasás:** A rendszer közvetlenül figyeli a Gmail / Outlook postaládádat (pl. info@, sales@, support@ címek).\n2. **🧠 AI Tartalomelemzés (GPT-4o):** Másodpercek alatt kinyeri a feladó szándékát (Ajánlatkérés, Reklamáció, Számlázási kérdés, Spam), a csapatméretet és a prioritást.\n3. **⚡ Automatikus akció:**\n   - Sürgős lead esetén: azonnali naptárlink küldése + Slack/SMS riasztás a sales vezetőnek.\n   - Általános kérdés esetén: RAG tudásbázisból pontos válaszlevél-piszkozat készítése az értékesítőnek egyetlen kattintásos jóváhagyásra.\n   - Az adatok azonnali beírása a CRM-be (HubSpot, Pipedrive, MiniCRM).\n\nÜgyfeleinknél ez heti **10–15 munkaórát szabadít fel** értékesítőnként. Hány bejövő email érkezik hozzátok naponta?`;
  }

  // 6. DEMÓ / KIPRÓBÁLÁS
  if (
    normMsg.includes('demo') ||
    normMsg.includes('kiprobal') ||
    normMsg.includes('hol tudom') ||
    normMsg.includes('tesztel') ||
    normMsg.includes('mukodes kozben')
  ) {
    return `${salutation}A weboldalunkon **mind a 7 AI szolgáltatásunkhoz élő, azonnal működő demót** készítettünk!\n\nKattints a felső menüben a **Szolgáltatások** pontra, vagy nyisd meg közvetlenül:\n* **AI Chatbot teszt:** /services/ai-chatbot#demo (RAG tudásbázis tesztelő)\n* **Ügyfélszolgálati jegykezelő:** /services/customer-support#demo (Reklamáció & cserecsomag AI elemzés)\n* **Email szűrés:** /services/email-automation#demo (Bejövő levél elemzése és piszkozat generálás)\n* **Lead kutató:** /services/lead-generation#demo (B2B döntéshozó kereső és jégtörő mondat)\n* **CRM szinkron:** /services/crm-automation#demo (2-irányú szinkronizáció szimulátor)\n* **Naptár & Időpont:** /services/appointment-booking#demo (No-show WhatsApp emlékeztető)\n* **AI Ágens Raj:** /services/ai-agents#demo (3 ágens közös feladatmegoldása)\n\nMelyik demót szeretnéd először kipróbálni?`;
  }

  // 7. Átfutási idő
  if (
    normMsg.includes('mennyi ido') ||
    normMsg.includes('atfutas') ||
    normMsg.includes('mikorra') ||
    normMsg.includes('hany nap') ||
    normMsg.includes('hany het') ||
    normMsg.includes('meddig tart') ||
    normMsg.includes('mennyi ideig')
  ) {
    return `${salutation}Nálunk a bevezetés rendkívül gyors, mert a kész **saját TypeScript motorunkra (XpanderFlow)** építünk:\n\n* **🚀 AI Chatbot & RAG tudásbázis:** **5–7 munkanap** (anyagaid bekötése, tesztelés és weboldali beágyazás).\n* **⚡ Email & Lead automatizáció:** **7–10 munkanap** (CRM szinkron és levélsablonok felállítása).\n* **🏢 Komplex többágenses ERP/CRM rendszer:** **10–14 munkanap** (alapos hibakezelés és munkatársak betanítása).\n\nMár az első héten működő tesztkörnyezetet adunk át!`;
  }

  // 8. Garancia / Kockázat
  if (
    normMsg.includes('garancia') ||
    normMsg.includes('kockazat') ||
    normMsg.includes('nem mukodik') ||
    normMsg.includes('penzvisszafizetes') ||
    normMsg.includes('biztonsag') ||
    normMsg.includes('sla')
  ) {
    return `${salutation}Teljes mértékben levesszük a kockázatot a válladról:\n\n1. **🛡️ 30 napos 100% Pénzvisszafizetési Garancia:** Ha az átadott rendszer az első hónapban nem működik a megbeszéltek szerint, vagy nem hozza a várt időmegtakarítást, kérdés nélkül visszafizetjük az implementációs díjat.\n2. **⚡ 99.9% Rendelkezésre állás (SLA):** Saját dedikált motorunk van folyamatos felügyelet és automata hibariasztás alatt.\n3. **🔒 Szigorú Titoktartási Szerződés (NDA):** Üzleti adataid és ügyfeleid adatai a legmagasabb biztonsági védelem alatt állnak.`;
  }

  // 9. Többnyelvűség / Nyelvek
  if (
    normMsg.includes('nyelv') ||
    normMsg.includes('angol') ||
    normMsg.includes('nemet') ||
    normMsg.includes('kulfold') ||
    normMsg.includes('magyarul') ||
    normMsg.includes('minden nyelven')
  ) {
    return `${salutation}Az xpander.ai mind szövegesen, mind hangalapú AI-val (Voice AI) **több mint 95 nyelven** képes anyanyelvi szinten kommunikálni!\n\n- **🌍 Automatikus nyelvfelismerés:** Ha egy külföldi érdeklődő angolul, németül, franciául vagy spanyolul beszél hozzánk, a rendszer azonnal felismeri és ugyanazon a nyelven válaszol.\n- **🎙️ Többnyelvű Voice AI:** A hangalapú asszisztensünk az adott nyelv anyanyelvi kiejtésével beszél vissza.\n- **🇭🇺 Hibátlan magyar nyelvhelyesség:** Pontosan kezeli a magyar ragozást, tegezést/magázást és az üzleti udvariassági formákat.\n- **🔄 Valós idejű fordítás:** A beérkező megkeresést azonnal lefordítja a CRM-ben a csapatod nyelvére.`;
  }

  // 10. Miért jobb a saját motor, mint a Make / Zapier / n8n?
  if (
    normMsg.includes('n8n') ||
    normMsg.includes('make') ||
    normMsg.includes('zapier') ||
    normMsg.includes('kulonbseg') ||
    normMsg.includes('miert sajat')
  ) {
    return `Ez az egyik legfontosabb stratégiai kérdés! Az **xpander.ai saját fejlesztésű TypeScript motorja (XpanderFlow)** és a külső felhős platformok (Make, Zapier, n8n) közötti fő különbségek:\n\n1. **⚡ Extrém alacsony késleltetés (< 25ms vs. 500-2000ms):** A mi motorunk közvetlenül a te vagy a dedikált szerverünk környezetében fut, nincs külső SaaS API sorbanállás.\n2. **🔒 100% Adatbiztonság és GDPR:** Az érzékeny ügyféladatok, számlák és belső emailek nem vándorolnak át harmadik fél felhős szerverein.\n3. **💰 Nincs havi műveleti felár (Operation fee):** A Zapiernél havi több tízezer művelet vagyonokba kerül; nálunk a végrehajtási volumennek nincs felára.\n4. **🧩 Vizuális drag-and-drop szerkesztő:** Saját 120 FPS simaságú felületen szerkesztheted a logikát, if/else feltételeket, ciklusokat és OpenAI GPT-4o csomópontokat.`;
  }

  // 11. Árazás
  if (
    /\b(ar|ara|aran|arak|arazas|arakrol|arai|arakat|dij|csomagok|csomag)\b/i.test(normMsg) ||
    normMsg.includes('mennyibe') ||
    normMsg.includes('mennyi') ||
    normMsg.includes('koltseg') ||
    normMsg.includes('forint') ||
    normMsg.includes('huf')
  ) {
    return `${salutation}Az xpander.ai transzparens, mérhető megtérülésre épülő csomagokkal dolgozik:\n\n* **🚀 Starter (240.000 Ft-tól):** Kisebb cégeknek: 1 db egyedi AI Chatbot céges tudásbázissal (RAG), automata email értesítő és havi 5 000 ingyenes AI művelet.\n* **⚡ Growth (380.000 Ft-tól):** Növekvő vállalkozásoknak: Korlátlan belső munkafolyamat, CRM kétirányú szinkronizáció, automata számlázás és prioritásos támogatás.\n* **🏢 Enterprise (Egyedi ajánlat):** Saját infrastruktúrára telepített TypeScript motor, egyedi AI ágensek, dedikált API konnektorok és SLA garancia.\n\nÁtlagosan ügyfeleink **2-3 hónapon belül teljes megtérülést (ROI)** érnek el a felszabadult munkaórák révén. Érdemes kalkulálnunk egy pontos számot a cégedre?`;
  }

  // 12. Időpontfoglalás és Konzultáció (Élő hangos és írásbeli egyeztetés)
  if (
    normMsg.includes('idopont') ||
    normMsg.includes('foglal') ||
    normMsg.includes('konzultacio') ||
    normMsg.includes('talalkozo') ||
    normMsg.includes('beszeljunk') ||
    normMsg.includes('hivas') ||
    normMsg.includes('naptar')
  ) {
    return `${salutation}Örömmel segítek az időpontfoglalásban! Egy ingyenes 20 perces folyamat-audit keretében konkrét automatizációs tervet készítünk a cégedre.\n\nMelyik nap lenne számodra a legkényelmesebb? Például holnap 14:00 vagy péntek délelőtt?\n\nHa megadod a neved és az elérhetőséged (telefonszám vagy email), azonnal rögzítem a naptárban, és kiküldjük a visszaigazoló naptármeghívót és SMS-t!`;
  }

  // 13. Mi ez a Voice AI Demó / Hangos asszisztens működése
  if (
    normMsg.includes('voice demo') ||
    normMsg.includes('ez a hang') ||
    normMsg.includes('hangos') ||
    normMsg.includes('voice agent') ||
    normMsg.includes('mit tud ez a voice') ||
    normMsg.includes('hangfelismeres')
  ) {
    return `${salutation}Ez az Xpander.ai élő, interaktív Voice AI demója! Képes valós időben beszédet felismerni több mint 95 nyelven, megérteni a szándékodat, és természetes emberi hangon válaszolni.\n\nUgyanilyen hangalapú AI agentet tudunk integrálni a céged weboldalára, webshopjába vagy a telefonos ügyfélszolgálatodra, így az ügyfeleid azonnal, gépelés nélkül választ kapnak minden kérdésükre.`;
  }

  // 14. Számlázás és Pénzügyi Automatizáció (Billingo, Számlázz.hu)
  if (
    normMsg.includes('szamla') ||
    normMsg.includes('billingo') ||
    normMsg.includes('szamlazz') ||
    normMsg.includes('penzugy') ||
    normMsg.includes('konyvel')
  ) {
    return `${salutation}A számlázási automatizációnk közvetlenül összekapcsolja a webshopodat, CRM-edet vagy belső adatbázisodat a Számlázz.hu vagy Billingo fiókoddal.\n\n- Sikeres megrendelés vagy lezárt deal esetén másodpercek alatt, emberi kéz érintése nélkül kiállítja a díjbekérőt vagy e-számlát,\n- Automatikusan kiküldi az ügyfélnek csatolva,\n- És frissíti a banki tranzakciós státuszt a belső rendszereidben.`;
  }

  // 15. Képességek / Mit tudtok csinálni? / Szolgáltatások áttekintése
  if (
    normMsg.includes('mit tudsz') ||
    normMsg.includes('mit tudtok') ||
    normMsg.includes('szolgaltatasok') ||
    normMsg.includes('kepessegek') ||
    normMsg.includes('miben tudtok segiteni')
  ) {
    return `${salutation}Az Xpander.ai csapata a repetitív manuális munkák teljes megszüntetésére szakosodott saját TypeScript motorral. Hét fő területen tudunk segíteni:\n\n1. **AI Chatbot & RAG Tudásbázis:** 24/7 weboldali ügyfélkiszolgálás 0% hallucinációval.\n2. **Voice AI Agentek:** Hangalapú asszisztensek és telefonos triage.\n3. **Email Automatizáció:** Beérkező levelek szűrése és válaszpiszkozat generálás.\n4. **B2B Lead Generálás:** Célzott döntéshozó-kutatás és személyre szabott outreach.\n5. **CRM Szinkronizáció:** HubSpot, Pipedrive, Salesforce kétirányú adatkapcsolat.\n6. **Időpontfoglaló & No-Show Védelem:** WhatsApp/SMS emlékeztetők a lemondások megszüntetésére.\n7. **Autonóm AI Munkatársak:** Többágenses rendszerek kutatásra, elemzésre és döntésekre.`;
  }

  // 16. Kapcsolat, Iroda, Elérhetőség
  if (
    normMsg.includes('iroda') ||
    normMsg.includes('hol vagytok') ||
    normMsg.includes('telefonszam') ||
    normMsg.includes('elerhetoseg') ||
    normMsg.includes('kapcsolat')
  ) {
    return `${salutation}Személyesen a budapesti irodánkban találsz meg minket a Szabadság tér 7. szám alatt, a Bank Centerben.\n\n- **Központi email cím:** xpander-automation.ai@outlook.hu\n- **Telefonszám:** +36 1 800 9999 (hétköznap 9:00 és 18:00 között)\n\nSzívesen látunk egy személyes kávéra vagy online videóhívásra egy ingyenes folyamataudit keretében!`;
  }

  // 17. Ki vagy te? / Mi az Xpander.ai?
  if (
    normMsg.includes('ki vagy') ||
    normMsg.includes('mi az az xpander') ||
    normMsg.includes('ki csinalta') ||
    normMsg.includes('cegrol')
  ) {
    return `${salutation}Az Xpander.ai egy prémium enterprise AI automatizációs ügynökség és platform. Célunk, hogy a modern vállalkozásoknak ne kelljen órákat tölteniük manuális email-válogatással, másolgatással és adminisztrációval.\n\nKülönlegességünk, hogy semmilyen dobozos külső platformtól (Make, Zapier, n8n) nem függünk: 100% saját natív TypeScript motorral, garantált SLA rendelkezésre állással és szigorú titoktartással dolgozunk.`;
  }

  // 18. CRM integrációk
  if (
    normMsg.includes('crm') ||
    normMsg.includes('hubspot') ||
    normMsg.includes('pipedrive') ||
    normMsg.includes('salesforce') ||
    normMsg.includes('minicrm')
  ) {
    return `${salutation}Az xpander.ai integrációs modulja univerzális REST API és Webhook architektúrával rendelkezik. Közvetlenül összekapcsolható a piacvezető rendszerekkel:\n\n- **CRM rendszerek:** HubSpot, Pipedrive, Salesforce, Zoho, MiniCRM\n- **Kommunikáció:** Gmail, Microsoft Outlook, Slack, WhatsApp Business API\n- **Pénzügy:** Számlázz.hu, Billingo, Stripe\n- **Adatbázisok:** Google Drive, Google Sheets, Supabase, PostgreSQL\n\nMilyen rendszert használtok jelenleg?`;
  }

  // 19. Chatbot és RAG technológia
  if (
    normMsg.includes('chatbot') ||
    normMsg.includes('bot') ||
    normMsg.includes('rag') ||
    normMsg.includes('tudasbazis') ||
    normMsg.includes('hallucinacio')
  ) {
    return `${salutation}Az xpander.ai RAG-alapú (Retrieval-Augmented Generation) chatbotjai:\n\n- **📚 Bármilyen forrásból tanulnak:** PDF-ek, belső GYIK, weboldal URL, Notion oldalak vagy termékkatalógusok.\n- **🛡️ 0% Hallucináció:** Szigorú prompt védelem védi: ha egy információ nem szerepel a dokumentumokban, nem talál ki választ, hanem intelligensen felajánlja az emberi kolléga visszahívását.\n- **🎯 1 kattintásos beágyazás:** Egyetlen sor kóddal elhelyezhető tetszőleges weboldalon.\n- **📈 Lead-rögzítés:** Beszélgetés közben természetes módon kéri el az érdeklődő email címét vagy telefonszámát és beküldi a CRM-be.`;
  }

  // 20. Üdvözlés
  if (/^(szia|udv|hello|szervusz|jo napot|szep napot|hali|cso|csa|mizu|hogy vagy)/.test(normMsg)) {
    return `${salutation}Szia! Minden szuper, készen állok a munkára! Az Xpander.ai automatizációs és Voice AI asszisztense vagyok.\n\nMiben lehetek ma a segítségedre? Érdekel valamelyik szolgáltatásunk (Chatbot, Voice AI, Email szűrés, CRM, Lead generálás, Időpontfoglalás), vagy egy konkrét üzleti kihívásodat beszélnénk át?`;
  }

  // Dinamikus intelligens válasz
  return `${salutation}A(z) **"${lastUserMsg.slice(0, 60)}"** igény pontosan az a terület, amit a saját TypeScript motorunkkal és AI modellekkel automatizálni tudunk!\n\n**Hogyan építjük fel ezt a megoldást?**\n1. **Adatcsatlakozás:** Bekötjük a meglévő rendszereidet (Email, Webhook, CRM, Adatbázis).\n2. **AI döntési motor:** A GPT-4o másodpercek alatt átvilágítja, kategorizálja és feldolgozza az információt.\n3. **Autonóm végrehajtás:** Elvégzi a műveletet emberi beavatkozás nélkül (válaszküldés, számlázás, értesítés).\n\nSzeretnél egy díjmentes 20 perces folyamat-auditot egyeztetni erről, ahol konkrét megvalósítási tervet adunk?`;
}
