import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Barcha ichki sahifalar uchun yagona premium sarlavha (Hero) bloki:
 * badge, sarlavha, tavsif, breadcrumb va o'ng tomonda icon.
 */
export default function PageHero({ badge, title, highlight, description, icon: Icon }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-900 bg-slate-950/60 backdrop-blur-xl">
      {/* Orqa fon dekorlari */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1914_1px,transparent_1px),linear-gradient(to_bottom,#1c1914_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_80%_at_20%_0%,#000_60%,transparent_100%)] pointer-events-none opacity-40" />
      <div className="absolute -top-20 -right-16 w-80 h-80 bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-2xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-widest mb-4">
            <Link to="/" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <Home className="h-3 w-3" /> Bosh sahifa
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-700" />
            <span className="text-slate-400">{badge}</span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-[10px] font-bold text-amber-300 uppercase tracking-[0.2em] mb-3 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            {badge}
          </div>

          {/* Sarlavha */}
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {title}{' '}
            {highlight && (
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                {highlight}
              </span>
            )}
          </h1>

          {description && (
            <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xl font-light">
              {description}
            </p>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className="hidden sm:flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent text-amber-400 shadow-[0_0_40px_-10px_rgba(255,193,7,0.4)]">
            <Icon className="h-9 w-9" />
          </div>
        )}
      </div>
    </div>
  );
}
