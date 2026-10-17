import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, Search, MessageCircle, LifeBuoy, Truck, RotateCcw, CreditCard, ShieldCheck } from 'lucide-react';
import PageHero from '../components/PageHero';

/**
 * FAQ — eng ko'p so'raladigan savollar (akkordeon + qidiruv).
 */
const FAQ_ITEMS = [
  {
    category: "Buyurtma",
    icon: HelpCircle,
    questions: [
      { q: "Buyurtmani qanday bersam bo'ladi?", a: "Mahsulotni savatga qo'shing, 'Buyurtma berish' tugmasini bosing, manzilingizni kiriting va to'lov usulini tanlang. Buyurtma tasdiqlangach operatorlarimiz siz bilan bog'lanadi." },
      { q: "Buyurtmani bekor qilish mumkinmi?", a: "Ha. Buyurtma 'Tayyorlanmoqda' holatiga o'tgunga qadar bekor qilishingiz mumkin. Buning uchun 'Buyurtmalarim' sahifasidagi 'Bekor qilish' tugmasini bosing." },
      { q: "Buyurtma holatini qanday kuzataman?", a: "'Buyurtmalarim' sahifasida barcha buyurtmalaringiz holatini real vaqtda ko'rishingiz mumkin: Qabul qilindi → Tayyorlanmoqda → Yo'lda → Yetkazildi." },
      { q: "Buyurtmani o'zgartira olamanmi?", a: "Buyurtma yuborilgunga qadar qo'ng'iroq markazi orqali o'zgartirishingiz mumkin. Yuborilgach, faqat qaytarish mumkin." },
    ],
  },
  {
    category: "Yetkazib berish",
    icon: Truck,
    questions: [
      { q: "Yetkazib berish qancha vaqt oladi?", a: "Toshkent shahri ichida 1-2 kun, viloyatlarga 2-5 kun. Yetkazib berish muddati hududga bog'liq va 'Yetkazib berish' sahifasida batafsil ko'rsatilgan." },
      { q: "Yetkazib berish narxi qancha?", a: "Toshkent shahri uchun 20 000 so'm. 1 000 000 so'mdan ortiq xaridlarda yetkazib berish bepul! Barcha zonalar narxlari 'Yetkazib berish' sahifasida." },
      { q: "Buyurtmani qayerdan olib ketsam bo'ladi?", a: "Toshkent shahridagi ofisimizdan (Chilonzor tumani, Bunyodkor ko'chasi 42) shaxsan olib ketishingiz mumkin." },
    ],
  },
  {
    category: "To'lov",
    icon: CreditCard,
    questions: [
      { q: "Qanday to'lov usullari bor?", a: "Naqd pul, plastik karta (UzCard, Humo, VISA, Mastercard), onlayn to'lov va bank o'tkazmasi. Batafsil 'To'lov usullari' sahifasida." },
      { q: "To'lov xavfsizmi?", a: "Barcha onlayn to'lovlar xalqaro PCI DSS standartlariga mos shifrlangan kanal orqali amalga oshiriladi." },
      { q: "Bo'lib to'lash imkoniyati bormi?", a: "Ha, 3-12 oygacha bo'lib to'lash mavjud. To'lov usullari sahifasida shartlar bilan tanishishingiz mumkin." },
    ],
  },
  {
    category: "Qaytarish",
    icon: RotateCcw,
    questions: [
      { q: "Mahsulotni qaytarish mumkinmi?", a: "Ha, mahsulot olingan kundan boshlab 14 kun ichida qaytarishingiz mumkin. Mahsulot tovar ko'rinishida bo'lishi shart. Batafsil 'Qaytarish' sahifasida." },
      { q: "Pul qachon qaytadi?", a: "Qaytarish tasdiqlangach, pul 3-5 ish kuni ichida to'lov usulingizga qaytariladi." },
      { q: "Kafolatli mahsulotda nosozlik bo'lsa?", a: "Barcha mahsulotlarimiz 1 yil rasmiy kafolatga ega. Nosozlik bo'lsa, bepul ta'mirlash yoki almashtirish taqdim etamiz." },
    ],
  },
  {
    category: "Boshqa",
    icon: LifeBuoy,
    questions: [
      { q: "Bonus ballar nima?", a: "Har 10 000 so'm xarid uchun 1 bonus ball olasiz. Ballarni keyingi xaridlarda chegirma sifatida ishlatishingiz mumkin. Batafsil 'Bonus dasturi' sahifasida." },
      { q: "Chegirma kuponlarini qanday ishlataman?", a: "Savatda 'Kupon' maydoniga kodni kiriting (masalan: WELCOME10) va chegirma avtomatik qo'llanadi." },
      { q: "Kafolat nimalarni qamrab oladi?", a: "Ishlab chiqarish nuqsonlari va texnik nosozliklar. Mexanik shikastlanishlar kafolatga kirmaydi." },
    ],
  },
];

export default function FaqPage() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);

  const filtered = FAQ_ITEMS.map(group => ({
    ...group,
    questions: group.questions.filter(item =>
      !query.trim() ||
      item.q.toLowerCase().includes(query.trim().toLowerCase()) ||
      item.a.toLowerCase().includes(query.trim().toLowerCase())
    ),
  })).filter(group => group.questions.length > 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,193,7,0.05),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHero
          badge="Ko'p so'raladigan savollar"
          title="Ko'p so'raladigan"
          highlight="savollar"
          description="Buyurtma, yetkazib berish, to'lov va qaytarish bo'yicha eng ko'p so'raladigan savollarga javoblar."
          icon={HelpCircle}
        />

        {/* QIDIRUV */}
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(null); }}
            placeholder="Savolingizni qidiring..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/10 transition-all"
          />
        </div>

        {/* FAQ GURUHLARI */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 p-12 text-center">
            <Search className="h-10 w-10 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-400">Hech narsa topilmadi. Savolingiz bo'lsa, bizga yozing.</p>
            <Link to="/aloqa" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-xs font-black text-slate-950 uppercase tracking-widest shadow-glow-sm hover:from-amber-300 hover:to-yellow-400 transition-colors">
              <MessageCircle className="h-3.5 w-3.5" /> Aloqa bo'limi
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map(group => (
              <div key={group.category}>
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                  <group.icon className="h-4 w-4 text-amber-400" /> {group.category}
                </h3>
                <div className="space-y-2.5">
                  {group.questions.map((item, idx) => {
                    const key = `${group.category}-${idx}`;
                    const isOpen = open === key;
                    return (
                      <div key={key} className={`rounded-2xl border transition-all duration-200 ${
                        isOpen ? 'border-amber-400/30 bg-amber-400/5' : 'border-slate-900 bg-slate-950/60 hover:border-slate-700'
                      }`}>
                        <button
                          onClick={() => setOpen(isOpen ? null : key)}
                          className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                        >
                          <span className="text-sm font-bold text-white">{item.q}</span>
                          <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5">
                            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-4">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* YORDAM CTA */}
        <div className="rounded-3xl border border-slate-900 bg-gradient-to-br from-amber-400/10 to-transparent backdrop-blur-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Javob topolmadingizmi?</p>
              <p className="text-[11px] text-slate-500">Operatorlarimiz 24/7 yordam berishga tayyor.</p>
            </div>
          </div>
          <Link to="/aloqa" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-xs font-black text-slate-950 uppercase tracking-widest shadow-glow-sm hover:from-amber-300 hover:to-yellow-400 transition-all">
            <MessageCircle className="h-3.5 w-3.5" /> Aloqa
          </Link>
        </div>
      </div>
    </div>
  );
}
