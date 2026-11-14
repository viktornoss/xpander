'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bot, 
  LayoutDashboard, 
  Layers, 
  MessageSquare, 
  ShoppingBag, 
  Bell, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  User, 
  ChevronRight, 
  ExternalLink, 
  Menu, 
  X,
  Zap,
  Activity,
  Workflow,
  Check
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import ZentrionLogo from '@/components/brand/ZentrionLogo';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, logout, switchRole, notifications, markNotificationRead, markAllNotificationsRead } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { label: 'Áttekintés', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Vizuális Szerkesztő', href: '/dashboard/builder', icon: <Workflow className="w-4 h-4 text-neon-purple" /> },
    { label: 'Automatizációk', href: '/dashboard/automations', icon: <Layers className="w-4 h-4" /> },
    { label: 'API Integrációk', href: '/dashboard/integrations', icon: <Zap className="w-4 h-4 text-neon-cyan" /> },
    { label: 'AI Chatbotok', href: '/dashboard/chatbots', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Megrendelések & Státusz', href: '/dashboard/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Értesítések', href: '/dashboard/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount > 0 ? unreadCount : undefined },
    { label: 'Beállítások & API', href: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-nexus-950 flex flex-col lg:flex-row text-foreground">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-nexus-950/80 backdrop-blur-xl p-5 sticky top-0 h-screen justify-between z-30">
        <div className="space-y-6">
          
          {/* Logo & Agency brand */}
          <div className="px-2">
            <ZentrionLogo size="md" showSubtitle subtitleText="Client Portal" linkToHome />
          </div>

          {/* User info box */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-xs font-bold text-white truncate">
              {currentUser?.name || 'Ügyfél'}
            </div>
            <div className="text-[11px] text-gray-400 truncate">
              {currentUser?.company || 'Vállalkozás'}
            </div>
            <div className="pt-1.5 flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                {currentUser?.plan || 'Growth'} Csomag
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Aktív
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-white border border-neon-blue/30 shadow-neon-blue/10 shadow'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-neon-blue' : 'text-gray-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-neon-purple text-nexus-950 font-bold text-[10px] flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom Sidebar area */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          
          {/* Quick switch to admin */}
          <button
            onClick={() => switchRole('admin')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neon-purple/10 hover:bg-neon-purple/20 border border-neon-purple/20 text-xs font-semibold text-neon-purple transition-all"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Váltás Admin Portálra</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Vissza a főoldalra</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kijelentkezés</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-nexus-950/80 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          
          {/* Mobile toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <ZentrionLogo size="sm" linkToHome />
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ZentrionFlow TS Motor & OpenAI Rendszerek: <strong>100% Online</strong></span>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-3">
            
            {/* Quick Demo Toggle */}
            <div className="flex items-center bg-nexus-900 border border-white/10 rounded-full p-1 text-[11px]">
              <button
                onClick={() => switchRole('client')}
                className="px-2.5 py-0.5 rounded-full font-bold bg-neon-blue text-nexus-950 shadow"
              >
                Ügyfél
              </button>
              <button
                onClick={() => switchRole('admin')}
                className="px-2.5 py-0.5 rounded-full text-gray-400 hover:text-white"
              >
                Admin
              </button>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-purple text-nexus-950 font-bold text-[9px] flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel shadow-2xl p-3 border border-white/10 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                    <span className="text-xs font-bold text-white">Értesítések</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-neon-blue hover:underline"
                      >
                        Összes olvasott
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                          n.read ? 'bg-white/5 text-gray-400' : 'bg-neon-purple/10 text-gray-200 border border-neon-purple/20'
                        }`}
                      >
                        <div className="font-semibold text-white">{n.title}</div>
                        <div className="text-[11px] text-gray-300 mt-0.5">{n.message}</div>
                        <div className="text-[9px] text-gray-500 mt-1">{n.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar badge */}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center text-nexus-950 font-extrabold text-xs">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-semibold text-white">{currentUser?.name}</div>
                <div className="text-[10px] text-gray-400">{currentUser?.company}</div>
              </div>
            </div>

          </div>
        </header>

        {/* Mobile Sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="lg:hidden border-b border-white/10 bg-nexus-950 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-200 hover:bg-white/5"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  switchRole('admin');
                  setMobileSidebarOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-xs font-semibold text-neon-purple"
              >
                Váltás Admin Portálra →
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Page Content */}
        <main className="p-4 sm:p-8 flex-1">
          {children}
        </main>

      </div>
    </div>
  );
}

