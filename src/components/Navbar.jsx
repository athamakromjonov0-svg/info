import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag, Menu, Search, Heart, User, Bell, Scale, CheckCircle2,
  AlertTriangle, Info, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * MINIMAL NAVBAR — faqat eng kerakli narsalar:
 * logo, qidiruv, bildirishnoma, sevimlilar, savat va foydalanuvchi.
 * Barcha sahifalar o'ng tomondagi SiteSidebar'da joylashgan.
 */
export default function Navbar({ onToggleSidebar }) {
  const {
    cart, wishlist, compareList, notifications, markAllNotificationsRead,
    isSiteAuthenticated, siteUser, products,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const cartCount = (cart || []).reduce((s, i) => s + (i.quantity || 1), 0);
  const wishlistCount = (wishlist || []).length;
  const compareCount = (compareList || []).length;
  const unreadNotifications = (notifications || []).filter(n => !n.read).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sahifa o'zgarganda panellarni yopish
  useEffect(() => {
    const t = setTimeout(() => {
      setBellOpen(false);
      setShowSuggestions(false);
      setMobileSearchOpen(false);
    }, 0);
    return () => clearTimeout(t);
  }, [location]);

  // Qidiruv takliflari (derived — effect kerak emas)
  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return (products || [])
      .filter(p => {
        const name = (p.name || p.title || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const cat = typeof p.category === 'object' ? (p.category.name || '') : (p.category || '');
        return name.includes(q) || desc.includes(q) || String(cat).toLowerCase().includes(q);
      })
      .slice(0, 5);
  }, [searchQuery, products]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/qidiruv?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('uz-UZ').format(Math.round(Number(price) || 0)) + " so'm";

  const iconBtn = 'relative p-2 sm:p-2.5 rounded-xl border border-transparent hover:border-slate-900 bg-transparent hover:bg-slate-900/30 text-slate-400 hover:text-white transition-all duration-200';
  const countBadge = (count, cls) => count > 0 ? (
    <span className={`absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-mono font-bold ${cls}`}>
      {count}
    </span>
  ) : null;

  const notifIcon = {
    success: <CheckCircle2 className="h-3.5 w-3.5 text-amber-300" />,
    error: <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />,
    warning: <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />,
    info: <Info className="h-3.5 w-3.5 text-slate-300" />,
  };

  return (
    <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      mobileSearchOpen
        ? 'border-slate-900/40 bg-slate-950'
        : scrolled
          ? 'border-slate-900 bg-slate-950/85 backdrop-blur-xl shadow-xl shadow-black/40 h-16'
          : 'border-slate-900/40 bg-slate-950 h-[4.5rem]'
    }`}>
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between gap-3">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300">
              <span className="font-serif text-xl font-black">G</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif font-black text-base lg:text-lg tracking-widest text-white uppercase leading-none">
                GRAND<span className="text-amber-400 font-normal">DÉCOR</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-amber-200/70 font-sans mt-0.5">
                Parda Aksessuarlari
              </span>
            </div>
          </Link>

          {/* QIDIRUV (desktop) */}
          <div className="hidden md:flex relative max-w-lg w-full mx-2">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Tassel, magnit tutqich, kristall karniz qidirish..."
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-slate-900/90 focus:ring-1 focus:ring-amber-400/20 transition-all duration-200"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-amber-400/60" />
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-50">
                {suggestions.map(s => {
                  const price = Number(s.discount) > 0 ? Number(s.price) * (1 - Number(s.discount) / 100) : Number(s.price);
                  return (
                    <button
                      key={s._id || s.id}
                      type="button"
                      onMouseDown={() => { navigate(`/product/${s._id || s.id}`); setSearchQuery(''); setShowSuggestions(false); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-slate-900/60 transition-colors border-b border-slate-900/30 last:border-b-0 text-left group"
                    >
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        <img src={s.image} alt={s.name || s.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">{s.name || s.title}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                          {typeof s.category === 'object' ? (s.category.name || '') : (s.category || '')}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300 whitespace-nowrap">{formatPrice(price)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* AMALLAR */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobil qidiruv tugmasi */}
            <button onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setBellOpen(false); }} className={`${iconBtn} md:hidden`} aria-label="Qidiruv">
              <Search className="h-4 w-4" />
            </button>

            {/* GRAND AI TUGMASI */}
            <Link
              to="/ai"
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400/15 via-amber-500/10 to-yellow-500/15 border border-amber-400/40 text-amber-300 hover:text-white hover:border-amber-400 hover:bg-amber-400/25 transition-all text-xs font-bold group shadow-sm shadow-amber-500/10"
              title="Grand AI — Loyiha Tahlilchisi va Yordamchi"
            >
              <Sparkles className="h-4 w-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="font-serif font-black tracking-wider">AI</span>
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </Link>

            {/* Bildirishnomalar */}
            <div className="relative">
              <button
                onClick={() => {
                  setMobileSearchOpen(false);
                  setBellOpen(!bellOpen);
                  if (!bellOpen && unreadNotifications > 0) setTimeout(() => markAllNotificationsRead?.(), 2500);
                }}
                className={iconBtn}
                aria-label="Bildirishnomalar"
              >
                <Bell className="h-4 w-4" />
                {countBadge(unreadNotifications, 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 animate-pulse')}
              </button>

              {bellOpen && (
                <div className="fixed left-3 right-3 top-[4.75rem] md:absolute md:left-auto md:right-0 md:top-auto md:mt-2 md:w-80 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-900 px-4 py-3">
                    <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Bell className="h-4 w-4 text-amber-400" /> Bildirishnomalar
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">{(notifications || []).length} TA</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto custom-scrollbar">
                    {(notifications || []).length === 0 ? (
                      <div className="text-center py-10 text-xs text-slate-500 font-light">Bildirishnomalar yo'q</div>
                    ) : (
                      (notifications || []).slice(0, 6).map(n => (
                        <div key={n.id} className={`px-4 py-3 border-b border-slate-900/50 flex gap-3 hover:bg-slate-900/50 transition-colors ${n.read ? 'opacity-50' : ''}`}>
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                            {notifIcon[n.type] || <Info className="h-3.5 w-3.5 text-slate-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                            <p className="text-[9px] text-slate-600 font-mono mt-1">
                              {new Date(n.time).toLocaleString('uz-UZ')}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sevimlilar */}
            <Link to="/sevimlilar" className={iconBtn} aria-label="Sevimlilar">
              <Heart className="h-4 w-4" />
              {countBadge(wishlistCount, 'bg-amber-400 text-slate-950 shadow-glow-sm animate-pulse')}
            </Link>

            {/* Solishtirish */}
            {compareCount > 0 && (
              <Link to="/solishtirish" className={`${iconBtn} hidden sm:flex`} aria-label="Solishtirish">
                <Scale className="h-4 w-4" />
                {countBadge(compareCount, 'bg-amber-400 text-slate-950 shadow-glow-sm')}
              </Link>
            )}

            {/* Savat */}
            <Link to="/savat" className={iconBtn} aria-label="Savat">
              <ShoppingBag className="h-4 w-4" />
              {countBadge(cartCount, 'bg-amber-400 text-slate-950 shadow-glow-sm')}
            </Link>

            {/* Foydalanuvchi */}
            {isSiteAuthenticated ? (
              <Link
                to="/sayt/profil"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 px-3 py-2 text-xs font-bold text-amber-300 hover:border-amber-500/50 transition-all duration-200"
                title="Shaxsiy kabinet"
              >
                {siteUser?.photoURL ? (
                  <img src={siteUser.photoURL} alt={siteUser?.name || 'User'} className="h-5 w-5 rounded-full object-cover" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="hidden md:block">{siteUser?.name || 'Profil'}</span>
              </Link>
            ) : (
              <Link
                to="/sayt/kirish"
                className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-2.5 sm:px-4 py-2 text-xs font-black text-slate-950 shadow-glow-sm hover:from-amber-300 hover:to-yellow-400 transition-all active:scale-95"
              >
                <User className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Kirish</span>
              </Link>
            )}

            {/* SIDEBAR TUGMASI */}
            <button
              onClick={onToggleSidebar}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-900 bg-slate-900/40 text-slate-400 hover:text-amber-300 hover:border-amber-400/30 transition-all"
              aria-label="Menyu"
              title="Barcha sahifalar"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* MOBIL QIDIRUV */}
        {mobileSearchOpen && (
          <form onSubmit={handleSearchSubmit} className="md:hidden pb-3 animate-in fade-in slide-in-from-top-2 duration-150 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Mahsulot qidirish..."
              className="w-full bg-slate-900 border border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-600" />
          </form>
        )}
      </div>
    </nav>
  );
}
