const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Load .env.local manually without extra dependencies
try {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [k, ...v] = line.split('=');
        if (k && v.length) {
          process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
  }
} catch (e) {}

async function testEmail() {
  const host = process.env.SMTP_HOST || 'smtp-mail.outlook.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || 'xpander-automation.ai@outlook.hu';
  const pass = process.env.SMTP_PASS;

  console.log('====================================================');
  console.log('ZENTRION.AI / XPANDER EMAIL DISPATCHER TEST');
  console.log('====================================================');
  console.log('SMTP Host:', host);
  console.log('SMTP Port:', port);
  console.log('SMTP User:', user);
  console.log('SMTP Pass:', pass ? '*** (Beállítva)' : 'HIÁNYZIK! (Állítsd be a .env.local fájlban: SMTP_PASS=...)');

  if (!pass) {
    console.log('\n❌ HIBA: A .env.local fájlban még nincs megadva az SMTP_PASS jelszó!');
    console.log('👉 Nyisd meg a .env.local fájlt, és a "SMTP_PASS=" sor után írd be a(z) xpander-automation.ai@outlook.hu fiókod jelszavát.');
    console.log('Ezután futtasd újra: node scripts/test_email.js\n');
    return;
  }

  console.log('\nKapcsolódás a Microsoft Outlook szerverhez...');

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
      tls: { ciphers: 'SSLv3' }
    });

    console.log('Hitelesítés ellenőrzése...');
    await transporter.verify();
    console.log('✅ Sikeres Outlook SMTP kapcsolat!');

    console.log('Teszt levél küldése a(z) 2viktornosss@gmail.com és xpander-automation.ai@outlook.hu címekre...');
    const info = await transporter.sendMail({
      from: `"Zentrion.ai Automation" <${user}>`,
      to: '2viktornosss@gmail.com',
      cc: user,
      subject: '✅ [SIKERES TESZT] Zentrion.ai Email Rendszer Működik!',
      text: `Szia Viktor!\n\nEz az igazolás arról, hogy az email rendszer 100%-ban működik és a levelek közvetlenül a(z) ${user} címről sikeresen megérkeznek a Gmail fiókodba!\n\nÜdvözlettel,\nZentrion.ai Engine`,
      html: `
        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 24px; border-radius: 16px;">
          <h2 style="color: #10b981;">✅ Zentrion.ai Email Rendszer Sikeresen Bekapcsolva!</h2>
          <p>Ez az igazolás arról, hogy a levelek mostantól közvetlenül a(z) <strong>${user}</strong> címről érkeznek a postaládádba.</p>
          <p>PayPal fogadó cím: <strong>2viktornosss@gmail.com</strong></p>
        </div>
      `
    });

    console.log('🎉 SIKER! A levél elküldve! MessageId:', info.messageId);
    console.log('Nézd meg a postafiókodat (2viktornosss@gmail.com és xpander-automation.ai@outlook.hu)!');
  } catch (err) {
    console.error('\n❌ KÜLDÉSI HIBA:', err.message);
    if (err.message.includes('Authentication') || err.message.includes('535')) {
      console.log('👉 Tipp: Ha kétlépcsős azonosítás (2FA) van bekapcsolva a fiókodon, hozz létre egy Alkalmazásjelszót (App Password) a Microsoft fiókod biztonsági beállításaiban, és azt írd be az SMTP_PASS-hoz!');
    }
  }
}

testEmail();
