import fs from 'fs';
import path from 'path';

// ============================================================
// PERSISTENT FALLBACK STORE (Offline/`MongoDB ulanmagan` rejim)
// ------------------------------------------------------------
// MongoDB mavjud bo'lmaganda butun backend shu xotirada ishlaydi
// va har bir o'zgarish darhol db.json fayliga YOZILADI. Shunday
// qilib admin panel'dagi barcha o'zgarishlar saqlanib qoladi va
// server qayta ishga tushsa ham yo'qolmaydi.
// ============================================================

const DB_FILE = path.resolve(process.cwd(), '..', 'db.json');

// Standart boshlang'ich ma'lumotlar (db.json'da bo'lmagan kolleksiyalar)
const DEFAULT_COUPONS = [
  { id: '1', code: 'WELCOME10', discount: 10, minSpend: 500000, active: true },
  { id: '2', code: 'SUMMER20', discount: 20, minSpend: 1000000, active: true },
  { id: '3', code: 'NEWYEAR30', discount: 30, minSpend: 2000000, active: true },
];

const DEFAULT_DELIVERY_ZONES = [
  { id: 'zone-1', name: "Toshkent shahri", price: 20000, days: '1-2 kun', freeFrom: 1000000 },
  { id: 'zone-2', name: "Toshkent viloyati", price: 25000, days: '2-3 kun', freeFrom: 1000000 },
  { id: 'zone-3', name: "Samarqand", price: 30000, days: '2-4 kun', freeFrom: 1500000 },
  { id: 'zone-4', name: "Buxoro", price: 35000, days: '3-5 kun', freeFrom: 1500000 },
  { id: 'zone-5', name: "Farg'ona vodiysi", price: 30000, days: '2-4 kun', freeFrom: 1500000 },
  { id: 'zone-6', name: "Qoraqalpog'iston", price: 40000, days: '4-6 kun', freeFrom: 2000000 },
  { id: 'zone-7', name: "Boshqa viloyatlar", price: 35000, days: '3-5 kun', freeFrom: 1500000 },
];

const DEFAULT_BLOG_POSTS = [
  {
    id: 1,
    title: "2026-yilda interyer dizaynida eng mashhur 10 ta yo'nalish",
    slug: "2026-yilda-interyer-dizaynida-eng-mashhur-10-ta-yonalish",
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
    slug: "pardalarni-togri-tanlash-olcham-mato-va-uslub-boyicha-qollanma",
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
    slug: "tassel-va-qadab-yuborilgan-bezaklar-uyingizga-qirollik-uslubi",
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
    slug: "yoruglik-va-rang-xonani-vizual-kengaytirish-sirlari",
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

const DEFAULT_ADMIN_USER = {
  id: 'USR-ADMIN',
  name: 'Bosh Administrator',
  email: process.env.ADMIN_EMAIL || 'admin@premium.com',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  role: 'admin',
  status: 'active',
  bonusPoints: 100,
  phone: '+998901234567',
  addresses: [],
  savedCards: [],
  joined: new Date().toISOString(),
};

let db = null;
let lastMtime = 0;
let lastSize = 0;

const findDbFile = () => {
  const candidates = [
    path.resolve(process.cwd(), '..', 'db.json'),
    path.resolve(process.cwd(), 'db.json'),
    path.resolve(process.cwd(), '../../db.json'),
  ];
  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
};

const readDbFile = () => {
  const filePath = findDbFile();
  if (!filePath) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error("fallbackStore o'qish xatosi:", e.message);
    return {};
  }
};

// db.json faylini (xotirada) yuklab, yetishmayotgan kolleksiyalarni standart qiymatlar bilan to'ldiradi.
// Fayl tashqaridan o'zgartirilgan bo'lsa (masalan, seed skript orqali) avtomatik qayta yuklanadi.
export const getDb = () => {
  const filePath = findDbFile();
  let stat = null;
  if (filePath) {
    try { stat = fs.statSync(filePath); } catch { /* ignore */ }
  }

  const fileChanged = stat && (stat.mtimeMs !== lastMtime || stat.size !== lastSize);

  if (!db || fileChanged) {
    const fileData = readDbFile();

    db = {
      products: Array.isArray(fileData.products) ? fileData.products : (db && db.products ? db.products : []),
      categories: Array.isArray(fileData.categories) ? fileData.categories : (db && db.categories ? db.categories : []),
      orders: Array.isArray(fileData.orders) ? fileData.orders : (db && db.orders ? db.orders : []),
      coupons: Array.isArray(fileData.coupons) && fileData.coupons.length > 0 ? fileData.coupons : DEFAULT_COUPONS,
      deliveryZones: Array.isArray(fileData.deliveryZones) && fileData.deliveryZones.length > 0 ? fileData.deliveryZones : DEFAULT_DELIVERY_ZONES,
      blogPosts: Array.isArray(fileData.blogPosts) && fileData.blogPosts.length > 0 ? fileData.blogPosts : DEFAULT_BLOG_POSTS,
      users: Array.isArray(fileData.users) && fileData.users.length > 0 ? fileData.users : [DEFAULT_ADMIN_USER],
      reviews: Array.isArray(fileData.reviews) ? fileData.reviews : (db && db.reviews ? db.reviews : []),
      activityLogs: Array.isArray(fileData.activityLogs) ? fileData.activityLogs : (db && db.activityLogs ? db.activityLogs : []),
    };

    lastMtime = stat ? stat.mtimeMs : 0;
    lastSize = stat ? stat.size : 0;
  }

  return db;
};

// Xotiradagi barcha o'zgarishlarni db.json fayliga yozadi
export const saveDb = () => {
  try {
    const data = getDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('fallbackStore yozish xatosi:', e.message);
  }
};

// Faoliyat logiga yozuv qo'shadi (fallback rejim)
export const addFallbackActivity = (action, user = 'Admin', type = 'general', icon = 'Activity') => {
  const dbData = getDb();
  dbData.activityLogs = dbData.activityLogs || [];
  dbData.activityLogs.unshift({
    id: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    action,
    user,
    type,
    icon,
    time: new Date().toISOString(),
  });
  if (dbData.activityLogs.length > 100) dbData.activityLogs = dbData.activityLogs.slice(0, 100);
  saveDb();
};

// Eskicha nomi bilan moslik (eski kontrollerlar uchun)
export const getFallbackData = () => getDb();