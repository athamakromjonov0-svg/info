import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Headset, CheckCircle2, Building2 } from 'lucide-react';
import PageHero from '../components/PageHero';
import { useApp } from '../context/AppContext';

/**
 * ALOQA — foydalanuvchi murojaatlari, telefon, manzil va ish vaqtlari.
 */
export default function ContactPage() {
  const { showToast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Savol', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      showToast("Ism va xabar maydonlarini to'ldiring!", "error");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showToast("Noto'g'ri elektron pochta formati!", "error");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      showToast("Murojaatingiz qabul qilindi! Tez orada javob beramiz.", "success");
      setForm({ name: '', email: '', phone: '', subject: 'Savol', message: '' });
      setTimeout(() => setSent(false), 5000);
    }, 800);
  };

  const infoCards = [
    { icon: Phone, title: 'Telefon', value: '+998 (90) 123-4567', desc: "Qo'ng'iroq markazi" },
    { icon: Mail, title: 'Elektron pochta', value: 'info@granddecor.uz', desc: '24/7 qabul qilamiz' },
    { icon: MapPin, title: 'Manzil', value: "Toshkent sh., Chilonzor t., Bunyodkor ko'chasi 42", desc: 'Asosiy ofis' },
    { icon: Clock, title: 'Ish vaqti', value: '09:00 - 22:00', desc: 'Har kuni, dam olishsiz' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,193,7,0.05),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHero
          badge="Aloqa"
          title="Biz bilan"
          highlight="bog'laning"
          description="Savollaringiz, takliflaringiz yoki muammolaringiz bo'lsa — bizga yozing. Qisqa vaqt ichida javob beramiz."
          icon={Headset}
        />

        {/* INFO KARTALAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {infoCards.map(card => (
            <div key={card.title} className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-5 hover:border-slate-700 transition-all duration-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 mb-3">
                <card.icon className="h-5 w-5" />
              </div>
              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{card.title}</h4>
              <p className="mt-1 text-xs font-bold text-white">{card.value}</p>
              <p className="mt-0.5 text-[10px] text-slate-600">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* FORMA */}
          <div className="lg:col-span-3 rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-6 sm:p-8">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber-400" /> Murojaat yuborish
            </h3>
            <p className="text-[11px] text-slate-500 mb-6">Formani to'ldiring, operatorlarimiz siz bilan bog'lanishadi.</p>

            {sent && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                <p className="text-xs text-amber-300 font-bold">Murojaat muvaffaqiyatli yuborildi! Rahmat.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Ismingiz *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ism Familiya"
                    className="mt-1 w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Elektron pochta</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="siz@example.com"
                    className="mt-1 w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Telefon</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+998 90 123 45 67"
                    className="mt-1 w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Mavzu</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="mt-1 w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/40 transition-all"
                  >
                    <option>Savol</option>
                    <option>Buyurtma bo'yicha</option>
                    <option>Qaytarish</option>
                    <option>Taqdimot / hamkorlik</option>
                    <option>Boshqa</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Xabaringiz *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows="5"
                  placeholder="Xabaringizni shu yerga yozing..."
                  className="mt-1 w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/10 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 text-xs font-black text-slate-950 uppercase tracking-widest shadow-glow-sm hover:from-amber-300 hover:to-yellow-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <span className="animate-pulse">Yuborilmoqda...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" /> Yuborish
                  </>
                )}
              </button>
            </form>
          </div>

          {/* FAQ / QO'SHIMCHA */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-400" /> Bosh ofis
              </h3>
              <div className="space-y-3 text-xs text-slate-400">
                <p className="flex items-start gap-2.5"><MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" /> Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi 42-bino</p>
                <p className="flex items-start gap-2.5"><Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" /> Dushanba — Yakshanba: 09:00 - 22:00</p>
                <p className="flex items-start gap-2.5"><Phone className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" /> +998 (90) 123-4567, +998 (71) 200-00-00</p>
                <p className="flex items-start gap-2.5"><Mail className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" /> info@granddecor.uz</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-900 bg-gradient-to-br from-amber-400/10 to-transparent backdrop-blur-xl p-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-3">Tezkor yordam</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                Eng ko'p so'raladigan savollarga javoblar FAQ sahifasida joylashgan.
              </p>
              <Link
                to="/faq"
                className="text-[11px] font-black text-amber-300 hover:text-amber-200 transition-colors"
              >
                FAQ sahifasiga o'tish →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
