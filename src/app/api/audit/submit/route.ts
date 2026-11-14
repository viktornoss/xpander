import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { dispatchEmail, MASTER_NOTIFICATION_EMAIL } from '@/lib/email/dispatcher';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      companyName,
      website,
      industry,
      teamSize,
      painPoints = [],
      tools = [],
      manualHoursPerWeek = 15,
      hourlyWage = 4500,
      primaryGoal,
      clientName,
      clientEmail,
      clientPhone
    } = body;

    // 1. Calculate Audit Metrics
    const weeklyHoursSaved = Math.round(manualHoursPerWeek * 0.72);
    const annualHoursSaved = weeklyHoursSaved * 50;
    const annualMoneySaved = annualHoursSaved * hourlyWage;
    const monthlyMoneySaved = Math.round(annualMoneySaved / 12);
    
    // Dynamic score calculation
    let calculatedScore = 75;
    if (painPoints.length >= 3) calculatedScore += 12;
    if (manualHoursPerWeek >= 20) calculatedScore += 8;
    if (tools.length >= 3) calculatedScore += 4;
    const automationScore = Math.min(98, calculatedScore);

    const auditId = `AUDIT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // 2. Determine Industry-Specific Blueprints
    const blueprints = [
      {
        title: 'Autonóm Lead & Ajánlatkérő Triage Ügynök',
        trigger: 'Új beérkező email / űrlapkitöltés',
        actions: [
          'Email tartalmának és mellékleteinek szemantikai elemzése GPT-4o-val',
          'Lead minősítése és automata rögzítése CRM-be (HubSpot / MiniCRM)',
          'Személyre szabott B2B ajánlattervezet azonnali összeállítása < 2 perc alatt'
        ],
        timeSaved: 'Heti 6-10 óra',
        impact: 'Azonnali válaszidő, 0 elveszített érdeklődő'
      },
      {
        title: 'Kétirányú Számlázási & Pénzügyi Szinkron Motor',
        trigger: 'Megrendelés jóváhagyása vagy naptári esemény lezárása',
        actions: [
          'Díjbekérő vagy számla automatikus kiállítása (Billingo / Számlázz.hu)',
          'Fizetési link továbbítása az ügyfélnek SMS / Emailben',
          'Banki jóváírás észlelésekor státuszfrissítés és értesítés a csapatnak'
        ],
        timeSaved: 'Heti 4-8 óra',
        impact: '100%-ban megszűnő manuális adatmásolás és adminisztráció'
      },
      {
        title: '24/7 Céged Tudásbázisára Tanított RAG Ügyfélszolgálati Bot',
        trigger: 'Weboldal látogató vagy meglévő ügyfél kérdést tesz fel',
        actions: [
          'Céges PDF-ek, árlisták és korábbi GYIK azonnali átkutatása',
          'Pontos, megbízható magyar nyelvű válaszadás hallucinációk nélkül',
          'Szükség esetén automatikus naptár-időpontfoglalás a szakértődhöz'
        ],
        timeSaved: 'Heti 8-15 óra',
        impact: 'Éjjel-nappal elérhető prémium kiszolgálás'
      }
    ];

    // 3. Dispatch Email Notification if Contact Info Provided
    let previewUrl: string | null = null;
    let emailSent = false;

    if (clientEmail || clientName) {
      const subject = `🚀 [XPANDER.AI AUDIT RIPORT] ${companyName || clientName} (${automationScore}% AI Potenciál - ${auditId})`;

      const textContent = `
XPANDER.AI - HIVATALOS VÁLLALATI AI FOLYAMAT-AUDIT RIPORT
Azonosító: ${auditId}
Időpont: ${new Date().toLocaleString('hu-HU')}

1. VÁLLALATI PROFIL:
- Cégnév: ${companyName || 'N/A'}
- Weboldal: ${website || 'N/A'}
- Iparág: ${industry || 'Általános'}
- Csapatméret: ${teamSize || '1-5 fő'}
- Kapcsolattartó: ${clientName || 'N/A'}
- Email cím: ${clientEmail || 'N/A'}
- Telefonszám: ${clientPhone || 'N/A'}

2. DIAGNOSZTIKAI EREDMÉNYEK:
- Automatizálási Index (Score): ${automationScore} / 100 [KIEMELKEDŐ]
- Heti manuális órák jelenleg: ${manualHoursPerWeek} óra / hét
- Becsült megtakarított idő: ${weeklyHoursSaved} óra / hét (${annualHoursSaved} óra / év)
- Becsült megtakarított bérköltség: ${annualMoneySaved.toLocaleString('hu-HU')} Ft / év (~${monthlyMoneySaved.toLocaleString('hu-HU')} Ft / hó)
- Jelenleg használt eszközök: ${tools.join(', ') || 'Általános'}
- Legfőbb szűk keresztmetszetek:
${painPoints.map((p: string) => `  * ${p}`).join('\n')}

3. JAVASOLT TECHNOLÓGIA:
- XpanderFlow Natív TypeScript Motor (0 Make/n8n felhőfüggőség)
- 99.98% SLA Üzemidő Garancia
- Várható élesbe állási idő: 1-2 hét

