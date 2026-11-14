'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Lock, Mail, User, Building, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Phone } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import ZentrionLogo from '@/components/brand/ZentrionLogo';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Kérjük, töltsd ki a kötelező mezőket!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await register(
        formData.name,
        formData.email,
        formData.company,
        formData.password,
        formData.phone
      );
      if (res.success) {
        if (formData.email.toLowerCase().includes('admin')) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Hiba történt a regisztráció során.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-grid-pattern">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <ZentrionLogo size="lg" linkToHome />
        </div>
        <h2 className="text-center text-2xl font-extrabold text-white">
          Fiók Létrehozása
        </h2>
        <p className="mt-2 text-center text-xs text-gray-400">
          Csatlakozz az automatizált vállalatok új korszakához
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="rounded-3xl glass-panel p-8 border border-white/10 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Teljes Név *</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Kovács Tamás"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Céges E-mail Cím *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tamas@ceged.hu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Cégnév</label>
              <div className="relative">
                <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="TechVentures Kft."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Telefonszám (Kapcsolattartáshoz)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+36 30 123 4567"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Jelszó</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-blue"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-neon-blue/30 shadow-md disabled:opacity-50"
              >
                <span>{loading ? 'Fiók készítése...' : 'Ingyenes Regisztráció'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="space-y-2 pt-2 border-t border-white/10 text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Azonnali hozzáférés a demó környezethez</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nem szükséges bankkártya</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <span className="text-xs text-gray-400">Már van regisztrációd? </span>
            <Link href="/login" className="text-xs font-semibold text-neon-blue hover:underline">
              Jelentkezz be
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

