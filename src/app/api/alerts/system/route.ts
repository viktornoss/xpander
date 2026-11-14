import { NextResponse } from 'next/server';
import { 
  getNotificationLogs, 
  sendSystemErrorAlert, 
  MASTER_NOTIFICATION_EMAIL,
  dispatchEmail 
} from '@/lib/email/dispatcher';

// GET: Retrieve all recent email notifications dispatched to zentrion-automation.ai@outlook.hu
export async function GET() {
  const logs = getNotificationLogs();
  return NextResponse.json({
    targetEmail: MASTER_NOTIFICATION_EMAIL,
    totalDispatched: logs.length,
    logs
  });
}

// POST: Trigger a test alert or report a system error
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, source, message, payload } = body;

    if (action === 'test_alert') {
      const res = await dispatchEmail({
        type: 'test_alert',
        subject: `🧪 [TESZT ÉRTESÍTÉS] Rendszerellenőrzés sikeres`,
        textContent: `Ez egy teszt üzenet az zentrion.ai rendszertől. A kapcsolat a(z) ${MASTER_NOTIFICATION_EMAIL} címmel hibátlanul üzemel.\nIdőpont: ${new Date().toLocaleString('hu-HU')}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #fff; padding: 20px; border-radius: 10px; border: 1px solid #10b981;">
            <h3 style="color: #10b981;">🧪 Sikeres Teszt Értesítés!</h3>
            <p>Minden rendszerhiba, érdeklődés és megrendelés automatikusan erre a címre fut be:</p>
            <p style="font-size: 16px; font-weight: bold; color: #60a5fa;">${MASTER_NOTIFICATION_EMAIL}</p>
            <p style="font-size: 11px; color: #9ca3af;">Időpont: ${new Date().toLocaleString('hu-HU')}</p>
          </div>
        `,
        metadata: { triggeredBy: 'admin_test', timestamp: new Date().toISOString() }
      });

      return NextResponse.json({
        success: true,
        message: `Teszt üzenet sikeresen kiküldve a(z) ${MASTER_NOTIFICATION_EMAIL} címre!`,
        result: res
      });
    }

    // Otherwise record system error alert
    const errorResult = await sendSystemErrorAlert({
      source: source || 'Kliensoldali bejelentés',
      message: message || 'Ismeretlen hiba lépett fel',
      payload
    });

    return NextResponse.json({
      success: true,
      message: `Hiba riasztás elküldve: ${MASTER_NOTIFICATION_EMAIL}`,
      errorResult
    });

  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Szerver hiba' }, { status: 500 });
  }
}

