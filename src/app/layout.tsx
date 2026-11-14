import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { VoiceAiProvider } from '@/components/voice/VoiceAiContext';
import { CartProvider } from '@/lib/cart-context';
import CartDrawer from '@/components/cart/CartDrawer';
import FloatingCartButton from '@/components/cart/FloatingCartButton';
import ScrollToTopOnNavigation from '@/components/layout/ScrollToTopOnNavigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Zentrion.ai',
  description: 'Zentrion.ai – Autonóm Vállalati AI Infrastruktúra és Munkafolyamat Automatizáció. Zéró Make.com, zéró n8n, 100% saját natív motor.',
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
          <CartProvider>
            <VoiceAiProvider>
              <ScrollToTopOnNavigation />
              {children}
              <CartDrawer />
              <FloatingCartButton />
            </VoiceAiProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
