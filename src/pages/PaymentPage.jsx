import { Link } from 'react-router-dom';
import { CreditCard, Banknote, Landmark, Smartphone, ShieldCheck, Lock, ArrowRight, BadgePercent, Wallet } from 'lucide-react';
import PageHero from '../components/PageHero';

/**
 * TO'LOV USULLARI — naqd, karta, onlayn, bo'lib to'lash.
 */
const METHODS = [
  {
    icon: Banknote,
    title: "Naqd pul",
    desc: "Buyurtma yetkazilganda yoki do'konimizda to'lov. Eng oddiy va ommabop usul.",
    badge: "Eng ommabop",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    icon: CreditCard,
    title: "Plastik karta",
    desc: "UzCard, Humo, VISA va Mastercard kartalari bilan to'lov. Kuryerga kartochka orqali ham to'lash mumkin.",
    badge: "Qulay",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    icon: Smartphone,
    title: "Onlayn to'lov",
    desc: "Payme, Click yoki Uzum Bank ilovalari orqali bir zumda to'lov. Buyurtma berishda tanlang.",
    badge: "Tezkor",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    icon: Landmark,
    title: "Bank o'tkazmasi",
    desc: "Yuridik shaxslar uchun hisob raqamiga o'tkazma. Schyot-faktura taqdim etiladi.",
    badge: "B2B",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
];

export default function PaymentPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,193,7,0.06),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHero
          badge="To'lov usullari"
          title="To'lov"
          highlight="usullari"
          description="Siz uchun eng qulay to'lov usulini tanlang. Barcha to'lovlar xavfsiz va himoyalangan."
          icon={CreditCard}
        />

        {/* XAVFSIZLIK */}
        <div className="flex flex-wrap items-center justify-center gap-4 rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lock className="h-4 w-4 text-amber-400" /> PCI DSS himoyalangan
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-amber-400" /> 3-D Secure tasdiqlash
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Wallet className="h-4 w-4 text-amber-400" /> Ma'lumotlar shifrlangan
          </div>
        </div>

        {/* USULLAR */}
        <div className="grid sm:grid-cols-2 gap-4">
          {METHODS.map(method => (
            <div key={method.title} className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-6 hover:border-slate-700 transition-all duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${method.bg} ${method.color}`}>
                  <method.icon className="h-7 w-7" />
                </div>
                <span className={`text-[9px] font-mono font-black uppercase tracking-widest rounded-full border px-2.5 py-1 ${method.bg} ${method.color}`}>
                  {method.badge}
                </span>
              </div>
              <h3 className="mt-4 text-base font-black text-white">{method.title}</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">{method.desc}</p>
            </div>
          ))}
        </div>

        {/* BO'LIB TO'LASH */}
        <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-transparent backdrop-blur-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <BadgePercent className="h-5 w-5 text-amber-400" /> Bo'lib to'lash
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-lg">
                Qimmatbaho mahsulotlarni 3 oydan 12 oygacha bo'lib to'lang. Dastlabki to'lov 0 so'mdan boshlanadi, ortiqcha to'lovsiz.
              </p>
            </div>
            <Link to="/katalog" className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 text-xs font-black text-slate-950 uppercase tracking-widest shadow-glow-sm hover:from-amber-300 hover:to-yellow-400 transition-all">
              Mahsulot tanlash <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {["3 oy — 0% ustama", "6 oy — 0% ustama", "12 oy — past ustama"].map((opt, i) => (
              <div key={i} className="rounded-2xl border border-amber-400/20 bg-slate-950/60 p-4 text-center">
                <p className="text-sm font-black text-amber-300">{opt.split(' — ')[0]}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{opt.split(' — ')[1]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* KAFOLAT */}
        <div className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-6 text-center">
          <ShieldCheck className="h-8 w-8 text-amber-400 mx-auto mb-3" />
          <h3 className="text-sm font-black text-white">100% xavfsiz to'lov kafolati</h3>
          <p className="mt-2 text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            To'lov ma'lumotlaringiz uchinchi shaxslarga uzatilmaydi. Har bir onlayn to'lov xalqaro xavfsizlik standartlariga muvofiq shifrlangan kanal orqali amalga oshiriladi.
          </p>
        </div>
      </div>
    </div>
  );
}
