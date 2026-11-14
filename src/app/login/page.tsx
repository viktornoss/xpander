'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { DEMO_CLIENT, DEMO_ADMIN } from '@/lib/mock-data';
import ZentrionLogo from '@/components/brand/ZentrionLogo';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Kérjük, add meg az e-mail címed!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.role === 'admin' || email.toLowerCase().includes('admin') || email.toLowerCase().includes('tolnai') || email.toLowerCase().includes('viktor')) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Hiba történt a bejelentkezés során.');
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoClient = async () => {
    switchRole('client');
    await login(DEMO_CLIENT.email);
    router.push('/dashboard');
  };

  const loginAsDemoAdmin = async () => {
    switchRole('admin');
    await login(DEMO_ADMIN.email);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-nexus-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-grid-pattern">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <ZentrionLogo size="lg" linkToHome />
        </div>
        <h2 className="text-center text-2xl font-extrabold text-white">
          Bejelentkezés a Platformra
        </h2>
        <p className="mt-2 text-center text-xs text-gray-400">
          Kezeld az aktív automatizációidat, chatbotjaidat és feladataidat
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="rounded-3xl glass-panel p-8 border border-white/10 shadow-2xl space-y-6">
          
          {/* Quick Demo Fast-Login Helpers */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neon-blue block">
              1-Kattintásos Demó Belépés:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={loginAsDemoClient}
                className="py-2 px-3 rounded-xl bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/30 text-neon-blue text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Ügyfélként</span>
              </button>
              <button
                type="button"
                onClick={loginAsDemoAdmin}
                className="py-2 px-3 rounded-xl bg-neon-purple/10 hover:bg-neon-purple/20 border border-neon-purple/30 text-neon-purple text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Adminként</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/10" />
            <span className="flex-shrink mx-3 text-[11px] text-gray-500 uppercase">vagy saját fiókkal</span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">E-mail cím</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pelda@ceg.hu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-gray-300">Jelszó</label>
                <a href="#" className="text-[11px] text-neon-blue hover:underline">
                  Elfelejtetted?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-neon-blue/30 shadow-md disabled:opacity-50"
              >
                <span>{loading ? 'Bejelentkezés...' : 'Bejelentkezés'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-white/10">
            <span className="text-xs text-gray-400">Nincs még fiókod? </span>
            <Link href="/register" className="text-xs font-semibold text-neon-blue hover:underline">
              Regisztrálj itt
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

