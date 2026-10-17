import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Scale, 
  Trash2, 
  ShoppingBag, 
  X, 
  Check, 
  Minus,
  ArrowLeft,
  Star,
  Cpu,
  Zap,
  ShieldCheck,
  Battery,
  Wifi,
  Camera,
  Smartphone,
  Headphones,
  Watch,
  Laptop,
  Monitor,
  Gamepad2,
  Sparkles
} from 'lucide-react';

export default function ComparePage() {
  const { compareList, toggleCompare, clearCompare, addToCart, showToast } = useApp();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    const n = Number(price);
    if (!Number.isFinite(n) || n <= 0) return '';
    return new Intl.NumberFormat('uz-UZ').format(Math.round(n)) + " so'm";
  };

  const getCategoryIcon = (category) => {
    const cat = String(category || '').toLowerCase();
    if (cat.includes('telefon') || cat.includes('phone')) return Smartphone;
    if (cat.includes('noutbuk') || cat.includes('laptop')) return Laptop;
    if (cat.includes('monitor')) return Monitor;
    if (cat.includes('quloq') || cat.includes('headphone')) return Headphones;
    if (cat.includes('soat') || cat.includes('watch')) return Watch;
    if (cat.includes('o\'yin') || cat.includes('game')) return Gamepad2;
    if (cat.includes('kamera')) return Camera;
    return Cpu;
  };

  const getSpecValue = (product, key) => {
    const specs = product.specs || product.attributes || {};
    return specs[key] || '—';
  };

  const allSpecKeys = [
    { key: 'brand', label: 'Brend', icon: ShieldCheck },
    { key: 'model', label: 'Model', icon: Cpu },
    { key: 'color', label: 'Rang', icon: Sparkles },
    { key: 'storage', label: 'Xotira', icon: Battery },
    { key: 'ram', label: 'RAM', icon: Zap },
    { key: 'battery', label: 'Batareya', icon: Battery },
    { key: 'connectivity', label: 'Ulanish', icon: Wifi },
    { key: 'camera', label: 'Kamera', icon: Camera },
    { key: 'display', label: 'Ekran', icon: Monitor },
    { key: 'warranty', label: 'Kafolat', icon: ShieldCheck },
  ];

  if (compareList.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
        {/* ORQA FON */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1914_1px,transparent_1px),linear-gradient(to_bottom,#1c1914_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />
        <div className="absolute -top-24 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-6">
            <Scale className="h-10 w-10 text-amber-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase">
            Solishtirish <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">ro'yxati</span>
          </h1>
          <p className="mt-2 text-xs text-slate-500 font-mono uppercase tracking-widest">
Hozircha bo'sh
          </p>
          <p className="mt-6 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Mahsulotlarni solishtirish uchun ularni kartochkalardagi "Solishtirish" tugmasi orqali qo'shing.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 text-xs font-black text-slate-950 uppercase tracking-widest shadow-glow-sm hover:from-amber-300 hover:to-yellow-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      {/* ORQA FON */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1914_1px,transparent_1px),linear-gradient(to_bottom,#1c1914_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* SARIQ */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase">
              Mahsulotlarni <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">solishtirish</span>
            </h1>
            <p className="mt-1 text-xs text-slate-500 font-mono uppercase tracking-widest">
{compareList.length} ta mahsulot taqqoslanmoqda
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all duration-200"
            >
              <Trash2 className="h-4 w-4" /> Tozalash
            </button>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-900 hover:border-slate-700 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" /> Orqaga
            </button>
          </div>
        </div>

        {/* MAHSULOTLAR JADVALI */}
        <div className="rounded-3xl border border-slate-900 bg-slate-950/50 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Mahsulot kartalari */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-900/50">
            {compareList.map((product) => {
              const CategoryIcon = getCategoryIcon(product.category);
              const hasDiscount = Number(product.discount) > 0;
              const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
              const isNew = product.isNew;
              const inStock = Number(product.stock) > 0;

              return (
                <div key={product._id || product.id} className="relative bg-slate-950 p-5 flex flex-col">
                  {/* O'chirish tugmasi */}
                  <button
                    onClick={() => toggleCompare(product)}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                    title="Olib tashlash"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* Kategoriya */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                      <CategoryIcon className="h-3 w-3" />
                    </span>
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                      {typeof product.category === 'object' ? product.category.name : (product.category || 'GENERAL')}
                    </span>
                  </div>

                  {/* Rasm */}
                  <div className="relative mb-4">
                    <div className="aspect-square rounded-2xl overflow-hidden border border-slate-900 bg-slate-900/40">
                      <img
                        src={product.image}
                        alt={product.name || product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {hasDiscount && (
                      <span className="absolute top-2 left-2 rounded-lg bg-amber-400 px-2 py-0.5 text-[9px] font-mono font-bold text-slate-950">
                        -{product.discount}%
                      </span>
                    )}
                    {isNew && (
                      <span className="absolute top-2 right-2 rounded-lg bg-slate-950/90 border border-amber-400/50 px-2 py-0.5 text-[9px] font-mono font-bold text-amber-300">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Nomi */}
                  <h3 className="text-sm font-bold text-white line-clamp-2 min-h-[2.5rem]">
                    {product.name || product.title}
                  </h3>

                  {/* Narx */}
                  <div className="mt-2 mb-4">
                    {hasDiscount ? (
                      <>
                        <div className="text-lg font-black text-amber-300">{formatPrice(finalPrice)}</div>
                        <div className="text-[10px] text-slate-500 line-through">{formatPrice(product.price)}</div>
                      </>
                    ) : (
                      <div className="text-lg font-black text-amber-300">{formatPrice(product.price)}</div>
                    )}
                  </div>

                  {/* Holat */}
                  <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest mb-4 ${
                    inStock 
                      ? 'bg-amber-400/10 border border-amber-400/20 text-amber-300' 
                      : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                  }`}>
                    {inStock ? <Check className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    {inStock ? `Omborda: ${product.stock} dona` : 'Mavjud emas'}
                  </div>

                  {/* Savatga qo'shish */}
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      showToast("Mahsulot savatga qo'shildi!", "success");
                    }}
                    disabled={!inStock}
                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2.5 text-[10px] font-black text-slate-950 uppercase tracking-widest shadow-glow-sm hover:from-amber-300 hover:to-yellow-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> Savatga
                  </button>
                </div>
              );
            })}
          </div>

          {/* XUSUSIYATLAR JADVALI */}
          <div className="border-t border-slate-900">
            {allSpecKeys.map(({ key, label, icon: SpecIcon }) => {
              const values = compareList.map(p => getSpecValue(p, key));
              const allSame = values.every(v => v === values[0]);
              return (
                <div key={key} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-900/50 ${
                  allSame ? 'bg-amber-400/5' : ''
                }`}>
                  <div className="bg-slate-950/80 p-4 flex items-center gap-2">
                    <SpecIcon className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                  </div>
                  {values.map((val, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 flex items-center justify-center">
                      <span className={`text-xs font-bold ${allSame ? 'text-amber-300' : 'text-slate-300'}`}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* TAVSIYA */}
        <div className="mt-8 rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/5 to-transparent backdrop-blur-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                Solishtirish bo'yicha maslahat
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Eng yaxshi tanlov uchun narx, xotira va batareya quvvatini solishtiring.
                Bir xil xususiyatlar oltin rangda belgilanadi — bu mahsulotlar o'xshash.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}