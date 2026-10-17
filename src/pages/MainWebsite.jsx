import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import FlashSale from '../components/FlashSale';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Sparkles, 
  Crown, 
  Gem, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Palette, 
  SlidersHorizontal, 
  Filter, 
  Percent, 
  Send, 
  MessageSquare, 
  PhoneCall, 
  Compass, 
  Award,
  Layers,
  Heart
} from 'lucide-react';

export default function MainWebsite() {
  const { products, categories, blogPosts, showToast, loading } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Filtrlangan va saralangan mahsulotlar
  const filteredProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];

    // Kategoriya filtri
    if (selectedCategory !== 'all') {
      list = list.filter((p) => {
        const catName = typeof p.category === 'object' ? p.category.name : p.category;
        return (catName || '').toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    // Qidiruv
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const title = (p.title || p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const cat = (typeof p.category === 'object' ? p.category.name : p.category || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || cat.includes(q);
      });
    }

    // Faqat chegirmadagilar
    if (onlyDiscount) {
      list = list.filter((p) => Number(p.discount) > 0);
    }

    // Saralash
    if (sortBy === 'price_asc') {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      // popular
      list.sort((a, b) => (Number(b.reviewsCount) || 0) - (Number(a.reviewsCount) || 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, onlyDiscount, sortBy]);

  // Kategoriyalar ro'yxati (katalog uchun)
  const categoryList = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) return categories;
    return [
      { id: '1', name: 'Hashamatli Tassellar', slug: 'tassellar' },
      { id: '2', name: 'Magnitli Tutqichlar', slug: 'magnitli-tutqichlar' },
      { id: '3', name: 'Karnizlar & Uchliklar', slug: 'karnizlar' },
      { id: '4', name: 'Zar Jiyaklar & Trimalar', slug: 'jiyaklar-trimlar' },
      { id: '5', name: 'Klassik Qisqichlar & Halqalar', slug: 'qisqichlar-halqalar' },
      { id: '6', name: 'Kristalli & Marvaridli Bezaklar', slug: 'kristalli-aksessuarlar' },
      { id: '7', name: 'Parda Lentalari & Ilgaklar', slug: 'lentalar-ilgaklar' },
      { id: '8', name: 'Aqlli Motorli Karnizlar', slug: 'aqlli-karnizlar' }
    ];
  }, [categories]);

  // Interyer Uslublari bo'yicha Tanlov Ma'lumotlari
  const interiorStyles = [
    {
      title: "Klassika & Barokko",
      desc: "Og'ir baxmal shokilalar, oltin ipak jiyaklar va quyma latun ilmoqlar bilan qirollik saroylari muhiti.",
      img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80",
      link: "/katalog?category=Hashamatli%20Tassellar",
      badge: "Klassik Tanlov"
    },
    {
      title: "Neoklassika & Elegans",
      desc: "Nozik marvarid donalari, billur kristalli karniz uchlari va ipak aralash saten bog'ichlar.",
      img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80",
      link: "/katalog?category=Kristalli%20&%20Marvaridli%20Bezaklar",
      badge: "Hashamatli"
    },
    {
      title: "Zamonaviy Minimalizm",
      desc: "Mat-qora geometrik magnitlar, yashirin shift profillari va chiziqli toza dizayn.",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
      link: "/katalog?category=Magnitli%20Tutqichlar",
      badge: "Trend 2026"
    },
    {
      title: "Aqlli Uy & High-Tech",
      desc: "Ovozsiz motorli karnizlar, Alice va Siri orqali pultsiz avtomatik pardalarni ochish tizimi.",
      img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80",
      link: "/katalog?category=Karnizlar%20%26%20Uchliklar",
      badge: "Smart Home"
    }
  ];

  // Mijozlar Fikrlari
  const testimonials = [
    {
      name: "Gulnora Karimova",
      city: "Toshkent sh.",
      role: "Interyer Dizayneri",
      text: "Grand Décor'dan mijozlarim uchun muntazam ravishda ipak shokilalar va kristalli karniz uchliklarini olaman. Sifati O'zbekistonda tengsiz, har bir detal qo'lda nafis ishlangan!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      name: "Bobur Mirzayev",
      city: "Samarqand sh.",
      role: "Xonadon Egasi",
      text: "Mehmonxonamiz uchun magnitli marvarid tutqichlar va motorli karniz buyurtma qildik. Devorni teshib o'tirmay osongina ulandi, Alisa orqali boshqarilishi esa butun oilamizga yoqdi.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      name: "Madina Usmonova",
      city: "Buxoro sh.",
      role: "Parda Saloni Rahbari",
      text: "Zar jiyaklar va Fransuz to'lqin lentalari juda pishiq. Yetkazib berish ham juda tez — Toshkentdan Buxoroga ertasi kuniyoq yetib keldi. Rahmat sizga!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. TOP DESIGNER ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-yellow-600/30 border-b border-amber-400/20 py-2 px-4 text-center">
        <p className="text-xs text-amber-200/90 font-medium flex items-center justify-center gap-2 flex-wrap">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 animate-pulse" />
          <span>500 000 so'mdan yuqori buyurtmalarga butun O'zbekiston bo'ylab yetkazish <strong>BEPUL!</strong></span>
          <span className="hidden sm:inline text-amber-400/40">•</span>
          <span className="hidden sm:inline text-amber-300">Pardangiz fotosuratini yuboring — bepul dizayner maslahatini oling</span>
        </p>
      </div>

      {/* 2. HERO BANNER */}
      <HeroBanner />

      {/* 3. FLASH SALE COUNTDOWN */}
      <FlashSale />

      {/* 3. VISUAL CATEGORIES SECTION */}
      <section className="py-12 sm:py-16 border-b border-slate-900/80 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
                <Crown className="h-4 w-4" />
                <span>Kolleksiyalar</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Parda Aksessuarlari Kategoriyalari
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Uyingizdagi har bir xona va pardaga mos keluvchi saralangan bezaklar
              </p>
            </div>

            <Link
              to="/katalog"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider group"
            >
              <span>Barcha kategoriyalar</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {categoryList.map((cat, idx) => (
              <button
                key={cat.id || idx}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative rounded-2xl border border-slate-900 bg-slate-900/40 p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/40 hover:bg-slate-900/80 hover:shadow-[0_15px_30px_-10px_rgba(255,193,7,0.15)] flex flex-col justify-between h-44 sm:h-52 overflow-hidden"
              >
                {/* Fon Rasmi (Subtle overlay) */}
                <div className="absolute inset-0 z-0 opacity-15 group-hover:opacity-30 transition-opacity duration-500">
                  <img
                    src={cat.image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80"}
                    alt={cat.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300 shadow-md">
                    <Gem className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                    {cat.name}
                  </h3>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] sm:text-xs text-amber-400/80 font-medium">
                    Kolleksiyani ko'rish
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-400 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 4. HAFTA TAVSIYASI — SPOTLIGHT SPECIAL */}
      <section className="py-12 sm:py-16 border-b border-slate-900/80 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="relative rounded-3xl border border-amber-400/30 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/15 px-3.5 py-1 text-xs font-bold text-amber-300 uppercase tracking-widest">
                  <Crown className="h-3.5 w-3.5 text-amber-400" />
                  <span>Hafta Tavsiyasi • Cheklangan Miqdor</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Imperator Oltin Ipak Tassel Shokila
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  Italiya ipak tolasidan mohir ustalar tomonidan 100% qo'lda to'qilgan saroy shokilasi. O'rtasidagi qirrali billur kristali yorug'likda serjilo nur taratadi.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-xs bg-slate-900 border border-slate-800 text-amber-200 px-3 py-1 rounded-xl">✓ 100% Ipak ip</span>
                  <span className="text-xs bg-slate-900 border border-slate-800 text-amber-200 px-3 py-1 rounded-xl">✓ Swarovski shisha billuri</span>
                  <span className="text-xs bg-slate-900 border border-slate-800 text-amber-200 px-3 py-1 rounded-xl">✓ Juft komplekt</span>
                </div>

                <div className="flex items-baseline gap-4 pt-2">
                  <span className="text-2xl sm:text-4xl font-black text-amber-300 font-sans">
                    345 000 so'm
                  </span>
                  <span className="text-base sm:text-lg line-through text-slate-500 font-sans">
                    460 000 so'm
                  </span>
                  <span className="text-xs font-bold bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg">
                    -25% TEJASH
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    to="/product/1"
                    className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 px-7 py-3 text-sm font-bold shadow-lg shadow-amber-400/25 hover:shadow-amber-400/40 hover:scale-[1.02] transition-all"
                  >
                    <span>Batafsil ko'rish</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/katalog?category=Hashamatli%20Tassellar"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-3 text-sm font-medium text-slate-300 hover:text-white hover:border-amber-400/40 transition-colors"
                  >
                    <span>Boshqa shokilalar</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80"
                    alt="Imperator Oltin Ipak Tassel"
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center p-3 rounded-xl bg-slate-950/90 border border-amber-400/30 backdrop-blur-md">
                    <span className="text-xs font-bold text-amber-300">Grand Décor Qirollik Seriyasi</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. INTERYER USLUBI BO'YICHA TANLASH (INTERIOR STYLE GUIDE) */}
      <section className="py-12 sm:py-16 border-b border-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              <Compass className="h-4 w-4" />
              <span>Dizayner Qo'llanmasi</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Interyer Uslubi Bo'yicha Tanlang
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Uyingiz qaysi uslubda bezatilgan? Pardalaringiz bilan 100% uyg'unlashuvchi to'g'ri aksessuarlarni toping
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {interiorStyles.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-900 bg-slate-950/80 overflow-hidden flex flex-col justify-between hover:border-amber-400/40 hover:shadow-[0_15px_30px_rgba(255,193,7,0.12)] transition-all duration-300"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-900">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 rounded-lg bg-slate-950/90 border border-amber-400/30 px-2.5 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-md uppercase tracking-wider">
                    {item.badge}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors pt-2 border-t border-slate-900"
                  >
                    <span>Uslubdagi modellarni ko'rish</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. ASOSIY MAHSULOTLAR KATALOGI (MAIN CATALOG) */}
      <section id="catalog-section" className="py-12 sm:py-16 border-b border-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Katalog Yuqori Boshqaruvi */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
                <Palette className="h-4 w-4" />
                <span>Vitrina</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Saralangan Parda Aksessuarlari
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Jami {filteredProducts.length} ta eksklyuziv mahsulot mavjud
              </p>
            </div>

            {/* Qidiruv & Saralash */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Qidiruv */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Katalogdan izlash..."
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50"
                />
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              </div>

              {/* Saralash */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400/50 cursor-pointer"
              >
                <option value="popular">Eng mashhur</option>
                <option value="price_asc">Narx: Arzonroq</option>
                <option value="price_desc">Narx: Qimmatroq</option>
                <option value="rating">Reyting bo'yicha</option>
                <option value="newest">Yangi kelganlar</option>
              </select>

              {/* Chegirma filtri */}
              <button
                onClick={() => setOnlyDiscount(!onlyDiscount)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  onlyDiscount
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Percent className="h-3.5 w-3.5" />
                <span>Chegirmalar</span>
              </button>
            </div>
          </div>

          {/* Kategoriya Kapsulalari (Tabs) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                  : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              Barcha Mahsulotlar ({products.length})
            </button>

            {categoryList.map((cat, idx) => (
              <button
                key={cat.id || idx}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                    : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Mahsulotlar Grid */}
          {loading && filteredProducts.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              <SkeletonCard count={8} />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-slate-900">
              <Sparkles className="h-10 w-10 text-amber-400/50 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Mahsulot topilmadi</h3>
              <p className="text-xs text-slate-500 mt-1">Boshqa parametr yoki so'z bilan qidirib ko'ring</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setOnlyDiscount(false); }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-amber-300 text-xs font-bold hover:bg-slate-700 transition-colors"
              >
                Filtrni tozalash
              </button>
            </div>
          )}

          {/* Ko'proq yuklash */}
          {visibleCount < filteredProducts.length && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount(prev => prev + 8)}
                className="px-8 py-3.5 rounded-xl border border-amber-400/30 bg-slate-900/80 text-amber-300 text-xs font-bold uppercase tracking-wider hover:bg-amber-400 hover:text-slate-950 transition-all duration-300 shadow-md"
              >
                Yana mahsulotlarni yuklash ({filteredProducts.length - visibleCount} ta qoldi)
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 7. MIJOZLAR RASMLARI VA LOOKBOOK */}
      <section className="py-12 sm:py-16 border-b border-slate-900/80 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
                <Heart className="h-4 w-4" />
                <span>#GrandDecorUylar</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Mijozlarimiz Uylaridagi Grand Décor
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Bizning aksessuarlarimiz bilan bezatilgan real xonadonlar va villalar
              </p>
            </div>

            <span className="text-xs text-slate-500 font-mono">15 000+ baxtli xonadon</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl overflow-hidden aspect-square border border-slate-900 relative group">
              <img
                src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600&auto=format&fit=crop&q=80"
                alt="Living Room Decor"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs font-semibold text-white">Toshkent, Tashkent City Villa</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-square border border-slate-900 relative group">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80"
                alt="Bedroom Curtains"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs font-semibold text-white">Samarqand, Grand Hotel Suite</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-square border border-slate-900 relative group">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80"
                alt="Modern Drapes"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs font-semibold text-white">Toshkent, Mirabad Avenue</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-square border border-slate-900 relative group">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80"
                alt="Classic Tassels"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs font-semibold text-white">Buxoro, Qasr Rezidensiya</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. SAMIMIY TAQRIZLAR (TESTIMONIALS) */}
      <section className="py-12 sm:py-16 border-b border-slate-900/80 bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              <Star className="h-4 w-4 fill-amber-400" />
              <span>Mijozlarimiz Bahosi</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Bizga Ishonganlar Fikri
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 flex flex-col justify-between space-y-4 hover:border-amber-400/30 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-900">
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover border border-amber-400/30" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[10px] text-amber-400/80">{t.role} • {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. VIP DIZAYNER KONSULTATSIYASI BLOKI (CTA) */}
      <section className="py-16 sm:py-20 relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border-t border-amber-400/20">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/20 px-4 py-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest">
            <Crown className="h-4 w-4 text-amber-400" />
            <span>VIP Dizayner Xizmati</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
            Pardangizga Qaysi Aksessuar Mos Kelishini Bilmayapsizmi?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light max-w-2xl mx-auto">
            Xonangiz yoki pardangiz fotosuratini bizga yuboring. Tajribali dizaynerlarimiz 15 daqiqa ichida interyeringizga eng mos keluvchi 3 xil eksklyuziv variantni taklif qilishadi!
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://t.me/akromjonov2011"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 px-8 py-4 text-sm font-bold shadow-xl shadow-amber-400/30 hover:shadow-amber-400/50 hover:scale-[1.02] transition-all"
            >
              <Send className="h-4 w-4" />
              <span>Telegram orqali fotosurat yuborish</span>
            </a>

            <a
              href="tel:+998712008800"
              className="inline-flex items-center gap-2.5 rounded-xl border border-amber-400/40 bg-slate-950/80 px-7 py-4 text-sm font-semibold text-white hover:bg-slate-900 transition-colors"
            >
              <PhoneCall className="h-4 w-4 text-amber-400" />
              <span>+998 (71) 200-88-00</span>
            </a>
          </div>

          <p className="text-[11px] text-slate-500 pt-2">
            Konsultatsiya mutlaqo BEPUL • Har kuni 09:00 dan 21:00 gacha
          </p>
        </div>
      </section>

    </div>
  );
}