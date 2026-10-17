import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, Package, Sparkles, Flame, Grid3X3, FilterX, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import PageHero from '../components/PageHero';
import { useApp } from '../context/AppContext';

/**
 * KATALOG — barcha mahsulotlar.
 * Qidiruv, kategoriya filtri, chegirma/yangi filtri, sortlash va sahifalash.
 */
const SORT_OPTIONS = [
  { key: 'popular', label: "Ommaboplik" },
  { key: 'price-asc', label: "Narx: arzondan qimmatga" },
  { key: 'price-desc', label: "Narx: qimmatdan arzonga" },
  { key: 'rating', label: "Reyting" },
  { key: 'new', label: "Yangi kelganlar" },
];

export default function CatalogPage() {
  const { products } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState('popular');
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const all = useMemo(() => Array.isArray(products) ? products : [], [products]);

  const categories = useMemo(() => {
    const set = new Set(all.map(p => {
      const c = p.category;
      return typeof c === 'object' ? (c.name || 'GENERAL') : String(c || 'GENERAL');
    }));
    return ['ALL', ...Array.from(set).sort()];
  }, [all]);

  const filtered = useMemo(() => {
    let result = [...all];
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(p => {
        const name = (p.name || p.title || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    }
    if (category !== 'ALL') {
      result = result.filter(p => {
        const c = typeof p.category === 'object' ? (p.category.name || '') : (p.category || '');
        return String(c).toLowerCase() === String(category).toLowerCase();
      });
    }
    if (onlyDiscount) result = result.filter(p => Number(p.discount) > 0);
    if (onlyNew) result = result.filter(p => p.isNew);

    switch (sort) {
      case 'price-asc': result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0)); break;
      case 'price-desc': result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0)); break;
      case 'rating': result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)); break;
      case 'new': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: result.sort((a, b) => (Number(b.reviewsCount) || 0) - (Number(a.reviewsCount) || 0));
    }
    return result;
  }, [all, query, category, sort, onlyDiscount, onlyNew]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, totalPages);
  const paged = filtered.slice((current - 1) * perPage, current * perPage);

  const hasFilters = query || category !== 'ALL' || onlyDiscount || onlyNew || sort !== 'popular';

  const clearAll = () => {
    setQuery(''); setCategory('ALL'); setSort('popular'); setOnlyDiscount(false); setOnlyNew(false); setPage(1);
  };

  const filterChip = (active, onClick, label, ChipIcon) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-bold transition-all duration-200 ${
        active
          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
          : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
      }`}
    >
      <ChipIcon className="h-3.5 w-3.5" /> {label}
    </button>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,193,7,0.05),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHero
          badge="Katalog"
          title="Barcha"
          highlight="mahsulotlar"
          description="Do'konimizdagi barcha mahsulotlarni bir joyda ko'ring. Qidiruv, filtr va sortlash orqali o'zingizga keraklisini tez toping."
          icon={Package}
        />

        {/* FILTR PANELI */}
        <div className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-5 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Mahsulot nomi yoki tavsifi bo'yicha qidirish..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30 focus:ring-1 focus:ring-amber-500/10 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {filterChip(onlyDiscount, () => { setOnlyDiscount(!onlyDiscount); setPage(1); }, 'Chegirmalar', Flame)}
              {filterChip(onlyNew, () => { setOnlyNew(!onlyNew); setPage(1); }, 'Yangi kelganlar', Sparkles)}
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/5 px-3 py-2 text-[11px] font-bold text-amber-300 hover:bg-amber-400/10 transition-all"
                >
                  <FilterX className="h-3.5 w-3.5" /> Tozalash
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pt-3 border-t border-slate-900">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                <SlidersHorizontal className="h-3 w-3" /> Kategoriya:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold font-mono uppercase tracking-wider transition-all ${
                      category === cat
                        ? 'bg-amber-400 text-slate-950 shadow-glow-sm'
                        : 'bg-slate-900/60 text-slate-500 hover:text-white hover:bg-slate-900 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                <ArrowUpDown className="h-3 w-3" /> Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-amber-500/30"
              >
                {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* NATIJALAR SONI */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span className="text-amber-400 font-black">{filtered.length}</span> ta mahsulot topildi
          </p>
          <p className="text-[10px] font-mono text-slate-600">Sahifa {current} / {totalPages}</p>
        </div>

        {/* MAHSULOTLAR GRID */}
        {paged.length === 0 ? (
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 p-16 text-center">
            <Package className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-black text-white">Hech narsa topilmadi</h3>
            <p className="text-xs text-slate-500 mt-2">Filtrlarni o'zgartirib qayta urinib ko'ring.</p>
            <button onClick={clearAll} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 uppercase tracking-widest hover:bg-amber-300 transition-colors">
              <Grid3X3 className="h-3.5 w-3.5" /> Barchasini ko'rsatish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {paged.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        {/* SAHIFALASH */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setPage(Math.max(1, current - 1))}
              disabled={current === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7).map(pg => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`h-9 min-w-9 px-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  pg === current
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'border border-slate-800 bg-slate-900/40 text-slate-500 hover:text-white'
                }`}
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, current + 1))}
              disabled={current === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* PASTKI HAVOLA */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-600 pt-2">
          <Link to="/chegirmalar" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" /> Chegirmalar sahifasi
          </Link>
          <span className="text-slate-800">|</span>
          <Link to="/sevimlilar" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" /> Sevimlilar
          </Link>
        </div>
      </div>
    </div>
  );
}
