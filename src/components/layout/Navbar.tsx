'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Sparkles, 
  ArrowRight, 
  User, 
  LogOut, 
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import ZentrionLogo from '@/components/brand/ZentrionLogo';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="glass-rim-top" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Official Zentrion.ai Brand Logo */}
          <ZentrionLogo size="md" linkToHome />

          {/* Minimalist Desktop Navigation Links (Only 4 core items) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <Link 
              href="/services" 
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                pathname.startsWith('/services') && !pathname.includes('appointment-booking')
                  ? 'text-black bg-white shadow-sm' 
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Szolgáltatások
            </Link>

            <Link 
              href="/#process" 
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Működés
            </Link>

            <Link 
              href="/#pricing" 
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Árazás
            </Link>

            <Link 
              href="/tour" 
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                pathname === '/tour' 
                  ? 'text-black bg-white shadow-sm' 
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Bemutató
            </Link>
          </nav>

          {/* Right Action Buttons (Clean & High-Contrast) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Primary CTA: Ingyenes AI Audit */}
            <Link 
              href="/audit" 
              className="px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all shadow-md hover:scale-105 active:scale-95 tracking-wide flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Ingyenes AI Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* User Profile / Dashboard dropdown if logged in, or simple Belépés link */}
            {currentUser ? (
              <div className="relative ml-1">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-8 h-8 rounded-full bg-neutral-900 border border-white/20 text-white flex items-center justify-center text-xs font-bold hover:border-white/50 transition-all"
                  title={currentUser.name}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-neutral-950 border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-[11px] font-semibold text-white truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{currentUser.email}</p>
                    </div>

                    <Link
                      href={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-neutral-200 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Dashboard</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors mt-1 border-t border-white/10"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Kijelentkezés</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 transition-colors"
              >
                Belépés
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-neutral-300 hover:text-white"
              aria-label="Menü megnyitása"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Clean Minimalist List) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-black/95 backdrop-blur-2xl px-5 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-neutral-200 hover:text-white hover:bg-white/5"
            >
              Szolgáltatások
            </Link>
            <Link
              href="/#process"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-neutral-200 hover:text-white hover:bg-white/5"
            >
              Működés
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-neutral-200 hover:text-white hover:bg-white/5"
            >
              Árazás
            </Link>
            <Link
              href="/tour"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-neutral-200 hover:text-white hover:bg-white/5"
            >
              Bemutató Túra
            </Link>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <Link
              href="/audit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white text-black font-bold text-xs shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Ingyenes AI Folyamat-Audit</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </Link>

            <div className="pt-2 text-center">
              {currentUser ? (
                <Link
                  href={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Dashboard megnyitása ({currentUser.name})
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Ügyfélfiók Belépés
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
