import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-[5.5rem] right-4 sm:right-6 lg:bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-xl shadow-amber-500/30 hover:scale-110 hover:shadow-amber-500/50 active:scale-95 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      aria-label="Yuqoriga qaytish"
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
    </button>
  );
}
