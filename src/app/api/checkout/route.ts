import { NextResponse } from 'next/server';
import { sendCustomerPurchaseConfirmationEmail } from '@/lib/email/dispatcher';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      customerCompany, 
      billingAddress, 
      taxNumber, 
      paymentMethod = 'bank_transfer', 
      items = [], 
      totalPrice,
      notes 
    } = body;

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'A név, az e-mail cím és a telefonszám megadása kötelező a megrendeléshez.' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'A kosár üres. Kérjük válassz legalább egy szolgáltatást vagy csomagot!' },
        { status: 400 }
      );
    }

    const orderId = `ZTR-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const formattedAddress = typeof billingAddress === 'object' && billingAddress !== null
      ? `${billingAddress.zip || ''} ${billingAddress.city || ''}, ${billingAddress.street || ''}`.trim()
      : (billingAddress || 'Nincs külön cím megadva');

    // Send the automated confirmation email to customer (and carbon copy to Tolnai Viktor)
    await sendCustomerPurchaseConfirmationEmail({
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      customerCompany: customerCompany || 'Egyéni megrendelő',
      billingAddress: formattedAddress,
      taxNumber,
      paymentMethod,
      items,
      totalPrice: totalPrice || 'Összeg egyeztetés szerint',
      notes
    });

    return NextResponse.json({
      success: true,
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      totalPrice,
      paymentMethod,
      bankDetails: {
        beneficiary: 'Zentrion.ai Automation Kft. (Tolnai Viktor)',
        bank: 'OTP Bank Nyrt.',
        accountNumber: '11773016-00000000-12345678',
        iban: 'HU42 1177 3016 0000 0000 1234 5678',
        swift: 'OTPVHUHB',
        reference: `${orderId} - ${customerName}`,
        deadlineDays: 8
      },
      paypalDetails: {
        link: 'https://paypal.me/zentrionai',
        account: 'zentrion-automation.ai@outlook.hu'
      }
    });
  } catch (error: any) {
    console.error('[API CHECKOUT ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Hiba történt a megrendelés feldolgozása közben.' },
      { status: 500 }
    );
  }
}

