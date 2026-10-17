import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, ArrowLeft, X, ChevronDown, Star, Zap, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading } = useApp();
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [minRating, setMinRating] = useState(0);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vortex_search_history')) || [];
    } catch {
      return [];
    }
  });

  const itemsPerPage = 12;
  const query = searchParams.get('q') || '';

  // Qidiruv tarixini saqlash
  useEffect(() => {
    if (query.trim()) {
      const newHistory = [
        {
          id: Date.now(),
          query: query,
          timestamp: new Date().toISOString(),
        },
        ...searchHistory.filter((h) => h.query !== query),
      ].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('vortex_search_history', JSON.stringify(newHistory));
    }
    setCurrentPage(1);
  }, [query]);

  // Mahsulotlar ro'yxatini kategoriyalar bilan to'ldirish
  const allCategories = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const cats = new Set();
    products.forEach((p) => {
      const cat = typeof p.category === 'object' ? p.category.name : p.category;
      if (cat) cats.add(cat);
    });
    return Array.from(cats).sort();
  }, [products]);

  // Qidiruv va filtrlash
  const results = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    let result = products.filter((p) => {
      const pName = p.name || p.title || '';
      const titleMatch = pName.toLowerCase().includes(query.toLowerCase());
      const descMatch = p.description?.toLowerCase().includes(query.toLowerCase()) || false;
      const categoryMatch =
        selectedCategory === 'ALL' ||
        (typeof p.category === 'object'
          ? p.category.name === selectedCategory
          : p.category === selectedCategory);

      const price = Number(p.discount) > 0 ? p.price * (1 - p.discount / 100) : p.price;
      const priceMatch = price >= priceRange[0] && price <= priceRange[1];

      const ratingMatch =
        (p.rating || 0) >= minRating ||
        (p.averageRating || 0) >= minRating;

      const stockMatch = !showOnlyInStock || (p.stock && p.stock > 0);

      return (titleMatch || descMatch) && categoryMatch && priceMatch && ratingMatch && stockMatch;
    });

    // Saralash
    switch (sortBy) {
      case 'PRICE_ASC':
        return [...result].sort((a, b) => {
          const aP = Number(a.discount) > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const bP = Number(b.discount) > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return aP - bP;
        });
      case 'PRICE_DESC':
        return [...result].sort((a, b) => {
          const aP = Number(a.discount) > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const bP = Number(b.discount) > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return bP - aP;
        });
      case 'NEWEST':
        return [...result].sort((a, b) => {
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();
          return bDate - aDate;
        });
      case 'RATING':
        return [...result].sort((a, b) => {
          const aRating = a.rating || a.averageRating || 0;
          const bRating = b.rating || b.averageRating || 0;
          return bRating - aRating;
        });
      case 'POPULARITY':
        return [...result].sort((a, b) => {
          const aViews = a.views || 0;
          const bViews = b.views || 0;
          return bViews - aViews;
        });
      case 'DISCOUNT':
        return [...result].sort((a, b) => {
          return (b.discount || 0) - (a.discount || 0);
        });
      default:
        return result;
    }
  }, [products, query, sortBy, selectedCategory, priceRange, minRating, showOnlyInStock]);

  // Sahifalantirish
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return results.slice(startIndex, startIndex + itemsPerPage);
  }, [results, currentPage]);

  const totalPages = Math.ceil(results.length / itemsPerPage);

  // Narx formatlash — null/undefined/NaN holatlarida artefakt chiqmaydi
  const formatPrice = (price) => {
    const n = Number(price);
    if (!Number.isFinite(n) || n <= 0) return '';
    return new Intl.NumberFormat('uz-UZ').format(Math.round(n)) + " so'm";
  };

  // Filtrlashni tozalash
  const handleClearFilters = () => {
    setSelectedCategory('ALL');
    setPriceRange([0, 10000000]);
    setMinRating(0);
    setShowOnlyInStock(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'ALL' ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 10000000 ||
    minRating !== 0 ||
    showOnlyInStock;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white relative overflow-hidden">
      {/* Orqa fon */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,193,7,0.06),transparent_45%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="pt-10 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-300 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Bosh sahifaga qaytish
          </Link>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold flex items-center gap-3 flex-wrap">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30">
              <Search className="h-6 w-6 text-amber-400" />
            </div>
            Qidiruv natijalari: <span className="text-amber-400">"{query}"</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-light">
            {loading ? "Qidiruv ishga tushmoqda..." : `${results.length} ta mahsulot topildi`}
          </p>
        </div>

      <div className="flex gap-6 mb-8">
        {/* Filtrlash Payvandi */}
        <div className="hidden lg:flex flex-col w-64 gap-4">
          <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest">Filtrlash</h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-[9px] font-bold text-amber-300 hover:text-amber-200 transition-colors"
                >
                  Tozalash
                </button>
              )}
            </div>

            {/* Kategoriya Filtri */}
            <div className="border-b border-slate-900 pb-4 mb-4">
              <h4 className="text-[9px] font-bold uppercase text-slate-400 mb-3 tracking-wider">Kategoriya</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value="ALL"
                    checked={selectedCategory === 'ALL'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-3 h-3 rounded border-slate-600 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                    Barcha Kategoriyalar
                  </span>
                </label>
                {allCategories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={selectedCategory === cat}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-3 h-3 rounded border-slate-600 cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Narx Filtri */}
            <div className="border-b border-slate-900 pb-4 mb-4">
              <h4 className="text-[9px] font-bold uppercase text-slate-400 mb-3 tracking-wider">Narx Diapazoni</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-slate-400 mb-1 block">Minimum: {formatPrice(priceRange[0])}</label>
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    step="50000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 mb-1 block">Maksimum: {formatPrice(priceRange[1])}</label>
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    step="50000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Reyting Filtri */}
            <div className="border-b border-slate-900 pb-4 mb-4">
              <h4 className="text-[9px] font-bold uppercase text-slate-400 mb-3 tracking-wider">Minimal Reyting</h4>
              <div className="space-y-2">
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="w-3 h-3 cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      {rating === 0 ? 'Barcha' : [...Array(rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      {rating > 0 && <span className="text-slate-500 text-[9px]">va undan yuqori</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Zaxira Filtri */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={showOnlyInStock}
                  onChange={(e) => setShowOnlyInStock(e.target.checked)}
                  className="w-3 h-3 rounded cursor-pointer"
                />
                <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                  Faqat zaxirada mavjudlar
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Mahsulotlar Bo'limi */}
        <div className="flex-1">
          {/* Saralash va Ko'rinish Vazifalari */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-xs font-bold text-amber-300 hover:bg-slate-900 transition-colors"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              Filtrlash
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
            >
              <option value="DEFAULT">Standart Saralash</option>
              <option value="PRICE_ASC">Narx: O'sish</option>
              <option value="PRICE_DESC">Narx: Kamayish</option>
              <option value="NEWEST">Yangi Mahsulotlar</option>
              <option value="RATING">Eng Yaxshi Reytinglar</option>
              <option value="POPULARITY">Mashhur</option>
              <option value="DISCOUNT">Eng Katta Chegirmalar</option>
            </select>
          </div>

          {/* Mobilida Filtrlash Payvandi */}
          {showFilters && (
            <div className="lg:hidden bg-slate-950/40 border border-slate-900 rounded-2xl p-4 mb-6">
              {/* Kategoriya */}
              <div className="mb-6">
                <h4 className="text-[9px] font-bold uppercase text-slate-400 mb-3">Kategoriya</h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300"
                >
                  <option value="ALL">Barcha Kategoriyalar</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Narx */}
              <div className="mb-6">
                <h4 className="text-[9px] font-bold uppercase text-slate-400 mb-3">Narx: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</h4>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="50000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="50000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full mt-2"
                />
              </div>

              {/* Reyting */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyInStock}
                    onChange={(e) => setShowOnlyInStock(e.target.checked)}
                  />
                  <span className="text-xs text-slate-300">Faqat zaxirada mavjudlar</span>
                </label>
              </div>
            </div>
          )}

          {/* Mahsulotlar Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse border border-slate-900 bg-slate-950/20 rounded-2xl p-4 flex flex-col gap-4 h-72 sm:h-[520px]">
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
          ) : results.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-900 rounded-3xl bg-slate-950/10 max-w-2xl mx-auto flex flex-col items-center p-8">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 text-slate-700 mb-4">
                <Package className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Hech narsa topilmadi</h3>
              <p className="mt-2 text-xs text-slate-500 max-w-sm leading-relaxed">
                "{query}" bo'yicha hech qanday mahsulot topilmadi. Boshqa kalit so'z bilan urinib ko'ring.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                {paginatedResults.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>

              {/* Sahifalantirish */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-3 mt-12 pt-8 border-t border-slate-900">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-slate-950 border border-slate-900 rounded-lg text-xs font-bold text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
                  >
                    Oldingi
                  </button>
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                          currentPage === i + 1
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black'
                            : 'bg-slate-950 border border-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-slate-950 border border-slate-900 rounded-lg text-xs font-bold text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
                  >
                    Keyingi
                  </button>
                  <div className="hidden sm:block text-xs text-slate-500 ml-4">
                    {currentPage} / {totalPages} sahifa
                  </div>
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}