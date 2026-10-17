import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  CreditCard,
  Zap,
  Ticket,
  Wallet,
  BadgePercent,
  CheckCircle2,
  Loader2,
  Sparkles,
  X,
  Gem,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    addToCart,
    decreaseCartQuantity,
    removeFromCart,
    clearCart,
    showToast,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    bonusPoints,
    spendBonusPoints,
    deliveryZones,
    selectedDeliveryZone,
    setSelectedDeliveryZone,
    calculateCartSubtotal,
    calculateDeliveryFee,
    calculateCouponDiscount,
    calculateCartTotal,
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [useBonus, setUseBonus] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (price) => {
    const n = Number(price);
    if (!Number.isFinite(n) || n <= 0) return '';
    return new Intl.NumberFormat('uz-UZ').format(Math.round(n)) + " so'm";
  };

  const getItemId = (item) => item._id || item.id;

  const getItemPrice = (item) => {
    const originalPrice = Number(item.price) || 0;
    const hasDiscount = item.discount && Number(item.discount) > 0;
    return hasDiscount
      ? originalPrice * (1 - Number(item.discount) / 100)
      : originalPrice;
  };

  const subtotal = calculateCartSubtotal();
  const deliveryFee = calculateDeliveryFee();
  const couponDiscount = calculateCouponDiscount();
  const bonusDiscount = useBonus ? Math.min(bonusPoints * 1000, subtotal - couponDiscount) : 0;
  const total = calculateCartTotal() - bonusDiscount;

  // Bepul yetkazib berish progress
  const targetForFree = 1000000;
  const remainingForFree = Math.max(0, targetForFree - subtotal);
  const freeProgress = Math.min(100, (subtotal / targetForFree) * 100);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    setTimeout(() => {
      navigate('/buyurtma');
      setIsCheckingOut(false);
    }, 500);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      showToast?.("Kupon kodini kiriting!", "error");
      return;
    }
    const success = applyCoupon?.(couponCode);
    if (success) {
      setCouponCode('');
    }
  };

  const handleToggleBonus = () => {
    if (bonusPoints <= 0) {
      showToast?.("Sizda bonus ballar yetarli emas!", "warning");
      return;
    }
    setUseBonus(!useBonus);
    if (!useBonus) {
      showToast?.(`${Math.min(bonusPoints * 1000, subtotal).toLocaleString('uz-UZ')} so'm bonus ishlatiladi`, "success");
    }
  };

  const itemCount = cart.reduce((t, i) => t + i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden flex items-center justify-center">
        {/* Orqa fon effektlari */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-lg">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-amber-400/20 bg-slate-900/50 backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(255,193,7,0.2)]">
            <ShoppingCart className="h-10 w-10 text-amber-400/70" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
            Savatingiz <span className="text-amber-400">Bo'sh</span>
          </h1>
          <p className="text-sm text-slate-400 font-light leading-relaxed mb-8">
            Savatingiz hozircha bo'sh. Hashamatli parda aksessuarlarimiz bilan uyingizga saroy jozibasini olib kiring.
          </p>
          <Link
            to="/katalog"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-7 py-3.5 text-sm font-bold text-slate-950 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Katalogga o'tish
          </Link>

          {/* Aksiya banner */}
          <div className="mt-10 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">VIP Maxsus taklif!</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Savatga mahsulot qo'shing va <span className="text-amber-300 font-bold">WELCOME10</span> kuponi bilan 10% chegirma oling!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 relative overflow-hidden">
      {/* Orqa fon effektlari */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        {/* Yuqori panel */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-900/50 border border-slate-900 px-4 py-2 rounded-xl backdrop-blur-md hover:border-amber-400/30"
          >
            <ArrowLeft className="h-4 w-4" /> Orqaga
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              {itemCount} ta mahsulot
            </span>
            <button
              onClick={() => {
                clearCart();
                showToast?.("Savat tozalandi", "info");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Tozalash
            </button>
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30">
            <ShoppingBag className="h-6 w-6 text-amber-400" />
          </div>
          Savat
        </h1>

        {/* Bepul yetkazib berish progress */}
        <div className="mb-8 p-5 rounded-3xl border border-amber-400/20 bg-slate-900/30 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Bepul yetkazib berish</span>
            </div>
            {remainingForFree > 0 ? (
              <span className="text-xs text-slate-500">
                Yana <span className="text-amber-300 font-bold">{formatPrice(remainingForFree)}</span> qo'shing
              </span>
            ) : (
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> BEPUL YETKAZIB BERISH
              </span>
            )}
          </div>
          <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500 shadow-[0_0_10px_rgba(255,193,7,0.4)]"
              style={{ width: `${freeProgress}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Mahsulotlar ro'yxati */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => {
              const itemId = getItemId(item);
              const itemName = item.name || item.title || "Mahsulot";
              const itemPrice = getItemPrice(item);
              const hasDiscount = item.discount && Number(item.discount) > 0;

              return (
                <div
                  key={itemId}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-md transition-all hover:border-amber-400/25 group"
                >
                  {/* Rasm */}
                  <Link
                    to={`/product/${itemId}`}
                    className="shrink-0 w-full sm:w-24 h-40 sm:h-24 rounded-xl overflow-hidden border border-slate-900 bg-slate-950/60 flex items-center justify-center p-2"
                  >
                    <img
                      src={item.image}
                      alt={itemName}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Ma'lumot */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${itemId}`}
                      className="font-serif font-bold text-white text-sm hover:text-amber-300 transition-colors line-clamp-1"
                    >
                      {itemName}
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-black text-amber-300 text-sm">
                        {formatPrice(itemPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-500 line-through">
                          {formatPrice(Number(item.price) || 0)}
                        </span>
                      )}
                      {hasDiscount && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                          -{item.discount}%
                        </span>
                      )}
                    </div>
                    {item.specs && item.specs.length > 0 && (
                      <p className="text-xs text-slate-500 mt-1.5 truncate">
                        {item.specs.slice(0, 2).join(" • ")}
                      </p>
                    )}
                    {item.stock && Number(item.stock) < 5 && (
                      <p className="text-xs text-amber-300 mt-1.5 animate-pulse">
                        Faqat {item.stock} dona qolgan!
                      </p>
                    )}
                  </div>

                  {/* Miqdor boshqaruvi */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="flex items-center border border-amber-400/20 bg-slate-950/60 rounded-xl p-1">
                      <button
                        onClick={() => decreaseCartQuantity(itemId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="font-bold text-sm px-3 text-white min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-white text-sm">
                        {formatPrice(itemPrice * item.quantity)}
                      </p>
                      <p className="text-[10px] text-slate-600">
                        {formatPrice(itemPrice)} × {item.quantity}
                      </p>
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="text-xs font-bold text-rose-400 hover:text-rose-300 mt-1.5 inline-flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" /> O'chirish
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Buyurtma xulosasi */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="p-6 rounded-3xl border border-amber-400/20 bg-slate-900/40 backdrop-blur-md space-y-4">
              <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" /> Buyurtma Xulosasi
              </h2>

              {/* Kupon qo'llash */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3.5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/30">
                        <BadgePercent className="h-4 w-4 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-amber-300">{appliedCoupon.code}</p>
                        <p className="text-[10px] text-slate-500">-{appliedCoupon.discount}% chegirma</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-300 hover:bg-amber-400/10 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Kupon kodi"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-amber-400/40 focus:outline-none uppercase tracking-widest"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-2 text-sm font-black text-slate-950 hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                    >
                      <BadgePercent className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className="mt-2.5 flex gap-1.5 flex-wrap">
                  {['WELCOME10', 'SUMMER20', 'NEWYEAR30'].map(code => (
                    <button
                      key={code}
                      onClick={() => {
                        setCouponCode(code);
                        applyCoupon?.(code);
                      }}
                      className="text-[10px] font-semibold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg hover:text-amber-300 hover:border-amber-400/30 transition-colors"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bonus ballar */}
              {bonusPoints > 0 && (
                <button
                  onClick={handleToggleBonus}
                  className={`w-full rounded-2xl border p-3.5 text-left transition-all ${
                    useBonus ? 'border-amber-400/40 bg-amber-400/5' : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-bold text-white">Bonus ballar</span>
                    </div>
                    <span className={`text-sm font-bold ${useBonus ? 'text-amber-300' : 'text-slate-400'}`}>
                      {useBonus ? 'Ishlatilmoqda ✓' : `${bonusPoints} ball`}
                    </span>
                  </div>
                  {useBonus && bonusDiscount > 0 && (
                    <p className="mt-1.5 text-xs text-amber-300">
                      Chegirma: -{formatPrice(bonusDiscount)}
                    </p>
                  )}
                </button>
              )}

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Ostiy summa</span>
                  <span className="font-bold text-white">{formatPrice(subtotal)}</span>
                </div>
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-amber-300">
                    <span className="flex items-center gap-1">
                      <Ticket className="h-3.5 w-3.5" /> Kupon chegirmasi
                    </span>
                    <span className="font-bold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                {useBonus && bonusDiscount > 0 && (
                  <div className="flex justify-between text-amber-300">
                    <span className="flex items-center gap-1">
                      <Wallet className="h-3.5 w-3.5" /> Bonus chegirma
                    </span>
                    <span className="font-bold">-{formatPrice(bonusDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5" /> Yetkazib berish
                  </span>
                  <span className="font-bold text-white">
                    {deliveryFee === 0 ? (
                      <span className="text-amber-300">BEPUL</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
                  <span className="font-serif font-bold text-white text-base">Jami</span>
                  <span className="font-black text-amber-300 text-2xl">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-4 text-sm font-black uppercase tracking-wider text-slate-950 hover:shadow-lg hover:shadow-amber-500/30 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Yo'naltirilmoqda...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" /> Buyurtmani Rasmiylashtirish
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 font-light text-center leading-relaxed">
                1 000 000 so'mdan yuqori buyurtmalarda yetkazib berish bepul!
              </p>
            </div>

            {/* Kafolat kartalari */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl border border-slate-900/80 bg-slate-900/30 flex flex-col items-center gap-2 text-center hover:border-amber-400/30 transition-colors">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2 yil kafolat</p>
              </div>
              <div className="p-3 rounded-2xl border border-slate-900/80 bg-slate-900/30 flex flex-col items-center gap-2 text-center hover:border-amber-400/30 transition-colors">
                <Truck className="h-5 w-5 text-amber-400" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tezkor yetkazish</p>
              </div>
              <div className="p-3 rounded-2xl border border-slate-900/80 bg-slate-900/30 flex flex-col items-center gap-2 text-center hover:border-amber-400/30 transition-colors">
                <RotateCcw className="h-5 w-5 text-amber-400" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">14 kun qaytarish</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}