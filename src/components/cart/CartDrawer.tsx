'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  CheckCircle2, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export default function CartDrawer() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalItems, 
    totalAmountFormatted 
  } = useCart();

  const { currentUser, addOrder } = useAuth();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    taxNumber: '',
    zip: '',
    city: '',
    street: '',
    paymentMethod: 'paypal' as 'paypal',
    notes: ''
  });

  // Successful order response details
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || currentUser.name || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.phone || '',
        company: prev.company || currentUser.company || ''
      }));
    }
  }, [currentUser]);

  // Reset step if cart closes
  useEffect(() => {
    if (!isOpen && step === 'success') {
      setStep('cart');
      setCompletedOrder(null);
    }
  }, [isOpen, step]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Kérjük, add meg a neved, e-mail címed és a telefonszámod!');
      return;
    }

    if (!formData.zip.trim() || !formData.city.trim() || !formData.street.trim()) {
      setErrorMessage('Kérjük, add meg a teljes számlázási címet (irányítószám, város, utca)!');
      return;
    }

    setSubmitting(true);

    try {
      const formattedAddress = `${formData.zip.trim()} ${formData.city.trim()}, ${formData.street.trim()}`;

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name.trim(),
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim(),
          customerCompany: formData.company.trim() || 'Egyéni megrendelő',
          taxNumber: formData.taxNumber.trim(),
          billingAddress: formattedAddress,
          paymentMethod: formData.paymentMethod,
          items: items.map(i => ({
            title: i.title,
            packageType: i.packageType,
            price: i.price,
            quantity: i.quantity
          })),
          totalPrice: totalAmountFormatted,
          notes: formData.notes.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'A megrendelés feldolgozása sikertelen.');
      }

      // Add to internal system orders so Admin Tolnai Viktor sees it in /admin/orders
      items.forEach(item => {
        addOrder({
          serviceId: item.id,
          serviceTitle: `${item.title} (${item.quantity} db)`,
          packageType: (item.packageType as any) || 'Starter',
          price: item.price,
          notes: `Webáruház megrendelés [${data.orderId}] - Fizetés: PayPal (2viktornosss@gmail.com). Számlázás: ${formattedAddress} (${formData.phone})`
        });
      });

      setCompletedOrder(data);
      clearCart();
      setStep('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Hálózati hiba történt a megrendelés során.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-neutral-950 border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 bg-neutral-900/60 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Bevásárlókosár</span>
                  {totalItems > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono">
                      {totalItems} tétel
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-neutral-400">
                  {step === 'cart' && 'Válaszd ki az AI rendszereket'}
                  {step === 'checkout' && 'Számlázási & Fizetési adatok'}
                  {step === 'success' && 'Sikeres megrendelés!'}
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Kosár bezárása"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">

            {/* STEP 1: CART ITEMS VIEW */}
            {step === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-neutral-500 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">A kosarad jelenleg üres</h3>
                      <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                        Válassz csomagot a főoldali Árazásból, vagy böngéssz az egyedi AI szolgáltatásaink között!
                      </p>
                    </div>
                    <button
                      onClick={closeCart}
                      className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors"
                    >
                      Böngészés a Szolgáltatások között
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-3 hover:border-white/20 transition-all"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{item.title}</span>
                              {item.packageType && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-medium">
                                  {item.packageType}
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-mono font-bold text-emerald-400">
                              {item.price}
                            </div>
                            {item.subtitle && (
                              <p className="text-[11px] text-neutral-400">{item.subtitle}</p>
                            )}

                            {/* Quantity Controls */}
                            <div className="pt-2 flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center text-xs"
                                title="Mennyiség csökkentése"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-mono font-bold text-white px-2">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center text-xs"
                                title="Mennyiség növelése"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Delete Item */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Tétel törlése a kosárból"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Summary row */}
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <div className="flex justify-between items-center text-xs text-neutral-400">
                        <span>Tételek darabszáma:</span>
                        <span className="text-white font-mono">{totalItems} db</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-neutral-400">
                        <span>Pénzvisszafizetési garancia:</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          30 nap 100%
                        </span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between items-center text-sm font-bold text-white">
                        <span>Fizetendő Végösszeg:</span>
                        <span className="text-lg font-mono text-emerald-400">{totalAmountFormatted}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* STEP 2: CHECKOUT FORM VIEW */}
            {step === 'checkout' && (
              <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Buyer Information Section */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-white" />
                    <span>Megrendelő & Számlázási Adatok</span>
                  </h4>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-300">
                      Teljes Név <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="pl. Kovács Tamás"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-300 flex items-center justify-between">
                        <span>E-mail cím <span className="text-rose-400">*</span></span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="pelda@ceg.hu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-white transition-colors"
                      />
                      <span className="text-[10px] text-neutral-500 block">Ide küldjük az utalási adatokat!</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-300">
                        Telefonszám <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+36 30 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-300">
                        Cégnév / Számlázási Név
                      </label>
                      <input
                        type="text"
                        placeholder="TechInnováció Kft. / Magánszemély"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-300">
                        Adószám (ha cég)
                      </label>
                      <input
                        type="text"
                        placeholder="12345678-2-41"
                        value={formData.taxNumber}
                        onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Billing address */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold text-neutral-300 block">
                      Számlázási Cím <span className="text-rose-400">*</span>
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="IRSZ (pl. 1054)"
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="col-span-1 px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-white"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Város (pl. Budapest)"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="col-span-2 px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-white"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Utca, házszám, emelet/ajtó"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                {/* Payment Method - Exclusive PayPal */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-white" />
                    <span>Fizetési Mód</span>
                  </h4>

                  <div className="p-4 rounded-2xl bg-[#001830] border border-[#0070ba]/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#38bdf8] flex items-center gap-1.5">
                        🅿️ Kizárólag PayPal / Bankkártyás Fizetés
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        Azonnali Jóváírás
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      A megrendelés elküldése után azonnal fizethetsz meglévő PayPal fiókoddal vagy bankkártyával a(z) <strong className="text-white font-mono">2viktornosss@gmail.com</strong> címre.
                    </p>
                  </div>
                </div>

                {/* Optional Notes */}
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-semibold text-neutral-400">
                    Megjegyzés / Egyedi Igény (Opcionális)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mikor szeretnéd elindítani az implementációt? Bármilyen egyéb részlet..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                {/* Price summary badge */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Összesen fizetendő:</span>
                  <span className="font-mono font-bold text-base text-emerald-400">{totalAmountFormatted}</span>
                </div>

              </form>
            )}

            {/* STEP 3: SUCCESS CONFIRMATION VIEW */}
            {step === 'success' && completedOrder && (
              <div className="space-y-6 animate-in zoom-in-95 duration-200">
                <div className="text-center space-y-2 py-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Sikeres Megrendelés!</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
                    A hivatalos visszaigazoló e-mailt a részletes díjbekérővel elküldtük a(z) <strong className="text-white">{completedOrder.customerEmail}</strong> címre.
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-neutral-300">
                    Rendelés azonosító: <strong className="text-white">{completedOrder.orderId}</strong>
                  </div>
                </div>

                {/* PAYPAL ONLY PAYMENT CARD */}
                <div className="rounded-2xl p-5 bg-[#001428] border border-[#0070ba]/60 space-y-3.5 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="text-xs font-black text-[#38bdf8] flex items-center gap-1.5 uppercase tracking-wider">
                      🅿️ PayPal Fizetési Adatok
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      Azonnali Fizetés
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Kedvezményezett PayPal email:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white text-xs">2viktornosss@gmail.com</span>
                        <button
                          onClick={() => copyToClipboard('2viktornosss@gmail.com', 'paypal')}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-neutral-300"
                          title="PayPal cím másolása"
                        >
                          {copiedKey === 'paypal' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Közlemény / Hivatkozás:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white text-xs">{completedOrder.orderId} - {completedOrder.customerName}</span>
                        <button
                          onClick={() => copyToClipboard(`${completedOrder.orderId} - ${completedOrder.customerName}`, 'ref')}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-neutral-300"
                          title="Közlemény másolása"
                        >
                          {copiedKey === 'ref' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/10 pt-2.5 text-sm font-bold text-white">
                      <span>Fizetendő összeg:</span>
                      <span className="font-mono text-emerald-400 text-lg">{completedOrder.totalPrice}</span>
                    </div>
                  </div>

                  <a
                    href="https://paypal.me/2viktornosss"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
                  >
                    <span>Fizetés Most PayPal-lal (2viktornosss@gmail.com)</span>
                    <ExternalLink className="w-4 h-4 text-white" />
                  </a>

                  <div className="text-center text-[10px] text-neutral-400 pt-1">
                    Ügyfélszolgálat & visszaigazolás: <strong className="text-neutral-200">xpander-automation.ai@outlook.hu</strong>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={closeCart}
                    className="w-full py-3 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                  >
                    Rendelés lezárása & Folytatás
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Navigation Bar */}
          {step !== 'success' && items.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-neutral-900/80 backdrop-blur-md space-y-3">
              {step === 'cart' ? (
                <>
                  <div className="flex justify-between items-center text-sm font-bold text-white">
                    <span>Fizetendő összeg:</span>
                    <span className="font-mono text-emerald-400 text-lg">{totalAmountFormatted}</span>
                  </div>
                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
                  >
                    <span>Tovább a Pénztárhoz & Számlázáshoz</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    Vissza a tételekhez
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={submitting}
                    className="flex-1 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <span>Rendelés rögzítése & Email küldése...</span>
                    ) : (
                      <>
                        <span>Megrendelés Jóváhagyása ({totalAmountFormatted})</span>
                        <ArrowRight className="w-4 h-4 text-black" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

