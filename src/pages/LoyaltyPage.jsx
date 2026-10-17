import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Coins, Gift, Crown, Star, Trophy, ArrowRight, ShieldCheck, Sparkles, Wallet, Percent } from 'lucide-react';
import PageHero from '../components/PageHero';
import { useApp } from '../context/AppContext';

/**
 * BONUS DASTURI — loyallik tizimi, bonus ballar, darajalar va kuponlar.
 */
const LEVELS = [
  {
    name: "Bronza",
    icon: Star,
    min: 0,
    color: 'text-amber-600',
    bg: 'bg-amber-500/10 border-amber-600/30',
    perks: ["Har 10 000 so'm = 1 ball", "Standart kuponlar", "Asosiy qo'llab-quvvatlash"],
  },
  {
    name: "Kumush",
    icon: Trophy,
    min: 50,
    color: 'text-slate-300',
    bg: 'bg-slate-400/10 border-slate-400/20',
    perks: ["Har 10 000 so'm = 1.5 ball", "Yiliga 2 marta bepul yetkazish", "Maxsus takliflar"],
  },
  {
    name: "Oltin",
    icon: Crown,
    min: 200,
    color: 'text-amber-300',
    bg: 'bg-amber-400/10 border-amber-400/30',
    perks: ["Har 10 000 so'm = 2 ball", "Bepul yetkazish", "Eksklyuziv chegirmalar", "Shaxsiy menejer"],
  },
];

export default function LoyaltyPage() {
  const { bonusPoints, coupons, orders } = useApp();

  const stats = useMemo(() => {
    const allOrders = Array.isArray(orders) ? orders : [];
    const spent = allOrders.reduce((s, o) => s + (o.total || 0), 0);
    const count = allOrders.length;
    let level = LEVELS[0];
    for (const l of LEVELS) { if (bonusPoints >= l.min) level = l; }
    const next = LEVELS.find(l => l.min > bonusPoints) || null;
    return { spent, count, level, next };
  }, [bonusPoints, orders]);

  const progress = stats.next
    ? Math.min(100, Math.round(((bonusPoints - stats.level.min) / (stats.next.min - stats.level.min)) * 100))
    : 100;

  const LevelIcon = stats.level.icon;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(255,193,7,0.07),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHero
          badge="Bonus dasturi"
          title="Loyallik"
          highlight="dasturi"
          description="Har bir xaridingizda bonus ballar yig'ing, darajangizni oshiring va ko'proq imtiyozlarga ega bo'ling."
          icon={Coins}
        />

        {/* JORIY DARAJA */}
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent backdrop-blur-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border ${stats.level.bg} ${stats.level.color} shadow-xl`}>
              <LevelIcon className="h-10 w-10" />
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-black text-white uppercase tracking-wide">
                  Sizning darajangiz: <span className={stats.level.color}>{stats.level.name}</span>
                </h2>
                {stats.next && (
                  <span className="text-[10px] font-mono text-slate-500">
                    Keyingi: {stats.next.name} ({stats.next.min} ball)
                  </span>
                )}
              </div>
              <div className="mt-4 h-2.5 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Jami xarid: <span className="text-white font-bold">{new Intl.NumberFormat('uz-UZ').format(Math.round(Number(stats.spent) || 0))} so'm</span>
                  {' '}• Buyurtmalar: <span className="text-white font-bold">{stats.count}</span>
                </p>
                <div className="flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-slate-950/60 px-4 py-2">
                  <Wallet className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-black text-amber-400">{bonusPoints} ball</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DARAJALAR */}
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" /> Darajalar
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {LEVELS.map(level => {
              const Icon = level.icon;
              const isCurrent = stats.level.name === level.name;
              return (
                <div key={level.name} className={`relative rounded-3xl border p-6 backdrop-blur-xl transition-all ${
                  isCurrent ? `${level.bg} shadow-xl` : 'border-slate-900 bg-slate-950/60'
                }`}>
                  {isCurrent && (
                    <span className="absolute top-4 right-4 text-[9px] font-mono font-black text-slate-950 bg-amber-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      Sizning darajangiz
                    </span>
                  )}
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${level.bg} ${level.color} mb-4`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h4 className={`text-lg font-black uppercase tracking-wide ${level.color}`}>{level.name}</h4>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">{level.min} balldan boshlab</p>
                  <ul className="mt-4 space-y-2">
                    {level.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-slate-400">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" /> {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* QANDAY ISHLAYDI */}
        <div className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-6 sm:p-8">
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" /> Qanday ishlaydi?
          </h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 font-black font-mono">1</div>
              <p className="text-xs text-slate-400 leading-relaxed">Xarid qiling va <span className="text-white font-bold">har 10 000 so'm</span> uchun 1 bonus ball oling.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black font-mono">2</div>
              <p className="text-xs text-slate-400 leading-relaxed">Ballar to'plang va <span className="text-white font-bold">darajangiz</span> oshsin — imtiyozlar kengayadi.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 font-black font-mono">3</div>
              <p className="text-xs text-slate-400 leading-relaxed">Ballarni <span className="text-white font-bold">chegirma</span> sifatida ishlating yoki kuponlarga almashtiring.</p>
            </div>
          </div>
        </div>

        {/* KUPONLAR */}
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <Percent className="h-4 w-4 text-amber-400" /> Faol kuponlar
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {(Array.isArray(coupons) ? coupons : []).map(coupon => (
              <div key={coupon.code} className="rounded-3xl border border-dashed border-amber-400/30 bg-amber-400/5 p-6 text-center hover:bg-amber-400/10 transition-colors">
                <p className="text-2xl font-black text-amber-300 font-mono tracking-widest">{coupon.code}</p>
                <p className="mt-2 text-[11px] text-slate-400">-{coupon.discount}% chegirma</p>
                <p className="text-[10px] text-slate-600 mt-1">Min. xarid: {new Intl.NumberFormat('uz-UZ').format(coupon.minSpend || 0)} so'm</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-slate-600 flex items-center gap-1.5">
            <Gift className="h-3.5 w-3.5" /> Kuponni savatda qo'llashingiz mumkin.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-900 bg-slate-950/60 p-6">
          <p className="text-xs text-slate-400">Ballarni ishlatish uchun xaridni boshlang.</p>
          <Link to="/katalog" className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 text-xs font-black text-slate-950 uppercase tracking-widest hover:bg-amber-300 transition-all active:scale-95">
            Katalogga o'tish <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
