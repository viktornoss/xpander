'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  Layers, 
  BarChart3, 
  Settings, 
  ExternalLink, 
  LogOut, 
  LayoutDashboard, 
  Activity,
  Workflow,
  Lock,
  Mail
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import XpanderLogo from '@/components/brand/XpanderLogo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, switchRole, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const navItems = [
    { label: 'Rendszer Áttekintés', href: '/admin', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Felhasználók & Ügyfelek', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Megrendelések Kezelése', href: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Szolgáltatások & Csomagok', href: '/admin/services', icon: <Layers className="w-4 h-4" /> },
    { label: 'Email Értesítések', href: '/admin/notifications', icon: <Mail className="w-4 h-4 text-neon-blue" /> },
  ];

  // If user is not admin, show authorization guard with instant admin unlock button
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-nexus-950 flex flex-col justify-center items-center p-6 text-center">
        <div className="max-w-md rounded-3xl glass-panel p-8 border border-neon-purple/40 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-neon-purple/20 text-neon-purple flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white">Adminisztrátori Jogosultság Szükséges</h2>
          <p className="text-xs text-gray-400">
            Jelenleg normál ügyfélként ({currentUser?.email}) vagy bejelentkezve. Az adminisztrációs felület eléréséhez válts adminisztrátori szerepkörre!
          </p>
          <div className="pt-2 space-y-2">
            <button
              onClick={() => switchRole('admin')}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 shadow-neon-purple/30 shadow-md"
            >
              Belépés Adminként (Nagy Viktor)
            </button>
            <Link
              href="/dashboard"
              className="block w-full py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5"
            >
              Vissza az Ügyfél Dashboardra
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nexus-950 flex flex-col lg:flex-row text-foreground">
      
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-nexus-950/90 backdrop-blur-xl p-5 sticky top-0 h-screen justify-between z-30">
        <div className="space-y-6">
          
          {/* Admin Header */}
          <div className="px-2">
            <XpanderLogo size="md" showSubtitle subtitleText="Admin Portál" linkToHome />
          </div>

          {/* Admin user info */}
          <div className="p-3 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 space-y-1">
            <div className="text-xs font-bold text-white truncate">{currentUser?.name}</div>
            <div className="text-[11px] text-neon-purple font-semibold">Főadminisztrátor</div>
            <div className="text-[10px] text-gray-400 font-mono">xpander-admin-hq</div>
          </div>

          {/* Admin Nav */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-neon-purple/20 text-white border border-neon-purple/40 shadow-neon-purple/10 shadow'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={isActive ? 'text-neon-purple' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom switch to client */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <button
            onClick={() => switchRole('client')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/20 text-xs font-semibold text-neon-blue transition-all"
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span>Váltás Ügyfél Nézetre</span>
            </div>
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Főoldal</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 bg-nexus-950/80 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-white">xpander.ai Agency Adminisztráció</span>
            <span className="text-gray-400">|</span>
            <span className="text-neon-cyan font-mono">v2.4.0 Live</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => switchRole('client')}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/15 text-gray-300"
            >
              ← Ügyfél Portal
            </button>
            <div className="w-8 h-8 rounded-xl bg-neon-purple flex items-center justify-center text-nexus-950 font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8 flex-1">
          {children}
        </main>
      </div>

    </div>
  );
}

