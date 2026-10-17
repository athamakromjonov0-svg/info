import { useState, useEffect } from 'react';
import { Flame, Timer, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Keyingi "flash sale" vaqti (har kuni 00:00 gacha)
function getNextMidnight() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = getNextMidnight();
    const tick = () => {
      const diff = Math.max(0, target - new Date());
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="border-y border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Chap qism: Sarlavha */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 border border-amber-400/30">
              <Flame className="h-5 w-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                Kunlik Aksiya
                <span className="rounded-lg bg-amber-400 text-slate-950 px-2 py-0.5 text-[10px] font-black animate-pulse">
                  -30%
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Chegirmali mahsulotlar — kun oxirigacha!</p>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-sm font-black text-amber-300 font-mono">{pad(timeLeft.hours)}</span>
              </div>
              <span className="text-xs text-slate-600 font-mono">:</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-sm font-black text-amber-300 font-mono">{pad(timeLeft.minutes)}</span>
              </div>
              <span className="text-xs text-slate-600 font-mono">:</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-sm font-black text-amber-300 font-mono">{pad(timeLeft.seconds)}</span>
              </div>
            </div>
            <Timer className="h-4 w-4 text-slate-600 hidden sm:block" />
          </div>

          {/* Tugma */}
          <Link
            to="/chegirmalar"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-xs font-black text-slate-950 uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/25 active:scale-95 transition-all"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Sotib olish
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
