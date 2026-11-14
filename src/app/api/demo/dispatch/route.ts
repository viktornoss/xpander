import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { dispatchEmail, MASTER_NOTIFICATION_EMAIL } from '@/lib/email/dispatcher';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, userEmail, userPhone, payload } = body;

    const timestamp = new Date().toLocaleString('hu-HU');
    const trackingId = `DEMO_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 1. APPOINTMENT BOOKING DEMO DISPATCH
    if (type === 'appointment') {
      const { slot = 'Holnap 14:00', clientName = 'Teszt Felhasználó' } = payload || {};
      const subject = `[Zentrion.ai Időpontfoglaló] Sikeres Foglalás Megerősítése: ${slot}`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #ffffff; padding: 28px; border-radius: 16px; border: 1px solid #27272a;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900;">Zentrion.ai</h1>
            <p style="color: #06b6d4; font-size: 13px; font-weight: bold; margin-top: 4px; text-transform: uppercase;">Automatikus Időpont-Megerősítő & No-Show Védelem</p>
          </div>
          
          <div style="background: #18181b; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #10b981;">
            <p style="margin: 0; font-size: 14px; color: #d4d4d8;">Kedves <strong>${clientName}</strong>!</p>
            <p style="margin: 8px 0 0 0; font-size: 16px; color: #ffffff;">Az időpontod sikeresen lefoglalásra került az Zentrion.ai rendszerében:</p>
            <div style="background: #27272a; padding: 14px; border-radius: 8px; margin-top: 12px; font-size: 20px; font-weight: bold; color: #10b981; text-align: center;">
              📅 ${slot}
            </div>
          </div>

          <div style="background: #18181b; padding: 16px; border-radius: 12px; font-size: 13px; color: #a1a1aa; margin-bottom: 20px; border: 1px solid #27272a;">
            <strong style="color: #ffffff; display: block; margin-bottom: 8px; font-size: 14px;">📱 SMS & WhatsApp Értesítő adatai:</strong>
            <p style="margin: 0;">Címzett telefonszám: <strong style="color: #ffffff;">${userPhone || '+36 30 123 4567'}</strong></p>
            <p style="margin: 6px 0 0 0;">SMS Gateway: <span style="color: #10b981; font-weight: bold;">Telekom / Vodafone / Yettel HU (200 OK - KÉZBESÍTVE)</span></p>
            <p style="margin: 6px 0 0 0;">Tranzakció azonosító: <code>${trackingId}</code></p>
          </div>

          <div style="background: #27272a; padding: 12px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <span style="color: #38bdf8; font-size: 13px; font-weight: bold;">Helyszín:</span>
            <span style="color: #e4e4e7; font-size: 13px;"> Online Google Meet / Teams vagy 1054 Budapest, Szabadság tér 7.</span>
          </div>

          <p style="font-size: 11px; color: #71717a; text-align: center; margin: 0;">
            Ez a levél az Zentrion.ai élő időpontfoglaló rendszeréből került kiküldésre.
          </p>
        </div>
      `;

      const textContent = `
Zentrion.ai Időpont-Foglaló Megerősítés
Időpont: ${slot}
Név: ${clientName}
Telefonszám: ${userPhone || '+36 30 123 4567'}
Email: ${userEmail || 'Tesztelő'}
Azonosító: ${trackingId}
Időpont: ${timestamp}
Helyszín: Online vagy 1054 Budapest, Szabadság tér 7.
      `.trim();

      // Dispatch to Master Email & Central Notification buffer
      await dispatchEmail({
        type: 'contact_inquiry',
        subject,
        htmlContent,
        textContent,
        metadata: {
          demoType: 'appointment_booking',
          slot,
          userPhone: userPhone || '+36 30 123 4567',
          userEmail: userEmail || 'Tesztelő',
          trackingId
        }
      });

      // 1. Generate live web email preview via Nodemailer Ethereal
      let previewUrl: string | null = null;
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

        const recipients = [MASTER_NOTIFICATION_EMAIL];
        if (userEmail && userEmail.includes('@')) {
          recipients.push(userEmail);
        }

        const info = await transporter.sendMail({
          from: '"Zentrion.ai Időpontfoglaló" <no-reply@zentrion.ai>',
          to: recipients.join(', '),
          subject,
          text: textContent,
          html: htmlContent
        });

        previewUrl = nodemailer.getTestMessageUrl(info) || null;
      } catch (etherealErr) {
        console.warn('Ethereal email generation error:', etherealErr);
      }

      // 2. Direct webmail links
      const targetUserEmail = userEmail && userEmail.includes('@') ? userEmail : MASTER_NOTIFICATION_EMAIL;
      const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetUserEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(textContent)}`;
      const outlookComposeUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(targetUserEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(textContent)}`;

      // 3. Simulated Carrier Gateway response
      const smsDispatchInfo = {
        carrier: 'Vodafone / Telekom / Yettel HU Gateway',
        status: 'DELIVERED',
        recipient: userPhone || '+36 30 123 4567',
        messageText: `[Zentrion.ai] Kedves ${clientName}! Időpontod rögzítve: ${slot}. Lemondás esetén válaszolj: LEMONDÁS. Ügyfélszolgálat: +36 1 800 9999`,
        sentAt: timestamp,
        latencyMs: 340,
        carrierId: `CARRIER_HU_${Math.floor(Math.random() * 899999 + 100000)}`
      };

      // 4. Standard iCalendar (.ics) format data
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Zentrion.ai//Idopontfoglalo//HU',
        'CALSCALE:GREGORIAN',
        'METHOD:REQUEST',
        'BEGIN:VEVENT',
        `UID:${trackingId}@zentrion.ai`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${new Date(Date.now() + 86400000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTEND:${new Date(Date.now() + 86400000 + 1800000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `SUMMARY:Zentrion.ai Folyamat-Audit (${slot})`,
        `DESCRIPTION:Kedves ${clientName}! Online konzultacio az Zentrion.ai automatizacios szakertovel.\\nIdopont: ${slot}\\nAzonosito: ${trackingId}`,
        'LOCATION:Online Google Meet vagy 1054 Budapest, Szabadsag ter 7.',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      return NextResponse.json({
        success: true,
        type: 'appointment',
        trackingId,
        targetEmail: MASTER_NOTIFICATION_EMAIL,
        userEmail: userEmail || null,
        previewUrl,
        gmailComposeUrl,
        outlookComposeUrl,
        icsData,
        sms: smsDispatchInfo,
        message: `Időpont sikeresen lefoglalva! Az email elkészült és online megtekinthető, az SMS továbbítva!`
      });
    }

    // 2. EMAIL AUTOMATION DEMO DISPATCH
    if (type === 'email_triage') {
      const { emailSubject = 'Ajánlatkérés', emailBody = '', autoDraft = '' } = payload || {};
      const subject = `[Zentrion.ai Email AI Demó] Beérkező levél feldolgozva: ${emailSubject}`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #ffffff; padding: 28px; border-radius: 16px; border: 1px solid #27272a;">
          <h2 style="color: #06b6d4; margin-top: 0;">Zentrion.ai Intelligens Email Triage Demó</h2>
          <p style="color: #a1a1aa; font-size: 13px;">Az alábbi bejövő emailt az AI elemző motor másodpercek alatt kielemezte:</p>
          <div style="background: #18181b; padding: 14px; border-radius: 8px; border: 1px solid #3f3f46; font-size: 13px; color: #e4e4e7;">
            ${emailBody || 'Teszt levélszöveg'}
          </div>
          <h3 style="color: #10b981; font-size: 15px; margin-top: 20px;">AI Által Készített Válasz Piszkozat:</h3>
          <div style="background: #18181b; padding: 14px; border-radius: 8px; border-left: 3px solid #10b981; font-size: 13px; color: #e4e4e7;">
            ${autoDraft || 'Köszönjük megkeresését, kollégánk hamarosan felveszi a kapcsolatot.'}
          </div>
        </div>
      `;

      await dispatchEmail({
        type: 'contact_inquiry',
        subject,
        htmlContent,
        textContent: `Email AI Demó: ${emailBody}\nPiszkozat: ${autoDraft}`,
        metadata: { demoType: 'email_automation', userEmail: userEmail || 'Tesztelő', trackingId }
      });

      return NextResponse.json({
        success: true,
        type: 'email_triage',
        trackingId,
        message: `Email feldolgozási esemény és válaszlevél-piszkozat sikeresen rögzítve és elküldve!`
      });
    }

    // 3. SUPPORT TICKET DEMO DISPATCH
    if (type === 'support_ticket') {
      const { issue = '', priority = 'Magas' } = payload || {};
      const subject = `[Zentrion.ai Support Ticket #${trackingId}] Új ügyfélszolgálati hibajegy: ${priority} prioritás`;

      await dispatchEmail({
        type: 'contact_inquiry',
        subject,
        htmlContent: `<p>Új hibajegy érkezett az Zentrion.ai ügyfélszolgálati demóból: <strong>${issue}</strong> (Prioritás: ${priority})</p>`,
        textContent: `Új hibajegy: ${issue} (${priority})`,
        metadata: { demoType: 'support_ticket', trackingId, issue, priority }
      });

      return NextResponse.json({
        success: true,
        type: 'support_ticket',
        trackingId,
        message: `Hibajegy sikeresen létrehozva (#${trackingId}) és értesítés továbbítva a technikai csapatnak!`
      });
    }

    return NextResponse.json({ error: 'Érvénytelen demó típus' }, { status: 400 });

  } catch (err: unknown) {
    const error = err as Error;
    console.error('Demo dispatch error:', error);
    return NextResponse.json({ error: error.message || 'Hiba a demó végrehajtásakor' }, { status: 500 });
  }
}
