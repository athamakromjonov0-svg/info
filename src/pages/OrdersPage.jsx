import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, PackageCheck, PackageX, Clock, Truck, ChevronDown, ShoppingCart, ArrowRight, ReceiptText } from 'lucide-react';
import PageHero from '../components/PageHero';
import { useApp } from '../context/AppContext';

const STATUS_STYLES = {
  'Qabul qilindi': { color: 'text-amber-300 bg-amber-400/10 border-amber-400/20', icon: Clock },
  'Tayyorlanmoqda': { color: 'text-amber-300 bg-amber-400/10 border-amber-400/20', icon: Package },
  "Yo'lda": { color: 'text-amber-300 bg-amber-400/10 border-amber-400/20', icon: Truck },
  'Yetkazildi': { color: 'text-amber-300 bg-amber-400/10 border-amber-400/20', icon: PackageCheck },
  'Bekor qilindi': { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', icon: PackageX },
};

/**
 * BUYURTMALARIM — foydalanuvchining barcha buyurtmalari tarixi.
 */
export default function OrdersPage() {
  const { orders, cancelOrder } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [expanded, setExpanded] = useState(null);

  const allOrders = useMemo(() => Array.isArray(orders) ? orders : [], [orders]);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return allOrders;
    return allOrders.filter(o => o.status === filter);
  }, [allOrders, filter]);

  const stats = useMemo(() => ({
    total: allOrders.length,
    active: allOrders.filter(o => !['Yetkazildi', 'Bekor qilindi'].includes(o.status)).length,
    delivered: allOrders.filter(o => o.status === 'Yetkazildi').length,
    cancelled: allOrders.filter(o => o.status === 'Bekor qilindi').length,
    spent: allOrders.reduce((s, o) => s + (o.total || 0), 0),
  }), [allOrders]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('uz-UZ').format(Math.round(Number(price) || 0)) + " so'm";

  const statuses = ['ALL', ...Object.keys(STATUS_STYLES)];

  const handleCancel = (orderId) => {
    cancelOrder(orderId);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,193,7,0.06),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHero
          badge="Buyurtmalarim"
          title="Buyurtma"
          highlight="tarixi"
          description="Barcha buyurtmalaringizni kuzatib boring: status, to'lov, yetkazib berish ma'lumotlari."
          icon={ReceiptText}
        />

        {/* STATISTIKA */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-5">
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <div className="mt-1 text-[10px] text-slate-500 font-mono uppercase tracking-widest">Jami buyurtma</div>
          </div>
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-5">
            <div className="text-2xl font-black text-amber-400">{stats.active}</div>
            <div className="mt-1 text-[10px] text-slate-500 font-mono uppercase tracking-widest">Faol</div>
          </div>
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-5">
            <div className="text-2xl font-black text-amber-400">{stats.delivered}</div>
            <div className="mt-1 text-[10px] text-slate-500 font-mono uppercase tracking-widest">Yetkazilgan</div>
          </div>
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-5">
            <div className="text-2xl font-black text-white">{formatPrice(stats.spent)}</div>
            <div className="mt-1 text-[10px] text-slate-500 font-mono uppercase tracking-widest">Jami sarflangan</div>
          </div>
        </div>

        {/* STATUS FILTRI */}
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-xl border px-3.5 py-2 text-[11px] font-bold transition-all duration-200 ${
                filter === s
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-glow-sm'
                  : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* BUYURTMALAR RO'YXATI */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-900 bg-slate-950/60 p-16 text-center">
            <Package className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-black text-white">Buyurtmalar topilmadi</h3>
            <p className="text-xs text-slate-500 mt-2">
              {allOrders.length === 0
                ? 'Hozircha hech qanday buyurtma bermagansiz.'
                : 'Bu statusdagi buyurtmalar yo\'q.'}
            </p>
            {allOrders.length === 0 && (
              <button
                onClick={() => navigate('/katalog')}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 uppercase tracking-widest hover:bg-amber-300 transition-colors"
              >
                <ShoppingCart className="h-3.5 w-3.5" /> Xarid qilish
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => {
              const st = STATUS_STYLES[order.status] || STATUS_STYLES['Qabul qilindi'];
              const StatusIcon = st.icon;
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} className="rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl overflow-hidden">
                  {/* Sarlavha */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 text-left hover:bg-slate-900/30 transition-colors"
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${st.color}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-white font-mono">#{order.id}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${st.color}`}>
                          <StatusIcon className="h-3 w-3" /> {order.status}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500 font-mono">
                        {new Date(order.createdAt).toLocaleString('uz-UZ')} • {order.items?.length || 0} ta mahsulot
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-base font-black text-amber-300">{formatPrice(order.total)}</span>
                      <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Batafsil */}
                  {isOpen && (
                    <div className="border-t border-slate-900 p-5 space-y-5">
                      {/* Mahsulotlar */}
                      <div className="space-y-2">                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Mahsulotlar</p>
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 rounded-2xl border border-slate-900 bg-slate-900/40 p-3">
                            <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-cover border border-slate-800" />
                            <div className="flex-1 min-w-0">
                              <Link to={`/product/${item.id}`} className="text-xs font-bold text-white hover:text-amber-300 transition-colors line-clamp-1">
                                {item.name}
                              </Link>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                {item.quantity} x {formatPrice(item.discount ? item.price * (1 - item.discount / 100) : item.price)}
                              </div>
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-300">
                              {formatPrice((item.discount ? item.price * (1 - item.discount / 100) : item.price) * (item.quantity || 1))}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* To'lov va manzil */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-4">
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-2">To'lov</p>
                          <p className="text-xs text-slate-300 capitalize">
                            {order.paymentMethod === 'card' ? 'Plastik karta' :
                             order.paymentMethod === 'cash' ? 'Naqd pul' : String(order.paymentMethod || 'Naqd pul')}
                          </p>
                          <div className="mt-3 space-y-1.5 text-[11px]">
                            <div className="flex justify-between text-slate-500"><span>Mahsulotlar:</span><span className="text-slate-300">{formatPrice(order.subtotal)}</span></div>
                            {order.couponDiscount > 0 && (
                              <div className="flex justify-between text-slate-500"><span>Chegirma:</span><span className="text-amber-300">-{formatPrice(order.couponDiscount)}</span></div>
                            )}
                            <div className="flex justify-between text-slate-500"><span>Yetkazib berish:</span><span className="text-slate-300">{order.deliveryFee ? formatPrice(order.deliveryFee) : 'Bepul'}</span></div>
                            <div className="flex justify-between pt-1.5 border-t border-slate-800"><span className="font-bold text-white">Jami:</span><span className="font-black text-amber-300">{formatPrice(order.total)}</span></div>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-4">
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-2">Yetkazib berish</p>
                          {order.address ? (
                            <>
                              <p className="text-xs text-slate-300 font-bold">{order.address.name || 'Qabul qiluvchi'}</p>
                              <p className="text-[11px] text-slate-500 mt-1">
                                {[order.address.region, order.address.city, order.address.street, order.address.house].filter(Boolean).join(', ')}
                              </p>
                              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{order.address.phone}</p>
                            </>
                          ) : (
                            <p className="text-xs text-slate-500">Manzil ko'rsatilmagan</p>
                          )}
                          {order.notes && (
                            <p className="text-[10px] text-slate-500 italic mt-2">"{order.notes}"</p>
                          )}
                        </div>
                      </div>

                      {/* Amallar */}
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          to="/katalog"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2 text-[11px] font-bold text-slate-300 hover:text-white transition-colors"
                        >
                          <ArrowRight className="h-3.5 w-3.5" /> Qayta xarid qilish
                        </Link>
                        {!['Yetkazildi', 'Bekor qilindi'].includes(order.status) && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2 text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <PackageX className="h-3.5 w-3.5" /> Bekor qilish
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
