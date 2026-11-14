'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  Search, 
  Mail, 
  Building, 
  Phone, 
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Key,
  KeyRound,
  UserPlus,
  RefreshCw,
  Lock,
  Download,
  AlertCircle,
  ExternalLink,
  Edit3,
  Trash2,
  Shield,
  Activity
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { UserProfile } from '@/types';

export default function AdminUsersPage() {
  const { users, updateUserPassword, updateUserProfile, deleteUser, addUser, switchRole } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'admin'>('all');
  const [planFilter, setPlanFilter] = useState<'all' | 'Starter' | 'Growth' | 'Enterprise'>('all');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Edit / Reset Password Modal State
  const [passwordModalUser, setPasswordModalUser] = useState<UserProfile | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // New User Registration Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    password: '',
    role: 'client' as 'client' | 'admin',
    plan: 'Growth' as 'Starter' | 'Growth' | 'Enterprise'
  });

  const togglePasswordReveal = (userId: string) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const copyCredentials = (user: UserProfile) => {
    const credText = `xpander.ai Belépési Adatok:\nNév: ${user.name}\nEmail: ${user.email}\nJelszó: ${user.plainPassword || 'Nincs külön jelszó megadva'}\nCég: ${user.company}\nElőfizetés: ${user.plan}`;
    navigator.clipboard.writeText(credText);
    setCopiedId(user.id);
    setFeedbackMessage(`Belépési adatok vágólapra másolva: ${user.email}`);
    setTimeout(() => {
      setCopiedId(null);
      setFeedbackMessage(null);
    }, 3000);
  };

  const handleOpenPasswordModal = (user: UserProfile) => {
    setPasswordModalUser(user);
    setNewPasswordInput(user.plainPassword || '');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser || !newPasswordInput.trim()) return;

    updateUserPassword(passwordModalUser.id, newPasswordInput.trim());
    setFeedbackMessage(`Új jelszó sikeresen beállítva a következő fiókhoz: ${passwordModalUser.email}`);
    setPasswordModalUser(null);
    setNewPasswordInput('');
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPasswordInput(res);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    const created: UserProfile = {
      id: `usr-${Date.now()}`,
      name: newUserForm.name,
      email: newUserForm.email.trim().toLowerCase(),
      company: newUserForm.company || 'Egyéni Vállalkozó',
      phone: newUserForm.phone || '+36 30 000 0000',
      role: newUserForm.role,
      plan: newUserForm.plan,
      createdAt: new Date().toISOString().split('T')[0],
      plainPassword: newUserForm.password || 'XpanderPass2026!',
      apiKey: `nx_live_${Math.random().toString(36).substring(2, 15)}`,
      status: 'active',
      lastLogin: 'Még nem lépett be'
    };

    addUser(created);
    setShowAddUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      company: '',
      phone: '',
      password: '',
      role: 'client',
      plan: 'Growth'
    });
    setFeedbackMessage(`Új ügyfél sikeresen rögzítve: ${created.name} (${created.email})`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const exportAllUsersJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `xpander_users_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered Users
  const filtered = users.filter(u => {
    const matchSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm));
    
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchPlan = planFilter === 'all' || u.plan === planFilter;

    return matchSearch && matchRole && matchPlan;
  });

  const totalClients = users.filter(u => u.role === 'client').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/15 border border-neon-purple/30 text-xs font-semibold text-neon-purple mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Főadminisztrátori Nyilvántartás</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Regisztrált Fiókok & Ügyfél Adatbázis
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Itt látható minden regisztrált ügyfél és adminisztrátor teljes adata. Ha egy felhasználó elfelejti a jelszavát vagy adatait, itt azonnal megtekintheted, kimásolhatod vagy egyetlen kattintással új jelszót állíthatsz be neki.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-95 transition-all shadow-neon-blue/20 shadow-md flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Új Ügyfél Rögzítése</span>
          </button>

          <button
            onClick={exportAllUsersJson}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white glass-panel border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2"
            title="Összes ügyféladat mentése JSON formátumban"
          >
            <Download className="w-4 h-4 text-neon-cyan" />
            <span className="hidden sm:inline">Adatok Exportálása</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert Bar */}
      {feedbackMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{feedbackMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-400/80">xpander.ai Rendszernapló Frissítve</span>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl glass-panel p-4 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Összes Regisztráció</span>
            <Users className="w-4 h-4 text-neon-blue" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{users.length}</div>
          <div className="text-[10px] text-gray-500">Minden rögzített fiók</div>
        </div>

        <div className="rounded-2xl glass-panel p-4 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Aktív B2B Ügyfelek</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{totalClients}</div>
          <div className="text-[10px] text-gray-500">Kliens portál hozzáférés</div>
        </div>

        <div className="rounded-2xl glass-panel p-4 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Adminisztrátorok</span>
            <Shield className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="text-2xl font-black text-neon-purple font-mono">{totalAdmins}</div>
          <div className="text-[10px] text-gray-500">Főadminisztrációs jogkör</div>
        </div>

        <div className="rounded-2xl glass-panel p-4 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Legújabb Fiók</span>
            <Activity className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="text-xs font-bold text-white truncate font-mono">
            {users[0]?.name || 'N/A'}
          </div>
          <div className="text-[10px] text-neon-cyan truncate">{users[0]?.company || 'Nincs cég'}</div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="rounded-3xl glass-panel p-4 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Keresés név, email, cég vagy telefonszám alapján..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-purple"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center bg-nexus-900 border border-white/10 rounded-xl p-1 text-xs shrink-0">
            <span className="text-gray-400 text-[10px] px-2 font-medium">Szerepkör:</span>
            {(['all', 'client', 'admin'] as const).map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                  roleFilter === role ? 'bg-neon-purple text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                {role === 'all' ? 'Mind' : role === 'client' ? 'Ügyfél' : 'Admin'}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-nexus-900 border border-white/10 rounded-xl p-1 text-xs shrink-0">
            <span className="text-gray-400 text-[10px] px-2 font-medium">Csomag:</span>
            {(['all', 'Starter', 'Growth', 'Enterprise'] as const).map(plan => (
              <button
                key={plan}
                onClick={() => setPlanFilter(plan)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                  planFilter === plan ? 'bg-neon-blue text-nexus-950 font-bold shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                {plan === 'all' ? 'Mind' : plan}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Registrations Table */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl bg-nexus-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-nexus-900/60 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-4 px-5">Regisztrált Fiók</th>
                <th className="py-4 px-4">Cég & Elérhetőség</th>
                <th className="py-4 px-4 bg-neon-purple/5 text-neon-purple font-bold">
                  🔐 Belépési Jelszó & Adat (Admin)
                </th>
                <th className="py-4 px-4">Szerepkör & Csomag</th>
                <th className="py-4 px-4">Dátum & Belépés</th>
                <th className="py-4 px-5 text-right">Műveletek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 text-sm">
                    Nem található a feltételeknek megfelelő regisztráció.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const isRevealed = revealedPasswords[user.id] || false;
                  const isCopied = copiedId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                      
                      {/* 1. Felhasználó & Státusz */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center text-nexus-950 font-extrabold text-xs shadow-md">
                              {user.name.charAt(0)}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-nexus-950" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {user.role === 'admin' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Cég & Kapcsolat */}
                      <td className="py-4 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-200 font-medium">
                          <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate max-w-[170px]">{user.company}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                          <Mail className="w-3 h-3 text-neon-blue shrink-0" />
                          <a href={`mailto:${user.email}`} className="hover:text-neon-blue transition-colors truncate max-w-[170px]">
                            {user.email}
                          </a>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                            <Phone className="w-3 h-3 text-neon-cyan shrink-0" />
                            <a href={`tel:${user.phone}`} className="hover:text-neon-cyan transition-colors">
                              {user.phone}
                            </a>
                          </div>
                        )}
                      </td>

                      {/* 3. Belépési Jelszó & Hitelesítési Adatok (Kifejezetten az elfelejtett adatokhoz!) */}
                      <td className="py-4 px-4 bg-neon-purple/5">
                        <div className="space-y-1.5">
                          
                          {/* Password Box */}
                          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-nexus-900 border border-neon-purple/30 w-fit">
                            <Lock className="w-3.5 h-3.5 text-neon-purple shrink-0 ml-1" />
                            
                            <span className="font-mono text-xs text-white px-2 py-0.5 select-all">
                              {isRevealed ? (user.plainPassword || 'Nincs jelszó') : '••••••••••••'}
                            </span>

                            {/* Eye button */}
                            <button
                              onClick={() => togglePasswordReveal(user.id)}
                              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                              title={isRevealed ? 'Jelszó elrejtése' : 'Jelszó megtekintése'}
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5 text-neon-blue" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>

                            {/* Quick copy credentials */}
                            <button
                              onClick={() => copyCredentials(user)}
                              className={`p-1 rounded-lg transition-colors ${
                                isCopied ? 'text-emerald-400 bg-emerald-500/20' : 'text-gray-400 hover:text-white hover:bg-white/10'
                              }`}
                              title="Összes belépési adat másolása vágólapra"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenPasswordModal(user)}
                              className="text-[10px] text-neon-purple hover:underline flex items-center gap-1 font-semibold"
                            >
                              <KeyRound className="w-3 h-3" />
                              <span>Új jelszó beállítása</span>
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* 4. Szerepkör & Csomag */}
                      <td className="py-4 px-4 space-y-2">
                        {/* Role selector */}
                        <div>
                          <select
                            value={user.role}
                            onChange={(e) => updateUserProfile(user.id, { role: e.target.value as 'client' | 'admin' })}
                            className="px-2.5 py-1 rounded-lg bg-nexus-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-neon-purple"
                          >
                            <option value="client">Ügyfél (Client)</option>
                            <option value="admin">Főadmin (Admin)</option>
                          </select>
                        </div>

                        {/* Plan badge */}
                        <div>
                          <select
                            value={user.plan}
                            onChange={(e) => updateUserProfile(user.id, { plan: e.target.value as any })}
                            className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-[11px] focus:outline-none focus:border-neon-blue"
                          >
                            <option value="Starter">Starter (240k)</option>
                            <option value="Growth">Growth (380k)</option>
                            <option value="Enterprise">Enterprise</option>
                          </select>
                        </div>
                      </td>

                      {/* 5. Regisztráció & Utolsó belépés */}
                      <td className="py-4 px-4 space-y-1 text-gray-400 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          <span>Kelt: <strong>{user.createdAt}</strong></span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Belépve: {user.lastLogin || 'Nemrég'}
                        </div>
                      </td>

                      {/* 6. Műveletek */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Impersonate button */}
                          <button
                            onClick={() => switchRole(user.role)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="Nézet váltása erre a szerepkörre"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-neon-blue" />
                          </button>

                          {/* Edit / Reset */}
                          <button
                            onClick={() => handleOpenPasswordModal(user)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-neon-purple hover:bg-neon-purple/10 transition-colors"
                            title="Jelszó módosítása"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Biztosan törölni szeretnéd a(z) ${user.name} fiókot?`)) {
                                deleteUser(user.id);
                                setFeedbackMessage(`Fiók sikeresen eltávolítva: ${user.name}`);
                                setTimeout(() => setFeedbackMessage(null), 3000);
                              }
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Fiók törlése"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: JELSZÓ MÓDOSÍTÁSA / RESET HA ELFELEJTETTE AZ ÜGYFÉL */}
      {/* ========================================================================= */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="max-w-md w-full glass-panel border border-neon-purple/40 rounded-3xl p-6 bg-nexus-950 space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-neon-purple/20 text-neon-purple flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Jelszó Visszaállítása & Módosítása</h3>
                  <p className="text-xs text-gray-400 truncate max-w-xs">{passwordModalUser.name} ({passwordModalUser.email})</p>
                </div>
              </div>
              <button
                onClick={() => setPasswordModalUser(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
              <div className="text-gray-400 font-medium">Jelenlegi jelszó:</div>
              <div className="font-mono text-neon-blue font-bold select-all">
                {passwordModalUser.plainPassword || 'Nincs rögzített jelszó'}
              </div>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Új Jelszó Megadása:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Írj be új jelszót..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-neon-purple"
                  />
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-semibold shrink-0 transition-colors"
                    title="Véletlenszerű erős jelszó készítése"
                  >
                    🎲 Generálás
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5"
                >
                  Mégse
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-95 shadow-neon-blue/20 shadow-md"
                >
                  Új Jelszó Mentése
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ÚJ FELHASZNÁLÓ KÉZI REGISZTRÁLÁSA AZ ADMIN ÁLTAL */}
      {/* ========================================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="max-w-lg w-full glass-panel border border-neon-blue/40 rounded-3xl p-6 bg-nexus-950 space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-neon-blue/20 text-neon-blue flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Új Ügyfél / Fiók Kézi Rögzítése</h3>
                  <p className="text-xs text-gray-400">Azonnali belépési adatok generálása egy új partnernek</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Teljes Név *</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    placeholder="Pl. Kiss József"
                    className="w-full px-3 py-2 rounded-xl bg-nexus-900 border border-white/10 text-white focus:outline-none focus:border-neon-blue"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Email Cím *</label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="jozsef@ceg.hu"
                    className="w-full px-3 py-2 rounded-xl bg-nexus-900 border border-white/10 text-white focus:outline-none focus:border-neon-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Cégnév</label>
                  <input
                    type="text"
                    value={newUserForm.company}
                    onChange={(e) => setNewUserForm({ ...newUserForm, company: e.target.value })}
                    placeholder="Apex Logistics Kft."
                    className="w-full px-3 py-2 rounded-xl bg-nexus-900 border border-white/10 text-white focus:outline-none focus:border-neon-blue"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Telefonszám</label>
                  <input
                    type="tel"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="+36 30 555 6677"
                    className="w-full px-3 py-2 rounded-xl bg-nexus-900 border border-white/10 text-white focus:outline-none focus:border-neon-blue"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Kezdeti Jelszó (amivel beléphet):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="Pl. XpanderPass2026!"
                    className="flex-1 px-3 py-2 rounded-xl bg-nexus-900 border border-white/10 text-white font-mono focus:outline-none focus:border-neon-blue"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
                      let p = '';
                      for (let i = 0; i < 10; i++) p += chars.charAt(Math.floor(Math.random() * chars.length));
                      setNewUserForm(prev => ({ ...prev, password: p }));
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 shrink-0 font-medium"
                  >
                    🎲 Véletlen
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Szerepkör</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-nexus-900 border border-white/10 text-white focus:outline-none focus:border-neon-purple"
                  >
                    <option value="client">Ügyfél (Client)</option>
                    <option value="admin">Főadminisztrátor (Admin)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Csomag</label>
                  <select
                    value={newUserForm.plan}
                    onChange={(e) => setNewUserForm({ ...newUserForm, plan: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-nexus-900 border border-white/10 text-white focus:outline-none focus:border-neon-blue"
                  >
                    <option value="Starter">Starter (240k)</option>
                    <option value="Growth">Growth (380k)</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5"
                >
                  Mégse
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-nexus-950 bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-95 shadow-neon-blue/20 shadow-md"
                >
                  Fiók Létrehozása & Rögzítése
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
