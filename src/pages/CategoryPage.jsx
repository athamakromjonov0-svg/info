import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, ArrowLeft, Package, Crown, Gem } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const { products, categories, loading } = useApp();

  const category = useMemo(() => {
    if (!Array.isArray(categories)) return null;
    return categories.find(c => 
      c.slug?.toLowerCase() === String(slug).toLowerCase() || 
      c.name?.toLowerCase() === String(slug).toLowerCase()
    );
  }, [categories, slug]);

  const categoryName = category?.name || (slug ? slug.replace(/-/g, ' ') : '');

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((p) => {
      let pCat = p.category;
      if (!pCat) return false;
      if (typeof pCat === 'object') pCat = pCat.name || '';
      return String(pCat).toLowerCase() === categoryName.toLowerCase();
    });
  }, [products, categoryName]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white relative overflow-hidden">
      {/* Orqa fon */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,193,7,0.06),transparent_45%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* Yuqori panel */}
        <div className="pt-10 mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-300 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Bosh sahifaga qaytish
          </Link>

          <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-slate-900/40 backdrop-blur-xl p-8 sm:p-10">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/15 to-transparent text-amber-400 shadow-[0_0_40px_-10px_rgba(255,193,7,0.4)]">
                <Layers className="h-8 w-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-2">
                  <Crown className="h-3.5 w-3.5" />
                  <span>Grand Décor Kolleksiyasi</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
                  {categoryName}
                </h1>
                <p className="mt-2 text-sm text-slate-400 font-light">
                  {loading ? "Katalog yuklanmoqda..." : `${filteredProducts.length} ta hashamatli mahsulot mavjud`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mahsulotlar */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse border border-slate-900 bg-slate-900/40 rounded-2xl p-4 flex flex-col gap-4 h-72 sm:h-[420px]">
                <div className="aspect-square w-full rounded-xl bg-slate-900/60" />
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-slate-900 rounded w-1/3" />
                  <div className="h-5 bg-slate-900 rounded w-3/4" />
                  <div className="h-3 bg-slate-900 rounded w-full" />
                </div>
                <div className="h-10 bg-slate-900 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-amber-400/20 rounded-3xl bg-slate-900/20 max-w-2xl mx-auto flex flex-col items-center p-10">
            <div className="p-5 bg-slate-950 rounded-2xl border border-amber-400/20 mb-5">
              <Gem className="h-8 w-8 text-amber-400/60" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Bu kategoriyada mahsulot yo'q</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-sm leading-relaxed font-light">
              Bu kategoriya bo'yicha hozircha mahsulotlar mavjud emas. Tez orada yangi kolleksiya qo'shiladi.
            </p>
            <Link
              to="/katalog"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 text-sm font-bold text-slate-950 hover:shadow-lg hover:shadow-amber-500/25 transition-all"
            >
              <Package className="h-4 w-4" /> Barcha mahsulotlar
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}