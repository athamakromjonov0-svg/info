import { useState } from 'react';
import { MessageCircle, X, Send, Phone } from 'lucide-react';

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-[5.5rem] left-4 sm:left-6 lg:bottom-6 z-50 flex flex-col items-start gap-3">
      {/* Popup menu */}
      {open && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-2xl p-4 shadow-2xl shadow-black/60 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <p className="text-xs font-bold text-white uppercase tracking-wider mb-3 px-1">Biz bilan bog'laning</p>
          
          <a
            href="https://t.me/akromjonov2011"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 w-56 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm font-medium text-white hover:border-sky-400/40 hover:bg-sky-500/10 transition-all group"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
              <Send className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold">Telegram</p>
              <p className="text-[10px] text-slate-500">Yozing, javob beramiz</p>
            </div>
          </a>

          <a
            href="https://wa.me/998712008800"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 w-56 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm font-medium text-white hover:border-green-400/40 hover:bg-green-500/10 transition-all group"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold">WhatsApp</p>
              <p className="text-[10px] text-slate-500">Tezkor javob</p>
            </div>
          </a>

          <a
            href="tel:+998712008800"
            className="flex items-center gap-3 w-56 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm font-medium text-white hover:border-amber-400/40 hover:bg-amber-500/10 transition-all group"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold">Qo'ng'iroq</p>
              <p className="text-[10px] text-slate-500">+998 (71) 200-88-00</p>
            </div>
          </a>
        </div>
      )}

      {/* Asosiy tugma */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl transition-all duration-300 ${
          open
            ? 'bg-slate-800 border border-slate-700 text-white rotate-0'
            : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-green-500/30 hover:scale-110 hover:shadow-green-500/50 animate-pulse'
        } active:scale-95`}
        aria-label="Bog'lanish"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