---
Központi másolat továbbítva a(z) ${MASTER_NOTIFICATION_EMAIL} címre.
      `.trim();

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #000000; color: #ffffff; padding: 32px; border-radius: 16px; max-width: 650px; border: 1px solid rgba(255,255,255,0.15);">
          <div style="border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 16px; margin-bottom: 24px;">
            <span style="font-family: monospace; font-size: 11px; letter-spacing: 2px; color: #a1a1aa; text-transform: uppercase;">Xpander.ai Enterprise Automation Platform</span>
            <h1 style="color: #ffffff; margin: 6px 0 0 0; font-size: 24px; font-weight: 900;">Vállalati AI Folyamat-Audit Riport</h1>
            <p style="color: #71717a; font-size: 12px; margin: 4px 0 0 0;">Audit Azonosító: <strong>${auditId}</strong> • Kelt: ${new Date().toLocaleString('hu-HU')}</p>
          </div>

          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 11px; color: #a1a1aa; text-transform: uppercase; font-weight: bold;">Automatizálási Potenciál Index</span>
                <div style="font-size: 36px; font-weight: 900; color: #ffffff; font-family: monospace;">${automationScore} <span style="font-size: 18px; color: #71717a;">/ 100</span></div>
              </div>
              <div style="text-align: right;">
                <span style="background: #ffffff; color: #000000; font-weight: 900; font-size: 11px; padding: 4px 10px; border-radius: 9999px;">Kiemelkedő Megtérülés</span>
              </div>
            </div>

            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <div style="font-size: 11px; color: #a1a1aa;">Becsült Heti Időmegtakarítás:</div>
                <div style="font-size: 18px; font-weight: bold; color: #ffffff;">${weeklyHoursSaved} óra / hét</div>
              </div>
              <div>
                <div style="font-size: 11px; color: #a1a1aa;">Becsült Éves Költségmegtakarítás:</div>
                <div style="font-size: 18px; font-weight: bold; color: #ffffff;">${annualMoneySaved.toLocaleString('hu-HU')} Ft / év</div>
              </div>
            </div>
          </div>

          <h3 style="color: #ffffff; font-size: 15px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">Ügyfél & Vállalati Adatok</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
            <tr><td style="padding: 6px 0; color: #a1a1aa; width: 140px;">Cégnév:</td><td style="color: #ffffff; font-weight: bold;">${companyName || '-'}</td></tr>
            <tr><td style="padding: 6px 0; color: #a1a1aa;">Iparág / Méret:</td><td style="color: #ffffff;">${industry} (${teamSize})</td></tr>
            <tr><td style="padding: 6px 0; color: #a1a1aa;">Kapcsolattartó:</td><td style="color: #ffffff; font-weight: bold;">${clientName || '-'}</td></tr>
            <tr><td style="padding: 6px 0; color: #a1a1aa;">Email:</td><td style="color: #ffffff;"><a href="mailto:${clientEmail}" style="color: #ffffff; text-decoration: underline;">${clientEmail || '-'}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #a1a1aa;">Telefonszám:</td><td style="color: #ffffff;">${clientPhone || '-'}</td></tr>
          </table>

          <h3 style="color: #ffffff; font-size: 15px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">Azonosított Fájópontok</h3>
          <ul style="color: #d4d4d8; font-size: 13px; line-height: 1.6; padding-left: 20px; margin-bottom: 24px;">
            ${painPoints.map((p: string) => `<li>${p}</li>`).join('')}
          </ul>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 13px;">Technológiai Jellemzők:</h4>
            <p style="margin: 0; font-size: 12px; color: #a1a1aa; line-height: 1.5;">
              • 100% saját XpanderFlow natív TypeScript motor (ZÉRÓ külső Make.com vagy n8n függőség).<br/>
              • 99.98% rendelkezésre állás (SLA) és 30 napos pénzvisszafizetési garancia.<br/>
              • GDPR és EU adatközpont kompatibilitás.
            </p>
          </div>

          <div style="text-align: center; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="font-size: 11px; color: #71717a; margin: 0;">
              Értesítés továbbítva a központi adminisztrátornak: <strong>${MASTER_NOTIFICATION_EMAIL}</strong>
            </p>
          </div>
        </div>
      `;

      // 3.1 Send to central administrator
      try {
        await dispatchEmail({
          type: 'order_created',
          subject,
          htmlContent,
          textContent,
          metadata: {
            auditId,
            companyName,
            clientName,
            clientEmail,
            clientPhone,
            industry,
            automationScore,
            annualMoneySaved
          }
        });
        emailSent = true;
      } catch (err) {
        console.error('[AUDIT API] Admin email dispatch failed:', err);
      }

      // 3.2 Create Ethereal preview link
      try {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });

        const info = await transporter.sendMail({
          from: '"Xpander.ai Folyamat-Audit" <audit@xpander.ai>',
          to: clientEmail || MASTER_NOTIFICATION_EMAIL,
          subject,
          text: textContent,
          html: htmlContent
        });

        previewUrl = nodemailer.getTestMessageUrl(info) || null;
      } catch (e) {
        console.warn('[AUDIT API] Ethereal preview generation skipped:', e);
      }
    }

    return NextResponse.json({
      success: true,
      auditId,
      metrics: {
        automationScore,
        weeklyHoursSaved,
        annualHoursSaved,
        monthlyMoneySaved,
        annualMoneySaved,
        roiWeeks: '3 - 5 hét'
      },
      blueprints,
      emailSent,
      previewUrl
    });

  } catch (error: any) {
    console.error('[AUDIT API ERROR]:', error);
    return NextResponse.json(
      { error: 'Nem sikerült az audit riport feldolgozása.', details: error.message },
      { status: 500 }
    );
  }
}

