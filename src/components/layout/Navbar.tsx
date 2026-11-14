'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bot, 
  Sparkles, 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  LayoutDashboard, 
  ArrowRight,
  LogOut,
  Zap,
  Layers,
  Mic,
  Radio,
  Play
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useVoiceAi } from '@/components/voice/VoiceAiContext';
import XpanderLogo from '@/components/brand/XpanderLogo';
import { INITIAL_SERVICES } from '@/lib/mock-data';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout, switchRole } = useAuth();
  const { openVoiceAi } = useVoiceAi();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleServicesMouseEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setServicesDropdownOpen(true);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 280);
  };

  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/85 backdrop-blur-2xl">
      <div className="glass-rim-top" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Official xpander.ai Brand Logo in Stark Monochrome */}
          <XpanderLogo size="md" showSubtitle subtitleText="Enterprise AI Platform" linkToHome />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <Link 
              href="/" 
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                pathname === '/' ? 'text-black bg-white shadow-sm' : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Főoldal
            </Link>

            {/* Services Dropdown with seamless unbreakable hover bridge */}
            <div 
              className="relative py-1.5" 
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
            >
              <button
                type="button"
                onClick={() => setServicesDropdownOpen(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  pathname.startsWith('/services') ? 'text-black bg-white shadow-sm' : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Szolgáltatások</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesDropdownOpen && (
                <div 
                  className="absolute left-0 top-full pt-2 w-88 z-50 animate-in fade-in zoom-in-95 duration-150 before:absolute before:-top-3 before:left-0 before:right-0 before:h-4 before:bg-transparent"
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <div className="rounded-2xl glass-card-3d shadow-2xl p-3 border border-white/20 bg-black/95 backdrop-blur-2xl grid gap-1.5">
                    <div className="glass-rim-top" />
                    <div className="px-3 py-1 text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase border-b border-white/10 mb-1 flex items-center justify-between">
                      <span>Vállalati AI Megoldások</span>
                      <span className="text-white font-mono font-bold">7 Rendszer</span>
                    </div>
                    {INITIAL_SERVICES.map((srv) => (
                      <Link
                        key={srv.id}
                        href={`/services/${srv.slug}`}
                        onClick={() => setServicesDropdownOpen(false)}
                        className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-all group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 group-hover:bg-white/15 transition-all shrink-0 mt-0.5">
                          <Zap className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white group-hover:text-white transition-colors flex items-center justify-between">
                            <span className="truncate">{srv.title}</span>
                            {srv.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-neutral-300 border border-white/15 ml-1 shrink-0">
                                {srv.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                            {srv.shortDesc}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <div className="pt-2 border-t border-white/10 mt-1">
                      <Link
                        href="/services"
                        onClick={() => setServicesDropdownOpen(false)}
                        className="text-xs text-center block w-full py-1 text-white hover:text-neutral-300 font-bold transition-colors"
                      >
                        Összes szolgáltatás megtekintése →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/tour" 
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                pathname === '/tour' ? 'text-black bg-white shadow-sm' : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Videós Bemutató</span>
            </Link>

            <Link 
              href="/audit" 
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 group ${
                pathname === '/audit' ? 'bg-white text-black shadow' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              <Sparkles className="w-3 h-3 text-white group-hover:rotate-12 transition-transform" />
              <span>AI Audit</span>
              <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wide ${
                pathname === '/audit' ? 'bg-black text-white' : 'bg-white text-black'
              }`}>
                Ingyenes
              </span>
            </Link>

            <Link 
              href="/#ai-chat" 
              className="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Chatbot</span>
            </Link>

            <Link 
              href="/#process" 
              className="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Működés
            </Link>

            <Link 
              href="/#pricing" 
              className="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Árazás
            </Link>

            <Link 
              href="/#contact" 
              className="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Kapcsolat
            </Link>
          </nav>

          {/* Right Action / Auth / Role Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Minimal Monochrome Voice AI Trigger */}
            <button
              onClick={openVoiceAi}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition-all hover:scale-105 active:scale-95 group cursor-pointer"
              title="Hangalapú AI Asszisztens Megnyitása"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <Mic className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
              <span className="text-white font-semibold tracking-wide">Voice AI</span>
            </button>

            {/* High-Contrast "Book a Demo" Pill CTA (like the screenshot!) */}
            <Link
              href="/services/appointment-booking"
              className="px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all shadow-md hover:scale-105 active:scale-95 tracking-wide flex items-center gap-1.5"
            >
              <span>Időpontfoglalás</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Quick Demo Role Switcher Badge */}
            <div className="flex items-center bg-neutral-900 border border-white/10 rounded-full p-1 text-xs">
              <button
                onClick={() => switchRole('client')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  currentUser?.role === 'client'
                    ? 'bg-white text-black font-bold shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Váltás ügyfél nézetre"
              >
                Ügyfél
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  currentUser?.role === 'admin'
                    ? 'bg-neutral-800 text-white font-bold border border-white/20'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Váltás adminisztrátori nézetre"
              >
                Admin
              </button>
            </div>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center text-nexus-950 font-bold text-xs">
                    {currentUser.role === 'admin' ? (
                      <ShieldCheck className="w-4 h-4 text-white" />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-white leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-neon-blue">
                      {currentUser.role === 'admin' ? 'Adminisztrátor' : currentUser.company}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel shadow-2xl p-2 border border-white/10 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs text-gray-400">Bejelentkezve mint:</p>
                      <p className="text-xs font-semibold text-white truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                        {currentUser.role === 'admin' ? 'Adminisztrátor' : `${currentUser.plan} Csomag`}
                      </span>
                    </div>

                    <Link
                      href={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white hover:bg-white/10 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-neon-blue" />
                      <span>{currentUser.role === 'admin' ? 'Admin Dashboard' : 'Ügyfél Dashboard'}</span>
                    </Link>

                    {currentUser.role === 'client' && (
                      <Link
                        href="/dashboard/automations"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Layers className="w-4 h-4 text-neon-purple" />
                        <span>Automatizációk</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors mt-1 border-t border-white/10"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Kijelentkezés</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Bejelentkezés
                </Link>
                <Link
                  href="/register"
                  className="relative group px-4 py-2 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-neon-blue/30 shadow-md"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-indigo to-neon-purple transition-all duration-300 group-hover:scale-105" />
                  <span className="relative flex items-center gap-1.5">
                    Regisztráció
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>
            )}

            {/* Direct Dashboard Link */}
            <Link
              href={currentUser?.role === 'admin' ? '/admin' : '/dashboard'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-neon-blue" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-nexus-950/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs text-gray-400 font-medium">Szerepkör váltó:</span>
            <div className="flex items-center bg-nexus-900 border border-white/10 rounded-full p-1 text-xs">
              <button
                onClick={() => switchRole('client')}
                className={`px-3 py-1 rounded-full font-medium ${
                  currentUser?.role === 'client' ? 'bg-neon-blue text-nexus-950 font-bold' : 'text-gray-400'
                }`}
              >
                Ügyfél
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-3 py-1 rounded-full font-medium ${
                  currentUser?.role === 'admin' ? 'bg-neon-purple text-white font-bold' : 'text-gray-400'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Voice AI Mobile Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openVoiceAi();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/40 text-white font-bold text-sm shadow-md"
          >
            <Mic className="w-4 h-4 text-neon-cyan animate-pulse" />
            <span>Élő Voice AI Indítása (Beszédvezérlés)</span>
          </button>

          <div className="space-y-1">
            <Link
              href="/audit"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-bold text-white bg-white/10 border border-white/15 my-1"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Ingyenes AI Folyamat-Audit</span>
            </Link>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-white/5"
            >
              Főoldal
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-neon-blue hover:bg-white/5"
            >
              Szolgáltatások (7 AI rendszer)
            </Link>
            <Link
              href="/#ai-chat"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold text-neon-purple hover:bg-neon-purple/10"
            >
              <Bot className="w-4 h-4" />
              <span>AI Chatbot (Kipróbálás)</span>
            </Link>
            <Link
              href="/#process"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5"
            >
              Működési folyamat
            </Link>
            <Link
              href="/#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5"
            >
              Megtakarítás kalkulátor
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5"
            >
              Árazás
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5"
            >
              Kapcsolat
            </Link>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <Link
              href={currentUser?.role === 'admin' ? '/admin' : '/dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple shadow-lg"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Megnyitás: {currentUser?.role === 'admin' ? 'Admin Dashboard' : 'Ügyfél Dashboard'}</span>
            </Link>

            {currentUser ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded-xl text-sm font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20"
              >
                Kijelentkezés ({currentUser.name})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl text-sm font-medium text-white bg-white/10"
                >
                  Bejelentkezés
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl text-sm font-medium text-nexus-950 bg-neon-blue font-bold"
                >
                  Regisztráció
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

