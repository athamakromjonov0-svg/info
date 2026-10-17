const fs = require('fs');
const path = require('path');

const categories = [
  {
    id: '1',
    name: 'Hashamatli Tassellar',
    slug: 'tassellar',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=800&auto=format&fit=crop&q=80',
    description: 'Italiya va Turkiya ipak iplaridan qo\'lda to\'qilgan hashamatli parda shokilalari'
  },
  {
    id: '2',
    name: 'Magnitli Tutqichlar',
    slug: 'magnitli-tutqichlar',
    icon: 'Magnet',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
    description: 'Devorni teshib o\'tirmasdan mustahkam ushlovchi zamonaviy magnitli bog\'ichlar'
  },
  {
    id: '3',
    name: 'Karnizlar & Uchliklar',
    slug: 'karnizlar',
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80',
    description: 'Zanglamas po\'lat, bronza va kristall uchlikli premium darajadagi karniz tizimlari'
  },
  {
    id: '4',
    name: 'Zar Jiyaklar & Trimalar',
    slug: 'jiyaklar-trimlar',
    icon: 'Gem',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    description: 'Pardalar, tullar va lambrekenlar chetiga tikiladigan nafis zarbof jiyaklar'
  },
  {
    id: '5',
    name: 'Klassik Qisqichlar & Halqalar',
    slug: 'qisqichlar-halqalar',
    icon: 'Circle',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
    description: 'Shovqinsiz harakatlanuvchi teflon qoplamali halqalar va nafis metall qisqichlar'
  },
  {
    id: '6',
    name: 'Kristalli & Marvaridli Bezaklar',
    slug: 'kristalli-aksessuarlar',
    icon: 'Crown',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80',
    description: 'Swarovski va billur kristalli marvaridlar bilan bezatilgan eksklyuziv dekorlar'
  },
  {
    id: '7',
    name: 'Parda Lentalari & Ilgaklar',
    slug: 'lentalar-ilgaklar',
    icon: 'Tape',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80',
    description: 'Mukammal to\'lqinsimon qatlam hosil qiluvchi mustahkam poliester lentalar'
  },
  {
    id: '8',
    name: 'Aqlli Motorli Karnizlar',
    slug: 'aqlli-karnizlar',
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&auto=format&fit=crop&q=80',
    description: 'Pult, mobil ilova va Alice/Google orqali boshqariluvchi ovozsiz motorli karnizlar'
  }
];

