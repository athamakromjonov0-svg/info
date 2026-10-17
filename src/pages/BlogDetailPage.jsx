import { useMemo, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Eye, Heart, Tag, ChevronRight, Home, Newspaper } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * BLOG MAQOLA — alohida maqola sahifasi.
 * Maqolalar admin paneldan boshqariladi (useBlog context).
 */
export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogPosts, incrementBlogViews, toggleBlogLike } = useApp();

  const posts = useMemo(() => Array.isArray(blogPosts) ? blogPosts : [], [blogPosts]);
  const post = useMemo(() => posts.find(p => String(p.id) === String(id)), [posts, id]);

  // Ko'rish sonini oshirish (har safar ochilganda)
  useEffect(() => {
    if (post) incrementBlogViews(post.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatDate = (d) => new Date(d).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });

  if (!post) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="h-12 w-12 text-slate-700 mx-auto mb-4" />
          <h2 className="text-lg font-black text-white">Maqola topilmadi</h2>
          <button onClick={() => navigate('/blog')} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 uppercase tracking-widest hover:bg-amber-300 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Blogga qaytish
          </button>
        </div>
      </div>
    );
  }

  const content = Array.isArray(post.content) ? post.content : String(post.content || '').split('\n').filter(Boolean);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,193,7,0.05),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <Link to="/" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
            <Home className="h-3 w-3" /> Bosh sahifa
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-700" />
          <Link to="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
          <ChevronRight className="h-3 w-3 text-slate-700" />
          <span className="text-slate-400 truncate max-w-[200px]">{post.category}</span>
        </nav>

        {/* Maqola */}
        <article className="rounded-[2rem] border border-slate-900 bg-slate-950/60 backdrop-blur-xl overflow-hidden">
          <div className="relative h-64 sm:h-96">
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-300">
                <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 font-black text-slate-950 uppercase tracking-widest">
                  <Tag className="h-3 w-3" /> {post.category}
                </span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(post.date)}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime} daqiqa</span>
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">{post.title}</h1>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-900 text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xs">
                  {(post.author || 'GD').split(' ').map(w => w[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="font-bold text-white">{post.author || 'Grand Decor'}</p>
                  <p className="text-[10px] font-mono text-slate-600">Muallif</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> {post.views}</span>
                <button onClick={() => toggleBlogLike(post.id)} className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
                  <Heart className={`h-3.5 w-3.5 ${post.likes > 0 ? 'text-amber-400 fill-amber-400' : ''}`} /> {post.likes}
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {content.map((para, i) => (
                <p key={i} className={`text-sm leading-relaxed text-slate-300 ${i === 0 ? 'text-base font-medium text-white/90 first-letter:text-3xl first-letter:font-black first-letter:text-amber-400' : ''}`}>
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-900">
              <button onClick={() => navigate('/blog')} className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2.5 text-[11px] font-bold text-slate-300 hover:text-white transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Barcha maqolalar
              </button>
              <Link to="/katalog" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-[11px] font-black text-slate-950 uppercase tracking-widest hover:bg-amber-300 transition-colors">
                Katalogga o'tish
              </Link>
            </div>
          </div>
        </article>

        {/* Boshqa maqolalar */}
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Boshqa maqolalar</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {posts.filter(p => String(p.id) !== String(post.id)).slice(0, 3).map(other => (
              <Link key={other.id} to={`/blog/${other.id}`} className="group rounded-2xl border border-slate-900 bg-slate-950/60 overflow-hidden hover:border-slate-700 transition-all">
                <div className="h-28 overflow-hidden">
                  <img src={other.image} alt={other.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-mono text-slate-600">{other.category} • {other.readTime} daqiqa</p>
                  <h4 className="mt-1 text-xs font-black text-white line-clamp-2 group-hover:text-amber-300 transition-colors">{other.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
