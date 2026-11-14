import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { VoiceAiProvider } from '@/components/voice/VoiceAiContext';
import ScrollToTopOnNavigation from '@/components/layout/ScrollToTopOnNavigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Xpander.ai',
  description: 'Xpander.ai – Autonóm AI infrastruktúra és munkafolyamat automatizálás. Zéró Make.com, zéró n8n, 100% saját natív motor.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className="dark scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} font-sans bg-nexus-950 text-foreground antialiased min-h-screen`}>
        <AuthProvider>
          <VoiceAiProvider>
            <ScrollToTopOnNavigation />
            {children}
          </VoiceAiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
