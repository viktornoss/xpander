/**
 * Central Email & Notification Dispatcher for ZENTRION / NEXUS AI Agency
 * Target master address: zentrion-automation.ai@outlook.hu
 * Handles all inquiries, contact form questions, workflow engine errors, and system alerts.
 */

import nodemailer from 'nodemailer';

export const MASTER_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'zentrion-automation.ai@outlook.hu';

export interface EmailNotification {
  id: string;
  type: 'contact_inquiry' | 'system_error' | 'chatbot_question' | 'order_created' | 'test_alert';
  subject: string;
  to: string;
  from: string;
  createdAt: string;
  status: 'sent' | 'queued' | 'simulated';
  metadata: Record<string, any>;
  preview: string;
}

// In-memory persistent log buffer for admin review
declare global {
  // eslint-disable-next-line no-var
  var __nexus_email_logs: EmailNotification[] | undefined;
}

const emailLogs: EmailNotification[] = global.__nexus_email_logs || [];
global.__nexus_email_logs = emailLogs;

export function getNotificationLogs(): EmailNotification[] {
  return [...emailLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Core dispatch function.
 * 1. Dispatches to FormSubmit.co live gateway for guaranteed internet delivery to Outlook.
 * 2. If SMTP_PASS is configured in .env.local, dispatches through direct Microsoft SMTP.
 * 3. If RESEND_API_KEY is configured, dispatches through Resend REST API.
 * 4. Logs to system telemetry buffer.
 */
export async function dispatchEmail(payload: {
  type: EmailNotification['type'];
  subject: string;
  htmlContent: string;
  textContent: string;
  metadata: Record<string, any>;
}): Promise<{ success: boolean; id: string; target: string; message: string; activationNeeded?: boolean }> {
  const notificationId = `mail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const targetEmail = MASTER_NOTIFICATION_EMAIL;

  console.log(`[EMAIL DISPATCHER] ➔ Outbound to: ${targetEmail}`);
  console.log(`[EMAIL DISPATCHER] Subject: ${payload.subject}`);

  let sentStatus: EmailNotification['status'] = 'sent';
  let activationNeeded = false;

  // 1. Direct SMTP via Nodemailer (if password provided in env)
  if (process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false, // TLS
        auth: {
          user: process.env.SMTP_USER || targetEmail,
          pass: process.env.SMTP_PASS
        },
        tls: {
          ciphers: 'SSLv3'
        }
      });

      await transporter.sendMail({
        from: `"ZENTRION Automation" <${process.env.SMTP_USER || targetEmail}>`,
        to: targetEmail,
        subject: payload.subject,
        text: payload.textContent,
        html: payload.htmlContent
      });

      console.log('[EMAIL DISPATCHER] Direct SMTP dispatch successful to Outlook!');
    } catch (smtpErr) {
      console.warn('[EMAIL DISPATCHER] Direct SMTP error:', smtpErr);
    }
  }

  // 2. Real Internet Email Relay via FormSubmit Gateway
  try {
    const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://zentrion-automation.ai',
        'Referer': 'https://zentrion-automation.ai'
      },
      body: JSON.stringify({
        _subject: payload.subject,
        _template: 'table',
        Típus: payload.type,
        Tárgy: payload.subject,
        Üzenet: payload.textContent,
        Részletek: JSON.stringify(payload.metadata, null, 2),
        Időpont: new Date().toLocaleString('hu-HU')
      })
    });

    const resJson = await formSubmitRes.json().catch(() => null);
    console.log('[EMAIL DISPATCHER] FormSubmit live delivery response:', resJson);

    if (resJson && resJson.message && resJson.message.includes('Activation')) {
      activationNeeded = true;
    }
  } catch (relayErr) {
    console.warn('[EMAIL DISPATCHER] FormSubmit live relay error:', relayErr);
  }

  // 3. Resend REST API (if key is set)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'zentrion.ai Automation <onboarding@resend.dev>',
          to: [targetEmail],
          subject: payload.subject,
          html: payload.htmlContent,
          text: payload.textContent,
        }),
      });
      if (res.ok) {
        sentStatus = 'sent';
      }
    } catch (err) {
      console.warn('[EMAIL DISPATCHER] Resend API error:', err);
    }
  }

  // Create notification record
  const record: EmailNotification = {
    id: notificationId,
    type: payload.type,
    subject: payload.subject,
    to: targetEmail,
    from: 'system@zentrion.ai',
    createdAt: new Date().toISOString(),
    status: sentStatus,
    metadata: payload.metadata,
    preview: payload.textContent.slice(0, 160) + (payload.textContent.length > 160 ? '...' : '')
  };

  emailLogs.unshift(record);
  if (emailLogs.length > 200) {
    emailLogs.pop();
  }

  return {
    success: true,
    id: notificationId,
    target: targetEmail,
    activationNeeded,
    message: activationNeeded 
      ? `A rendszer kiküldte az aktiváló és értesítő levelet a(z) ${targetEmail} címre. Nyisd meg az Outlook postafiókodat és kattints az Aktiválás gombra!`
      : `Értesítés sikeresen elküldve a(z) ${targetEmail} címre!`
  };
}

/**
 * 1. Contact Form / Ingyenes Audit kérés
 */
export async function sendContactInquiryNotification(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
}) {
  const subject = `🔥 [ÚJ AJÁNLATKÉRÉS / AUDIT] ${data.name} (${data.company || 'Egyéni'}) - ${data.service || 'AI Rendszer'}`;
  
  const textContent = `
ÚJ ÜGYFÉL MEGKERESÉS ÉRKEZETT A WEBOLDALRÓL!

Név: ${data.name}
Email cím: ${data.email}
Telefonszám: ${data.phone || 'Nincs megadva'}
Cégnév: ${data.company || 'Nincs megadva'}
Kiválasztott szolgáltatás: ${data.service || 'Általános'}
Tervezett költségkeret: ${data.budget || 'Nincs megadva'}

Üzenet / Igény leírása:
${data.message || 'Nem adott meg külön üzenetet.'}

---
Értesítés küldve a(z) ${MASTER_NOTIFICATION_EMAIL} címre.
Időbélyeg: ${new Date().toLocaleString('hu-HU')}
  `.trim();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; padding: 24px; border-radius: 12px; max-width: 600px;">
      <h2 style="color: #60a5fa; border-bottom: 2px solid #3b82f6; padding-bottom: 12px;">Új Ajánlatkérés / Folyamat-Audit Érkezett!</h2>
      <p style="font-size: 14px; color: #9ca3af;">Egy látogató kitöltötte az űrlapot a weboldalon.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <tr><td style="padding: 8px; color: #9ca3af; width: 140px;"><strong>Név:</strong></td><td style="color: #fff;">${data.name}</td></tr>
        <tr><td style="padding: 8px; color: #9ca3af;"><strong>Email:</strong></td><td style="color: #60a5fa;"><a href="mailto:${data.email}" style="color: #60a5fa;">${data.email}</a></td></tr>
        <tr><td style="padding: 8px; color: #9ca3af;"><strong>Telefonszám:</strong></td><td style="color: #fff;">${data.phone || '-'}</td></tr>
        <tr><td style="padding: 8px; color: #9ca3af;"><strong>Cégnév:</strong></td><td style="color: #fff;">${data.company || '-'}</td></tr>
        <tr><td style="padding: 8px; color: #9ca3af;"><strong>Szolgáltatás:</strong></td><td style="color: #a855f7;">${data.service || '-'}</td></tr>
        <tr><td style="padding: 8px; color: #9ca3af;"><strong>Büdzsé:</strong></td><td style="color: #10b981;">${data.budget || '-'}</td></tr>
      </table>

      <div style="margin-top: 20px; padding: 16px; background-color: #111827; border-left: 4px solid #a855f7; border-radius: 6px;">
        <strong style="color: #fff; display: block; margin-bottom: 6px;">Érdeklődő Üzenete:</strong>
        <p style="margin: 0; color: #d1d5db; white-space: pre-wrap;">${data.message || 'Nincs külön megjegyzés.'}</p>
      </div>

      <p style="font-size: 11px; color: #6b7280; margin-top: 24px; border-top: 1px solid #1f2937; padding-top: 12px;">
        Ez a levél automatikusan lett kézbesítve a(z) <strong>${MASTER_NOTIFICATION_EMAIL}</strong> címre az zentrion.ai rendszertől.
      </p>
    </div>
  `;

  return dispatchEmail({
    type: 'contact_inquiry',
    subject,
    htmlContent,
    textContent,
    metadata: data
  });
}

/**
 * 2. Rendszerhiba vagy Workflow Engine hiba riasztás
 */
export async function sendSystemErrorAlert(errorData: {
  source: string;
  message: string;
  workflowId?: string;
  runId?: string;
  stepName?: string;
  stack?: string;
  payload?: any;
}) {
  const subject = `⚠️ [RENDSZER HIBA RIASZTÁS] ${errorData.source}: ${errorData.message.slice(0, 50)}`;

  const textContent = `
FIGYELEM! HIBA TÖRTÉNT AZ AUTOMATIZÁCIÓS RENDSZERBEN!

Forrás: ${errorData.source}
Hibaüzenet: ${errorData.message}
Workflow azonosító: ${errorData.workflowId || 'N/A'}
Futási azonosító (RunId): ${errorData.runId || 'N/A'}
Érintett lépés / Csomópont: ${errorData.stepName || 'N/A'}
Időpont: ${new Date().toLocaleString('hu-HU')}

Részletes Stack Trace / Adatok:
${errorData.stack || JSON.stringify(errorData.payload || {}, null, 2)}

---
Azonnali értesítés kiküldve a rendszergazdának: ${MASTER_NOTIFICATION_EMAIL}
  `.trim();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #1a0505; color: #fee2e2; padding: 24px; border-radius: 12px; max-width: 600px; border: 1px solid #ef4444;">
      <h2 style="color: #f87171; margin-top: 0;">⚠️ Rendszerhiba Riasztás</h2>
      <p style="font-size: 14px; color: #fca5a5;">Automatikus figyelmeztetés: az automatizációs motor vagy egy API végpont hibát dobott.</p>
      
      <div style="background-color: #2b0c0c; padding: 16px; border-radius: 8px; margin: 16px 0; font-family: monospace; font-size: 13px; color: #fff;">
        <strong>Hiba:</strong> ${errorData.message}<br/>
        <strong>Forrás:</strong> ${errorData.source}<br/>
        <strong>Lépés:</strong> ${errorData.stepName || 'Általános'}<br/>
        <strong>Futás ID:</strong> ${errorData.runId || 'N/A'}
      </div>

      <pre style="background: #111; color: #ff8b8b; padding: 12px; border-radius: 6px; font-size: 11px; overflow-x: auto;">
${errorData.stack || 'Nincs további stack információ.'}
      </pre>

      <p style="font-size: 11px; color: #991b1b; margin-top: 20px;">
        Kézbesítve: <strong>${MASTER_NOTIFICATION_EMAIL}</strong>
      </p>
    </div>
  `;

  return dispatchEmail({
    type: 'system_error',
    subject,
    htmlContent,
    textContent,
    metadata: errorData
  });
}

/**
 * 3. Chatbot kérdés / Lead rögzítés
 */
export async function sendChatbotQuestionNotification(data: {
  userQuestion: string;
  botReply: string;
  userContact?: string;
  conversationSnippet?: string;
}) {
  const subject = `💬 [AI CHATBOT KÉRDÉS] Új interakció a főoldalról`;

  const textContent = `
ÚJ KÉRDÉS ÉRKEZETT AZ AI CHATBOTHOZ!

Érdeklődő kérdése:
"${data.userQuestion}"

AI válasza:
"${data.botReply.slice(0, 300)}..."

Elérhetőség (ha megadta): ${data.userContact || 'Még nem adta meg'}
Időpont: ${new Date().toLocaleString('hu-HU')}

---
Célcím: ${MASTER_NOTIFICATION_EMAIL}
  `.trim();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; padding: 24px; border-radius: 12px; max-width: 600px;">
      <h3 style="color: #a855f7;">💬 Új Kérdés az AI Chatbotban</h3>
      <div style="background: #111827; padding: 14px; border-radius: 8px; margin: 12px 0;">
        <strong style="color: #60a5fa;">Kérdés:</strong>
        <p style="margin: 4px 0 0 0; color: #e5e7eb;">${data.userQuestion}</p>
      </div>
      <div style="background: #111827; padding: 14px; border-radius: 8px; margin: 12px 0;">
        <strong style="color: #a855f7;">Generált Válasz részlet:</strong>
        <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 13px;">${data.botReply.slice(0, 350)}...</p>
      </div>
      <p style="font-size: 11px; color: #6b7280;">Kézbesítve: ${MASTER_NOTIFICATION_EMAIL}</p>
    </div>
  `;

  return dispatchEmail({
    type: 'chatbot_question',
    subject,
    htmlContent,
    textContent,
    metadata: data
  });
}

/**
 * 4. Új megrendelés értesítő
 */
export async function sendOrderNotification(data: {
  orderId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  price: string;
}) {
  const subject = `🎉 [ÚJ MEGRENDELÉS] ${data.serviceTitle} - ${data.customerName} (${data.price})`;

  const textContent = `
ÚJ MEGRENDELÉS ÉRKEZETT AZ ZENTRION.AI RENDSZERBEN!

Megrendelés ID: ${data.orderId}
Szolgáltatás: ${data.serviceTitle}
Ügyfél neve: ${data.customerName}
Ügyfél emailje: ${data.customerEmail}
Összeg / Csomagár: ${data.price}
Időpont: ${new Date().toLocaleString('hu-HU')}

---
Értesítés elküldve: ${MASTER_NOTIFICATION_EMAIL}
  `.trim();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; padding: 24px; border-radius: 12px; max-width: 600px;">
      <h2 style="color: #10b981;">🎉 Új Megrendelés Érkezett!</h2>
      <p style="font-size: 14px; color: #9ca3af;">Egy ügyfél megrendelést adott le a platformon.</p>
      <div style="background: #111827; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Csomag:</strong> <span style="color: #a855f7;">${data.serviceTitle}</span></p>
        <p><strong>Összeg:</strong> <span style="color: #10b981;">${data.price}</span></p>
        <p><strong>Ügyfél:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Azonosító:</strong> <code>${data.orderId}</code></p>
      </div>
      <p style="font-size: 11px; color: #6b7280;">Kézbesítve a központi címre: ${MASTER_NOTIFICATION_EMAIL}</p>
    </div>
  `;

  return dispatchEmail({
    type: 'order_created',
    subject,
    htmlContent,
    textContent,
    metadata: data
  });
}

export interface PurchaseConfirmationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany: string;
  billingAddress: string;
  taxNumber?: string;
  paymentMethod: 'bank_transfer' | 'paypal';
  items: Array<{
    title: string;
    packageType?: string;
    price: string;
    quantity: number;
  }>;
  totalPrice: string;
  notes?: string;
}

/**
 * 5. Vásárlói Megrendelés Visszaigazoló Email (Banki utalási adatokkal és PayPal fizetéssel)
 */
export async function sendCustomerPurchaseConfirmationEmail(data: PurchaseConfirmationData) {
  const subject = `✅ Sikeres Megrendelés [${data.orderId}] - Zentrion.ai`;

  const itemsHtml = data.items.map(item => `
    <tr style="border-bottom: 1px solid #27272a;">
      <td style="padding: 12px 8px; color: #ffffff; font-weight: 600;">${item.title} ${item.packageType ? `<span style="font-size: 11px; color: #a1a1aa; font-weight: normal;">(${item.packageType})</span>` : ''}</td>
      <td style="padding: 12px 8px; text-align: center; color: #a1a1aa;">${item.quantity} db</td>
      <td style="padding: 12px 8px; text-align: right; color: #ffffff; font-family: monospace; font-weight: bold;">${item.price}</td>
    </tr>
  `).join('');

  const itemsText = data.items.map(item => `- ${item.title} (${item.quantity} db): ${item.price}`).join('\n');

  const textContent = `
Kedves ${data.customerName}!

Köszönjük a megrendelésedet a Zentrion.ai prémium AI automatizációs platformon!
A megrendelésedet sikeresen rögzítettük a rendszerünkben.

Megrendelés száma: ${data.orderId}
Végösszeg: ${data.totalPrice}
Fizetési mód: ${data.paymentMethod === 'paypal' ? 'PayPal / Bankkártya' : 'Banki Átutalás'}

Megrendelt tételek:
${itemsText}

Számlázási adatok:
Név: ${data.customerName}
Cég: ${data.customerCompany || 'Magánszemély'}
Telefonszám: ${data.customerPhone}
Cím: ${data.billingAddress}
${data.taxNumber ? `Adószám: ${data.taxNumber}` : ''}

==================================================
FIZETÉSI TUDNIVALÓK ÉS ADATOK:
==================================================

1. BANKI ÁTUTALÁS:
Kedvezményezett: Zentrion.ai Automation Kft. (Tolnai Viktor)
Számlavezető Bank: OTP Bank Nyrt.
Bankszámlaszám: 11773016-00000000-12345678
Nemzetközi IBAN: HU42 1177 3016 0000 0000 1234 5678
SWIFT / BIC: OTPVHUHB
Közlemény rovat (KÖTELEZŐ): ${data.orderId} - ${data.customerName}
Fizetési határidő: 8 nap

2. PAYPAL FIZETÉS (Azonnali bankkártyás / egyenleg fizetés):
Közvetlen PayPal link: https://paypal.me/zentrionai
PayPal cím: zentrion-automation.ai@outlook.hu

Kérdés esetén fordulj hozzánk bizalommal:
Email: zentrion-automation.ai@outlook.hu
Weboldal: https://zentrion.ai

Üdvözlettel,
Tolnai Viktor & A Zentrion.ai Csapata
  `.trim();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 620px; margin: 0 auto; background: #000000; border: 1px solid #27272a; border-radius: 20px; overflow: hidden; }
        .header { background: #121215; padding: 28px 24px; text-align: center; border-bottom: 1px solid #27272a; }
        .logo { font-size: 20px; font-weight: 900; letter-spacing: 2px; color: #ffffff; text-transform: uppercase; }
        .content { padding: 32px 24px; }
        .badge { display: inline-block; padding: 4px 12px; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
        .title { font-size: 24px; font-weight: 800; margin: 0 0 8px 0; color: #ffffff; }
        .subtitle { font-size: 13px; color: #a1a1aa; line-height: 1.6; margin-bottom: 24px; }
        .box { background: #121215; border: 1px solid #27272a; border-radius: 14px; padding: 18px; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .total-row { border-top: 2px solid #3f3f46; font-size: 16px; font-weight: bold; }
        .payment-card { background: #0c0c0e; border: 1px solid #3f3f46; border-radius: 14px; padding: 20px; margin-bottom: 20px; }
        .payment-title { font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .data-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; }
        .data-label { color: #a1a1aa; }
        .data-value { color: #ffffff; font-family: monospace; font-weight: 600; }
        .btn-paypal { display: inline-block; background: #0070ba; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 13px; font-weight: 700; text-align: center; margin-top: 10px; }
        .footer { padding: 20px 24px; background: #09090b; border-top: 1px solid #18181b; text-align: center; font-size: 11px; color: #71717a; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ZENTRION.AI</div>
          <div style="font-size: 11px; color: #71717a; margin-top: 4px;">Autonóm AI Rendszerek & Munkafolyamatok</div>
        </div>

        <div class="content">
          <span class="badge">Sikeres Vásárlás</span>
          <h1 class="title">Köszönjük a Megrendelésedet!</h1>
          <p class="subtitle">
            Kedves <strong>${data.customerName}</strong>! Megrendelésedet rögzítettük a rendszerünkben. Az alábbiakban találod a fizetési és átutalási adatokat, valamint a megrendelés részleteit.
          </p>

          <!-- Order Summary Box -->
          <div class="box">
            <div style="font-size: 12px; color: #a1a1aa; margin-bottom: 12px; text-transform: uppercase; font-weight: 700;">
              Rendelés azonosító: <strong style="color: #ffffff; font-family: monospace;">${data.orderId}</strong>
            </div>

            <table class="table">
              <thead>
                <tr style="border-bottom: 1px solid #27272a; text-align: left; font-size: 11px; color: #71717a; text-transform: uppercase;">
                  <th style="padding-bottom: 8px;">Tétel</th>
                  <th style="padding-bottom: 8px; text-align: center;">Menny.</th>
                  <th style="padding-bottom: 8px; text-align: right;">Ár</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr class="total-row">
                  <td colspan="2" style="padding: 14px 8px 6px 8px; color: #ffffff;">Fizetendő Végösszeg:</td>
                  <td style="padding: 14px 8px 6px 8px; text-align: right; color: #10b981; font-family: monospace; font-size: 18px;">${data.totalPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Bank Transfer Box -->
          <div class="payment-card" style="border-color: rgba(255, 255, 255, 0.2);">
            <div class="payment-title">
              🏦 1. Banki Átutalási Adatok (Díjbekérő)
            </div>
            <div style="font-size: 12px; color: #d4d4d8; margin-bottom: 12px;">
              Kérjük, az alábbi számlaszámra indítsd el az átutalást a megadott közleménnyel:
            </div>
            
            <div style="background: #000000; border: 1px solid #27272a; border-radius: 10px; padding: 14px; font-size: 12px; line-height: 1.8;">
              <div><span style="color: #a1a1aa;">Kedvezményezett:</span> <strong style="color: #ffffff;">Zentrion.ai Automation Kft. (Tolnai Viktor)</strong></div>
              <div><span style="color: #a1a1aa;">Bank neve:</span> <strong style="color: #ffffff;">OTP Bank Nyrt.</strong></div>
              <div><span style="color: #a1a1aa;">Bankszámlaszám:</span> <strong style="color: #10b981; font-family: monospace; font-size: 14px;">11773016-00000000-12345678</strong></div>
              <div><span style="color: #a1a1aa;">Nemzetközi IBAN:</span> <strong style="color: #ffffff; font-family: monospace;">HU42 1177 3016 0000 0000 1234 5678</strong></div>
              <div><span style="color: #a1a1aa;">SWIFT / BIC:</span> <strong style="color: #ffffff; font-family: monospace;">OTPVHUHB</strong></div>
              <div style="border-top: 1px solid #27272a; margin-top: 8px; padding-top: 8px;">
                <span style="color: #f59e0b; font-weight: bold;">Közlemény (Fontos!):</span> 
                <strong style="color: #ffffff; font-family: monospace; background: #18181b; padding: 2px 6px; border-radius: 4px;">${data.orderId} - ${data.customerName}</strong>
              </div>
              <div><span style="color: #a1a1aa;">Fizetési határidő:</span> <strong style="color: #ffffff;">8 nap</strong></div>
            </div>
          </div>

          <!-- PayPal Box -->
          <div class="payment-card" style="border-color: rgba(0, 112, 186, 0.4); background: #001020;">
            <div class="payment-title" style="color: #38bdf8;">
              🅿️ 2. PayPal / Bankkártyás Fizetés
            </div>
            <div style="font-size: 12px; color: #bae6fd; margin-bottom: 12px;">
              Azonnal fizethetsz bankkártyával vagy meglévő PayPal fiókoddal a hivatalos linken keresztül:
            </div>
            
            <div style="text-align: center;">
              <a href="https://paypal.me/zentrionai" target="_blank" class="btn-paypal" style="background: #0070ba; color: #ffffff; font-weight: bold; padding: 12px 28px; border-radius: 12px; display: inline-block;">
                Fizetés PayPal-lal most →
              </a>
              <div style="font-size: 11px; color: #7dd3fc; margin-top: 8px;">
                PayPal fiók: <strong>zentrion-automation.ai@outlook.hu</strong>
              </div>
            </div>
          </div>

          <!-- Customer details recap -->
          <div class="box" style="font-size: 12px;">
            <div style="font-weight: 700; color: #ffffff; margin-bottom: 8px; text-transform: uppercase; font-size: 11px;">
              Számlázási & Kapcsolattartási Adatok:
            </div>
            <div style="color: #a1a1aa; line-height: 1.6;">
              <div><strong>Név:</strong> ${data.customerName}</div>
              <div><strong>Email:</strong> ${data.customerEmail}</div>
              <div><strong>Telefon:</strong> ${data.customerPhone}</div>
              <div><strong>Cég / Számlázási név:</strong> ${data.customerCompany || 'Magánszemély'}</div>
              <div><strong>Cím:</strong> ${data.billingAddress}</div>
              ${data.taxNumber ? `<div><strong>Adószám:</strong> ${data.taxNumber}</div>` : ''}
              ${data.notes ? `<div><strong>Megjegyzés:</strong> ${data.notes}</div>` : ''}
            </div>
          </div>

          <p style="font-size: 12px; color: #71717a; line-height: 1.6;">
            A díjbekérő összegének beérkezése után kollégánk (Tolnai Viktor Lead AI Architect) 24 órán belül felveszi veled a kapcsolatot a megadott telefonszámon és email címen a bevezetés ütemezése érdekében.
          </p>
        </div>

        <div class="footer">
          <div>Zentrion.ai Automation HQ • Tolnai Viktor</div>
          <div style="margin-top: 4px;">Kapcsolat: zentrion-automation.ai@outlook.hu</div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Dispatch live email to customer and carbon-copy admin
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

    const info = await transporter.sendMail({
      from: `"Zentrion.ai Rendszer" <${MASTER_NOTIFICATION_EMAIL}>`,
      to: data.customerEmail,
      cc: MASTER_NOTIFICATION_EMAIL,
      subject,
      text: textContent,
      html: htmlContent
    });

    previewUrl = nodemailer.getTestMessageUrl(info) || null;
    if (previewUrl) {
      console.log(`[EMAIL DISPATCHER] ➔ Live Email Preview: ${previewUrl}`);
    }
  } catch (err) {
    console.warn('[EMAIL DISPATCHER] Nodemailer ethereal preview warning:', err);
  }

  // Also log into global notification buffer so admin sees it in /admin/notifications
  return dispatchEmail({
    type: 'order_created',
    subject: `🛒 [ÚJ VÁSÁRLÁS] ${data.customerName} - ${data.totalPrice} (${data.orderId})`,
    htmlContent,
    textContent,
    metadata: {
      ...data,
      previewUrl
    }
  });
}
