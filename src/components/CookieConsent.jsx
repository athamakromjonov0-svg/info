import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'granddecor_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="mx-auto max-w-4xl rounded-2xl border border-amber-400/30 bg-slate-900/95 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl shadow-black/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30">
            <Cookie className="h-6 w-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white mb-1">Cookie fayllardan foydalanamiz</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sayt tajribasini yaxshilash, reklama va tahlil maqsadida cookie fayllardan foydalanamiz.
              Saytdan foydalanishni davom etishingiz orqali siz <span className="text-amber-300">Cookie Siyosatiga</span> rozilik bildirasiz.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAccept}
              className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-xs font-bold text-slate-950 uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/25 active:scale-95 transition-all"
            >
              Qabul qilish
            </button>
            <button
              onClick={handleAccept}
              className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Yopish"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
