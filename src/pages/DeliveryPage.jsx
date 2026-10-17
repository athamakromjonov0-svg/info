import { Link } from 'react-router-dom';
import { Truck, MapPin, Package, ShieldCheck, Clock, ArrowRight, CheckCircle2, Gift } from 'lucide-react';
import PageHero from '../components/PageHero';
import { useApp } from '../context/AppContext';

/**
 * YETKAZIB BERISH — zonalar, muddatlar, narxlar va qoidalar.
 */
export default function DeliveryPage() {
  const { deliveryZones } = useApp();
  const zones = Array.isArray(deliveryZones) ? deliveryZones : [];

  const steps = [
    { icon: Package, title: "Buyurtma", desc: "Savatdagi mahsulotlar uchun buyurtma berasiz." },
    { icon: Clock, title: "Tayyorlash", desc: "Buyurtmangizni omborda qadoqlaymiz (max 1 kun)." },
    { icon: Truck, title: "Yetkazish", desc: "Kuryer buyurtmani manzilingizga yetkazadi." },
    { icon: CheckCircle2, title: "Qabul qilish", desc: "Mahsulotni tekshirib, qabul qilib olasiz." },
  ];

  const formatPrice = (price) =>
    new Intl.NumberFormat('uz-UZ').format(Math.round(Number(price) || 0)) + " so'm";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,193,7,0.05),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHero
          badge="Yetkazib berish"
          title="Yetkazib"
          highlight="berish"
          description="O'zbekiston bo'ylab tez va ishonchli yetkazib berish. Zonalar, narxlar va muddatlar bilan tanishing."
          icon={Truck}
        />

        {/* ASOSIY AFZALLIKLAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-6 text-center">
            <Gift className="h-8 w-8 text-amber-400 mx-auto mb-3" />
            <p className="text-sm font-black text-white">1 000 000 so'mdan</p>
            <p className="mt-1 text-[11px] text-slate-400">yetkazib berish BEPUL</p>
          </div>
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 p-6 text-center">
            <Clock className="h-8 w-8 text-amber-400 mx-auto mb-3" />
            <p className="text-sm font-black text-white">1-2 kun</p>
            <p className="mt-1 text-[11px] text-slate-400">Toshkent shahrida</p>
          </div>
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 p-6 text-center">
            <ShieldCheck className="h-8 w-8 text-amber-400 mx-auto mb-3" />
            <p className="text-sm font-black text-white">100% kafolat</p>
            <p className="mt-1 text-[11px] text-slate-400">Yetkazilganda tekshirish</p>
          </div>
        </div>

        {/* ZONALAR JADVALI */}
        <div className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Yetkazib berish zonalari</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-mono text-slate-600 uppercase tracking-widest border-b border-slate-900">
                  <th className="px-6 py-3">Hudud</th>
                  <th className="px-6 py-3">Narx</th>
                  <th className="px-6 py-3">Muddat</th>
                  <th className="px-6 py-3">Bepul yetkazish</th>
                </tr>
              </thead>
              <tbody>
                {zones.map(zone => (
                  <tr key={zone.id} className="border-b border-slate-900/60 last:border-0 hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-white">{zone.name}</td>
                    <td className="px-6 py-4 text-xs font-mono text-amber-300">{formatPrice(zone.price)}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{zone.days}</td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">{formatPrice(zone.freeFrom)} dan</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* JARAYON */}
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <Truck className="h-4 w-4 text-amber-400" /> Yetkazish jarayoni
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, idx) => (
              <div key={step.title} className="relative rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-6">
                <span className="absolute top-4 right-4 text-[10px] font-mono font-black text-slate-700">0{idx + 1}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
                  <step.icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-black text-white">{step.title}</h4>
                <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* QOIDALAR */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Muhim qoidalar</h3>
            <ul className="space-y-3">
              {[
                "Yetkazib berishdan oldin operator siz bilan telefon orqali bog'lanadi.",
                "Buyurtma to'liq to'langandan so'ng yoki naqd to'lovda qabul qilganda yuboriladi.",
                "Kuryer kelishidan 30 daqiqa oldin xabar beriladi.",
                "Mahsulotni qabul qilishda albatta tekshirib oling.",
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" /> {rule}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-900 bg-gradient-to-br from-amber-400/10 to-transparent backdrop-blur-xl p-6 flex flex-col justify-center">
            <h3 className="text-sm font-black text-white">O'z manzilingizni tekshiring</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Buyurtma berishda manzilingizni kiriting va yetkazib berish narxini darhol bilib oling.
            </p>
            <Link to="/buyurtma" className="mt-5 inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-xs font-black text-slate-950 uppercase tracking-widest shadow-glow-sm hover:from-amber-300 hover:to-yellow-400 transition-all">
              Buyurtma berish <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
