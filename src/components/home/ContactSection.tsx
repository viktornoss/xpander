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
  ShieldCheck,
  ArrowRight
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

    // 1. Azonnal kiürítjük az űrlap mezőit
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      service: 'AI Intelligens Chatbot',
      budget: '240.000 - 400.000 Ft (Starter)',
      message: ''
    });

    // 2. Átváltunk a sikeres küldés nézetre
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
    <section id="contact" className="py-28 relative bg-black text-white overflow-hidden">
      {/* Top section divider */}
      <div className="section-divider mb-20" />

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-white" />
            <span>Ingyenes 20 Perces AI Folyamat-Audit</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase">
            <span className="text-shimmer">Kezdjük el</span> a Céged Automatizálását
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto">
            Töltsd ki az űrlapot, és mérnökcsapatunk 4 munkaórán belül jelentkezik egy konkrét automatizációs tervvel és pontos költségkalkulációval.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left info box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl service-card p-8 sm:p-10 space-y-6 shadow-2xl scroll-reveal-scale relative">
              <div className="glass-rim-top" />
              <h3 className="text-2xl font-bold text-white">Mi történik a konzultáción?</h3>
              
              <div className="space-y-5 text-xs sm:text-sm text-neutral-300">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-xl bg-white text-black flex items-center justify-center shrink-0 mt-0.5 font-black text-xs shadow-md">
                    1
                  </div>
                  <div>
                    <strong className="text-white block text-sm mb-0.5">Munkafolyamatok átvilágítása</strong>
                    <span className="text-neutral-400 text-xs leading-relaxed">Átbeszéljük, hol veszíti a csapat a legtöbb időt manuális feladatokkal és adatmásolással.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-xl bg-white text-black flex items-center justify-center shrink-0 mt-0.5 font-black text-xs shadow-md">
                    2
                  </div>
                  <div>
                    <strong className="text-white block text-sm mb-0.5">Technikai architektúra</strong>
                    <span className="text-neutral-400 text-xs leading-relaxed">Kiválasztjuk a legoptimálisabb AI modellt (GPT-4o, Claude) és a saját ZentrionFlow TS motor integrációt.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-xl bg-white text-black flex items-center justify-center shrink-0 mt-0.5 font-black text-xs shadow-md">
                    3
                  </div>
                  <div>
                    <strong className="text-white block text-sm mb-0.5">ROI és árajánlat kalkuláció</strong>
                    <span className="text-neutral-400 text-xs leading-relaxed">Konkrét időbeli és pénzügyi megtérülési tervet kapsz kézhez, garanciával védve.</span>
                  </div>
                </div>
              </div>

              {/* Contact info list */}
              <div className="border-t border-white/10 pt-6 space-y-3.5 text-xs text-neutral-300">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white shrink-0" />
                  <a href="mailto:xpander-automation.ai@outlook.hu" className="text-white hover:underline transition-colors font-semibold">
                    xpander-automation.ai@outlook.hu
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white shrink-0" />
                  <span>+36 1 800 9999 (H-P 9:00 - 18:00)</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-white shrink-0" />
                  <span>1054 Budapest, Szabadság tér 7. (Bank Center)</span>
                </div>
              </div>
            </div>

            {/* SLA Badge */}
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-white/15 flex items-center gap-3.5 shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white shrink-0" />
              <div className="text-xs">
                <span className="text-white font-bold block mb-0.5">Garantált titoktartási nyilatkozat (NDA)</span>
                <span className="text-neutral-400 leading-relaxed">Üzleti adataid és folyamataid a legmagasabb banki szintű biztonsági védelem alatt állnak.</span>
              </div>
            </div>
          </div>

          {/* Right form box */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl glass-spotlight p-8 sm:p-12 border border-white/15 shadow-2xl relative scroll-reveal-scale">
              <div className="glass-rim-top" />
              
              {submitted ? (
                <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center mx-auto shadow-2xl">
                    <CheckCircle2 className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                    Megkeresés Sikeresen Elküldve!
                  </h3>
                  <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed">
                    Köszönjük{submittedName ? `, ${submittedName}` : ''}! Az adataidat rögzítettük, és az azonnali értesítést továbbítottuk a dedikált címre: <strong className="text-white underline">xpander-automation.ai@outlook.hu</strong>.
                  </p>

                  {/* 1-Click Direct Delivery & Preview Section */}
                  <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/20 text-left space-y-3.5 max-w-lg mx-auto shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-white" />
                        <span>Közvetlen Levelező Elérés</span>
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">1-Kattintásos Küldés</span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Szeretnéd azonnal ellenőrizni vagy kiküldeni a saját felhős fiókodból is?
                    </p>

                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {dispatchResult?.outlookComposeUrl && (
                        <a
                          href={dispatchResult.outlookComposeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all shadow-sm"
                        >
                          <Mail className="w-3.5 h-3.5 text-white" />
                          <span>Outlook Web Megnyitása</span>
                        </a>
                      )}

                      {dispatchResult?.gmailComposeUrl && (
                        <a
                          href={dispatchResult.gmailComposeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all shadow-sm"
                        >
                          <Mail className="w-3.5 h-3.5 text-white" />
                          <span>Gmail Web Megnyitása</span>
                        </a>
                      )}

                      {dispatchResult?.previewUrl && (
                        <a
                          href={dispatchResult.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-all shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                          <span>Élő Email Megtekintése</span>
                        </a>
                      )}

                      {dispatchResult?.mailtoUrl && (
                        <a
                          href={dispatchResult.mailtoUrl}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 text-xs font-semibold transition-colors border border-white/10"
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
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer transition-all"
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
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-all placeholder:text-neutral-600"
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
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-all placeholder:text-neutral-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Cégnév</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="TechVentures Kft."
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-all placeholder:text-neutral-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Telefonszám</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+36 30 123 4567"
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-all placeholder:text-neutral-600"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Melyik folyamatot automatizálnád?</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-all"
                      >
                        <option value="AI Intelligens Chatbot" className="bg-neutral-900 text-white">AI Intelligens Chatbot</option>
                        <option value="AI Customer Support" className="bg-neutral-900 text-white">AI Customer Support Rendszer</option>
                        <option value="E-mail Automatizáció" className="bg-neutral-900 text-white">Intelligens E-mail Automatizáció</option>
                        <option value="Lead Generation" className="bg-neutral-900 text-white">Autonóm Lead Generation</option>
                        <option value="CRM Automatizáció" className="bg-neutral-900 text-white">CRM & Pipeline Automatizáció</option>
                        <option value="Appointment Booking" className="bg-neutral-900 text-white">AI Időpontfoglaló Rendszer</option>
                        <option value="AI Agents" className="bg-neutral-900 text-white">Autonóm AI Munkatársak (Agents)</option>
                        <option value="Komplett Vállalati Audit" className="bg-neutral-900 text-white">Komplett Vállalati Audit</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Tervezett Költségkeret</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-all"
                      >
                        <option value="240.000 - 400.000 Ft" className="bg-neutral-900 text-white">240.000 - 400.000 Ft (Starter)</option>
                        <option value="400.000 - 800.000 Ft" className="bg-neutral-900 text-white">400.000 - 800.000 Ft (Growth)</option>
                        <option value="800.000 Ft+" className="bg-neutral-900 text-white">800.000 Ft felett (Enterprise)</option>
                        <option value="Egyedi / Nem tudom még" className="bg-neutral-900 text-white">Egyedi / Szakértői javaslatot kérek</option>
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
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-all placeholder:text-neutral-600"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-premium py-4 rounded-xl font-black text-xs uppercase tracking-wider text-black bg-white flex items-center justify-center gap-2 shadow-2xl disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-black" />
                      <span>{loading ? 'Küldés folyamatban...' : 'Ingyenes AI Audit Igénylése'}</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </button>
                    <p className="text-[11px] text-center text-neutral-500 mt-2.5">
                      Nem jár kötelezettséggel. 100% bizalmas és spam-mentes garancia.
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
