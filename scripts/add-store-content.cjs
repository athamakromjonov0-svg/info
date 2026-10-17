/**
 * Grand Decor — do'kon kontentini boyitish skripti
 * -------------------------------------------------
 * Qo'shadi (idempotent — ikkinchi marta ishga tushirilsa dublikat yaratmaydi):
 *  1. "Pardalar" kategoriyasi + 15 ta premium parda mahsuloti
 *  2. 5 ta yangi blog maqolasi
 *  3. Eng mashhur mahsulotlarga haqiqiy ko'rinishdagi mijoz sharhlari
 *  4. Kategoriyalarga alohida chiroyli rasmlar va ikonkalar
 */
const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, '..', 'db.json');

const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
let changed = false;

// ============ RASMLAR ============
const IMG = {
  velvet: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
  luxury: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
  modern: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
  minimal: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
  decor: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
  apartment: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
  living: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop&q=80',
  bedroom: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80',
  magnet: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&auto=format&fit=crop&q=80',
  interior: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&auto=format&fit=crop&q=80',
  lookbook: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600&auto=format&fit=crop&q=80',
};

// ============ 1. PARDALAR KATEGORIYASI + MAHSULOTLAR ============
const PARDALAR_CAT = {
  id: '8',
  name: 'Pardalar',
  slug: 'pardalar',
  icon: 'Blinds',
  image: IMG.velvet,
  description: 'Premium baxmal, ipak, shifon va blackout pardalar — Grand Decor kolleksiyasi',
};

