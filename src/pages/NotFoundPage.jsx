import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Gem, Crown, Sparkles } from 'lucide-react';

/**
 * Grand Décor — 404 sahifasi.
 * Mavjud bo'lmagan sahifalarni hashamatli va samimiy tarzda kutib oladi.
 */
export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center font-sans select-none text-white relative bg-slate-950 overflow-hidden">
      {/* ORQA FON EFFEKTLARI */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffd966_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.03] pointer-events-none" />

      <div className="w-full max-w-xl space-y-8 relative z-10">
        {/* RAMZ */}
        <div className="relative flex justify-center">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-400/20 to-yellow-500/20 opacity-40 blur-2xl animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-950 border border-amber-400/30 shadow-[0_0_60px_-10px_rgba(255,193,7,0.35)]">
            <Gem className="h-10 w-10 text-amber-400" />
            <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/30">
              <Crown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* MATN */}
        <div className="space-y-3">
          <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight">
            404
          </h1>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-300">
            Sahifa Topilmadi
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed font-light">
            Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
            Ammo hashamatli parda aksessuarlari kolleksiyamiz sizni kutyapti.
          </p>
        </div>

        {/* AMALLAR */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-slate-900/60 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white hover:border-amber-400/60 transition-all active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" /> Orqaga qaytish
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Home className="h-4 w-4" /> Bosh sahifaga o'tish
          </Link>
        </div>

        {/* YO'NALTIRISH */}
        <Link
          to="/katalog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors pt-2"
        >
          <Sparkles className="h-3.5 w-3.5" /> Kolleksiyalarimizni ko'rish
        </Link>
      </div>
    </div>
  );
}