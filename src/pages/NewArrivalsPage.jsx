import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Package, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import PageHero from '../components/PageHero';
import { useApp } from '../context/AppContext';

/**
 * YANGI KELGANLAR — katalogga yaqinda qo'shilgan mahsulotlar.
 */
export default function NewArrivalsPage() {
  const { products } = useApp();
  const [limit, setLimit] = useState(12);

  const newArrivals = useMemo(() => {
    const all = Array.isArray(products) ? products : [];
    return all.filter(p => p.isNew);
  }, [products]);

  const shown = newArrivals.slice(0, limit);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,193,7,0.05),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHero
          badge="Yangi kelganlar"
          title="Yangi"
          highlight="mahsulotlar"
          description="Katalogimizga yaqinda qo'shilgan eng yangi mahsulotlar. Birinchilardan bo'lib ko'ring va qo'lga kiriting!"
          icon={Sparkles}
        />

        {/* Statistik chiziq */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{newArrivals.length}</div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Yangi mahsulot</div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">Haftalik</div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Yangilanish</div>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-transparent backdrop-blur-xl p-5 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Ko'proq yangiliklar uchun</p>
              <Link to="/katalog" className="mt-1 inline-flex items-center gap-1.5 text-xs font-black text-amber-300 hover:text-amber-200 transition-colors">
                Katalogga o'tish <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* MAHSULOTLAR */}
        {shown.length === 0 ? (
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 p-16 text-center">
            <Package className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-black text-white">Hozircha yangi mahsulotlar yo'q</h3>
            <p className="text-xs text-slate-500 mt-2">Tez orada katalog yangilanadi. Barcha mahsulotlarni ko'ring.</p>
            <Link to="/katalog" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 uppercase tracking-widest hover:bg-amber-300 transition-colors">
              Katalogga o'tish
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map(product => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>

            {newArrivals.length > limit && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setLimit(prev => prev + 12)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-3 text-xs font-black text-white uppercase tracking-widest hover:border-amber-400/30 hover:text-amber-300 transition-all duration-200"
                >
                  Yana ko'rsatish ({newArrivals.length - limit} ta qoldi)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
