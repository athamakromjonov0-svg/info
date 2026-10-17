import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, Clock, ArrowRight, Tag, Eye, Heart } from 'lucide-react';
import PageHero from '../components/PageHero';
import { useApp } from '../context/AppContext';

/**
 * BLOG — do'kon yangiliklari, foydali maslahatlar va maqolalar.
 * Maqolalar admin paneldan boshqariladi (useBlog context).
 */

export default function BlogPage() {
  const { blogPosts } = useApp();
  const posts = useMemo(() => Array.isArray(blogPosts) && blogPosts.length > 0 ? blogPosts : [], [blogPosts]);
  const [activeCat, setActiveCat] = useState('ALL');

  const categories = useMemo(() => ['ALL', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))], [posts]);

  const filtered = useMemo(() =>
    activeCat === 'ALL' ? posts : posts.filter(p => p.category === activeCat),
  [posts, activeCat]);

  const featured = filtered[0];
  const rest = filtered.filter(p => p.id !== featured.id);

  const formatDate = (d) => new Date(d).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,193,7,0.05),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHero
          badge="Dizayner Blogi"
          title="Yangiliklar va"
          highlight="maqolalar"
          description="Interyer dizayni bo'yicha foydali maslahatlar, do'kon yangiliklari va ekspert tavsiyalari."
          icon={Newspaper}
        />

        {/* KATEGORIYALAR */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`rounded-xl border px-4 py-2 text-[11px] font-bold transition-all duration-200 ${
                activeCat === cat
                  ? 'bg-amber-400 text-slate-950 border-amber-400'
                  : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 p-14 text-center">
            <Newspaper className="h-10 w-10 text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-bold text-white">Maqolalar topilmadi</p>
            <p className="text-xs text-slate-500 mt-1">Bu kategoriyada hozircha maqola yo'q.</p>
          </div>
        )}

        {/* ASOSIY MAQOLA */}
        {featured && (
        <Link
          to={`/blog/${featured.id}`}
          className="group relative overflow-hidden rounded-[2rem] border border-slate-900 bg-slate-950/60 backdrop-blur-xl block"
        >
          <div className="grid lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto overflow-hidden">
              <img src={featured.image} alt={featured.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:bg-gradient-to-r" />
              <span className="absolute top-4 left-4 rounded-full bg-amber-400 px-3 py-1 text-[9px] font-black text-slate-950 uppercase tracking-widest">
                Asosiy maqola
              </span>
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {featured.category}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(featured.date)}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readTime} daqiqa</span>
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white leading-tight group-hover:text-amber-300 transition-colors">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed line-clamp-3">{featured.excerpt}</p>
              <div className="mt-5 flex items-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {featured.views}</span>
                <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {featured.likes}</span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-amber-400 font-bold group-hover:gap-2.5 transition-all">
                  O'qish <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </Link>
        )}

        {/* QOLGAN MAQOLALAR */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(post => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl overflow-hidden hover:border-slate-700 transition-all duration-200 flex flex-col">
              <div className="relative h-44 overflow-hidden">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <span className="absolute top-3 left-3 rounded-full bg-slate-950/80 border border-white/10 px-2.5 py-1 text-[9px] font-black text-amber-300 uppercase tracking-widest backdrop-blur-md">
                  {post.category}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(post.date)}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime} daqiqa</span>
                </div>
                <h3 className="mt-2.5 text-sm font-black text-white leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-[11px] text-slate-400 leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
                <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.views}</span>
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post.likes}</span>
                  </span>
                  <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">O'qish →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Yangiliklar katalogi bilan bog'lovchi */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-900 bg-slate-950/60 p-6">
          <p className="text-xs text-slate-400">Maqolada ko'rsatilgan mahsulotlarni katalogdan toping.</p>
          <Link to="/katalog" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 uppercase tracking-widest hover:bg-amber-300 transition-all">
            Katalogga o'tish <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