const PARDALAR_PRODUCTS = [
  {
    title: "Oltin Baxmal Parda — Imperator",
    description: "100% zich baxmal matodan qo'lda tikilgan hashamatli parda. Oltin tusdagi mato xonaga iliqlik va ulug'vorlik bag'ishlaydi, quyosh nurini to'sib, xonada qulay muhit yaratadi.",
    price: 950000, discount: 15, stock: 12, isNew: true, rating: 4.9, reviewsCount: 34,
    image: IMG.velvet, specs: ['100% Baxmal', 'Oltin rang', '280 x 260 sm', "Qo'lda tikilgan", 'To\'liq quyoshdan himoya'],
  },
  {
    title: "Qirollik Qizil Velvet Parda",
    description: "Boy qizil velvet mato klassik va saroy uslubidagi interyerlar uchun ideal. Og'ir, yumshoq va hashamatli — har qanday mehmonxonaning markaziga aylanadi.",
    price: 890000, discount: 10, stock: 9, isNew: true, rating: 4.8, reviewsCount: 27,
    image: IMG.luxury, specs: ['Velvet', 'Qizil rang', '280 x 260 sm', 'Yumshoq tekstura', 'Og\'ir mato'],
  },
  {
    title: "Tabiiy Ipak Parda — Shoyi",
    description: "100% tabiiy ipakdan to'qilgan nafis parda. Yengil, silliq va yaltiroq mato xonaga hashamatli ko'rinish beradi. Interyerning eng nozik bezagi.",
    price: 1200000, discount: 0, stock: 6, isNew: false, rating: 5.0, reviewsCount: 19,
    image: IMG.decor, specs: ['100% Ipak', 'Tabiiy shoyi', '300 x 280 sm', 'Yaltiroq', 'Premium sifat'],
  },
  {
    title: "Yengil Shifon Parda — Fransuz Oynasi",
    description: "Yengil va havodar shifon mato yorug'likni xonaga yumshoq tarqatadi. Katta derazalar va fransuz oynalari uchun ideal tanlov.",
    price: 450000, discount: 20, stock: 18, isNew: true, rating: 4.7, reviewsCount: 45,
    image: IMG.apartment, specs: ['Shifon', 'Yengil mato', '280 x 260 sm', 'Yorug\'lik o\'tkazuvchi', 'Ikki panel'],
  },
  {
    title: "Organza Parda — Nafis Tül",
    description: "Nozik organza tül pardasi. Shaffof mato yorug'likni xonaga erkin o'tkazadi, xususiy hayotni esa himoya qiladi. Yotoqxona va yashash xonalar uchun.",
    price: 380000, discount: 0, stock: 22, isNew: false, rating: 4.6, reviewsCount: 51,
    image: IMG.bedroom, specs: ['Organza', 'Shaffof', '300 x 280 sm', 'Yumshoq', 'Oson yuviladi'],
  },
  {
    title: "Blackout Parda — To'liq Qorong'ulik",
    description: "Maxsus uch qatlamli mato quyosh nurini 100% to'sadi. Yotoqxona va media xonalar uchun ideal — xonada kun bo'yi to'liq qorong'ulik yaratadi.",
    price: 690000, discount: 12, stock: 14, isNew: true, rating: 4.9, reviewsCount: 63,
    image: IMG.living, specs: ['3 qatlam', '100% qorong\'ulik', '280 x 260 sm', 'Issiqlik izolyatsiyasi', 'Ovoz o\'tkazmaydi'],
  },
  {
    title: "Zig'ir (Linnen) Parda — Provans",
    description: "Tabiiy zig'ir matodan tikilgan parda. Rustik va Provans uslubidagi interyerlar uchun. Ekologik toza, nafas oladigan mato.",
    price: 520000, discount: 0, stock: 16, isNew: false, rating: 4.7, reviewsCount: 38,
    image: IMG.minimal, specs: ['100% Zig\'ir', 'Tabiiy mato', '280 x 260 sm', 'Ekologik', 'Rustik uslub'],
  },
  {
    title: "Makrame To'qilgan Parda — Boho",
    description: "Qo'lda to'qilgan makrame pardasi. Boho va etnik uslubdagi interyerlar uchun noyob yechim. Har bir parda ustalar tomonidan alohida to'qiladi.",
    price: 480000, discount: 5, stock: 10, isNew: true, rating: 4.8, reviewsCount: 29,
    image: IMG.modern, specs: ['Qo\'lda to\'qilgan', 'Makrame', '250 x 220 sm', 'Boho uslub', 'Noyob dizayn'],
  },
  {
    title: "Ikki Qavatli Parda Seti — Luxe",
    description: "Tül + asosiy matodan iborat to'liq parda seti. Bir komplektda xonangiz uchun hammasi tayyor — karnizga osish kifoya.",
    price: 1150000, discount: 15, stock: 7, isNew: true, rating: 4.9, reviewsCount: 24,
    image: IMG.luxury, specs: ['2 qavat', 'Tül + mato', '300 x 280 sm', 'To\'liq komplekt', 'Premium'],
  },
  {
    title: "Jaluzi Parda — Zamonaviy Ofis",
    description: "Zamonaviy jaluzi pardasi. Ofis va ish xonalari uchun amaliy yechim — yorug'likni xohlagan darajada boshqaring.",
    price: 350000, discount: 0, stock: 25, isNew: false, rating: 4.5, reviewsCount: 41,
    image: IMG.modern, specs: ['Jaluzi', 'Zamonaviy', '200 x 200 sm', 'Oson boshqaruv', 'Tozalash oson'],
  },
  {
    title: "Krem Shifon Parda — Yumshoq Yorug'lik",
    description: "Krem rangdagi shifon parda xonaga iliq va yumshoq yorug'lik olib kiradi. Neytral ranglar bilan uyg'unlashuvchi universal tanlov.",
    price: 420000, discount: 10, stock: 15, isNew: false, rating: 4.6, reviewsCount: 33,
    image: IMG.bedroom, specs: ['Shifon', 'Krem rang', '280 x 260 sm', 'Neytral', 'Universal'],
  },
  {
    title: "To'q Yashil Velvet Parda — Tabiat",
    description: "To'q yashil velvet mato tabiatdan ilhomlangan boy rang palitrasi. Zamonaviy va klassik interyerlar bilan ajoyib uyg'unlashadi.",
    price: 780000, discount: 0, stock: 11, isNew: false, rating: 4.8, reviewsCount: 22,
    image: IMG.velvet, specs: ['Velvet', 'Yashil rang', '280 x 260 sm', 'Zich mato', 'Hashamatli'],
  },
  {
    title: "Oq Tül Parda — Klassik Nafislik",
    description: "Klassik oq tül pardasi — har qanday interyerning mustahkam asosi. Yengil, shaffof va nafis, yashash xonalar uchun abadiy klassika.",
    price: 290000, discount: 0, stock: 30, isNew: false, rating: 4.5, reviewsCount: 58,
    image: IMG.apartment, specs: ['Tül', 'Oq rang', '300 x 280 sm', 'Klassik', 'Arzon va sifatli'],
  },
  {
    title: "Jip Qora Blackout — Kino Zali",
    description: "Jip qora blackout parda kino zal va media xonalar uchun mo'ljallangan. Yorug'lik va shovqinni maksimal darajada to'sadi.",
    price: 720000, discount: 8, stock: 8, isNew: true, rating: 4.8, reviewsCount: 17,
    image: IMG.living, specs: ['Qora', 'Blackout', '280 x 260 sm', 'Kino zal', '100% himoya'],
  },
  {
    title: "Oltin Naqshli Damask Parda — Saroy",
    description: "Oltin naqshli damask matodan tikilgan parda. Qasr va saroy uslubidagi interyerlar uchun hashamatli yechim — har bir detalda ulug'vorlik.",
    price: 990000, discount: 12, stock: 9, isNew: true, rating: 4.9, reviewsCount: 21,
    image: IMG.decor, specs: ['Damask', 'Oltin naqsh', '280 x 260 sm', 'Saroy uslub', 'Qo\'lda ishlov'],
  },
];

