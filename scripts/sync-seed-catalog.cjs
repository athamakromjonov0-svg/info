/**
 * Frontend seed faylini sinxronlash skripti
 * ----------------------------------------
 * db.json'dan FAQAT mahsulotlar va kategoriyalarni ajratib, frontend
 * zaxirasi sifatida `src/data/seed-catalog.json` fayliga yozadi.
 *
 * NIMA UCHUN: db.json ichida endi foydalanuvchilar (parollar bilan),
 * buyurtmalar, sharhlar va faoliyat loglari ham bor. Ularni frontend
 * bundle'iga qo'shish xavfsizlik xatosi (parollar sayt JS kodiga tushadi)
 * va ortiqcha og'irlik bo'lardi. Shuning uchun frontend faqat mahsulot
 * va kategoriyalarni oladi.
 *
 * Ishga tushirish:  node scripts/sync-seed-catalog.cjs
 */
const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, '..', 'db.json');
const OUT_FILE = path.resolve(__dirname, '..', 'src', 'data', 'seed-catalog.json');

if (!fs.existsSync(DB_FILE)) {
  console.error('❌ db.json topilmadi:', DB_FILE);
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

const seed = {
  products: Array.isArray(db.products) ? db.products : [],
  categories: Array.isArray(db.categories) ? db.categories : [],
};

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(seed, null, 2), 'utf8');

console.log('✔ src/data/seed-catalog.json yaratildi:');
console.log(`  Mahsulotlar: ${seed.products.length}`);
console.log(`  Kategoriyalar: ${seed.categories.length}`);
console.log('  (parollar/buyurtmalar/sharhlar frontend\'ga kirmaydi)');