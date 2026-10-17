import React, { useState, useMemo, useCallback } from 'react';
import { 
  ShoppingCart, Heart, Star, Check, Scale, Eye, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist, showToast, toggleCompare, compareList } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  // Rasm yuklanmasa ishlatiladigan NEYTRAL placeholder — boshqa mahsulot/galereya rasmi fallback qilinmaydi (spec 2.1-band)
  const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><rect width='600' height='600' fill='#0d1220'/><rect x='14' y='14' width='572' height='572' rx='28' fill='none' stroke='#F5C518' stroke-opacity='0.35' stroke-width='3'/><text x='300' y='300' text-anchor='middle' fill='#F5C518' font-family='Georgia, serif' font-size='44' font-weight='bold'>Grand Décor</text><text x='300' y='340' text-anchor='middle' fill='#8b93a7' font-family='Arial, sans-serif' font-size='20'>Mahsulot rasmi</text></svg>`
  );

  const currentId = useMemo(() => product?._id || product?.id, [product]);
  const productName = useMemo(() => product?.name || product?.title || '', [product]);

  const isWishlisted = useMemo(() => {
    if (!Array.isArray(wishlist) || !currentId) return false;
    return wishlist.some(item => (item._id || item.id) === currentId);
  }, [wishlist, currentId]);

  const isCompared = useMemo(() => {
    if (!Array.isArray(compareList) || !currentId) return false;
    return compareList.some(item => (item._id || item.id) === currentId);
  }, [compareList, currentId]);

  const formatPrice = useCallback((price) => {
    const n = Number(price);
    if (!Number.isFinite(n) || n <= 0) return '';
    return new Intl.NumberFormat('uz-UZ').format(Math.round(n)) + " so'm";
  }, []);

  const { hasDiscount, originalPrice, currentPrice } = useMemo(() => {
    const discount = Number(product?.discount) || 0;
    const hasDisc = discount > 0;
    const origPrice = Number(product?.price) || 0;
    const currPrice = hasDisc ? origPrice * (1 - discount / 100) : origPrice;
    return { hasDiscount: hasDisc, originalPrice: origPrice, currentPrice: currPrice };
  }, [product]);

  const categoryName = useMemo(() => {
    if (!product?.category) return "Parda Dekori";
    if (typeof product.category === 'object') {
      return product.category.name || product.category.title || "Parda Dekori";
    }
    return String(product.category);
  }, [product]);

  const isOutOfStock = useMemo(() => Number(product?.stock) <= 0, [product]);
  const isLowStock = useMemo(() => !isOutOfStock && Number(product?.stock) < 5, [product, isOutOfStock]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    setJustAdded(true);
    try {
      addToCart(product, 1);
      showToast?.(`${productName} savatga qo'shildi!`, "success");
    } catch (error) {
      console.error("Savat xatosi:", error);
    } finally {
      setTimeout(() => setIsAdding(false), 500);
      setTimeout(() => setJustAdded(false), 2000);
    }
  }, [isAdding, addToCart, product, productName, showToast]);

  const handleWishlistToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      toggleWishlist?.(product);
      showToast?.(
        isWishlisted ? "Sevimlilardan olib tashlandi" : "Sevimlilarga qo'shildi",
        "info"
      );
    } catch (error) {
      console.error("Wishlist xatosi:", error);
    }
  }, [toggleWishlist, product, isWishlisted, showToast]);

  const handleCompareToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      toggleCompare?.(product);
    } catch (error) {
      console.error("Compare xatosi:", error);
    }
  }, [toggleCompare, product]);

  if (!product) return null;

  return (
    <div className="group relative rounded-2xl border border-slate-900/90 bg-slate-950/70 p-3 sm:p-4 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-400/40 hover:shadow-[0_20px_45px_-12px_rgba(255,193,7,0.18)] flex flex-col justify-between overflow-hidden text-white">
      
      {/* Yuqori Rasm Qismi */}
      <div className="relative w-full aspect-[4/4.2] rounded-xl overflow-hidden bg-slate-900/80 mb-3 border border-slate-800/80">
        <Link to={`/product/${currentId}`} className="block h-full w-full">
          <img
            src={imgFailed ? FALLBACK_IMAGE : (product.image || product.img)}
            alt={productName}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Ustki Badjlar */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="rounded-lg bg-amber-400 text-slate-950 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-md">
              -{product.discount}%
            </span>
          )}
          {isOutOfStock && (
            <span className="rounded-lg bg-rose-500 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-md">
              Tugagan
            </span>
          )}
          {product.isNew && !isOutOfStock && (
            <span className="rounded-lg bg-slate-950/90 border border-amber-400/40 text-amber-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              Yangi
            </span>
          )}
        </div>

        {/* O'ng Ustki Tezkor Tugmalar (Wishlist & Compare) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlistToggle}
            className={`h-8 w-8 rounded-lg flex items-center justify-center backdrop-blur-md transition-all duration-200 border ${
              isWishlisted
                ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 shadow-sm'
                : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:text-white hover:border-amber-400/50 hover:bg-slate-900'
            }`}
            title="Sevimlilarga qo'shish"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleCompareToggle}
            className={`h-8 w-8 rounded-lg flex items-center justify-center backdrop-blur-md transition-all duration-200 border opacity-0 group-hover:opacity-100 ${
              isCompared
                ? 'bg-amber-400/20 border-amber-400/60 text-amber-300'
                : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:text-white hover:border-amber-400/50 hover:bg-slate-900'
            }`}
            title="Solishtirish"
          >
            <Scale className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Tezkor Ko'rish (Hover Overlay) */}
        <Link
          to={`/product/${currentId}`}
          className="absolute inset-x-3 bottom-3 py-2 rounded-xl bg-slate-950/90 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 backdrop-blur-md shadow-lg"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Batafsil ko'rish</span>
        </Link>
      </div>

      {/* Ma'lumotlar Qismi */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        
        <div>
          {/* Kategoriya va Reyting */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400/90 truncate">
              {categoryName}
            </span>

            <div className="flex items-center gap-1 text-[11px] text-amber-300 shrink-0">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{Number(product.rating || 5.0).toFixed(1)}</span>
              <span className="text-slate-500 text-[10px]">({product.reviewsCount || 0})</span>
            </div>
          </div>

          {/* Sarlavha */}
          <Link to={`/product/${currentId}`} className="block group-hover:text-amber-300 transition-colors">
            <h3 className="font-medium text-sm text-slate-100 line-clamp-2 leading-snug">
              {productName}
            </h3>
          </Link>

          {/* Specs / Xususiyatlar Kapsulalari */}
          {Array.isArray(product.specs) && product.specs.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.specs.slice(0, 2).map((spec, idx) => (
                <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/80 text-slate-300 truncate max-w-[130px]">
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Narx va Savatga Qo'shish Tugmasi */}
        <div className="pt-3 border-t border-slate-900/90 mt-2 flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-amber-300 font-sans tracking-tight">
              {formatPrice(currentPrice)}
            </div>
            {hasDiscount && (
              <div className="text-[11px] line-through text-slate-500 font-sans -mt-0.5">
                {formatPrice(originalPrice)}
              </div>
            )}
            {/* Ombor holati (mavjudlik indikatori) */}
            <div className="mt-1 text-[10px] font-semibold leading-none">
              {isOutOfStock ? (
                <span className="text-rose-400">Hozircha mavjud emas</span>
              ) : isLowStock ? (
                <span className="text-amber-400/90">Omborda kam ({product.stock} dona)</span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-emerald-400/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                  Mavjud
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            className={`h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-md ${
              isOutOfStock
                ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                : justAdded
                  ? 'bg-amber-400 text-slate-950 shadow-glow-sm'
                  : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-glow-sm hover:scale-[1.03] active:scale-[0.97]'
            }`}
          >
            {isOutOfStock ? (
              <>
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Tugagan</span>
              </>
            ) : justAdded ? (
              <>
                <Check className="h-4 w-4 stroke-[3]" />
                <span className="hidden sm:inline">Qo'shildi</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Savatga</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}

// PERFORMANCE: mahsulot o'zgarmasa karta qayta render qilinmaydi
export default React.memo(ProductCard);