// ============ 2. BLOG MAQOLALARI ============
const NEW_BLOG_POSTS = [
  {
    id: 5,
    title: "Karnizni qanday o'rnatish kerak: bosqichma-bosqich qo'llanma",
    slug: "karnizni-qanday-ornatish-kerak-bosqichma-bosqich-qollanma",
    excerpt: "Karnizni mustahkam va to'g'ri o'rnatishning 6 ta asosiy bosqichi — o'lchashdan tortib pardani osishgacha.",
    category: "Maslahatlar", date: "2026-08-25", readTime: 7,
    image: "/banner/banner2.png", author: "Grand Decor Studio", views: 512, likes: 38,
    content: [
      "Karnizni o'rnatish — bu oddiy ko'ringan, ammo to'g'ri yondashuv talab qiladigan ish. Xatolik pardaning egilib osilishiga yoki karnizning devordan uzilib tushishiga sabab bo'lishi mumkin.",
      "1-bosqich: O'lchash. Karniz uzunligi deraza kengligidan kamida 30-40 sm ortiq bo'lishi kerak — bu pardaning yon tomonlarga chiroyli ochilishi uchun. Balandlikda esa shiftdan 10-15 sm pastga o'rnatish tavsiya etiladi.",
      "2-bosqich: Belgilash. Sath (uroven) yordamida karnizning ikki uchi va o'rtasini aniq belgilang. Noto'g'ri belgilangan karniz egri ko'rinadi.",
      "3-bosqich: O'rnatish. Devor materialiga qarab mos dübel va shurup tanlang. Beton devor uchun plastik dübel, gipsokarton uchun maxsus 'butterfly' dübeller kerak bo'ladi.",
      "4-bosqich: Pardani osish. Halqalarni karnizga ilib, pardani tekislang. Og'ir baxmal pardalar uchun ikki qavatli karniz yoki mustahkamlangan uchliklardan foydalaning.",
      "Agar karnizni mustaqil o'rnatishga vaqtingiz bo'lmasa, xizmat ko'rsatish markazimiz bepul o'lchash va o'rnatish xizmatini taklif qiladi — operatorlarga qo'ng'iroq qiling.",
    ],
  },
  {
    id: 6,
    title: "2026-yilda parda tendensiyalari: moda palitra va matolar",
    slug: "2026-yilda-parda-tendensiyalari-moda-palitra-va-matolar",
    excerpt: "Bu yil qaysi parda matolari, ranglar va aksessuarlar trendda? Dizaynerlarimiz eng so'nggi yo'nalishlarni baholadi.",
    category: "Interyer", date: "2026-08-20", readTime: 6,
    image: "/banner/banner1.png", author: "Dizaynerlar jamoasi", views: 689, likes: 52,
    content: [
      "2026-yilda interyer dizaynida tabiiylik va hashamat uyg'unligi davom etmoqda. Bu yilning asosiy tendensiyasi — yumshoq, tabiiy teksturalar va issiq ranglar palitrasi.",
      "Matolar: Zich baxmal va velvet yana yetakchilik qilmoqda. Ikkinchi o'rinda tabiiy zig'ir (linnen) va yengil shifon. Blackout pardalar esa amaliylikni qadrlovchilar orasida mashhur.",
      "Ranglar: Krem, bej, terrakota va to'q yashil — bu yilning eng trend ranglari. Oltin va bronza aksentlar hashamatli ko'rinish uchun qo'shimcha sifatida ishlatilmoqda.",
      "Aksessuarlar: Tassel shokilalar, kristall uchliklar va magnitli tutqichlar parda ko'rinishini to'ldiradi. Dizaynerlar bitta katta tassel bog'ichni o'rniga 2-3 ta mayda aksessuarni tavsiya qilmoqda.",
      "Aqlli uy integratsiyasi: Motorli karnizlar endi yangilik emas — ular Alisa va Google Home bilan bevosita sinxronlashadi. Pardalarni ovoz bilan boshqarish 2026-yilning standartiga aylandi.",
    ],
  },
  {
    id: 7,
    title: "Tassel shokilalarni qanday to'g'ri osish kerak",
    slug: "tassel-shokilalarni-qanday-togri-osish-kerak",
    excerpt: "Tassel bog'ichlar parda ko'rinishini butunlay o'zgartira oladi. Ularni to'g'ri joylashtirish sirlari bilan tanishing.",
    category: "Dekor", date: "2026-08-15", readTime: 4,
    image: "/banner/banner3.png", author: "Grand Decor Studio", views: 423, likes: 31,
    content: [
      "Tassel — pardani bog'lab qo'yish uchun ishlatiladigan dekorativ bezak bo'lib, u interyerga alohida nafislik bag'ishlaydi. To'g'ri osilgan tassel xonaning butun ko'rinishini o'zgartiradi.",
      "Balandligi: Tassel bog'ich odatda deraza o'rtasidan biroz pastroq (pol sathidan 120-140 sm) balandlikda o'rnatiladi. Bu vizual jihatdan eng qulay nuqta hisoblanadi.",
      "Simmetriya: Ikkita parda panelini bog'layotganda tassellarni simmetrik joylashtiring. Oyna markaziga nisbatan teng masofada bo'lishi muhim.",
      "Uyg'unlik: Tassel rangi parda va xona palitrasi bilan uyg'un bo'lishi kerak. Oltin tassellar baxmal va to'q rangli pardalar bilan, kumush esa sovuq tonlardagi matolar bilan ajoyib ko'rinadi.",
      "Kichik o'zgarishlar katta natija beradi — shuning uchun tassel bilan tajriba qilishdan qo'rqmang!",
    ],
  },
  {
    id: 8,
    title: "Yotoqxona uchun parda tanlash: qorong'ulik va qulaylik sirlari",
    slug: "yotoqxona-uchun-parda-tanlash-qorongulik-va-qulaylik-sirlari",
    excerpt: "Yaxshi uyqu — sog'liq garovi. Blackout pardalar va to'g'ri mato tanlash bo'yicha mutaxassis maslahatlari.",
    category: "Maslahatlar", date: "2026-08-08", readTime: 5,
    image: "/banner/banner2.png", author: "Dizaynerlar jamoasi", views: 355, likes: 27,
    content: [
      "Yotoqxona — uyingizning eng shaxsiy va muhim xonasi. To'g'ri tanlangan parda yaxshi uyqu, dam olish va xonada qulay muhit yaratishning kalitidir.",
      "Qorong'ulik: Blackout pardalar quyosh nurini 100% to'sadi. Kechki smenada ishlaydiganlar yoki yorug'likka sezgir uxlaydiganlar uchun bu eng yaxshi tanlov.",
      "Mato: Yotoqxona uchun zich, yumshoq matolar (velvet, baxmal) tavsiya etiladi. Ular shovqinni kamaytiradi va xonada issiq muhit yaratadi.",
      "Rang: Tinchlantiruvchi ranglar — och ko'k, kulrang, krem va lavanta — uyqu sifatini yaxshilaydi. Yorqin ranglar aksincha, organizmni qo'zg'atishi mumkin.",
      "Karniz va aksessuarlar: Yotoqxonada yashirin shift karnizi yoki ovozsiz motorli karniz tavsiya etiladi — ertalab pardalarni pultsiz ham ochish mumkin.",
    ],
  },
  {
    id: 9,
    title: "Bo'lib to'lash va bonus dasturi: qanday tejash mumkin",
    slug: "bolib-tolash-va-bonus-dasturi-qanday-tejash-mumkin",
    excerpt: "Grand Decor'da xarid qilishning eng tejabli yo'llari: kuponlar, bonus ballar va bo'lib to'lash imkoniyatlari.",
    category: "Yangiliklar", date: "2026-08-01", readTime: 4,
    image: "/banner/banner1.png", author: "Grand Decor Studio", views: 298, likes: 22,
    content: [
      "Grand Decor'da xarid qilish nafaqat sifat, balki tejash hamdir. Bu yil bizning mijozlarimiz uchun bir nechta qulay imkoniyatlar mavjud.",
      "Bonus ballar: Har 10 000 so'mlik xarid uchun 1 bonus ball olasiz. Ballar keyingi xaridlarda chegirma sifatida ishlatiladi, daraja oshgani sari ball tezroq to'planadi.",
      "Kuponlar: WELCOME10, SUMMER20 va NEWYEAR30 kuponlari bilan 10-30% gacha chegirma oling. Kupon kodini savatda qo'llash kifoya.",
      "Bo'lib to'lash: Qimmatbaho mahsulotlarni 3 oydan 12 oygacha bo'lib to'lang. 3 va 6 oylik muddatlarda ortiqcha to'lov umuman yo'q.",
      "Mavsumiy aksiyalar: Flash-sale aksiyalari har kuni yangilanadi — chegirmali mahsulotlarni 'Chegirmalar' sahifasida kuzatib boring!",
    ],
  },
];

