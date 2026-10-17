import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, FileText, Globe } from 'lucide-react';
import PageHero from '../components/PageHero';

/**
 * HUQUQIY SAHIFALAR — maxfiylik siyosati / foydalanish shartlari / ommaviy oferta.
 * Route: /maxfiylik, /shartlar, /ommaviy-oferta
 */
const LEGAL_TYPES = {
  'maxfiylik': {
    title: 'Maxfiylik',
    highlight: 'siyosati',
    icon: ShieldCheck,
    badge: 'Maxfiylik siyosati',
    updated: '2026-yil 1-avgust',
    desc: 'Sizning shaxsiy ma\'lumotlaringiz qanday yig\'ilishi, saqlanishi va himoyalanishi haqida.',
    sections: [
      { title: "1. Umumiy qoidalar", body: "Ushbu Maxfiylik siyosati Grand Decor onlayn-do'koni tomonidan foydalanuvchilarning shaxsiy ma'lumotlarini yig'ish, saqlash va himoya qilish tartibini belgilaydi. Saytdan foydalanish orqali siz ushbu siyosat shartlariga rozilik bildirasiz." },
      { title: "2. Ma'lumotlar yig'ilishi", body: "Biz quyidagi ma'lumotlarni yig'amiz: ism, telefon raqami, elektron pochta, yetkazib berish manzili, buyurtma tarixi va to'lov ma'lumotlari. Bu ma'lumotlar faqat buyurtmalarni bajarish va xizmat ko'rsatish sifatini oshirish uchun ishlatiladi." },
      { title: "3. Ma'lumotlardan foydalanish", body: "Yig'ilgan ma'lumotlar buyurtmalarni qayta ishlash, yetkazib berish, to'lovlarni amalga oshirish, marketing xabarlarini yuborish (rozilik asosida) va xavfsizlikni ta'minlash uchun ishlatiladi." },
      { title: "4. Ma'lumotlarni himoya qilish", body: "Shaxsiy ma'lumotlaringiz shifrlangan kanallar orqali uzatiladi va ruxsatsiz kirishdan himoyalangan serverlarda saqlanadi. Ma'lumotlarga faqat vakolatli xodimlar kirish huquqiga ega." },
      { title: "5. Uchinchi shaxslar bilan almashish", body: "Biz sizning ma'lumotlaringizni uchinchi shaxslarga sotmaymiz va ijaraga bermaymiz. Faqat buyurtmani yetkazish uchun zarur bo'lgan kuryer xizmatlari va to'lov tizimlari bilan almashishimiz mumkin." },
      { title: "6. Cookie fayllari", body: "Sayt cookie fayllaridan foydalanuvchi tajribasini yaxshilash uchun foydalanadi. Siz brauzer sozlamalari orqali cookie fayllarini boshqarishingiz yoki o'chirib qo'yishingiz mumkin." },
      { title: "7. Foydalanuvchi huquqlari", body: "Siz istalgan vaqtda ma'lumotlaringizni ko'rish, tuzatish yoki o'chirishni so'rash huquqiga egasiz. Buning uchun aloqa bo'limiga murojaat qiling." },
    ],
  },
  'shartlar': {
    title: 'Foydalanish',
    highlight: 'shartlari',
    icon: FileText,
    badge: 'Foydalanish shartlari',
    updated: '2026-yil 1-avgust',
    desc: 'Saytdan foydalanish tartib-qoidalari va foydalanuvchi majburiyatlari.',
    sections: [
      { title: "1. Qabul qilish", body: "Saytdan foydalanish orqali siz ushbu shartlarni to'liq qabul qilasiz. Agar shartlarga rozi bo'lmasangiz, saytdan foydalanmang." },
      { title: "2. Hisob qaydnomasi", body: "Hisob yaratishda to'g'ri va haqqoniy ma'lumotlarni taqdim etishingiz shart. Hisobingiz paroli va xavfsizligi uchun siz javobgarsiz." },
      { title: "3. Buyurtmalar", body: "Buyurtma berish orqali siz mahsulot narxini to'lash majburiyatini olasiz. Narxlar va mavjudlik istalgan vaqtda o'zgarishi mumkin." },
      { title: "4. Intellektual mulk", body: "Saytdagi barcha kontent (matn, tasvirlar, logotiplar) Grand Decor kompaniyasiga tegishli bo'lib, ruxsatsiz nusxalash taqiqlanadi." },
      { title: "5. Taqiqlangan harakatlar", body: "Saytdan noqonuniy maqsadlarda foydalanish, tizimga ruxsatsiz kirish, boshqa foydalanuvchilar ma'lumotlarini o'g'irlash taqiqlanadi." },
      { title: "6. Javobgarlik cheklovi", body: "Fors-major holatlari (tabiiy ofatlar, davlat qarorlari) tufayli majburiyatlarni bajarmaslik uchun kompaniya javobgar emas." },
    ],
  },
  'ommaviy-oferta': {
    title: 'Ommaviy',
    highlight: 'oferta',
    icon: Globe,
    badge: 'Ommaviy oferta',
    updated: '2026-yil 1-avgust',
    desc: 'Xarid qilishdan oldin tanishishingiz kerak bo\'lgan rasmiy savdo shartnomasi.',
    sections: [
      { title: "1. Oferta ta'rifi", body: "Ushbu hujjat Grand Decor onlayn-do'koni tomonidan mahsulotlarni sotish bo'yicha rasmiy ommaviy ofertadir. Oferta qabul qilinganda (buyurtma berilganda) savdo shartnomasi tuzilgan hisoblanadi." },
      { title: "2. Narxlar", body: "Mahsulot narxlari so'mda ko'rsatilgan va buyurtma berish vaqtida amal qiladi. Narxlar istalgan vaqtda o'zgarishi mumkin, ammo tasdiqlangan buyurtma narxi o'zgarmaydi." },
      { title: "3. To'lov tartibi", body: "To'lov naqd, plastik karta yoki onlayn usullar orqali amalga oshiriladi. Onlayn to'lovlar xavfsiz shifrlangan kanal orqali o'tkaziladi." },
      { title: "4. Yetkazib berish", body: "Yetkazib berish muddati va narxi hududga bog'liq. Yetkazib berish xarajatlari saytning 'Yetkazib berish' sahifasida ko'rsatilgan." },
      { title: "5. Qaytarish", body: "Foydalanuvchi mahsulotni olingan kundan boshlab 14 kun ichida qaytarish huquqiga ega. Qaytarish shartlari 'Qaytarish' sahifasida keltirilgan." },
      { title: "6. Kafolat", body: "Barcha mahsulotlar ishlab chiqaruvchi kafolati bilan taqdim etiladi. Kafolat muddati mahsulot turiga qarab 1 yildan 2 yilgacha." },
    ],
  },
};