const products = [
  // 1. Tassellar
  {
    id: '1',
    title: 'Imperator Oltin Ipak Tassel Shokila (Juft)',
    description: 'Qo\'lda to\'qilgan haqiqiy ipak ipli, qirrali billur sharcha bilan boyitilgan qirollik uslubidagi shokila. Og\'ir baxmal va jakkard pardalar uchun ayni muddao.',
    price: 345000,
    category: 'Hashamatli Tassellar',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    discount: 15,
    stock: 24,
    isNew: true,
    rating: 4.9,
    reviewsCount: 42,
    specs: ['Material: Italiya ipak ipi', 'Uzunligi: 85 sm', 'Rangi: Tilla / Champagne', 'Og\'irligi: 620g', 'Ishlab chiqarilgan: Turkiya']
  },
  {
    id: '2',
    title: 'Venetsiya Qirollik Tasseli "Royal Velvet Emerald"',
    description: 'Zumrad yashil va oltin rang uyg\'unligidagi hashamatli parda bog\'ichi. Katta zallar va mexmonxona xonalari interyeri uchun eksklyuziv model.',
    price: 420000,
    category: 'Hashamatli Tassellar',
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=800&auto=format&fit=crop&q=80',
    discount: 10,
    stock: 18,
    isNew: true,
    rating: 5.0,
    reviewsCount: 38,
    specs: ['Material: Velvet baxmal + ipak', 'Uzunligi: 92 sm', 'Rangi: Zumrad / Oltin', 'Kristallar: Qirrali shisha', '100% Handmade']
  },
  {
    id: '3',
    title: 'Klassik Bohem Kumush Tassel To\'plami',
    description: 'Och kulrang, marvarid va kumushrang tondagi yengil va o\'rta qalinlikdagi pardalar uchun nafis shokila to\'plami.',
    price: 280000,
    category: 'Hashamatli Tassellar',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
    discount: 0,
    stock: 35,
    isNew: false,
    rating: 4.8,
    reviewsCount: 29,
    specs: ['Material: Saten tola', 'Uzunligi: 78 sm', 'Rangi: Kumush / Marvarid', 'To\'plam: 2 dona']
  },
  {
    id: '4',
    title: 'Art-Deco Bronza Tassel "Sultan Gold"',
    description: 'Sharqona va neoklassik uslubda yasalgan, mayda munchoqlar bilan qoplangan og\'ir parda ushlagichi.',
    price: 390000,
    category: 'Hashamatli Tassellar',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80',
    discount: 20,
    stock: 12,
    isNew: false,
    rating: 4.7,
    reviewsCount: 19,
    specs: ['Material: Zarbof ipak', 'Uzunligi: 88 sm', 'Rangi: Qadimiy bronza', 'Qadoqda: 2 dona']
  },

  // 2. Magnitli Tutqichlar
  {
    id: '5',
    title: 'Magnitli Marvarid Bog\'ich "Lumiere Pearl" (2 dona)',
    description: 'Devorga mix qoqish va burg\'ulash shart emas! Kuchli neodim magniti va marvarid donalari pardani bir soniyada nafis qatlamga yig\'ib beradi.',
    price: 145000,
    category: 'Magnitli Tutqichlar',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    discount: 0,
    stock: 50,
    isNew: true,
    rating: 4.9,
    reviewsCount: 88,
    specs: ['Magnit turi: Neodim N52', 'Sharcha diametri: 3.5 sm', 'Tros uzunligi: 45 sm', 'Rangi: Oq marvarid']
  },
  {
    id: '6',
    title: 'Kristall Sharli Magnit Parda Mahkamlagichi (Juft)',
    description: 'Yorug\'likda olmos kabi jilvalanuvchi qirrali kristall sharcha va pishiq to\'qilgan metall simli magnit tutqich.',
    price: 175000,
    category: 'Magnitli Tutqichlar',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
    discount: 15,
    stock: 40,
    isNew: true,
    rating: 4.8,
    reviewsCount: 54,
    specs: ['Kristall: K9 optik oyna', 'Tros: Zanglamas po\'lat arqon', 'Rangi: Shaffof / Oltin', 'Diametr: 40 mm']
  },
  {
    id: '7',
    title: 'Geometrik Mat-Qora Magnit Tutqich "Nordic Minimal"',
    description: 'Minimalizm va zamonaviy loft uslubidagi interyerlar uchun mukammal geometrik shakldagi qora mat tutqich.',
    price: 120000,
    category: 'Magnitli Tutqichlar',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80',
    discount: 0,
    stock: 65,
    isNew: false,
    rating: 4.7,
    reviewsCount: 31,
    specs: ['Material: Alyuminiy qotishma', 'Qoplama: Mat kukunli bo\'yoq', 'Rangi: Mat qora', 'Tros: 42 sm']
  },
  {
    id: '8',
    title: 'Zar Bog\'ichli Oltin Magnit Kapsula "Elegance Gold"',
    description: 'Qalin pardalarni ham mustahkam ushlab turuvchi ikki tomonlama kuchaytirilgan neodim magnitli kapsula.',
    price: 160000,
    category: 'Magnitli Tutqichlar',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80',
    discount: 10,
    stock: 28,
    isNew: false,
    rating: 4.9,
    reviewsCount: 47,
    specs: ['Material: Jez (latun) qoplama', 'Arqon: Oltin ipak o\'ram', 'Uzunlik: 48 sm']
  },

  // 3. Karnizlar & Uchliklar
  {
    id: '9',
    title: 'Swarovski Kristalli Karniz Uchligi "Crown Crystal" (2 dona)',
    description: 'Diametri 28mm va 32mm bo\'lgan metall karniz quvurlari uchun mo\'ljallangan, ko\'p qirrali hashamatli kristall karniz uchi.',
    price: 490000,
    category: 'Karnizlar & Uchliklar',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&auto=format&fit=crop&q=80',
    discount: 20,
    stock: 15,
    isNew: true,
    rating: 5.0,
    reviewsCount: 26,
    specs: ['Mos quvur diametri: 28-32 mm', 'Material: Kristall + Xrom metall', 'O\'lchami: 11 x 7 sm', 'Komplektda: 2 dona + mahkamlagich']
  },
  {
    id: '10',
    title: 'Klassik Bronza "Versailles Imperial" Karniz Uchligi',
    description: 'Qadimiy qasrlar uslubidagi o\'ymakor barg naqshli, quyma latun karniz uchi. Har qanday klassik interyerga salobat baxsh etadi.',
    price: 360000,
    category: 'Karnizlar & Uchliklar',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80',
    discount: 0,
    stock: 22,
    isNew: false,
    rating: 4.8,
    reviewsCount: 34,
    specs: ['Material: Quyma Jez (Latun)', 'Rangi: Antik bronza', 'Diametr: 25-28 mm', 'Vazni: 480g']
  },
  {
    id: '11',
    title: 'Zanglamas Po\'latdan Ikki Qatorli Premium Karniz (3 metr)',
    description: 'Oyna pardasi (tyul) va tungi og\'ir parda uchun mo\'ljallangan, shovqinsiz siljuvchi ikki qatorli mustahkam karniz to\'plami.',
    price: 850000,
    category: 'Karnizlar & Uchliklar',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&auto=format&fit=crop&q=80',
    discount: 15,
    stock: 14,
    isNew: true,
    rating: 4.9,
    reviewsCount: 62,
    specs: ['Uzunligi: 300 sm', 'Qatorlar: 2 qatorli', 'Material: Zanglamas po\'lat 304', 'Qoplamasi: Satin nikel', 'Yuk ko\'tarish: 45 kg gacha']
  },
  {
    id: '12',
    title: 'Yashirin Shift Karniz Profili "Secret Track Invisible" (4m)',
    description: 'Gipsokarton va cho\'ziluvchan shiftlar orqasiga yashirin o\'rnatiladigan, pardalar go\'yo osmondan tushib turgandek ko\'rinadigan zamonaviy profil.',
    price: 580000,
    category: 'Karnizlar & Uchliklar',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80',
    discount: 0,
    stock: 30,
    isNew: true,
    rating: 4.9,
    reviewsCount: 45,
    specs: ['Uzunlik: 4 metr', 'O\'rnatish: Shiftga yashirin', 'Material: Anodlangan alyuminiy', 'G\'ildirakchalar: Shovqinsiz silikon']
  },

  // 4. Zar Jiyaklar & Trimalar
  {
    id: '13',
    title: 'Fransuz Oltin Zar Bilan To\'qilgan Jiyak "Versailles Trim" (1 metr)',
    description: 'Pardalar, lambrekenlar va mebel qoplamalari hoshiyasi uchun yuqori sifatli zar ip va marvaridlar bilan to\'qilgan dekorativ lenta.',
    price: 45000,
    category: 'Zar Jiyaklar & Trimalar',
    image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&auto=format&fit=crop&q=80',
    discount: 0,
    stock: 250,
    isNew: false,
    rating: 4.9,
    reviewsCount: 73,
    specs: ['Kengligi: 7.5 sm', 'Material: Zar ip + lureks', 'Sotuv birligi: 1 pogon metr', 'Rangi: Tilla zar']
  },
  {
    id: '14',
    title: 'Marvaridli Osilma Shokila-Jiyak "Crystal Drop Fringe" (1m)',
    description: 'Parda etagiga va lambrekenlarga tikiladigan, har bir qadamda nur sochuvchi shaffof billur osilmali jiyak.',
    price: 65000,
    category: 'Zar Jiyaklar & Trimalar',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    discount: 10,
    stock: 180,
    isNew: true,
    rating: 5.0,
    reviewsCount: 51,
    specs: ['Balandligi: 10 sm', 'Elementlar: Akril qirrali kristallar', 'Asos: Jakard lenta', 'Rangi: Shaffof / Oltin']
  },
  {
    id: '15',
    title: 'Baxmalli Qalin Kord-Ip "Velvet Piping Cord" (10m)',
    description: 'Pardalar konturini aniq va hashamatli ajratib ko\'rsatuvchi ipak va baxmal aralash qalin bezak shnuri.',
    price: 95000,
    category: 'Zar Jiyaklar & Trimalar',
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=800&auto=format&fit=crop&q=80',
    discount: 0,
    stock: 80,
    isNew: false,
    rating: 4.7,
    reviewsCount: 18,
    specs: ['Diametri: 12 mm', 'O\'rami: 10 metr', 'Material: Paxta + Saten', 'Rangi: Zangori, Zumrad, Krem']
  },

  // 5. Klassik Qisqichlar & Halqalar
  {
    id: '16',
    title: 'Shovqinsiz Teflon Halqalar To\'plami "Silent Glide" (20 dona)',
    description: 'Ichki qismi maxsus silikon va teflon qoplangan bo\'lib, karniz bo\'ylab hech qanday shovqinsiz va qirilishsiz silliq sirg\'aladi.',
    price: 110000,
    category: 'Klassik Qisqichlar & Halqalar',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
    discount: 0,
    stock: 120,
    isNew: false,
    rating: 4.9,
    reviewsCount: 95,
    specs: ['Ichki diametri: 35 mm', 'Material: Zanglamas metall + Teflon lenta', 'Soni: 20 dona', 'Ranglar: Xrom, Tilla, Qora']
  },
  {
    id: '17',
    title: 'Dekorativ Metall Parda Qisqichlari "Crocodile Gold" (30 dona)',
    description: 'Tishlari matoni yirtmaydigan himoya qoplamali, og\'ir pardalarni ham mustahkam tishlab turuvchi tilla qisqichlar.',
    price: 85000,
    category: 'Klassik Qisqichlar & Halqalar',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80',
    discount: 15,
    stock: 90,
    isNew: false,
    rating: 4.8,
    reviewsCount: 41,
    specs: ['Material: Karbon po\'lat', 'Qoplama: Korroziyaga qarshi elektroforez', 'Soni: 30 dona']
  },
  {
    id: '18',
    title: 'Klassik Bronza Devor Ilgagi "Royal Swan" (Juft)',
    description: 'Parda shokilalari va tutqichlarini devorga ilish uchun oqqush shaklida ishlangan san\'at asari darajasidagi metall ilmoq.',
    price: 210000,
    category: 'Klassik Qisqichlar & Halqalar',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    discount: 10,
    stock: 35,
    isNew: true,
    rating: 5.0,
    reviewsCount: 33,
    specs: ['Material: Quyma latun', 'Balandligi: 16 sm', 'Komplekt: 2 dona ilmoq + dushaviy vintlar']
  },

  // 6. Kristalli & Marvaridli Bezaklar
  {
    id: '19',
    title: 'Swarovski Kristalli Parda Broshi "Florencia Flower"',
    description: 'Parda markaziga yoki qatlamiga qadaluvchi, gul shaklidagi yirik billur kristalli magnitli hashamatli broshka.',
    price: 260000,
    category: 'Kristalli & Marvaridli Bezaklar',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
    discount: 15,
    stock: 25,
    isNew: true,
    rating: 5.0,
    reviewsCount: 46,
    specs: ['Diametri: 8.5 sm', 'Kristallar: Swarovski Elements', 'Mahkamlash: Kuchsiz matoga zarar bermaydigan magnit']
  },
  {
    id: '20',
    title: 'Marvarid Shokilali Parda Osilmasi "Tears of Pearl" (Juft)',
    description: 'Har xil o\'lchamdagi marvarid donalari shodalari bilan tikilgan, pardaga oqib tushuvchi joziba baxsh etuvchi dekorativ osilma.',
    price: 230000,
    category: 'Kristalli & Marvaridli Bezaklar',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80',
    discount: 0,
    stock: 19,
    isNew: false,
    rating: 4.8,
    reviewsCount: 22,
    specs: ['Uzunligi: 65 sm', 'Toshlar: Tabiiy marvarid imitatsiyasi', 'Komplekt: 2 dona']
  },

  // 7. Parda Lentalari & Ilgaklar
  {
    id: '21',
    title: 'Fransuz To\'lqinsimon Parda Lentasi "Wave Fold" (50 metr)',
    description: 'Parda yuqorisida mukammal bir xil va tekis to\'lqinli chuqur qatlamlar hosil qiluvchi shaffof, pishiq armatura lenta.',
    price: 290000,
    category: 'Parda Lentalari & Ilgaklar',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80',
    discount: 0,
    stock: 70,
    isNew: false,
    rating: 4.9,
    reviewsCount: 67,
    specs: ['Kengligi: 10 sm', 'Uzunligi: 50 metr o\'ram', 'Material: Shaffof mustahkam poliester', 'Qatorlar: 4 ta ilgak yo\'li']
  },
  {
    id: '22',
    title: 'Sinteponli Parda Qatlam Ilgaklari "HeavyDuty Hook" (100 dona)',
    description: 'Og\'ir pardalar yuklamasiga chidamli, sinmaydigan va vaqt o\'tishi bilan zanglamaydigan Germaniya texnologiyasidagi plastik ilgaklar.',
    price: 65000,
    category: 'Parda Lentalari & Ilgaklar',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&auto=format&fit=crop&q=80',
    discount: 0,
    stock: 200,
    isNew: false,
    rating: 4.8,
    reviewsCount: 84,
    specs: ['Balandligi: 30 mm', 'Material: Yuqori zichlikdagi POM plastik', 'Soni: 100 dona', 'Kafolat: 5 yil']
  },

  // 8. Aqlli Motorli Karnizlar
  {
    id: '23',
    title: 'Avtomatik Aqlli Motorli Karniz Tizimi "SmartDrape Pro" (3.5m)',
    description: 'Yandeks Alisa, Apple HomeKit va pult orqali ovozsiz ochilib-yopiluvchi aqlli karniz. Qo\'l bilan sal tortganda o\'zi avtomatik harakatlanadi (Touch-motion).',
    price: 1850000,
    category: 'Aqlli Motorli Karnizlar',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80',
    discount: 25,
    stock: 12,
    isNew: true,
    rating: 5.0,
    reviewsCount: 57,
    specs: ['Uzunlik: 3.5 metr (sozlanuvchi)', 'Shovqin darajasi: < 25 dB (ovozsiz)', 'Boshqaruv: Wi-Fi, Tuya, Alisa, Pult', 'Yuk ko\'tarish: 50 kg gacha', 'Kafolat: 3 yil']
  },
  {
    id: '24',
    title: 'Batareyali Simsiz Motorli Karniz "SolarDrape Wireless" (3m)',
    description: 'Elektr sim tortish shart emas! O\'rnatilgan kuchli akkumulyator 6 oy xizmat qiladi. Quyosh paneli orqali avtomatik quvvatlanish imkoniyati.',
    price: 2100000,
    category: 'Aqlli Motorli Karnizlar',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&auto=format&fit=crop&q=80',
    discount: 15,
    stock: 8,
    isNew: true,
    rating: 4.9,
    reviewsCount: 39,
    specs: ['Akkumulyator: 4000 mAh Li-ion', 'Quvvatlash: Type-C yoki Solar panel', 'Boshqaruv: Zigbee 3.0 / Bluetooth', 'Kafolat: 3 yil']
  }
];

const dbData = {
  products,
  categories,
  $schema: './schema.json'
};

fs.writeFileSync(path.resolve(__dirname, '../db.json'), JSON.stringify(dbData, null, 2), 'utf8');
console.log('✔ db.json muvaffaqiyatli yangilandi: ' + products.length + ' ta parda aksessuarlari va ' + categories.length + ' ta kategoriya!');