// ============ 3. SHARHLAR ============
const SEED_REVIEWS = [
  // id: REV-SEED-n, productId, userName, rating, comment, date
  ['1', 'Gulnora Karimova', 5, "Imperator shokila haqiqatan ham saroy darajasida! Ipak iplari juda mayin, oltin rangi xonaga darrov ulug'vorlik baxsh etdi.", '2026-08-18'],
  ['1', 'Akmal Tursunov', 5, "Sifatga hayron qoldim. Qo'lda ishlanganini har bir detalidan sezilasiz. Mehmonxonamizga alohida ko'rkamlik berdi.", '2026-08-05'],
  ['1', 'Zulfiya Saidova', 4, "Juda chiroyli va sifatli. Yetkazib berish ham o'z vaqtida bo'ldi. Narxi biroz baland, lekin sifatiga arziydi.", '2026-07-27'],
  ['3', 'Dilnoza Rahimova', 5, "Kristallari yorug'likda juda go'zal yarqaydi! Pardalarim bilan ajoyib uyg'unlashdi.", '2026-08-12'],
  ['3', 'Jasurbek Ergashev', 5, "Sifatli kristal, tassel juda og'ir va hashamatli ko'rinadi. Tavsiya qilaman!", '2026-07-30'],
  ['5', 'Malika Yusupova', 4, "Etnik uslubni yaxshi ko'raman, bu tassel kutganimdan ham zo'r chiqdi. Ranglari jonli.", '2026-08-01'],
  ['6', 'Nodira Alimova', 5, "Marvaridlari tabiiy va juda nafis. Yangi uyimiz uchun maxsus buyurtma qildim, natijadan mamnunman.", '2026-08-20'],
  ['16', 'Bobur Mirzayev', 5, "Devorni teshib o'tirmasdan o'rnatildi, juda mustahkam ushlab turibdi. Minimalist uslubimizga bemalol mos keldi.", '2026-08-15'],
  ['16', 'Shahzod Komilov', 4, "Yaxshi mahsulot, magniti kuchli. Faqat o'rnatishda sirt toza bo'lishiga e'tibor bering.", '2026-07-22'],
  ['18', 'Feruza Nazarova', 5, "Oltin rangi hashamatli ko'rinadi, pardalarimni mukammal ushlab turadi. Eng yaxshi xaridlarimdan biri!", '2026-08-10'],
  ['20', "Sanjar Yo'ldoshev", 5, "Bluetooth orqali ulanish juda oson. Aqlli uy tizimimizga mukammal mos keldi.", '2026-08-08'],
  ['31', 'Aziza Ismoilova', 5, "Karniz sifatli, keramika qatlami haqiqatan ham chizilmaydi. O'rnatish ham oson bo'ldi.", '2026-08-14'],
  ['35', 'Umida Karimova', 5, "Kristall uchliklari yorug'likda juda go'zal. Pardalarimiz endi butunlay boshqacha ko'rinadi!", '2026-08-02'],
  ['46', 'Ravshan Xolmatov', 4, "Jiyak pishiq va chiroyli tikilgan. Pardalarim chetiga juda yarashdi.", '2026-07-28'],
  ['56', 'Madina Usmonova', 5, "Swarovski kristallari ajoyib yarqaydi! Saroy interyerimiz uchun eng zo'r tanlov bo'ldi.", '2026-08-19'],
  ['71', 'Otabek Nematov', 4, "Arzon va sifatli. Pardalarni chiroyli bog'lab turadi, ranglari o'chmagan.", '2026-08-06'],
  ['101', 'Gulnora Karimova', 5, "Parda matosi juda qalin va mayin, oltin rangi xonaga iliqlik baxsh etdi. Tikuvchiligi mukammal!", '2026-08-22'],
  ['101', 'Dilshod Abdurahmonov', 5, "O'lchamlari aniq, rangi fotosuratdagidek. Butun yashash xonasini bezatdi. Rahmat!", '2026-08-17'],
  ['105', "Nargiza To'xtayeva", 5, "To'liq qorong'ulik beradi! Farzandim yaxshi uxlaydigan bo'ldi. Matosi ham yoqimli.", '2026-08-13'],
  ['110', 'Sardor Umarov', 4, "Ofisimiz uchun oldik, zamonaviy va amaliy. O'rnatish qo'llanmasi tushunarli.", '2026-08-09'],
  ['102', 'Zebo Toshmatova', 5, "Qizil velvet parda mehmonxonamizga saroy ko'rinishini berdi. Matosi juda yumshoq va og'ir.", '2026-08-16'],
  ['103', 'Bekzod Aliyev', 5, "Tabiiy ipak parda — bu boshqa daraja. Yorug'likda yaltirashi ajoyib, uyimizning eng chiroyli qismi.", '2026-08-11'],
  ['104', 'Gulchehra Salimova', 4, "Shifon parda yengil va havodar, xonani yorug' qiladi. O'lchamlari to'g'ri keldi.", '2026-08-07'],
  ['106', 'Olimjon Xayrullayev', 5, "Blackout parda bilan uyqum butunlay yaxshilandi. Matosi ham juda yoqimli, tavsiya qilaman!", '2026-08-04'],
  ['108', 'Kamola Ergasheva', 5, "Makrame parda xonaga boho uslubini olib kirdi. Qo'l ishi sifatini har bir tugunida his qilasiz.", '2026-08-03'],
  ['115', "Rustam G'aniyev", 5, "Damask parda — haqiqiy san'at asari! Oltin naqshlari yorug'likda yarqaydi. Saroy darajasidagi sifat.", '2026-07-31'],
];