export default function LegalPage() {
  const location = useLocation();
  const type = location.pathname.replace(/^\//, '');
  const config = useMemo(() => LEGAL_TYPES[type] || LEGAL_TYPES['maxfiylik'], [type]);
  const Icon = config.icon;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,193,7,0.04),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHero
          badge={config.badge}
          title={config.title}
          highlight={config.highlight}
          description={config.desc}
          icon={Icon}
        />

        {/* TABLAR */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.keys(LEGAL_TYPES).map(key => {
            const t = LEGAL_TYPES[key];
            const isActive = key === type;
            const TabIcon = t.icon;
            return (
              <Link
                key={key}
                to={`/${key}`}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[11px] font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-glow-sm'
                    : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <TabIcon className="h-3.5 w-3.5" /> {t.title} {t.highlight}
              </Link>
            );
          })}
        </div>

        {/* YANGILANGAN SANASI */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-900 bg-slate-950/60 px-5 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <span>So'nggi yangilanish: {config.updated}</span>
          <ShieldCheck className="h-4 w-4 text-amber-400" />
        </div>

        {/* BO'LIMLAR */}
        <div className="space-y-4">
          {config.sections.map(section => (
            <div key={section.title} className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-6 sm:p-8">
              <h3 className="text-sm font-black text-white mb-3">{section.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        {/* ALOQA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-900 bg-slate-950/60 p-6">
          <p className="text-xs text-slate-400">Savollaringiz bo'lsa, huquqiy bo'limga murojaat qiling.</p>
          <Link to="/aloqa" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-xs font-black text-slate-950 uppercase tracking-widest shadow-glow-sm hover:from-amber-300 hover:to-yellow-400 transition-all">
            Aloqa bo'limi
          </Link>
        </div>
      </div>
    </div>
  );
}
