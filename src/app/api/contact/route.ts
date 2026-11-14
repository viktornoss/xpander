import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { sendContactInquiryNotification, MASTER_NOTIFICATION_EMAIL } from '@/lib/email/dispatcher';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, service, budget, message } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'A név és az email cím megadása kötelező.' }, { status: 400 });
    }

    // 1. Dispatch internal email notification to zentrion-automation.ai@outlook.hu
    const result = await sendContactInquiryNotification({
      name,
      email,
      phone,
      company,
      service,
      budget,
      message,
    });

    const subject = `[Zentrion.ai Audit Igénylés] ${name} - ${service || 'AI Megoldás'}`;
    const textContent = `
Kedves Zentrion.ai Csapat!

Új ingyenes AI folyamat-audit igénylést küldök:

Név: ${name}
Email cím: ${email}
Telefonszám: ${phone || 'Nincs megadva'}
Cégnév: ${company || 'Nincs megadva'}
Választott szolgáltatás: ${service || 'AI Intelligens Chatbot'}
Tervezett költségkeret: ${budget || 'Starter'}

Üzenet / Folyamat leírása:
${message || 'Nincs külön megjegyzés.'}

Kérem vegyétek fel velem a kapcsolatot a megadott elérhetőségeken!
Köszönettel,
${name}
    `.trim();

    // 2. Generate live web email preview via Nodemailer Ethereal
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
        from: `"${name}" <${email}>`,
        to: `${MASTER_NOTIFICATION_EMAIL}, ${email}`,
        subject,
        text: textContent,
        html: `
          <div style="font-family: Arial, sans-serif; background: #09090b; color: #fff; padding: 24px; border-radius: 12px;">
            <h2 style="color: #38bdf8;">Új Ingyenes AI Audit Igénylés</h2>
            <p><strong>Név:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Cég:</strong> ${company || '-'}</p>
            <p><strong>Telefon:</strong> ${phone || '-'}</p>
            <p><strong>Szolgáltatás:</strong> ${service || '-'}</p>
            <p><strong>Költségkeret:</strong> ${budget || '-'}</p>
            <div style="background: #18181b; padding: 14px; border-radius: 8px; margin-top: 14px;">
              <strong>Üzenet:</strong>
              <p>${message || 'Nincs megjegyzés.'}</p>
            </div>
          </div>
        `
      });

      previewUrl = nodemailer.getTestMessageUrl(info) || null;
    } catch (etherealErr) {
      console.warn('Ethereal preview error:', etherealErr);
    }

    // 3. Generate direct webmail URLs for 1-click delivery
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(MASTER_NOTIFICATION_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(textContent)}`;
    const outlookComposeUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(MASTER_NOTIFICATION_EMAIL)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(textContent)}`;
    const mailtoUrl = `mailto:${encodeURIComponent(MASTER_NOTIFICATION_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(textContent)}`;

    return NextResponse.json({
      success: true,
      targetEmail: MASTER_NOTIFICATION_EMAIL,
      userEmail: email,
      notificationId: result.id,
      previewUrl,
      gmailComposeUrl,
      outlookComposeUrl,
      mailtoUrl,
      message: `Megkeresésedet rögzítettük és előkészítettük a(z) ${MASTER_NOTIFICATION_EMAIL} címre!`
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Contact form API error:', err);
    return NextResponse.json({ error: err.message || 'Hiba az üzenet küldésekor' }, { status: 500 });
  }
}
