'use client';

import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ContactSection() {
  const { addOrder } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: 'AI Intelligens Chatbot',
    budget: '240.000 - 400.000 Ft (Starter)',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const submissionPayload = { ...formData };
    const clientName = formData.name;
    setSubmittedName(clientName);

    // 1. Azonnal kiürítjük az űrlap mezőit, hogy ne maradjanak ott az adatok
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      service: 'AI Intelligens Chatbot',
      budget: '240.000 - 400.000 Ft (Starter)',
      message: ''
    });

    // 2. Azonnal átváltunk a sikeres küldés nézetre
    setSubmitted(true);

    try {
      // 3. Mentés a helyi megrendelések/ajánlatkérések közé
      addOrder({
        serviceId: 'srv-contact-request',
        serviceTitle: submissionPayload.service,
        packageType: 'Custom',
        price: submissionPayload.budget,
        notes: `Érdeklődő: ${submissionPayload.name} (${submissionPayload.company || 'Nincs cég'}, Tel: ${submissionPayload.phone || 'Nincs megadva'}). Üzenet: ${submissionPayload.message || 'Nincs megjegyzés'}`
      });

      // 4. Kiküldés a központi email dispatcher API-nak (xpander-automation.ai@outlook.hu)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload)
      });
      const data = await res.json();
      setDispatchResult(data);

    } catch (err) {
      console.error('Contact submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300">
            <Calendar className="w-3.5 h-3.5 text-white" />
            <span>Ingyenes 20 Perces AI Folyamat-Audit</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Kezdjük el a Vállalkozásod Automatizálását
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-normal">
            Töltsd ki az űrlapot, és mérnökcsapatunk 4 munkaórán belül jelentkezik egy konkrét automatizációs tervvel és pontos költségkalkulációval.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left info box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl glass-card-3d p-8 space-y-6 shadow-xl scroll-reveal-scale">
              <div className="glass-rim-top" />
              <h3 className="text-xl font-bold text-white">Mi történik a konzultáción?</h3>
              
              <div className="space-y-4 text-xs sm:text-sm text-neutral-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    1
                  </div>
                  <div>
                    <strong className="text-white block">Munkafolyamatok átvilágítása</strong>
                    Átbeszéljük, hol veszíti a csapat a legtöbb időt manuális feladatokkal.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    2
                  </div>
                  <div>
                    <strong className="text-white block">Technikai megvalósíthatóság</strong>
                    Megmutatjuk, melyik AI modell (GPT-4o, Claude) és saját motor webhook a legoptimálisabb.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    3
                  </div>
                  <div>
                    <strong className="text-white block">ROI és árajánlat kalkuláció</strong>
                    Konkrét időbeli és pénzügyi megtérülési tervet kapsz kézhez.
                  </div>
                </div>
              </div>

              {/* Contact info list */}
              <div className="border-t border-white/10 pt-6 space-y-3 text-xs text-neutral-400">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white" />
                  <a href="mailto:xpander-automation.ai@outlook.hu" className="text-white hover:underline transition-colors font-medium">
                    xpander-automation.ai@outlook.hu
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white" />
                  <span>+36 1 800 9999 (H-P 9:00 - 18:00)</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-white" />
                  <span>1054 Budapest, Szabadság tér 7. (Bank Center)</span>
                </div>
              </div>
            </div>

            {/* SLA Badge */}
            <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-white shrink-0" />
              <div className="text-xs">
                <span className="text-white font-semibold block">Garantált titoktartás (NDA)</span>
                <span className="text-neutral-400">Üzleti adataid és folyamataid a legmagasabb biztonsági védelem alatt állnak.</span>
              </div>
            </div>
          </div>

          {/* Right form box */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl glass-spotlight p-8 sm:p-10 border border-white/15 shadow-2xl relative scroll-reveal-scale">
              <div className="glass-rim-top" />
              
              {submitted ? (
                <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Megkeresés Sikeresen Elküldve!</h3>
                  <p className="text-gray-300 text-sm max-w-md mx-auto">
                    Köszönjük{submittedName ? `, ${submittedName}` : ''}! Az adataidat rögzítettük, az űrlap kiürült, és az értesítést továbbítottuk az illetékesnek: <strong className="text-neon-blue">xpander-automation.ai@outlook.hu</strong>.
                  </p>

                  {/* 1-Click Direct Delivery & Preview Section */}
                  <div className="p-4 rounded-2xl bg-nexus-900/90 border border-emerald-500/30 text-left space-y-3 max-w-lg mx-auto">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Közvetlen Email Elérés & Kiküldés</span>
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">1-Kattintásos Küldés</span>
                    </div>

                    <p className="text-[11px] text-gray-300">
                      Szeretnéd azonnal ellenőrizni vagy kiküldeni a saját leveleződből is? Kattints az alábbi gombok valamelyikére:
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {dispatchResult?.gmailComposeUrl && (
                        <a
                          href={dispatchResult.gmailComposeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all shadow-sm"
                        >
                          <Mail className="w-3.5 h-3.5 text-rose-400" />
                          <span>Kiküldés Gmailből</span>
                        </a>
                      )}

                      {dispatchResult?.outlookComposeUrl && (
                        <a
                          href={dispatchResult.outlookComposeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-bold transition-all shadow-sm"
                        >
                          <Mail className="w-3.5 h-3.5 text-sky-400" />
                          <span>Kiküldés Outlookból</span>
                        </a>
                      )}

                      {dispatchResult?.previewUrl && (
                        <a
                          href={dispatchResult.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 text-nexus-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Élő Email Megtekintése</span>
                        </a>
                      )}

                      {dispatchResult?.mailtoUrl && (
                        <a
                          href={dispatchResult.mailtoUrl}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Alapértelmezett Levelező</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setFormData({
                          name: '',
                          email: '',
                          company: '',
                          phone: '',
                          service: 'AI Intelligens Chatbot',
                          budget: '240.000 - 400.000 Ft (Starter)',
                          message: ''
                        });
                        setDispatchResult(null);
                        setSubmitted(false);
                      }}
                      className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer"
                    >
                      Új üzenet küldése (Űrlap újranyitása)
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Teljes Név *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="pl. Kovács Tamás"
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Céges E-mail Cím *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tamas@ceged.hu"
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Cégnév</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="TechVentures Kft."
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Telefonszám</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+36 30 123 4567"
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Melyik folyamatot automatizálnád?</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white"
                      >
                        <option value="AI Intelligens Chatbot">AI Intelligens Chatbot</option>
                        <option value="AI Customer Support">AI Customer Support Rendszer</option>
                        <option value="E-mail Automatizáció">Intelligens E-mail Automatizáció</option>
                        <option value="Lead Generation">Autonóm Lead Generation</option>
                        <option value="CRM Automatizáció">CRM & Pipeline Automatizáció</option>
                        <option value="Appointment Booking">AI Időpontfoglaló Rendszer</option>
                        <option value="AI Agents">Autonóm AI Munkatársak (Agents)</option>
                        <option value="Komplett Vállalati Audit">Komplett Vállalati Audit</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Tervezett Költségkeret</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white"
                      >
                        <option value="240.000 - 400.000 Ft">240.000 - 400.000 Ft (Starter)</option>
                        <option value="400.000 - 800.000 Ft">400.000 - 800.000 Ft (Growth)</option>
                        <option value="800.000 Ft+">800.000 Ft felett (Enterprise)</option>
                        <option value="Egyedi / Nem tudom még">Egyedi / Szakértői javaslatot kérek</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300">
                      Rövid leírás az aktuális kihívásról / folyamatról
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Pl. Naponta 40-50 árajánlatkérő emailt kapunk, amiket kézzel kell bevinni a CRM-be és kiküldeni a válaszokat..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-black" />
                      <span>{loading ? 'Küldés folyamatban...' : 'Ingyenes AI Audit Igénylése'}</span>
                    </button>
                    <p className="text-[11px] text-center text-neutral-500 mt-2">
                      Nem jár kötelezettséggel. 100% spam-mentes garancia.
                    </p>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