// ============ 4. KATEGORIYA RASMLARI ============
const CATEGORY_IMAGES = {
  'Hashamatli Tassellar': { image: IMG.decor, icon: 'Crown' },
  'Magnitli Tutqichlar': { image: IMG.magnet, icon: 'Magnet' },
  'Karnizlar & Uchliklar': { image: IMG.modern, icon: 'Columns' },
  'Zar Jiyaklar & Trimalar': { image: IMG.luxury, icon: 'Scissors' },
  'Klassik Qisqichlar & Halqalar': { image: IMG.interior, icon: 'Link' },
  'Kristalli & Marvaridli Bezaklar': { image: IMG.minimal, icon: 'Sparkles' },
  'Parda Lentalari & Ilgaklar': { image: IMG.lookbook, icon: 'Ribbon' },
};

// ============================================================
// QO'LLASH
// ============================================================

// 4. Kategoriya rasmlari/ikonkalari
db.categories = db.categories || [];
for (const cat of db.categories) {
  const style = CATEGORY_IMAGES[cat.name];
  if (style) {
    cat.image = style.image;
    cat.icon = style.icon;
    changed = true;
  }
}

// 1. Pardalar kategoriyasi + mahsulotlar
const hasPardalarCat = db.categories.some(c => c.name === 'Pardalar');
if (!hasPardalarCat) {
  db.categories.push(PARDALAR_CAT);
  changed = true;
}

