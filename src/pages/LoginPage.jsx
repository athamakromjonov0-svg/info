import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, Loader2, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const [email, setEmail] = useState('admin@premium.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsAuthenticating(true);

    const success = await login(email, password);
    setIsAuthenticating(false);

    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleQuickInject = () => {
    setEmail('admin@premium.com');
    setPassword('admin123');
  };

  if (isAuthenticated) {
    setTimeout(() => navigate('/admin', { replace: true }), 0);
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 font-sans select-none text-slate-100 relative overflow-hidden bg-slate-950">

      {/* ORQA FON EFFEKTLARI */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1914_1px,transparent_1px),linear-gradient(to_bottom,#1c1914_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse duration-[4000ms]" />

      {/* CARD SHILD */}
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-8 shadow-2xl relative z-10 border-t-slate-800/80 transition-all duration-300 hover:border-slate-800">

        {/* LOGO VA HEADER */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-black text-amber-400 mb-4 border border-slate-800 shadow-xl shadow-amber-500/10">
            <KeyRound className="h-5 w-5 animate-pulse" />
          </div>
          <h2 className="text-xl font-black tracking-wider uppercase font-mono text-white">
            OPERATOR <span className="text-amber-400 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">SHLYUZI</span>
          </h2>
          <p className="mt-1.5 text-xs text-slate-400 font-light max-w-xs mx-auto leading-relaxed">
            Ma'lumotlar omborini boshqarish quyi tizimini blokdan chiqarish uchun root kalitlarini kiriting.
          </p>
        </div>

        {/* FORMA */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">

            {/* Input Email */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Elektron pochta
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  disabled={isAuthenticating}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/80 py-3 pl-11 pr-4 text-xs text-white placeholder-slate-700 focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 focus:outline-none transition-all font-medium disabled:opacity-50"
                  placeholder="admin@premium.com"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                Kriptografik Kalit So'z
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isAuthenticating}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/80 py-3 pl-11 pr-10 text-xs text-white placeholder-slate-700 focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 focus:outline-none transition-all font-mono tracking-widest disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

          </div>

          {/* TEZKOR AVTO-TO'LDIRISH SHIELD (NEON GLOW) */}
          <div
            onClick={handleQuickInject}
            className="group border border-slate-900 bg-slate-950/90 hover:border-amber-400/30 rounded-xl p-3.5 text-[11px] text-slate-400 leading-relaxed cursor-pointer transition-all duration-300 select-none relative overflow-hidden hover:shadow-glow-sm"
            title="Ma'lumotlarni avtomatik to'ldirish"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-40 transition-opacity duration-300 text-amber-400">
              <ShieldCheck className="h-4 w-4 shadow-sm" />
            </div>
            <span className="font-bold text-slate-300 block mb-1 font-mono uppercase tracking-wider group-hover:text-amber-300 transition-colors">
              [✓] Tezkor Avto-To'ldirish Shlyuzi:
            </span>
            <div className="font-mono text-[10px] space-y-0.5 text-slate-500 group-hover:text-slate-400 transition-colors">
              User: <span className="text-slate-300 font-medium">admin@premium.com</span><br/>
              Pass: <span className="text-slate-300 font-medium tracking-wide">admin123</span>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 py-3 text-xs font-black text-slate-200 uppercase tracking-widest transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 hover:text-slate-950 hover:border-amber-400 disabled:opacity-50 active:scale-[0.99] shadow-xl hover:shadow-glow-sm"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                Sinxronizatsiya qilinmoqda...
              </>
            ) : (
              <>
                Kirish Seansini Boshlash <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}