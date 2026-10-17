import { useState } from 'react';
import {
  Crown,
  ShieldCheck, 
  Mail, 
  Phone, 
  Send, 
  Clock, 
  MapPin, 
  Instagram, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  HelpCircle, 
  Sparkles,
  Palette,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { showToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Iltimos, elektron pochtangizni kiriting!", "warning");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Noto'g'ri elektron pochta formati!", "error");
      return;
    }

    showToast("Grand Décor VIP klubiga xush kelibsiz! Sizga 10% promokod yuborildi.", "success");
    setEmail('');
  };

  return (
    <footer className="relative border-t border-slate-900 bg-slate-950 text-slate-400 font-sans mt-auto overflow-hidden">
      
      {/* Orqa fon nur effekti */}
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 1-QISM: NEWSLETTER (VIP KLUB) */}
      <div className="border-b border-slate-900/80 bg-slate-900/40 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center lg:text-left">
            <h3 className="font-serif text-base sm:text-lg font-bold text-white flex items-center justify-center lg:justify-start gap-2">
              <Crown className="h-5 w-5 text-amber-400" />
              <span>Grand Décor VIP Klubiga A'zo Bo'ling</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-light">
              Yangi ipak shokilalar, bayramona chegirmalar va birinchi xaridingiz uchun <strong>10% chegirma</strong> promokodiga ega bo'ling.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="w-full max-w-md flex items-center gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Elektron pochta manzilingiz..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition-all"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 text-xs font-bold text-slate-950 hover:shadow-lg hover:shadow-amber-400/25 active:scale-95 transition-all"
            >
              <span>A'zo bo'lish</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 2-QISM: ASOSIY MA'LUMOTLAR VA LINKLAR */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Blok 1: Brend & Logo */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20">
                <span className="font-serif text-xl font-black">G</span>
              </div>
              <div>
                <span className="font-serif font-black text-lg tracking-widest text-white uppercase block leading-none">
                  GRAND<span className="text-amber-400 font-normal">DÉCOR</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider text-amber-300/80 font-sans">
                  Parda Aksessuarlari Butigi
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed font-light max-w-sm">
              Grand Décor Luxe — O'zbekistondagi eng yirik hashamatli parda aksessuarlari va interyer dekori butigi. Italiya ipak shokilalari, Swarovski billur karniz uchliklari, magnitli marvarid tutqichlar va ovozsiz aqlli motorli karnizlar.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:text-amber-300 hover:border-amber-400/40 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://t.me/akromjonov2011"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:text-amber-300 hover:border-amber-400/40 transition-colors"
                aria-label="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="tel:+998712008800"
                className="h-9 w-9 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:text-amber-300 hover:border-amber-400/40 transition-colors"
                aria-label="Telefon"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Blok 2: Kolleksiyalar */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kolleksiyalar</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/katalog?category=Hashamatli%20Tassellar" className="hover:text-amber-300 transition-colors">Hashamatli Tassellar</Link></li>
              <li><Link to="/katalog?category=Magnitli%20Tutqichlar" className="hover:text-amber-300 transition-colors">Magnitli Tutqichlar</Link></li>
              <li><Link to="/katalog?category=Karnizlar%20&%20Uchliklar" className="hover:text-amber-300 transition-colors">Karnizlar va Uchliklar</Link></li>
              <li><Link to="/katalog?category=Zar%20Jiyaklar%20&%20Trimalar" className="hover:text-amber-300 transition-colors">Zar Jiyaklar va Trimalar</Link></li>
              <li><Link to="/katalog?category=Aqlli%20Motorli%20Karnizlar" className="hover:text-amber-300 transition-colors">Aqlli Motorli Karnizlar</Link></li>
              <li><Link to="/chegirmalar" className="text-amber-400 hover:underline">Chegirmalar (Aksiyalar)</Link></li>
            </ul>
          </div>

          {/* Blok 3: Xizmat va Yordam */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mijozlar Uchun</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/yetkazib-berish" className="hover:text-amber-300 transition-colors">Yetkazib berish shartlari</Link></li>
              <li><Link to="/tolov-usullari" className="hover:text-amber-300 transition-colors">To'lov usullari (Click, Payme)</Link></li>
              <li><Link to="/qaytarish" className="hover:text-amber-300 transition-colors">Kafolat va qaytarish</Link></li>
              <li><Link to="/bonus-dasturi" className="hover:text-amber-300 transition-colors">Bonus va sodiqlik dasturi</Link></li>
              <li><Link to="/faq" className="hover:text-amber-300 transition-colors">Ko'p so'raladigan savollar</Link></li>
              <li><Link to="/blog" className="hover:text-amber-300 transition-colors">Dizayner blogi va maslahatlar</Link></li>
            </ul>
          </div>

          {/* Blok 4: Kontaktlar va Showroom */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Showroom & Aloqa</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Toshkent sh., Chilonzor t., Bunyodkor shoh ko'chasi, 42-uy (Grand Décor Showroom)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <a href="tel:+998712008800" className="hover:text-white transition-colors">+998 (71) 200-88-00</a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Har kuni: 09:00 — 21:00 (Damsiz)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span>info@granddecor.uz</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 3-QISM: AFZALLIKLAR VA ISHONCH LENTASI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-slate-900/80 text-xs">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Butun O'zbekiston</p>
              <p className="text-[11px] text-slate-500">1-3 kunda yetkazish</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">100% Sifat kafolati</p>
              <p className="text-[11px] text-slate-500">2 yillik rasmiy kafolat</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Xavfsiz to'lov</p>
              <p className="text-[11px] text-slate-500">Click, Payme yoki naqd</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">14 kun qaytarish</p>
              <p className="text-[11px] text-slate-500">Muammosiz almashtirish</p>
            </div>
          </div>
        </div>

        {/* 4-QISM: PASTKI HUQUQIY SATR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {currentYear} Grand Décor Luxe. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4">
            <Link to="/maxfiylik" className="hover:text-slate-400 transition-colors">Maxfiylik siyosati</Link>
            <Link to="/shartlar" className="hover:text-slate-400 transition-colors">Foydalanish shartlari</Link>
            <Link to="/admin" className="hover:text-amber-400 transition-colors">Admin panel</Link>
          </div>
        </div>

      </div>

    </footer>
  );
}