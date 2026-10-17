import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white relative overflow-hidden">
      {/* Orqa fon */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,193,7,0.06),transparent_45%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* Yuqori panel */}
        <div className="pt-10 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-300 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Bosh sahifaga qaytish
          </Link>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30">
              <Heart className="h-6 w-6 text-amber-400" />
            </div>
            Sevimlilar
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-light">
            {wishlist.length > 0 ? `${wishlist.length} ta hashamatli mahsulot sevimlilarda saqlangan` : "Sevimlilar ro'yxati bo'sh"}
          </p>
        </div>

      {/* Sevimlilar */}
      {wishlist.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-amber-400/20 rounded-3xl bg-slate-900/20 max-w-2xl mx-auto flex flex-col items-center p-10">
          <div className="p-5 bg-slate-950 rounded-2xl border border-amber-400/20 mb-5">
            <Heart className="h-8 w-8 text-amber-400/60" />
          </div>
          <h3 className="font-serif text-lg font-bold text-white">Sevimlilar bo'sh</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm leading-relaxed font-light">
            Sevimli mahsulotlaringizga yurakcha belgisi bilan qo'shishingiz mumkin. Ularni bu yerda topasiz.
          </p>
          <Link
            to="/katalog"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 text-sm font-bold text-slate-950 hover:shadow-lg hover:shadow-amber-500/25 transition-all"
          >
            Katalogga o'tish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}