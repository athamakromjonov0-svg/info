import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import DeliveryZone from '../models/DeliveryZone.js';
import BlogPost from '../models/BlogPost.js';
import ActivityLog from '../models/ActivityLog.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbJsonPath = path.resolve(process.cwd(), '../db.json');
const rootDbJsonPath = fs.existsSync(dbJsonPath)
  ? dbJsonPath
  : path.resolve(process.cwd(), 'db.json');

const DEFAULT_DELIVERY_ZONES = [
  { legacyId: 'zone-1', name: "Toshkent shahri", price: 20000, days: '1-2 kun', freeFrom: 1000000 },
  { legacyId: 'zone-2', name: "Toshkent viloyati", price: 25000, days: '2-3 kun', freeFrom: 1000000 },
  { legacyId: 'zone-3', name: "Samarqand", price: 30000, days: '2-4 kun', freeFrom: 1500000 },
  { legacyId: 'zone-4', name: "Buxoro", price: 35000, days: '3-5 kun', freeFrom: 1500000 },
  { legacyId: 'zone-5', name: "Farg'ona vodiysi", price: 30000, days: '2-4 kun', freeFrom: 1500000 },
  { legacyId: 'zone-6', name: "Qoraqalpog'iston", price: 40000, days: '4-6 kun', freeFrom: 2000000 },
  { legacyId: 'zone-7', name: "Boshqa viloyatlar", price: 35000, days: '3-5 kun', freeFrom: 1500000 },
];

const DEFAULT_COUPONS = [
  { code: 'WELCOME10', discount: 10, minSpend: 500000, active: true },
  { code: 'SUMMER20', discount: 20, minSpend: 1000000, active: true },
  { code: 'NEWYEAR30', discount: 30, minSpend: 2000000, active: true },
];

const DEFAULT_BLOGS = [
  {
    legacyId: 1,
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
      "Interyer dizayni har yili yangi yo'nalishlar bilan boyiydi va 2026-yil ham bundan mustasno emas.",
      "Scandinavian uslubi — soddalik, yorug'lik va funksionallikni afzal ko'radiganlar uchun.",
      "Japandi — yapon va skandinav uslublarining uyg'unligi. Tabiiy to'qimalar va tinch muhit.",
    ],
  },
  {
    legacyId: 2,
    title: "Pardalarni to'g'ri tanlash: o'lcham, mato va uslub bo'yicha qo'llanma",
    slug: "pardalarni-togri-tanlash-olcham-mato-va-uslub-boyicha-qollanma",
    excerpt: "Xonangiz kattaligiga qarab qaysi parda matosi va o'lchami mos kelishini aniqlash algoritmi.",
    category: "Maslahatlar",
    date: "2026-08-03",
    readTime: 8,
    image: "/banner/banner2.png",
    author: "Dizaynerlar jamoasi",
    views: 956,
    likes: 71,
    content: [
      "Parda tanlash — interyerda eng muhim qadamlardan biri.",
      "O'lcham: parda karnizdan polgacha bo'lgan masofani o'lchab, 4-6 sm zaxira qo'shing.",
    ],
  },
  {
    legacyId: 3,
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
      "Tassel — bu pardalarni bog'lab qo'yish uchun ishlatiladigan dekorativ bezak bo'lib, u interyerga nafislik bag'ishlaydi.",
    ],
  },
];

async function seedDatabase() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/premium_ecommerce';

  try {
    console.log(`\x1b[34m🔄 MongoDB'ga ulanmoqda: ${mongoURI}...\x1b[0m`);
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log(`\x1b[32m✔ MongoDB ulandi!\x1b[0m`);

    // Eski ma'lumotlarni tozalash
    console.log(`\x1b[33m🧹 Eski ma'lumotlar tozalanmoqda...\x1b[0m`);
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});
    await DeliveryZone.deleteMany({});
    await BlogPost.deleteMany({});
    await ActivityLog.deleteMany({});

    // db.json faylidan o'qish
    let dbData = { products: [], categories: [] };
    if (fs.existsSync(rootDbJsonPath)) {
      console.log(`\x1b[34m📂 db.json fayli topildi: ${rootDbJsonPath}\x1b[0m`);
      const fileContent = fs.readFileSync(rootDbJsonPath, 'utf8');
      dbData = JSON.parse(fileContent);
    } else {
      console.warn(`\x1b[33m⚠ db.json topilmadi, bo'sh ma'lumotlar bilan davom etilmoqda\x1b[0m`);
    }

    // 1. Kategoriyalarni import qilish
    const categoriesToInsert = (dbData.categories || []).map((cat) => ({
      legacyId: String(cat.id),
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: cat.icon || '',
      image: cat.image || '',
      description: cat.description || '',
    }));
    const createdCategories = await Category.insertMany(categoriesToInsert);
    console.log(`\x1b[32m✔ ${createdCategories.length} ta kategoriya MongoDB'ga yuklandi\x1b[0m`);

    // 2. Mahsulotlarni import qilish
    const productsToInsert = (dbData.products || []).map((p) => ({
      legacyId: String(p.id),
      title: p.title,
      description: p.description || '',
      price: Number(p.price) || 0,
      category: p.category || 'Boshqa',
      image: p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      images: p.images || [],
      discount: Number(p.discount) || 0,
      stock: Number(p.stock) || 0,
      isNew: Boolean(p.isNew),
      rating: Number(p.rating) || 5.0,
      reviewsCount: Number(p.reviewsCount) || 0,
      specs: Array.isArray(p.specs) ? p.specs : [],
      featured: Boolean(p.featured),
    }));
    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`\x1b[32m✔ ${createdProducts.length} ta mahsulot MongoDB'ga yuklandi\x1b[0m`);

    // 3. Admin foydalanuvchi yaratish
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@premium.com').toLowerCase();
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Bosh Administrator',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        phone: '+998901234567',
        status: 'active',
      });
      console.log(`\x1b[32m✔ Bosh Admin foydalanuvchi yaratildi (${adminEmail} / admin123)\x1b[0m`);
    }

    // 4. Kuponlar
    await Coupon.insertMany(DEFAULT_COUPONS);
    console.log(`\x1b[32m✔ ${DEFAULT_COUPONS.length} ta kupon yuklandi\x1b[0m`);

    // 5. Yetkazib berish hududlari
    await DeliveryZone.insertMany(DEFAULT_DELIVERY_ZONES);
    console.log(`\x1b[32m✔ ${DEFAULT_DELIVERY_ZONES.length} ta yetkazib berish hududi yuklandi\x1b[0m`);

    // 6. Blog postlar
    await BlogPost.insertMany(DEFAULT_BLOGS);
    console.log(`\x1b[32m✔ ${DEFAULT_BLOGS.length} ta blog maqolasi yuklandi\x1b[0m`);

    // 7. Dastlabki log
    await ActivityLog.create({
      action: "Tizim ma'lumotlar bazasi (MongoDB) muvaffaqiyatli to'ldirildi",
      user: 'Bosh Administrator',
      type: 'general',
      icon: 'Database',
      time: 'Hozir',
    });

    console.log(`\x1b[35m====================================================\x1b[0m`);
    console.log(`\x1b[32m🎉 BARCHA MA'LUMOTLAR MUVAFFAQIYATLI BACKENDGA KO'CHIRILDI!\x1b[0m`);
    console.log(`\x1b[35m====================================================\x1b[0m`);
    process.exit(0);
  } catch (error) {
    console.error(`\x1b[31m❌ Seed qilishda xatolik yuz berdi:\x1b[0m`, error.message);
    process.exit(1);
  }
}

seedDatabase();
