# Premium E-Commerce — Real Backend (MongoDB & Node.js/Express)

Ushbu backend to'liq professional darajada ishlab chiqilgan bo'lib, loyihangizning barcha ma'lumotlarini (324 ta mahsulot, 24 ta kategoriya, buyurtmalar, foydalanuvchilar, kuponlar, bloglar, sharhlar va statistikalarni) haqiqiy ma'lumotlar bazasida boshqaradi.

---

## 🛠 Texnologiyalar to'plami (Tech Stack)

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS
- **Fayl yuklash**: Multer (rasmlar va bannerlar uchun)
- **Xavfsizlik**: CORS, Error Middleware, Role-based Access Control (Admin / Moderator / User)
- **Logger**: Morgan

---

## 📂 Backend Strukturasi

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB ulanishi va holat nazorati
│   ├── models/
│   │   ├── Product.js            # Mahsulotlar modeli (izlash indekslari bilan)
│   │   ├── Category.js           # Kategoriyalar modeli
│   │   ├── User.js               # Foydalanuvchilar va parollar modeli (bcrypt)
│   │   ├── Order.js              # Buyurtmalar modeli (avtomatik qoldiq kamaytirish)
│   │   ├── Coupon.js             # Chegirma kuponlari
│   │   ├── DeliveryZone.js       # Yetkazib berish zonalari
│   │   ├── BlogPost.js           # Blog maqolalari
│   │   ├── Review.js             # Mahsulot sharhlari va reyting
│   │   └── ActivityLog.js        # Admin faoliyatlar tarixi
│   ├── controllers/
│   │   ├── authController.js     # Ro'yxatdan o'tish, kirish, rollar
│   │   ├── productController.js  # Mahsulotlar CRUD, qidiruv, filtr
│   │   ├── categoryController.js # Kategoriyalar CRUD
│   │   ├── orderController.js    # Buyurtmalar, statuslar
│   │   ├── couponController.js   # Kuponlarni tekshirish va boshqarish
│   │   ├── deliveryZoneController.js # Yetkazib berish hududlari
│   │   ├── blogController.js     # Blog maqolalari va layklar
│   │   ├── reviewController.js   # Sharhlar va avtomatik reyting
│   │   ├── statsController.js    # Dashboard tahliliy statistikasi
│   │   └── uploadController.js   # Rasmlarni yuklash
│   ├── routes/                   # Barcha Express API yo'nalishlari
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT va Admin himoyasi
│   │   └── errorMiddleware.js    # 404 va xatoliklar ushlagichi
│   ├── scripts/
│   │   └── seed.js               # db.json'dagi barcha ma'lumotlarni MongoDB'ga yuklovchi skript
│   ├── utils/
│   │   └── fallbackStore.js      # Oflayn/Zaxira xotira yordamchisi
│   └── server.js                 # Asosiy Express server fayli
├── uploads/                      # Yuklangan media fayllar
├── .env                          # Maxfiy konfiguratsiyalar
└── package.json
```

---

## 🚀 Ishga tushirish yo'riqnomasi

### 1. Backend serverni ishga tushirish:
Loyiha asosiy papkasida quyidagi buyruqni bering:
```bash
npm run server
```
Yoki nodemon bilan avtomatik qayta yuklanadigan rejimda:
```bash
npm run server:dev
```
Server `http://localhost:5000` manzilida ishga tushadi.

---

### 2. Barcha ma'lumotlarni MongoDB'ga ko'chirish (Database Seeding):
MongoDB'ga 324 ta mahsulot, 24 ta kategoriya, bosh admin akkaunti va kuponlarni bir zumda to'ldirish uchun:
```bash
npm run seed
```

---

### 3. MongoDB Atlas (Bulutli Baza) ulash:
Agar sizda MongoDB kompyuteringizda o'rnatilmagan bo'lsa, mutlaqo bepul MongoDB Atlas bulut bazasini 2 daqiqada ulashingiz mumkin:
1. [mongodb.com/atlas](https://www.mongodb.com/atlas) saytiga kiring va bepul klaster (FREE M0) yarating.
2. **Database Access** bo'limida yangi foydalanuvchi yarating (masalan: `admin` va parol `parol123`).
3. **Network Access** bo'limida `0.0.0.0/0` (Allow Access from Anywhere) qilib qo'ying.
4. **Connect** tugmasini bosing -> **Drivers** (Node.js) ni tanlang va ulanish kodini nusxalang.
5. Loyihadagi `backend/.env` faylini oching va `MONGO_URI` qatoriga joylang:
```env
MONGO_URI=mongodb+srv://admin:parol123@cluster0.mongodb.net/premium_ecommerce?retryWrites=true&w=majority
```
Shundan so'ng `npm run seed` buyrug'ini bering — barcha 324 ta mahsulot bir zumda bulut bazaga joylashadi!

---

## 📡 API Marshrutlari (Endpoints)

| Metod | Marshrut | Tavsif |
|---|---|---|
| `GET` | `/api/health` | Server va baza holatini tekshirish |
| `GET` | `/api/products` | Mahsulotlar ro'yxati (qidiruv: `?search=...`, kategoriya: `?category=...`, saralash: `?sort=...`) |
| `GET` | `/api/products/:id` | Bitta mahsulot tafsilotlari |
| `POST` | `/api/products` | Yangi mahsulot qo'shish (Admin) |
| `PUT` | `/api/products/:id` | Mahsulotni yangilash (Admin) |
| `DELETE` | `/api/products/:id` | Mahsulotni o'chirish (Admin) |
| `GET` | `/api/categories` | Barcha kategoriyalar |
| `POST` | `/api/categories` | Yangi kategoriya yaratish (Admin) |
| `POST` | `/api/orders` | Yangi buyurtma berish (Stock avtomatik kamayadi) |
| `GET` | `/api/orders` | Barcha buyurtmalar (Admin) |
| `GET` | `/api/orders/my` | Foydalanuvchining buyurtmalari (JWT) |
| `PATCH` | `/api/orders/:id/status` | Buyurtma statusini o'zgartirish |
| `POST` | `/api/auth/register` | Yangi foydalanuvchi ro'yxatdan o'tishi |
| `POST` | `/api/auth/login` | Tizimga kirish (JWT token qaytaradi) |
| `GET` | `/api/auth/me` | Joriy profil ma'lumotlari |
| `GET` | `/api/auth/users` | Barcha foydalanuvchilar (Admin) |
| `POST` | `/api/coupons/validate` | Kupon kodini va minimal xaridni tekshirish |
| `GET` | `/api/delivery-zones` | Yetkazib berish hududlari va narxlari |
| `GET` | `/api/blog` | Blog maqolalari |
| `POST` | `/api/blog/:id/like` | Maqolaga layk bosish |
| `POST` | `/api/reviews` | Sharh qoldirish va reyting yangilash |
| `GET` | `/api/stats/dashboard` | Admin dashboard umumiy statistikasi |
| `POST` | `/api/upload` | Rasm fayli yuklash (Multer) |