const existingTitles = new Set((db.products || []).map(p => p.title));
let nextId = Math.max(0, ...(db.products || []).map(p => Number(p.id) || 0)) + 1;
let addedProducts = 0;
for (const p of PARDALAR_PRODUCTS) {
  if (existingTitles.has(p.title)) continue;
  db.products.push({
    id: String(nextId++),
    title: p.title,
    description: p.description,
    price: p.price,
    category: 'Pardalar',
    image: p.image,
    images: [],
    discount: p.discount,
    stock: p.stock,
    isNew: p.isNew,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    specs: p.specs,
    featured: p.featured !== undefined ? p.featured : p.isNew,
  });
  addedProducts++;
  changed = true;
}

// 2. Blog maqolalari
db.blogPosts = db.blogPosts || [];
const existingBlogTitles = new Set(db.blogPosts.map(b => b.title));
let addedBlogs = 0;
for (const post of NEW_BLOG_POSTS) {
  if (existingBlogTitles.has(post.title)) continue;
  db.blogPosts.push({ ...post });
  addedBlogs++;
  changed = true;
}

// 3. Sharhlar
db.reviews = db.reviews || [];
const existingReviewKeys = new Set(db.reviews.map(r => `${r.productId}|${r.userName}|${r.comment}`));
let addedReviews = 0;
SEED_REVIEWS.forEach(([productId, userName, rating, comment, date], i) => {
  const key = `${productId}|${userName}|${comment}`;
  if (existingReviewKeys.has(key)) return;
  db.reviews.push({
    id: `REV-SEED-${i + 1}`,
    productId,
    userId: null,
    userName,
    rating,
    comment,
    createdAt: new Date(date).toISOString(),
  });
  addedReviews++;
  changed = true;
});

if (changed) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  console.log('✔ db.json yangilandi:');
  console.log(`  Mahsulotlar: ${db.products.length} (+${addedProducts} parda)`);
  console.log(`  Kategoriyalar: ${db.categories.length}`);
  console.log(`  Blog maqolalari: ${db.blogPosts.length} (+${addedBlogs})`);
  console.log(`  Sharhlar: ${db.reviews.length} (+${addedReviews})`);
} else {
  console.log('ℹ Hech qanday o\'zgarish kerak emas — hamma narsa allaqachon mavjud.');
}