import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const BLOG_KEY = 'vortex_blog_posts';

const DEFAULT_POSTS = [
  {
    id: 1,
    title: "2026-yilda interyer dizaynida eng mashhur 10 ta yo'nalish",
    excerpt: "Scandinavian minimalism, Japandi uslubi va eco-dekor — bu yil qaysi yo'nalishlar tendensiyada ekanini bilib oling.",
    category: "Interyer",
    date: "2026-08-10",
    readTime: 6,
    image: "/banner/banner1.png",
    author: "Grand Decor Studio",
    views: 1284,
    likes: 96,
    content: [
      "Interyer dizayni har yili yangi yo'nalishlar bilan boyiydi va 2026-yil ham bundan mustasno emas. Bu yil tabiiy materiallar, issiq ranglar va funksionallik birinchi o'rinda turibdi.",
      "Scandinavian uslubi — soddalik, yorug'lik va funksionallikni afzal ko'radiganlar uchun. Oq devorlar, och yog'och mebellar va minimal dekor bu yo'nalishning asosiy belgilaridir.",
      "Japandi — yapon va skandinav uslublarining uyg'unligi. Tabiiy to'qimalar, neytral palitra va tinch muhit. Bu uslub uyingizda osoyishtalik yaratishga yordam beradi.",
      "Eco-dekor — qayta ishlangan materiallar, jonli o'simliklar va organik matolar. Ekologik toza yondashuv nafaqat moda, balki mas'uliyatli tanlov hamdir.",
      "Pardalar va to'qimachilikda esa boy teksturalar, tassellar va qadab yuborilgan bezaklar yana modaga qaytmoqda. Oddiy pardaga bir nechta dekorativ tassel qo'shish xonaning ko'rinishini butunlay o'zgartiradi.",
    ],
  },
  {
    id: 2,
    title: "Pardalarni to'g'ri tanlash: o'lcham, mato va uslub bo'yicha qo'llanma",
    excerpt: "Xonangiz kattaligiga qarab qaysi parda matosi va o'lchami mos kelishini aniqlashning soddalashtirilgan algoritmi.",
    category: "Maslahatlar",
    date: "2026-08-03",
    readTime: 8,
    image: "/banner/banner2.png",
    author: "Dizaynerlar jamoasi",
    views: 956,
    likes: 71,
    content: [
      "Parda tanlash — interyerda eng muhim qadamlardan biri. Noto'g'ri tanlangan parda hatto eng chiroyli xonani ham buzishi mumkin.",
      "Birinchidan, o'lcham. Parda karnizdan polgacha bo'lgan masofani o'lchab, 4-6 sm zaxira qo'shing. Kengligi esa karniz kengligidan 1.5-2 barobar ortiq bo'lishi kerak.",
      "Ikkinchidan, mato. Yengil shifon va organza yorug xonalar uchun, qalin baxmal va velvet esa yotoqxona va yashash xonalar uchun ideal. Zamonaviy aralash matolar ham chidamli, ham chiroyli.",
      "Uchinchidan, uslub. Klassik interyer uchun boy teksturali pardalar va tassellar mos keladi. Minimalizm uchun esa oddiy, tekis matolar.",
      "Va nihoyat, aksessuarlar: qadab yuborilgan bezaklar, tassel bog'ichlar va dekorativ trimalar pardaga yakuniy ko'rinish beradi.",
    ],
  },
  {
    id: 3,
    title: "Tassel va qadab yuborilgan bezaklar: uyingizga qirollik uslubi",
    excerpt: "Kurtain tassels va dekorativ trimlar yordamida oddiy interyerni qanday hashamatli qilish mumkin?",
    category: "Dekor",
    date: "2026-07-25",
    readTime: 5,
    image: "/banner/banner3.png",
    author: "Grand Decor Studio",
    views: 743,
    likes: 58,
    content: [
      "Tassel — bu pardalarni bog'lab qo'yish uchun ishlatiladigan dekorativ bezak bo'lib, u interyerga alohida nafislik bag'ishlaydi.",
      "Ular turli rang va o'lchamlarda bo'ladi: oltin, kumush, krem, lavanta va chang pushti. Xonaning rang palitrasiga mos tassel tanlash muhim.",
      "Qadab yuborilgan trimlar (gimp) esa parda chetlariga, yostiqlarga va mebel qoplamalariga tikiladigan bezak tasmalaridir. Ular geometrik naqshlari bilan zamonaviy ko'rinish beradi.",
      "Qirollik uslubini yaratish uchun: qalin baxmal parda + oltin tassel bog'ich + naqshli trim. Bu kombinatsiya har qanday xonani darhol o'zgartiradi.",
      "Kichik o'zgarishlar katta natija beradi — shuning uchun dekor bilan tajriba qilishdan qo'rqmang.",
    ],
  },
  {
    id: 4,
    title: "Yorug'lik va rang: xonani vizual kengaytirish sirlari",
    excerpt: "Kichik xonalarni yorug'lik va rang o'yini bilan qanday kengroq ko'rsatish mumkinligi haqida 7 ta amaliy maslahat.",
    category: "Maslahatlar",
    date: "2026-07-18",
    readTime: 7,
    image: "/banner/banner1.png",
    author: "Dizaynerlar jamoasi",
    views: 612,
    likes: 44,
    content: [
      "Kichik xonalar — bu cheklov emas, balki ijod uchun maydon. To'g'ri yondashuv bilan har qanday xonani vizual kengaytirish mumkin.",
      "1. Oq va och ranglar. Devor va shiftlarda och ranglar xonani kengroq ko'rsatadi. Yaltiroq, aks etuvchi yuzalar yorug'likni tarqatadi.",
      "2. Ko'zgular. Katta ko'zgu deraza ro'parasiga qo'yilsa, xona ikki barobar kengaygandek ko'rinadi.",
      "3. Yorug'lik qatlamlari. Bitta markaziy chiroq o'rniga bir nechta manba ishlating: stol lampalari, lenta yoritgichlar.",
      "4. Vertikal chiziqlar. Baland pardalar va vertikal naqshlar shiftni balandroq ko'rsatadi.",
      "5. Kamroq mebel. Faqat kerakli narsalarni qoldiring va ko'p funksiyali mebellarni tanlang.",
    ],
  },
];

