import { Link } from 'react-router-dom';
import { RotateCcw, ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle, ArrowRight, Package, Wallet } from 'lucide-react';
import PageHero from '../components/PageHero';

/**
 * QAYTARISH — qaytarish va almashtirish siyosati.
 */
export default function ReturnsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,193,7,0.04),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHero
          badge="Kafolat va qaytarish"
          title="Qaytarish va"
          highlight="almashtirish"
          description="Mahsulot sizga mos kelmadimi? 14 kun ichida bepul qaytaring yoki almashtiring."
          icon={RotateCcw}
        />

        {/* ASOSIY QOIDALAR */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-6 text-center">
            <Clock className="h-8 w-8 text-amber-400 mx-auto mb-3" />
            <p className="text-2xl font-black text-white">14 kun</p>
            <p className="mt-1 text-[11px] text-slate-400">qaytarish muddati</p>
          </div>
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 p-6 text-center">
            <Wallet className="h-8 w-8 text-amber-400 mx-auto mb-3" />
            <p className="text-2xl font-black text-white">3-5 kun</p>
            <p className="mt-1 text-[11px] text-slate-400">pulni qaytarish</p>
          </div>
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 p-6 text-center">
            <Package className="h-8 w-8 text-amber-400 mx-auto mb-3" />
            <p className="text-2xl font-black text-white">Bepul</p>
            <p className="mt-1 text-[11px] text-slate-400">olib qaytish xizmati</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* MUMKIN */}
          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 backdrop-blur-xl p-6 sm:p-8">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" /> Qaytarish mumkin
            </h3>
            <ul className="space-y-3.5">
              {[
                "Mahsulot nuqsonli yoki nosoz bo'lsa",
                "Mahsulot tavsifga mos kelmasa",
                "O'lchami, rangi yoki modeli mos kelmasa",
                "Kafolat muddati ichida ishlab chiqarish nuqsoni (defekt)",
                "Buyurtma olingan kundan boshlab 14 kun ichida",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* MUMKIN EMAS */}
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-xl p-6 sm:p-8">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-rose-400" /> Qaytarib bo'lmaydi
            </h3>
            <ul className="space-y-3.5">
              {[
                "Metrajga kesilgan yoki o'rnatilgan mahsulotlar (parda lentasi, karniz profillari)",
                "Foydalanish belgilari bo'lgan mahsulotlar",
                "Mexanik shikastlangan mahsulotlar",
                "14 kundan ortiq muddat o'tgan buyurtmalar",
                "Shaxsiylashtirilgan buyurtmalar",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                  <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* JARAYON */}
        <div className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-6 sm:p-8">
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-400" /> Qaytarish jarayoni
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: "01", t: "Murojaat", d: "Aloqa bo'limi orqali qaytarish so'rovini yuboring." },
              { n: "02", t: "Tasdiqlash", d: "Operator murojaatni 24 soat ichida ko'rib chiqadi." },
              { n: "03", t: "Olib qaytish", d: "Kuryer mahsulotni bepul olib qaytadi." },
              { n: "04", t: "To'lov", d: "Pul 3-5 ish kuni ichida qaytariladi yoki almashtiriladi." },
            ].map(step => (
              <div key={step.n} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-black">
                  {step.n}
                </div>
                <h4 className="mt-3 text-sm font-black text-white">{step.t}</h4>
                <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* OGOHLANTIRISH */}
        <div className="flex items-start gap-3 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            Qaytarishda mahsulot to'liq komplektda (quti, aksessuarlar, kafolat taloni) bo'lishi shart. Mahsulotni qaytarishdan oldin operator bilan bog'lanishni unutmang.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-900 bg-slate-950/60 p-6">
          <p className="text-xs text-slate-400">Qaytarish bo'yicha savollaringiz bormi?</p>
          <Link to="/aloqa" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 uppercase tracking-widest hover:bg-amber-300 transition-all">
            Aloqa bo'limi <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
