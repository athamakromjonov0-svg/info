import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Layers, Percent, Heart, Scale, User, Wallet,
  ShieldCheck, ChevronDown, X, Compass, Sparkles, LogOut,
  ShoppingCart, Sparkle, Coins, Truck, Newspaper, LifeBuoy, RotateCcw,
  CreditCard, HelpCircle, Headset, Package, ReceiptText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * O'NG TOMON SIDEBAR — saytning barcha sahifalari shu yerda.
 * Katta ekranlarda (xl+) doimiy ko'rinadi, kichik ekranlarda
 * navbar tugmasi orqali ochiladigan drawer bo'lib ishlaydi.
 */
export default function SiteSidebar({ open, onClose }) {
  const {
    cart, wishlist, compareList,
    isSiteAuthenticated, siteUser, siteLogout,
    isAuthenticated,
    bonusPoints, networkStatus,
    products,
  } = useApp();

  const location = useLocation();
  const [catsOpen, setCatsOpen] = useState(false);

  // Mobil drawer ochilganda orqa sahifa skroll qilinmasin (lg+ da doimiy,
  // oynasiz holatda skroll bo'lib qolmasligi uchun lock berilmaydi)
  useEffect(() => {
    if (open && window.innerWidth < 1280) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
    return undefined;
  }, [open]);

  const cartCount = (cart || []).reduce((s, i) => s + (i.quantity || 1), 0);
  const wishlistCount = (wishlist || []).length;
  const compareCount = (compareList || []).length;

  // Sayt kategoriyalari (mahsulotlardan yig'iladi)
  const cats = useMemo(() => {
    const set = new Set((products || []).map(p => {
      const c = p.category;
      if (!c) return 'GENERAL';
      return typeof c === 'object' ? (c.name || 'GENERAL') : String(c);
    }));
    return Array.from(set).sort();
  }, [products]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const linkCls = (path) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all border ${
    isActive(path)
      ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
      : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border-transparent'
  }`;

  const sectionTitle = (text) => (
    <p className="px-3 mb-2 mt-6 text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] first:mt-0">{text}</p>
  );

  const badge = (count, cls) => count > 0 ? (
    <span className={`ml-auto text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md min-w-[20px] text-center ${cls}`}>{count}</span>
  ) : null;

  return (
    <>
      {/* MOBIL ORQA FON (drawer) */}
      {open && (
        <div className="fixed inset-0 z-[55] bg-slate-950/70 backdrop-blur-sm xl:hidden" onClick={onClose} />
      )}

      <aside className={`fixed right-0 top-0 bottom-0 z-[60] w-64 flex flex-col border-l border-slate-900 bg-slate-950/95 backdrop-blur-2xl transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'
      }`}>
        {/* LOGO */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-900">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <span className="font-serif text-lg font-black">G</span>
            </div>
            <div>
              <p className="font-serif text-sm font-black tracking-widest text-white uppercase">GRAND<span className="text-amber-400">DÉCOR</span></p>
              <p className="text-[8px] text-amber-300/70 tracking-widest uppercase">Parda Aksessuarlari</p>
            </div>
          </Link>
          <button onClick={onClose} className="xl:hidden p-2 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* NAVIGATSIYA */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
          {sectionTitle('/// Navigatsiya')}
          <Link to="/" onClick={onClose} className={linkCls('/')}>
            <Home className="h-4 w-4 shrink-0" /> Bosh sahifa
          </Link>

          {/* GRAND AI */}
          <Link to="/ai" onClick={onClose} className={`${linkCls('/ai')} bg-gradient-to-r from-amber-400/10 to-yellow-500/10 border-amber-400/20 text-amber-300`}>
            <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
            <span className="flex-1">Grand AI Tahlilchi</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">AI</span>
          </Link>

          {/* Kategoriyalar (ochiluvchi) */}
          <div>
            <button
              onClick={() => setCatsOpen(!catsOpen)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all border ${
                isActive('/kategoriya') ? 'bg-amber-400/10 text-amber-300 border-amber-400/30' : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border-transparent'
              }`}
            >
              <Layers className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Kategoriyalar</span>
              <span className="text-[9px] font-mono text-slate-600">{cats.length}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${catsOpen ? 'rotate-180' : ''}`} />
            </button>
            {catsOpen && (
              <div className="mt-1 ml-7 pl-3 border-l border-slate-800 space-y-0.5 max-h-52 overflow-y-auto custom-scrollbar">
                {cats.map(cat => (
                  <Link
                    key={cat}
                    to={`/kategoriya/${encodeURIComponent(String(cat).toLowerCase())}`}
                    onClick={onClose}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg text-[11px] text-slate-500 hover:text-amber-300 hover:bg-slate-900/60 transition-all"
                  >
                    <span className="truncate">{cat}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/katalog" onClick={onClose} className={linkCls('/katalog')}>
            <Package className="h-4 w-4 shrink-0" /> Barcha mahsulotlar
          </Link>
          <Link to="/yangi-kelganlar" onClick={onClose} className={linkCls('/yangi-kelganlar')}>
            <Sparkle className="h-4 w-4 shrink-0" /> Yangi kelganlar
          </Link>
          <Link to="/chegirmalar" onClick={onClose} className={linkCls('/chegirmalar')}>
            <Percent className="h-4 w-4 shrink-0" /> Chegirmalar
          </Link>
          <Link to="/solishtirish" onClick={onClose} className={linkCls('/solishtirish')}>
            <Scale className="h-4 w-4 shrink-0" /> Solishtirish {badge(compareCount, 'bg-amber-400/20 text-amber-300 border border-amber-400/30')}
          </Link>

          {sectionTitle('/// Do\'kon')}
          <Link to="/sevimlilar" onClick={onClose} className={linkCls('/sevimlilar')}>
            <Heart className="h-4 w-4 shrink-0" /> Sevimlilar {badge(wishlistCount, 'bg-amber-400/20 text-amber-300 border border-amber-400/30')}
          </Link>
          <Link to="/savat" onClick={onClose} className={linkCls('/savat')}>
            <ShoppingCart className="h-4 w-4 shrink-0" /> Savat {badge(cartCount, 'bg-amber-400/20 text-amber-300 border border-amber-400/30')}
          </Link>
          <Link to="/buyurtmalarim" onClick={onClose} className={linkCls('/buyurtmalarim')}>
            <ReceiptText className="h-4 w-4 shrink-0" /> Buyurtmalarim
          </Link>

          {sectionTitle('/// Xizmatlar')}
          <Link to="/bonus-dasturi" onClick={onClose} className={linkCls('/bonus-dasturi')}>
            <Coins className="h-4 w-4 shrink-0" /> Bonus dasturi
          </Link>
          <Link to="/yetkazib-berish" onClick={onClose} className={linkCls('/yetkazib-berish')}>
            <Truck className="h-4 w-4 shrink-0" /> Yetkazib berish
          </Link>
          <Link to="/tolov-usullari" onClick={onClose} className={linkCls('/tolov-usullari')}>
            <CreditCard className="h-4 w-4 shrink-0" /> To'lov usullari
          </Link>
          <Link to="/qaytarish" onClick={onClose} className={linkCls('/qaytarish')}>
            <RotateCcw className="h-4 w-4 shrink-0" /> Qaytarish
          </Link>
          <Link to="/faq" onClick={onClose} className={linkCls('/faq')}>
            <HelpCircle className="h-4 w-4 shrink-0" /> FAQ
          </Link>
          <Link to="/aloqa" onClick={onClose} className={linkCls('/aloqa')}>
            <Headset className="h-4 w-4 shrink-0" /> Aloqa
          </Link>
          <Link to="/blog" onClick={onClose} className={linkCls('/blog')}>
            <Newspaper className="h-4 w-4 shrink-0" /> Blog / Yangiliklar
          </Link>
          <Link to="/ommaviy-oferta" onClick={onClose} className={linkCls('/ommaviy-oferta')}>
            <LifeBuoy className="h-4 w-4 shrink-0" /> Ommaviy oferta
          </Link>

          {sectionTitle('/// Hisob')}
          {isSiteAuthenticated ? (
            <>
              <Link to="/sayt/profil" onClick={onClose} className={linkCls('/sayt/profil')}>
                <User className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{siteUser?.name || 'Shaxsiy kabinet'}</span>
              </Link>
              <button
                onClick={() => { siteLogout(); onClose(); }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all border border-transparent w-full text-left"
              >
                <LogOut className="h-4 w-4 shrink-0" /> Saytdan chiqish
              </button>
            </>
          ) : (
            <Link to="/sayt/kirish" onClick={onClose} className={linkCls('/sayt/kirish')}>
              <User className="h-4 w-4 shrink-0" /> Kirish / Ro'yxatdan o'tish
            </Link>
          )}
          <div className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-slate-400 border border-slate-900 bg-slate-950/60 mt-1">
            <span className="flex items-center gap-2"><Wallet className="h-4 w-4 text-amber-400" /> Bonus ballar</span>
            <span className="text-amber-400 font-mono font-black">{bonusPoints}</span>
          </div>

          {sectionTitle('/// Tizim')}
          <Link to="/admin" onClick={onClose} className={linkCls('/admin')}>
            <ShieldCheck className="h-4 w-4 shrink-0" /> Admin panel
          </Link>
          {!isAuthenticated && (
            <Link to="/login" onClick={onClose} className={linkCls('/login')}>
              <Compass className="h-4 w-4 shrink-0" /> Admin kirish
            </Link>
          )}

          {/* Aksiya kartasi */}
          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-slate-950/40 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <p className="text-[10px] font-black text-white uppercase tracking-wider">Maxsus taklif</p>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Kupon: <span className="text-amber-300 font-bold">WELCOME10</span> — 500 000 so'mdan yuqori xaridlarda 10% chegirma!
            </p>
          </div>
        </nav>

        {/* PASTKI HOLAT */}
        <div className="px-4 py-4 border-t border-slate-900 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/60 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${networkStatus === 'online' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${networkStatus === 'online' ? 'bg-amber-400' : 'bg-rose-500'}`} />
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{networkStatus === 'online' ? 'Tarmoq: Ulangan' : 'Tarmoq: Uzilgan'}</span>
            </div>
            <span className="text-[9px] font-mono text-slate-600">v2.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