const useBlog = () => {
  const [blogPosts, setBlogPosts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(BLOG_KEY));
      return Array.isArray(stored) && stored.length > 0 ? stored : DEFAULT_POSTS;
    } catch {
      return DEFAULT_POSTS;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(BLOG_KEY, JSON.stringify(blogPosts)); } catch { /* ignore */ }
  }, [blogPosts]);

  // Backend bilan sinxronizatsiya
  const serverAvailable = useRef(false);

  const fetchBackendBlog = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE}/api/blog`, { timeout: 3000 });
      if (Array.isArray(res.data) && res.data.length > 0) {
        setBlogPosts(res.data);
        serverAvailable.current = true;
      }
    } catch {
      // offline fallback
    }
  }, []);

  // REAL VAQT: blog postlarini davriy yangilab turamiz
  // PERFORMANCE: sahifa ko'rinmas bo'lsa polling to'xtatiladi
  useEffect(() => {
    const t = setTimeout(fetchBackendBlog, 0);
    const interval = setInterval(() => {
      if (navigator.onLine && serverAvailable.current && document.visibilityState === 'visible') fetchBackendBlog();
    }, 15000);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, [fetchBackendBlog]);

  // REAL VAQT: boshqa oynalardagi blog o'zgarishlarini darhol qabul qilish
  useEffect(() => {
    const syncFromStorage = (e) => {
      if (e.key !== BLOG_KEY) return;
      if (e.newValue === null) { setBlogPosts([]); return; }
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) setBlogPosts(parsed);
      } catch { /* ignore */ }
    };
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  const addBlogPost = useCallback((postData) => {
    const newPost = {
      id: Date.now(),
      views: 0,
      likes: 0,
      ...postData,
      content: Array.isArray(postData.content) ? postData.content : String(postData.content || '').split('\n').filter(Boolean),
    };
    setBlogPosts(prev => [newPost, ...prev]);
    axios.post(`${BASE}/api/blog`, newPost).catch(() => {});
    return newPost;
  }, []);

  const updateBlogPost = useCallback((id, postData) => {
    setBlogPosts(prev => prev.map(p => String(p.id) === String(id) ? { ...p, ...postData } : p));
    axios.put(`${BASE}/api/blog/${id}`, postData).catch(() => {});
    return true;
  }, []);

  const deleteBlogPost = useCallback((id) => {
    setBlogPosts(prev => prev.filter(p => String(p.id) !== String(id)));
    axios.delete(`${BASE}/api/blog/${id}`).catch(() => {});
    return true;
  }, []);

  const incrementBlogViews = useCallback((id) => {
    setBlogPosts(prev => prev.map(p => String(p.id) === String(id) ? { ...p, views: (Number(p.views) || 0) + 1 } : p));
  }, []);

  const toggleBlogLike = useCallback((id) => {
    setBlogPosts(prev => prev.map(p => String(p.id) === String(id) ? { ...p, likes: (Number(p.likes) || 0) + 1 } : p));
    axios.post(`${BASE}/api/blog/${id}/like`).catch(() => {});
  }, []);

  return {
    blogPosts,
    addBlogPost, updateBlogPost, deleteBlogPost,
    incrementBlogViews, toggleBlogLike,
  };
};

export default useBlog;
