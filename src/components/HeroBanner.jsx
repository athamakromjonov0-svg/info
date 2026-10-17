import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Star,
  Gem,
  CheckCircle2,
  Crown,
  Heart,
  Palette
} from 'lucide-react';

const AUTO_PLAY_INTERVAL = 6000;

const BANNER_SLIDES = [
  {
    id: 1,
    tag: "QIROLLIK KOLLEKSIYASI • 2026",
    tagIcon: Crown,
    title: "Eksklyuziv Tassellar",
    highlightTitle: "& Ipak Shokilalar",
    description: "Italiya ipak iplari, qirrali billur kristallar va 100% qo'l mehnati bilan tayyorlangan hashamatli shokilalar. Uyingizga saroy jozibasini bag'ishlang.",
    badgeText: "-25% CHEGIRMA",
    oldPrice: "460 000 so'm",
    newPrice: "345 000 so'm",
    rating: 4.9,
    reviewsCount: 142,
    categoryBadges: ['100% Qo\'l mehnati', 'Italiya ipak ipi', 'Swarovski billuri', 'Kafolatli'],
    imgUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=85",
    link: "/katalog?category=Hashamatli%20Tassellar",
    accentColor: "from-amber-400 to-yellow-600",
    glowColor: "rgba(255, 193, 7, 0.45)"
  },
  {
    id: 2,
    tag: "ZAMONAVIY QULAYLIK",
    tagIcon: Sparkles,
    title: "Magnitli & Marvarid",
    highlightTitle: "Parda Tutqichlari",
    description: "Devorni teshib o'tirmasdan, bir soniyada pardalaringizni mukammal to'lqinga yig'ib beruvchi kuchli neodim magnitli va marvaridli mahkamlagichlar.",
    badgeText: "ENG KO'P SOTILGAN",
    oldPrice: "190 000 so'm",
    newPrice: "145 000 so'm",
    rating: 5.0,
    reviewsCount: 289,
    categoryBadges: ['Devorni teshish shart emas', 'Neodim N52 magniti', 'Marvarid toshlar', 'Oson o\'rnatish'],
    imgUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=85",
    link: "/katalog?category=Magnitli%20Tutqichlar",
    accentColor: "from-amber-300 to-amber-500",
    glowColor: "rgba(254, 235, 175, 0.4)"
  },
  {
    id: 3,
    tag: "SMART HOME TEXNOLOGIYASI",
    tagIcon: Gem,
    title: "Aqlli Motorli Karnizlar",
    highlightTitle: "& Kristall Uchliklar",
    description: "Yandeks Alisa, Apple Home va pult orqali mutlaqo ovozsiz boshqariluvchi motorli karniz tizimlari va zanglamas po'latdan ishlangan nafis uchliklar.",
    badgeText: "YANGI TREND",
    oldPrice: "2 300 000 so'm",
    newPrice: "1 850 000 so'm",
    rating: 4.9,
    reviewsCount: 96,
    categoryBadges: ['Alisa / Siri mosligi', 'Ovozsiz (<25dB)', '3 yil kafolat', 'Bepul o\'lchash'],
    imgUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=85",
    link: "/katalog?category=Karnizlar%20%26%20Uchliklar",
    accentColor: "from-amber-400 to-yellow-500",
    glowColor: "rgba(255, 217, 102, 0.4)"
  },
  {
    id: 4,
    tag: "PREMIUM PARDA KOLLEKSIYASI",
    tagIcon: Palette,
    title: "Baxmal, Ipak va",
    highlightTitle: "Blackout Pardalar",
    description: "O'zbekistonda qo'lda tikilgan premium pardalar: zich baxmal, tabiiy ipak, yengil shifon va 100% qorong'ulik beruvchi blackout matolar.",
    badgeText: "YANGI KOLLEKSIYA",
    oldPrice: "1 150 000 so'm",
    newPrice: "990 000 so'm",
    rating: 4.9,
    reviewsCount: 120,
    categoryBadges: ['Qo\'lda tikilgan', '100% qorong\'ulik', 'O\'zbek matolari', '1 yil kafolat'],
    imgUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=85",
    link: "/katalog?category=Pardalar",
    accentColor: "from-amber-300 to-yellow-600",
    glowColor: "rgba(255, 193, 7, 0.4)"
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  const slide = BANNER_SLIDES[currentSlide];
  const TagIcon = slide.tagIcon;

  return (
    <section 
      className="relative w-full overflow-hidden bg-slate-950 py-4 sm:py-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Royal Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-amber-400/20 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 p-6 sm:p-10 lg:p-12 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Subtle Golden Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffd966_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* CHAP TOMON: Matnlar va Takliflar */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-5">
              
              {/* Yuqori Tag / Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md shadow-sm">
                <TagIcon className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span className="text-[11px] font-semibold tracking-widest text-amber-300 uppercase">
                  {slide.tag}
                </span>
              </div>

              {/* Sarlavha */}
              <div className="space-y-1">
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  {slide.title}
                </h1>
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent leading-tight">
                  {slide.highlightTitle}
                </h2>
              </div>

              {/* Tavsif */}
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl">
                {slide.description}
              </p>

              {/* Category Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {slide.categoryBadges.map((item, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-amber-100/90 shadow-sm"
                  >
                    <CheckCircle2 className="h-3 w-3 text-amber-400" />
                    {item}
                  </span>
                ))}
              </div>

              {/* Narx va Reyting Bloki */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-800/80 w-full">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Eksklyuziv Narx</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300 font-sans tracking-tight">
                      {slide.newPrice}
                    </span>
                    {slide.oldPrice && (
                      <span className="text-sm line-through text-slate-500 font-sans">
                        {slide.oldPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-800 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-300">
                    {slide.rating} ({slide.reviewsCount} baho)
                  </span>
                </div>
              </div>

              {/* Tugmalar (Action buttons) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={slide.link}
                  className="group relative inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-400/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Kolleksiyani ko'rish</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/katalog"
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-slate-900/60 px-6 py-3.5 text-sm font-medium text-slate-200 backdrop-blur-md transition-all duration-300 hover:bg-slate-800 hover:border-amber-400/60 hover:text-white"
                >
                  <Palette className="h-4 w-4 text-amber-400" />
                  <span>Barcha Mahsulotlar</span>
                </Link>
              </div>

            </div>

            {/* O'NG TOMON: Hashamatli Rasm va Interaktiv Karta */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Rasm atrofidagi Oltin Halqa va Soya */}
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-[0_20px_50px_rgba(255,193,7,0.2)] group">
                <img
                  src={slide.imgUrl}
                  alt={slide.title}
                  fetchpriority="high"
                  decoding="async"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Yorug'lik o'yini (shine sweep) */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="hero-shine absolute -inset-y-full w-1/3 rotate-12 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent" />
                </div>
                
                {/* Rasm ustidagi nozik gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                {/* Ustki Chegirma Badji */}
                <div className="absolute top-4 left-4 rounded-xl bg-slate-950/85 border border-amber-400/40 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
                  <span className="text-xs font-black tracking-wider text-amber-300 uppercase">
                    {slide.badgeText}
                  </span>
                </div>

                {/* Pastki Kichik Banner / Brand Stamp */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-slate-950/90 border border-amber-400/30 p-3.5 backdrop-blur-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                      <Crown className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Grand Décor Luxe</h4>
                      <p className="text-[10px] text-amber-200/80">O'zbekistonning #1 Parda Aksessuarlari Butigi</p>
                    </div>
                  </div>
                  <Gem className="h-4 w-4 text-amber-400 shrink-0" />
                </div>
              </div>

            </div>

          </div>

          {/* Slayder Navigatsiyasi (Pastki qator) */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800/80 relative z-10">
            {/* Nuqtalar (Dots) */}
            <div className="flex items-center gap-2">
              {BANNER_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    idx === currentSlide
                      ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50'
                      : 'w-2 bg-slate-800 hover:bg-slate-700'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* O'ng/Chap tugmalar */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="h-10 w-10 rounded-xl border border-slate-800 bg-slate-900/80 flex items-center justify-center text-slate-300 hover:text-white hover:border-amber-400/50 hover:bg-slate-800 transition-colors"
                aria-label="Oldingi slayd"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="h-10 w-10 rounded-xl border border-slate-800 bg-slate-900/80 flex items-center justify-center text-slate-300 hover:text-white hover:border-amber-400/50 hover:bg-slate-800 transition-colors"
                aria-label="Keyingi slayd"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>

        {/* 4 Ta Asosiy Afzallik Kartalari (Trust Bar) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="rounded-2xl border border-slate-900/80 bg-slate-950/60 p-4 backdrop-blur-xl flex items-center gap-3.5 hover:border-amber-400/30 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Eksklyuziv Dizayn</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">100% qo'l mehnati va nozik did</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-900/80 bg-slate-950/60 p-4 backdrop-blur-xl flex items-center gap-3.5 hover:border-amber-400/30 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Tezkor Yetkazish</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">Butun O'zbekiston bo'ylab 1-3 kun</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-900/80 bg-slate-950/60 p-4 backdrop-blur-xl flex items-center gap-3.5 hover:border-amber-400/30 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Dizayner Maslahati</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">Pardangizga mosini tanlab beramiz</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-900/80 bg-slate-950/60 p-4 backdrop-blur-xl flex items-center gap-3.5 hover:border-amber-400/30 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Sifat Kafolati</h4>
              <p className="text-[10px] sm:text-xs text-slate-400">2 yil rasmiy kafolat va almashtirish</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
