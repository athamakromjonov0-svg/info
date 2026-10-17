import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Loader2, ShieldCheck, Eye, EyeOff, Mail, User, Lock, ArrowRight,
  Sparkles, CheckCircle2, Zap, Fingerprint, ShoppingBag, Star
} from 'lucide-react';

export default function SiteLoginPage() {
  const {
    loginWithGoogle, isSiteAuthenticated, siteRegister, siteEmailLogin, products,
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/sayt/profil';

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (isSiteAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isSiteAuthenticated, navigate, from]);

  if (isSiteAuthenticated) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'register') {
      const ok = siteRegister(form.name, form.email, form.password);
      if (ok) navigate(from, { replace: true });
    } else {
      const ok = siteEmailLogin(form.email, form.password);
      if (ok) navigate(from, { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) navigate(from, { replace: true });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const productCount = (products || []).length;

  const inputCls = 'w-full rounded-xl border border-slate-900 bg-slate-950/80 py-3 pl-11 pr-4 text-xs text-white placeholder-slate-700 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 focus:outline-none transition-all font-medium';

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 font-sans select-none">

      {/* ORQA FON EFFEKTLARI */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1914_1px,transparent_1px),linear-gradient(to_bottom,#1c1914_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-6xl z-10">
        <div className="grid lg:grid-cols-5 overflow-hidden rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl shadow-2xl shadow-black/50">

          {/* CHAP SEKSIYA — BREND / NISH (katta) */}
          <div className="relative hidden lg:flex flex-col justify-between p-10 lg:col-span-2 border-r border-slate-900 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,193,7,0.15),transparent_50%)] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 text-slate-950 shadow-glow-sm">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-widest text-white uppercase">
                    GRAND<span className="text-amber-400">DECOR</span>
                  </h1>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                    Premium Store
                  </p>
                </div>
              </div>

              <div className="mt-14 space-y-6">
                <h2 className="text-3xl font-black text-white leading-tight">
                  Premium do'konimizga<br />
                  <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                    xush kelibsiz!
                  </span>
                </h2>

                <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                  Hisob yarating yoki kiring — buyurtmalaringiz, sevimli
                  mahsulotlaringiz va maxsus chegirmalaringiz bir joyda.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span>Shaxsiy kabinet va buyurtmalar tarixi</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                      <Zap className="h-4 w-4" />
                    </div>
                    <span>Tezkor xarid va bonus ballar</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                      <Star className="h-4 w-4" />
                    </div>
                    <span>Maxsus chegirmalar siz uchun</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistika */}
            <div className="relative grid grid-cols-3 gap-3 mt-10">
              <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-3 text-center">
                <p className="text-lg font-black text-amber-300 font-mono">{productCount || 300}+</p>
                <p className="text-[8px] text-slate-500 uppercase tracking-wider font-mono mt-0.5">Mahsulot</p>
              </div>
              <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-3 text-center">
                <p className="text-lg font-black text-amber-300 font-mono">24</p>
                <p className="text-[8px] text-slate-500 uppercase tracking-wider font-mono mt-0.5">Kategoriya</p>
              </div>
              <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-3 text-center">
                <p className="text-lg font-black text-amber-400 font-mono">7/24</p>
                <p className="text-[8px] text-slate-500 uppercase tracking-wider font-mono mt-0.5">Xizmat</p>
              </div>
            </div>

            <div className="relative flex items-center gap-2 text-[9px] text-slate-600 font-mono uppercase tracking-widest">
              <Fingerprint className="h-3 w-3 text-amber-400/60" />
              Firebase Auth
              <span className="text-slate-800">•</span>
              Google Secure
              <span className="text-slate-800">•</span>
              SSL Encrypted
            </div>
          </div>

          {/* O'NG SEKSIYA — FORMA */}
          <div className="p-8 sm:p-10 lg:col-span-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 text-slate-950">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-widest text-white uppercase">
                  GRAND<span className="text-amber-400">DECOR</span>
                </h1>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                  Premium Store
                </p>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 border border-amber-400/20 px-3 py-1 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
                <Sparkles className="h-3 w-3" /> Premium hisob
              </div>

              <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white">
                {mode === 'login' ? 'Hisobingizga kiring' : 'Yangi hisob yarating'}
              </h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                {mode === 'login'
                  ? 'Email va parol yoki Google orqali kirishingiz mumkin.'
                  : 'Bir necha soniya ichida ro\'yxatdan o\'ting — barcha imkoniyatlar ochiladi.'}
              </p>
            </div>

            {/* TABLAR: Kirish / Ro'yxatdan o'tish */}
            <div className="mt-6 grid grid-cols-2 gap-1.5 rounded-xl border border-slate-900 bg-slate-950/60 p-1.5">
              {[
                { id: 'login', label: 'Kirish' },
                { id: 'register', label: "Ro'yxatdan o'tish" },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setMode(t.id)}
                  className={`py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    mode === t.id
                      ? 'bg-amber-400 text-slate-950 shadow-glow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* GOOGLE */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="mt-6 group relative w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-white px-6 py-3.5 text-sm font-black text-slate-800 uppercase tracking-widest transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 hover:shadow-2xl hover:shadow-white/10 disabled:opacity-50 active:scale-[0.99] overflow-hidden"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
                  Google bilan ulanmoqda...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google bilan kirish
                </>
              )}
            </button>

            {/* DIVIDER */}
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-900" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-950/60 px-4 py-1 rounded-full border border-slate-900 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                  yoki email bilan
                </span>
              </div>
            </div>

            {/* EMAIL FORMA */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ismingiz</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-400 transition-colors" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ismingiz"
                      className={inputCls}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email manzil</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-400 transition-colors" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Parol</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    minLength={4}
                    className={`${inputCls} pr-10 font-mono tracking-widest`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-slate-600 hover:text-slate-300 transition-colors"
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3.5 text-xs font-black text-slate-950 uppercase tracking-widest shadow-glow transition-all duration-300 hover:shadow-glow-lg active:scale-[0.99]"
              >
                {mode === 'login' ? 'Kirish' : 'Hisob yaratish'}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* XAVFSIZLIK */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[9px] text-slate-600 font-mono uppercase tracking-widest">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-amber-400/60" /> Lokal xavfsiz auth
              </span>
              <span className="text-slate-800">•</span>
              <span>Google Auth</span>
              <span className="text-slate-800">•</span>
              <span>Ma'lumotlar shifrlangan</span>
            </div>

            <p className="mt-4 text-center text-[10px] text-slate-600 leading-relaxed">
              Davom etish orqali siz <Link to="/shartlar" className="text-slate-400 underline hover:text-slate-200 transition-colors">Foydalanish shartlari</Link> va{' '}
              <Link to="/maxfiylik" className="text-slate-400 underline hover:text-slate-200 transition-colors">Maxfiylik siyosatiga</Link> rozilik bildirasiz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
