import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Layers,
  ArrowLeft,
  Share2,
  Sparkles,
  Zap,
  Minus,
  Plus,
  Scale,
  Check,
  MessageSquare,
  Clock,
  Package,
  CreditCard,
  Banknote,
  Smartphone,
  Gift,
  ChevronRight,
  BadgePercent,
  Award,
  Users,
  Send,
  ShoppingBag,
  CheckCircle2,
  Ruler,
  Palette,
  Gem,
  Crown
} from 'lucide-react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Neytral placeholder — mahsulotning o'z rasmi yuklanmasa, BOSHQA mahsulot/galereya rasmi emas,
// shu brendga mos neytral joy egallovchi ko'rsatiladi (spec 2.1-band: fallback taqiqlangan).
const PLACEHOLDER_IMAGE = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><rect width='600' height='600' fill='#0d1220'/><rect x='14' y='14' width='572' height='572' rx='28' fill='none' stroke='#F5C518' stroke-opacity='0.35' stroke-width='3'/><text x='300' y='300' text-anchor='middle' fill='#F5C518' font-family='Georgia, serif' font-size='44' font-weight='bold'>Grand Décor</text><text x='300' y='340' text-anchor='middle' fill='#8b93a7' font-family='Arial, sans-serif' font-size='20'>Mahsulot rasmi</text></svg>`
);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    toggleWishlist,
    wishlist,
    showToast,
    loading,
    addToRecentlyViewed,
    compareList,
    toggleCompare,
    reviews,
    addReview,
    bonusPoints,
    currency,
  } = useApp();

  // Lokal holatlar (States)
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [selectedImage, setSelectedImage] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);
  const [askQuestion, setAskQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [backendReviews, setBackendReviews] = useState([]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState('1-2 kun');

  // MAHSULOTNI TOPISH
  const product = products
    ? products.find(item => String(item._id || item.id) === String(id))
    : null;

  // Mahsulot yuklanganda asosiy rasm holatini o'rnatish
  const productId = product ? String(product._id || product.id) : null;
  useEffect(() => {
    if (product) {
      const pImage = product.image || product.img;
      if (pImage) setSelectedImage(pImage);
      addToRecentlyViewed?.(product);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Faqat SHU mahsulotga tegishli rasmlar (boshqa mahsulot yoki bosh sahifa galereyasi rasmlari ishlatilmaydi)
  const productImages = useMemo(() => {
    const primary = product?.image || product?.img;
    const gallery = Array.isArray(product?.images) ? product.images : [];
    const list = [primary, ...gallery].filter(Boolean).map(String);
    return [...new Set(list)];
  }, [product]);

  // O'xshash mahsulotlar
  const relatedProducts = useMemo(() => {
    if (!product || !Array.isArray(products)) return [];
    let pCat = product.category;
    if (typeof pCat === 'object') pCat = pCat.name || '';
    return products
      .filter(p => {
        let cat = p.category;
        if (typeof cat === 'object') cat = cat.name || '';
        return String(cat) === String(pCat) && String(p._id || p.id) !== String(product._id || product.id);
      })
      .slice(0, 4);
  }, [product, products]);

  // Shu kategoriyadagi reyting
  const categoryAvgRating = useMemo(() => {
    if (!product || !Array.isArray(products)) return 0;
    let pCat = product.category;
    if (typeof pCat === 'object') pCat = pCat.name || '';
    const catProducts = products.filter(p => {
      let cat = p.category;
      if (typeof cat === 'object') cat = cat.name || '';
      return String(cat) === String(pCat);
    });
    if (catProducts.length === 0) return 0;
    return (catProducts.reduce((s, p) => s + (Number(p.rating) || 0), 0) / catProducts.length).toFixed(1);
  }, [product, products]);

  // Backenddan haqiqiy sharhlarni yuklash (REAL VAQT)
  useEffect(() => {
    let active = true;
    const productId = String(product?._id || product?.id || id);
    if (!productId) { setBackendReviews([]); return undefined; }
    axios.get(`${API_BASE}/api/reviews/${productId}`, { timeout: 5000 })
      .then((res) => {
        if (!active) return;
        const data = res.data;
        const list = Array.isArray(data) ? data : [];
        setBackendReviews(list.map((r) => ({
          id: r.id || r._id,
          userName: r.userName || 'Foydalanuvchi',
          rating: Number(r.rating) || 5,
          text: r.comment || r.text || '',
          time: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : '',
        })));
      })
      .catch(() => { if (active) setBackendReviews([]); });
    return () => { active = false; };
  }, [id, product]);

  // Mahsulot sharhlari (backend + lokal + context)
  const productReviews = useMemo(() => {
    if (!product) return [];
    const productId = String(product._id || product.id);
    const contextReviews = reviews?.[productId] || [];
    const defaultReviews = product.reviewsCount ? [
      { id: 'r1', userName: 'Gulnora Karimova', rating: 5, text: 'Haqiqatdan ham juda sifatli ishlangan, narxiga mutlaqo arziydi. Pardalarimga bejirim mos keldi, tavsiya qilaman!', time: '2026-05-12' },
      { id: 'r2', userName: 'Dilnoza Rahimova', rating: 4, text: 'Yetkazib berish juda tez ishladi. Mahsulot qadoqlanishi buzilmagan, ideal holatda keldi.', time: '2026-05-08' },
      { id: 'r3', userName: 'Malika Yusupova', rating: 5, text: 'Sifat va ishonchlilik nuqtai nazaridan eng yaxshisi! Xonadonimga saroy jozibasi bag\'ishladi.', time: '2026-05-01' },
    ].slice(0, 10) : [];
    return [...backendReviews, ...contextReviews, ...defaultReviews];
  }, [product, reviews, backendReviews]);

  // Ulashish tizimi
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name || product?.title || 'Mahsulot',
          text: product?.description || '',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast?.("Havola buferga nusxalandi!", "info");
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        showToast?.("Ulashishda xatolik yuz berdi", "error");
      }
    }
  };

  // Savat mexanikasi
  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product, quantity);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
      showToast?.(`${product.name || product.title} (${quantity} dona) savatga qo'shildi!`, "success");
    }
  };

  // Sotib olish
  const handleBuyNow = () => {
    if (addToCart) {
      addToCart(product, quantity);
      // Savat state'i yangilanishini kutib, keyin buyurtma sahifasiga o'tamiz
      setTimeout(() => navigate('/buyurtma'), 150);
    }
  };

  // Sharh qo'shish
  const handleAddReview = () => {
    if (!reviewText.trim()) {
      showToast?.("Sharh matnini kiriting!", "error");
      return;
    }
    addReview?.(String(product._id || product.id), {
      rating: reviewRating,
      text: reviewText,
      userName: reviewName || 'Anonim Foydalanuvchi',
      time: new Date().toISOString(),
    });
    setReviewText('');
    setReviewName('');
    setReviewRating(5);
    showToast?.("Sharhingiz qo'shildi, rahmat!", "success");
  };

  // Savol berish
  const handleAskQuestion = () => {
    if (!askQuestion.trim()) {
      showToast?.("Savol matnini kiriting!", "error");
      return;
    }
    setQuestions(prev => [
      { id: `Q-${Date.now()}`, text: askQuestion, userName: 'Siz', time: new Date().toISOString(), answered: false },
      ...prev,
    ]);
    setAskQuestion('');
    showToast?.("Savolingiz yuborildi! Admin tez orada javob beradi.", "success");
  };

  // In stock tekshirish
  const isInStock = product ? Number(product.stock) > 0 : false;
  const isWishlisted = wishlist
    ? wishlist.some(item => String(item._id || item.id) === String(product?._id || product?.id))
    : false;
  const isCompared = compareList
    ? compareList.some(item => String(item._id || item.id) === String(product?._id || product?.id))
    : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-400"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-400/20 bg-slate-900/60 mb-6">
          <Gem className="h-9 w-9 text-amber-400/70" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3 text-center">
          Mahsulot Topilmadi
        </h1>
        <p className="text-sm text-slate-400 mb-8 text-center max-w-sm font-light">
          So'ralgan mahsulot hozircha katalogimizda mavjud emas yoki olib tashlangan bo'lishi mumkin.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.02] transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  // Narxni formatlash — null/undefined/NaN holatlarida "NaN so'm" yoki "0 so'm" artefaktlari chiqmaydi
  const formatPrice = (price) => {
    const n = Number(price);
    if (!Number.isFinite(n) || n <= 0) return '';
    return new Intl.NumberFormat('uz-UZ').format(Math.round(n)) + " so'm";
  };

  const basePrice = Number(product.price) || 0;
  const hasDiscount = product.discount && Number(product.discount) > 0;
  const currentPrice = hasDiscount ? basePrice * (1 - Number(product.discount) / 100) : basePrice;
  const savings = hasDiscount ? basePrice - currentPrice : 0;
  const stockLevel = Number(product.stock) || 0;
  const stockText = stockLevel === 0 ? 'Mavjud emas' : stockLevel < 5 ? `Faqat ${stockLevel} dona qoldi!` : 'Mavjud';
  const stockColor = stockLevel === 0 ? 'text-rose-400' : stockLevel < 5 ? 'text-amber-300' : 'text-amber-300';

  const categoryLabel = typeof product.category === 'object' ? product.category.name : (product.category || "Parda Dekori");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 lg:pb-20 relative overflow-hidden">
      {/* Orqa fon effektlari */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-amber-400 transition-colors">Bosh sahifa</Link>
          <ChevronRight className="h-3 w-3 text-slate-700" />
          <Link to="/katalog" className="hover:text-amber-400 transition-colors">Katalog</Link>
          <ChevronRight className="h-3 w-3 text-slate-700" />
          <Link
            to={`/kategoriya/${encodeURIComponent(String(categoryLabel).toLowerCase())}`}
            className="hover:text-amber-400 transition-colors"
          >
            {categoryLabel}
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-700" />
          <span className="text-slate-300 truncate max-w-[160px]">{product.name || product.title}</span>
        </nav>

        {/* Yuqori boshqaruv paneli */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-900/50 border border-slate-900 px-4 py-2 rounded-xl backdrop-blur-md hover:border-amber-400/30"
          >
            <ArrowLeft className="h-4 w-4" /> Orqaga
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => toggleCompare?.(product)}
              className={`p-2.5 rounded-xl border transition-all ${
                isCompared
                  ? 'bg-amber-400/10 border-amber-400/50 text-amber-300'
                  : 'bg-slate-900/50 border-slate-900 text-slate-400 hover:text-amber-300 hover:border-amber-400/30'
              }`}
              title="Solishtirish"
            >
              <Scale className={`h-4 w-4 ${isCompared ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-900 text-slate-400 hover:text-white hover:border-amber-400/30 transition-colors"
              title="Ulashish"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => toggleWishlist && toggleWishlist(product)}
              className={`p-2.5 rounded-xl border transition-all ${
                isWishlisted
                  ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                  : 'bg-slate-900/50 border-slate-900 text-slate-400 hover:text-amber-300'
              }`}
              title="Sevimlilar"
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Asosiy Grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          {/* CHAP TARAFI: Rasm */}
          <div className="lg:col-span-6 space-y-4">
            <div
              className={`relative aspect-[4/4.4] w-full rounded-3xl border border-amber-400/20 bg-slate-900/30 overflow-hidden group flex items-center justify-center transition-all shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] ${
                zoomImage ? 'cursor-zoom-out scale-[1.02]' : 'cursor-zoom-in'
              }`}
              onClick={() => setZoomImage(!zoomImage)}
            >
              <img
                src={selectedImage || PLACEHOLDER_IMAGE}
                alt={product.name || product.title}
                onError={() => { if (selectedImage) setSelectedImage(''); }}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
              {hasDiscount && (
                <div className="absolute top-4 left-4 rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-black text-slate-950 uppercase tracking-widest shadow-lg shadow-amber-500/30">
                  -{product.discount}%
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-4 right-4 rounded-xl bg-slate-950/90 border border-amber-400/40 px-3 py-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" /> Yangi
                </div>
              )}
            </div>

            {/* Qo'shimcha prevyu rasmlar — faqat shu mahsulotning o'z rasmlari */}
            {productImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((imgSrc, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(imgSrc)}
                    className={`aspect-square rounded-xl overflow-hidden border bg-slate-900/50 p-1 transition-all ${
                      selectedImage === imgSrc ? 'border-amber-400/60 shadow-md shadow-amber-500/10' : 'border-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <img src={imgSrc} alt="" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* O'NG TARAFI: Ma'lumot va Sotib olish */}
          <div className="lg:col-span-6 space-y-6">

            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/30">
                  <Crown className="h-3 w-3" /> {categoryLabel}
                </span>
                {hasDiscount && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20">
                    <BadgePercent className="h-3 w-3" /> -{product.discount}% Chegirma
                  </span>
                )}
                {product.isNew && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/30 animate-pulse">
                    <Sparkles className="h-3 w-3" /> Yangi Kolleksiya
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight">
                {product.name || product.title}
              </h1>

              {/* Reyting */}
              <div className="flex items-center gap-4 pt-1 flex-wrap">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-800'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {product.rating || "5.0"} ({product.reviewsCount || 12} baho)
                </span>
                <span className="h-4 w-px bg-slate-800" />
                <span className="text-xs text-slate-500">
                  Kategoriya reytingi: <span className="text-amber-300 font-bold">{categoryAvgRating}</span>
                </span>
              </div>

              {/* Status panel */}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${stockColor} ${
                  stockLevel === 0 ? 'border-rose-500/20 bg-rose-500/5' : stockLevel < 5 ? 'border-amber-500/20 bg-amber-500/5' : 'border-amber-400/20 bg-amber-400/5'
                }`}>
                  <Package className="h-3.5 w-3.5" /> {stockText}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-400/20 bg-amber-400/5 text-amber-300">
                  <ShieldCheck className="h-3.5 w-3.5" /> 2 yil kafolat
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-400/20 bg-amber-400/5 text-amber-300">
                  <Award className="h-3.5 w-3.5" /> Grand Décor Premium
                </span>
              </div>
            </div>

            {/* Narxlar */}
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-amber-400/20 backdrop-blur-md space-y-4">
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-4xl font-black text-amber-300 tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm text-slate-500 line-through">
                      {formatPrice(basePrice)}
                    </span>
                    <span className="text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
                      Tejash: {formatPrice(savings)}
                    </span>
                  </>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Kafolat</div>
                  <div className="text-sm font-bold text-amber-300 mt-1">2 yil</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Yetkazish</div>
                  <div className="text-sm font-bold text-amber-300 mt-1">{deliveryEstimate}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Qaytarish</div>
                  <div className="text-sm font-bold text-amber-300 mt-1">14 kun</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-light">Barcha soliqlar hisobga olingan. Rasmiy kafolat ostida.</p>
            </div>

            {/* Tavsif */}
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              {product.description || "Ushbu hashamatli parda aksessuari Grand Décor ustalari tomonidan 100% qo'l mehnati bilan ishlangan. Uyingiz interyeriga saroy jozibasi va nafislik olib kiradi."}
            </p>

            {/* Miqdor va Savatga */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

                {/* Counter */}
                <div className="flex items-center justify-between border border-amber-400/20 bg-slate-900/60 rounded-xl p-1.5 sm:w-32">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-bold text-sm px-2 text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(stockLevel || 99, q + 1))}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Tugmalar */}
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!isInStock}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold uppercase tracking-wider transition-all ${
                      isAddedToCart
                        ? 'bg-amber-400 text-slate-950 shadow-glow-sm'
                        : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-glow-sm hover:scale-[1.02]'
                    } ${!isInStock ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.99]'}`}
                  >
                    {isAddedToCart ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Qo'shildi!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" /> Savatga
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!isInStock}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-slate-900/70 py-3.5 text-xs font-bold uppercase tracking-wider text-amber-300 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="h-4 w-4" /> Hoziroq sotib olish
                  </button>
                </div>
              </div>
            </div>

            {/* To'lov usullari */}
            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5"><Banknote className="h-4 w-4 text-amber-400" /> Naqd</span>
              <span className="text-slate-800">•</span>
              <span className="flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-amber-400" /> Karta</span>
              <span className="text-slate-800">•</span>
              <span className="flex items-center gap-1.5"><Smartphone className="h-4 w-4 text-amber-400" /> Click / Payme</span>
            </div>

            {/* Info kartalari */}
            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl border border-slate-900/80 bg-slate-900/30 flex items-center gap-3 hover:border-amber-400/30 transition-colors">
                <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-white">2 Yil Kafolat</p>
                  <p className="text-slate-500 mt-0.5">Rasmiy ishlab chiqarish kafolati</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-slate-900/80 bg-slate-900/30 flex items-center gap-3 hover:border-amber-400/30 transition-colors">
                <Truck className="h-5 w-5 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-white">Tezkor Yetkazish</p>
                  <p className="text-slate-500 mt-0.5">O'zbekiston bo'ylab 1-3 kun</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-slate-900/80 bg-slate-900/30 flex items-center gap-3 hover:border-amber-400/30 transition-colors">
                <RotateCcw className="h-5 w-5 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-white">Oson Qaytarish</p>
                  <p className="text-slate-500 mt-0.5">14 kunlik qaytarish sharti</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tablar */}
        <div className="mt-16 border-t border-slate-800/80 pt-10">
          <div className="flex border-b border-slate-800/80 gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'specs' ? 'border-amber-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Ruler className="h-3.5 w-3.5 inline mr-1.5" /> Xususiyatlar
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'reviews' ? 'border-amber-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 inline mr-1.5" /> Sharhlar ({product.reviewsCount || 12})
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'questions' ? 'border-amber-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Users className="h-3.5 w-3.5 inline mr-1.5" /> Savol-javob
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'shipping' ? 'border-amber-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Truck className="h-3.5 w-3.5 inline mr-1.5" /> Yetkazib berish
            </button>
          </div>

          <div className="py-8">
            {activeTab === 'specs' && (
              <div className="max-w-3xl space-y-4">
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  Ushbu mahsulotning to'liq xususiyatlari va ishlab chiqarish detallari:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {(product.specs && product.specs.length > 0 ? product.specs : ["100% qo'l mehnati", "Italiya ipak iplari", "Swarovski billur bezaklar", "Kafolatli sifat"]).map((spec, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/30 border border-slate-900 text-sm text-slate-300 hover:border-amber-400/30 transition-colors">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
                        <Gem className="h-4 w-4" />
                      </div>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-2xl space-y-6">
                {/* Sharh qo'shish formasi */}
                <div className="p-6 rounded-2xl border border-amber-400/20 bg-slate-900/30 space-y-4">
                  <h4 className="font-serif text-base font-bold text-white">Sharh qoldiring</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Baho:</span>
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setReviewRating(i + 1)}
                        className="transition-colors"
                      >
                        <Star className={`h-5 w-5 ${i < reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700 hover:text-amber-400/50'}`} />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Ismingiz"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-amber-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400/20"
                  />
                  <textarea
                    placeholder="Sharhingizni yozing..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-amber-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400/20 resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleAddReview}
                    className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3 text-sm font-bold uppercase tracking-wider text-slate-950 hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                  >
                    Sharhni yuborish
                  </button>
                </div>

                {/* Sharhlar ro'yxati */}
                {productReviews.slice(0, showAllReviews ? productReviews.length : 3).map((review, i) => (
                  <div key={review.id || i} className="p-5 rounded-2xl border border-slate-900 bg-slate-900/20 space-y-3 hover:border-slate-800 transition-colors">
                    <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                      <span className="font-bold text-amber-300 flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/10 border border-amber-400/30">
                          <Users className="h-3.5 w-3.5" />
                        </div>
                        {review.userName}
                      </span>
                      <span className="text-slate-600 text-xs">
                        {new Date(review.time).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, starIdx) => <Star key={starIdx} className={`h-3.5 w-3.5 ${starIdx < (review.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-800'}`} />)}
                    </div>
                    <p className="text-sm text-slate-400 font-light leading-relaxed">{review.text}</p>
                  </div>
                ))}

                {productReviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="w-full rounded-xl border border-amber-400/20 bg-slate-950/50 py-3 text-sm font-bold text-amber-300 hover:bg-slate-900 hover:border-amber-400/40 transition-colors"
                  >
                    {showAllReviews ? 'Kamroq ko\'rsatish' : `Barcha sharhlarni ko'rsatish (${productReviews.length})`}
                  </button>
                )}
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="max-w-2xl space-y-4">
                <div className="p-6 rounded-2xl border border-amber-400/20 bg-slate-900/30 space-y-4">
                  <h4 className="font-serif text-base font-bold text-white">Savol berish</h4>
                  <textarea
                    placeholder="Mahsulot haqida savolingiz..."
                    value={askQuestion}
                    onChange={(e) => setAskQuestion(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-amber-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400/20 resize-none"
                    rows={2}
                  />
                  <button
                    onClick={handleAskQuestion}
                    className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3 text-sm font-bold uppercase tracking-wider text-slate-950 hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                  >
                    <Send className="h-4 w-4 inline mr-1.5" /> Savolni yuborish
                  </button>
                </div>

                {questions.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-slate-900 bg-slate-950/40">
                    <p className="text-sm text-slate-500 font-light">Hozircha savollar yo'q. Birinchi bo'ling!</p>
                  </div>
                ) : (
                  questions.map((q) => (
                    <div key={q.id} className="p-5 rounded-2xl border border-slate-900 bg-slate-900/20 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-white flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-amber-400" /> {q.userName}
                        </span>
                        <span className="text-slate-600 text-xs">{new Date(q.time).toLocaleDateString('uz-UZ')}</span>
                      </div>
                      <p className="text-sm text-slate-300 font-light">{q.text}</p>
                      {q.answered ? (
                        <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/20">
                          <p className="text-xs text-amber-300 font-bold">Admin javobi:</p>
                          <p className="text-sm text-slate-300 mt-1">{q.answer}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> Javob kutmoqda...
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-3xl space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/30 hover:border-amber-400/30 transition-colors">
                    <Truck className="h-6 w-6 text-amber-400 mb-3" />
                    <p className="text-sm font-bold text-white">Standart yetkazish</p>
                    <p className="text-xs text-slate-500 mt-1">1-2 kun · 20,000 so'm</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/30 hover:border-amber-400/30 transition-colors">
                    <Zap className="h-6 w-6 text-amber-400 mb-3" />
                    <p className="text-sm font-bold text-white">Tezkor yetkazish</p>
                    <p className="text-xs text-slate-500 mt-1">24 soat · 35,000 so'm</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/30 hover:border-amber-400/30 transition-colors">
                    <Gift className="h-6 w-6 text-amber-400 mb-3" />
                    <p className="text-sm font-bold text-white">Showroomdan olish</p>
                    <p className="text-xs text-slate-500 mt-1">Toshkent sh. · Bepul</p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl border border-amber-400/20 bg-amber-400/5">
                  <p className="text-sm text-amber-200/90 font-light leading-relaxed">
                    <ShieldCheck className="h-4 w-4 inline mr-1.5 text-amber-400" />
                    1,000,000 so'mdan yuqori buyurtmalarda yetkazib berish bepul! To'lov naqd, karta yoki Click/Payme orqali amalga oshirilishi mumkin.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
        O'XSHASH MAHSULOTLAR
        ============================================================ */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-800/80 pb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/30">
                <Layers className="h-5 w-5 text-amber-400" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                O'xshash <span className="text-amber-400">Mahsulotlar</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {relatedProducts.map((related) => (
                <ProductCard key={related._id || related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
      MOBIL STICKY SAVAT PANELI — telefonda sahifa ikkilasida ham
      "Savatga qo'shish" doim ekranning pastida ko'rinib turadi (lg+)
      ============================================================ */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center gap-3">
        <div className="min-w-0 shrink-0">
          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Jami</p>
          <p className="text-base font-black text-amber-300 tracking-tight leading-none">
            {formatPrice(currentPrice * quantity)}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all ${
            isAddedToCart
              ? 'bg-amber-400 text-slate-950 shadow-glow-sm'
              : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-glow-sm'
          } ${!isInStock ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
        >
          {isAddedToCart ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Qo'shildi!
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" /> Savatga
            </>
          )}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!isInStock}
          className={`shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-400/40 bg-slate-900/70 py-3 px-4 text-xs font-bold uppercase tracking-wider text-amber-300 active:scale-[0.98] transition-all ${isInStock ? '' : 'opacity-50 cursor-not-allowed'}`}
        >
          <Zap className="h-4 w-4" /> Hoziroq
        </button>
      </div>
    </div>
  );
}