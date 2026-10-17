import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Mail, 
  LogOut, 
  ShieldCheck, 
  ShoppingBag, 
  Heart, 
  Settings,
  ChevronRight,
  Package,
  CreditCard,
  MapPin,
  Bell,
  Users,
  Trash2,
  Plus,
  Check,
  Star,
  Wallet,
  BellRing,
  BellOff,
  Megaphone,
  Sparkles,
  Truck,
  Tag,
  X,
  Save,
  Globe,
  Coins,
  Eye,
  EyeOff,
  Phone,
  Home,
  Building2,
  StickyNote
} from 'lucide-react';

export default function UserProfilePage() {
  const { 
    siteUser, 
    siteLogout, 
    orders, 
    wishlist, 
    addresses, 
    deleteAddress, 
    setDefaultAddress,
    addAddress,
    savedCards,
    addCard,
    deleteCard,
    setDefaultCard,
    notifications,
    notificationSettings,
    updateNotificationSettings,
    settings,
    updateSettings,
    bonusPoints,
    showToast
  } = useApp();
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get('tab') || 'overview';

  // Manzil qo'shish formasi
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '',
    region: '',
    city: '',
    street: '',
    house: '',
    phone: '',
    comment: '',
    isDefault: false,
  });

  // Karta qo'shish formasi
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    isDefault: false,
  });
  const [showCvv, setShowCvv] = useState(false);

  const handleLogout = async () => {
    await siteLogout();
    navigate('/');
  };

  const setActiveSection = (tab) => {
    setSearchParams({ tab });
  };

  const formatPrice = (price) => {
    const n = Number(price);
    if (!Number.isFinite(n) || n <= 0) return '';
    return new Intl.NumberFormat('uz-UZ').format(Math.round(n)) + " so'm";
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.region || !addressForm.city || !addressForm.street || !addressForm.phone) {
      showToast("Iltimos, barcha majburiy maydonlarni to'ldiring!", "error");
      return;
    }
    addAddress(addressForm);
    setAddressForm({ name: '', region: '', city: '', street: '', house: '', phone: '', comment: '', isDefault: false });
    setShowAddressForm(false);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (cardForm.cardNumber.replace(/\s/g, '').length !== 16) {
      showToast("Karta raqami 16 xonali bo'lishi kerak!", "error");
      return;
    }
    if (!cardForm.cardHolder) {
      showToast("Karta egasi ismini kiriting!", "error");
      return;
    }
    if (cardForm.expiry.length !== 5) {
      showToast("Amal qilish muddatini to'g'ri kiriting (MM/YY)!", "error");
      return;
    }
    addCard({
      ...cardForm,
      cardNumber: cardForm.cardNumber.replace(/\s/g, ''),
      last4: cardForm.cardNumber.replace(/\s/g, '').slice(-4),
    });
    setCardForm({ cardNumber: '', cardHolder: '', expiry: '', cvv: '', isDefault: false });
    setShowCardForm(false);
  };

  const menuItems = [
    { icon: Package, label: 'Buyurtmalarim', desc: 'Barcha buyurtmalar tarixi', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', tab: 'orders' },
    { icon: Heart, label: 'Sevimlilarim', desc: 'Saqlangan mahsulotlar', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', tab: 'wishlist' },
    { icon: CreditCard, label: 'To\'lov usullari', desc: 'Karta va boshqa usullar', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', tab: 'payments' },
    { icon: MapPin, label: 'Yetkazib berish manzili', desc: 'Manzilni boshqarish', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', tab: 'addresses' },
    { icon: Bell, label: 'Bildirishnomalar', desc: 'Ogohlantirish sozlamalari', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', tab: 'notifications' },
    { icon: Settings, label: 'Sozlamalar', desc: 'Hisob parametrlari', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', tab: 'settings' },
  ];

  const notificationOptions = [
    { key: 'orderUpdates', label: 'Buyurtma holati', desc: 'Buyurtmalaringiz holati haqida xabarlar', icon: Package },
    { key: 'promotions', label: 'Aksiyalar', desc: 'Yangi aksiya va chegirmalar', icon: Megaphone },
    { key: 'newArrivals', label: 'Yangi mahsulotlar', desc: 'Katalogga qo\'shilgan yangi mahsulotlar', icon: Sparkles },
    { key: 'priceDrops', label: 'Narx pasayishi', desc: 'Sevimli mahsulotlar narxi tushganda', icon: Tag },
  ];

  const settingsOptions = [
    { key: 'notifications', label: 'Bildirishnomalar', desc: 'Umumiy bildirishnomalar', icon: Bell },
    { key: 'autoSave', label: 'Avtomatik saqlash', desc: 'Ma\'lumotlarni avtomatik saqlash', icon: Save },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 font-sans select-none relative overflow-hidden">
      {/* ORQA FON */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1914_1px,transparent_1px),linear-gradient(to_bottom,#1c1914_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* SARIQ */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase">
              Shaxsiy <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">kabinet</span>
            </h1>
            <p className="mt-1 text-xs text-slate-500 font-mono uppercase tracking-widest">
Shaxsiy boshqaruv paneli
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-amber-300 hover:bg-amber-400/5 hover:border-amber-400/30 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" /> Chiqish
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* CHAP - PROFIL KARTASI */}
          <div className="lg:col-span-1 space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-slate-900 bg-slate-950/50 backdrop-blur-xl p-6 text-center shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
              <div className="absolute -top-10 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />

              <div className="relative">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 animate-pulse" />
                  {siteUser?.photoURL ? (
                    <img 
                      src={siteUser.photoURL} 
                      alt={siteUser.name}
                      className="relative w-22 h-22 m-1 rounded-full object-cover border-4 border-slate-950"
                      style={{ width: '88px', height: '88px' }}
                    />
                  ) : (
                    <div className="relative mx-auto w-full h-full rounded-full border-4 border-slate-950 bg-slate-900 flex items-center justify-center">
                      <User className="h-10 w-10 text-amber-400" />
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-amber-400 border-2 border-slate-950 flex items-center justify-center">
                    <span className="block h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                  </div>
                </div>

                <h2 className="mt-4 text-lg font-black text-white">
                  {siteUser?.name || 'Foydalanuvchi'}
                </h2>
                <p className="mt-1 text-xs text-slate-500 flex items-center justify-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {siteUser?.email}
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 px-3 py-1 text-[9px] font-mono font-bold text-amber-300 uppercase tracking-widest">
                  <ShieldCheck className="h-3 w-3" /> Premium Foydalanuvchi
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-900 bg-slate-950/50 backdrop-blur-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                  Statistikalar
                </h3>
                <Users className="h-4 w-4 text-slate-600" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center rounded-2xl border border-slate-900 bg-slate-900/40 p-3">
                  <div className="text-2xl font-black text-amber-300">{orders.length}</div>
                  <div className="mt-1 text-[9px] text-slate-500 font-mono uppercase tracking-wider">Buyurtmalar</div>
                </div>
                <div className="text-center rounded-2xl border border-slate-900 bg-slate-900/40 p-3">
                  <div className="text-2xl font-black text-amber-300">{wishlist.length}</div>
                  <div className="mt-1 text-[9px] text-slate-500 font-mono uppercase tracking-wider">Sevimlilar</div>
                </div>
                <div className="text-center rounded-2xl border border-slate-900 bg-slate-900/40 p-3">
                  <div className="text-2xl font-black text-amber-400">{bonusPoints}</div>
                  <div className="mt-1 text-[9px] text-slate-500 font-mono uppercase tracking-wider">Bonus ball</div>
                </div>
              </div>
            </div>

            {/* Bonus ballar kartasi */}
            <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent backdrop-blur-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">Bonus ballar</h3>
                  <p className="text-[10px] text-slate-500">Har 10,000 so'm = 1 ball</p>
                </div>
              </div>
              <div className="text-3xl font-black text-amber-400">{bonusPoints} <span className="text-sm text-slate-500">ball</span></div>
              <p className="mt-2 text-[10px] text-slate-500 leading-relaxed">
                Ballarni keyingi xaridlarda chegirma sifatida ishlatishingiz mumkin.
              </p>
            </div>
          </div>

          {/* O'NG - MENYU RO'YXATI */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl border border-slate-900 bg-slate-950/50 backdrop-blur-xl p-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-5">
                Boshqaruv menyusi
              </h3>

              <div className="grid sm:grid-cols-2 gap-3">
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSection(item.tab)}
                    className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200 ${
                      activeSection === item.tab
                        ? 'border-slate-700 bg-slate-900/60'
                        : 'border-slate-900 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.bg} ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="mt-0.5 text-[10px] text-slate-500 truncate">{item.desc}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-700 group-hover:text-slate-400 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-900 bg-slate-950/50 backdrop-blur-xl p-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-5">
                {activeSection === 'orders' ? 'Buyurtmalarim' : 
                 activeSection === 'wishlist' ? 'Sevimlilarim' : 
                 activeSection === 'addresses' ? 'Yetkazib berish manzillari' :
                 activeSection === 'payments' ? "To'lov usullari" :
                 activeSection === 'notifications' ? 'Bildirishnomalar' :
                 activeSection === 'settings' ? 'Sozlamalar' :
                 'Mening dashboardim'}
              </h3>

              {activeSection === 'orders' ? (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 text-center text-slate-400">
                      Sizda hozircha buyurtmalar yo'q.
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="rounded-3xl border border-slate-900 bg-slate-900/50 p-4">
                        <div className="flex items-center justify-between mb-3 gap-4">
                          <div>
                            <div className="text-xs uppercase tracking-widest text-slate-500">#{order.id}</div>
                            <div className="text-sm font-semibold text-white">{new Date(order.createdAt).toLocaleString('uz-UZ')}</div>
                          </div>
                          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">{order.status}</div>
                        </div>
                        <div className="grid gap-2">
                          {order.items?.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="h-12 w-12 rounded-2xl object-cover border border-slate-800" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-white line-clamp-1">{item.name}</div>
                                <div className="text-[10px] text-slate-500">{item.quantity} x {formatPrice(item.discount ? item.price * (1 - item.discount / 100) : item.price)}</div>
                              </div>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <div className="text-[10px] text-slate-500">+{order.items.length - 3} ta qo'shimcha mahsulot</div>
                          )}
                          <div className="border-t border-slate-900 pt-3 flex items-center justify-between text-sm text-slate-400">
                            <span>Jami:</span>
                            <span className="font-bold text-white">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : activeSection === 'wishlist' ? (
                <div className="space-y-4">
                  {wishlist.length === 0 ? (
                    <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 text-center text-slate-400">
                      Sevimli mahsulotlaringiz hali yo'q.
                    </div>
                  ) : (
                    wishlist.map((product) => (
                      <div key={product._id || product.id} className="flex items-center gap-4 rounded-3xl border border-slate-900 bg-slate-900/50 p-4">
                        <img src={product.image} alt={product.name || product.title} className="h-16 w-16 rounded-2xl object-cover border border-slate-800" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white line-clamp-1">{product.name || product.title}</div>
                          <div className="text-[10px] text-slate-500">{product.category || "Noma'lum kategoriya"}</div>
                        </div>
                        <div className="text-sm font-bold text-amber-300">{formatPrice(product.price)}</div>
                      </div>
                    ))
                  )}
                </div>
              ) : activeSection === 'addresses' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                      {addresses.length} ta manzil
                    </p>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-2 text-[10px] font-black text-slate-950 uppercase tracking-widest hover:bg-amber-300 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" /> Yangi manzil
                    </button>
                  </div>

                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Ism *</label>
                          <input
                            type="text"
                            value={addressForm.name}
                            onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                            placeholder="Qabul qiluvchi ismi"
                            className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Telefon *</label>
                          <input
                            type="tel"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            placeholder="+998 90 123 45 67"
                            className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Viloyat *</label>
                          <input
                            type="text"
                            value={addressForm.region}
                            onChange={(e) => setAddressForm({ ...addressForm, region: e.target.value })}
                            placeholder="Toshkent shahri"
                            className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Shahar *</label>
                          <input
                            type="text"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            placeholder="Chilonzor tumani"
                            className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Ko'cha *</label>
                          <input
                            type="text"
                            value={addressForm.street}
                            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                            placeholder="Amir Temur ko'chasi"
                            className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Uy *</label>
                          <input
                            type="text"
                            value={addressForm.house}
                            onChange={(e) => setAddressForm({ ...addressForm, house: e.target.value })}
                            placeholder="12-uy, 5-xonadon"
                            className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Izoh (ixtiyoriy)</label>
                        <textarea
                          value={addressForm.comment}
                          onChange={(e) => setAddressForm({ ...addressForm, comment: e.target.value })}
                          placeholder="Mo'ljal, kirish kodi va h.k."
                          rows="2"
                          className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30 resize-none"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-amber-500/20"
                          />
                          <span className="text-[10px] text-slate-400 font-bold">Asosiy manzil qilish</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="px-4 py-2 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
                          >
                            Bekor qilish
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-amber-400 text-[10px] font-black text-slate-950 uppercase tracking-widest hover:bg-amber-300 transition-colors"
                          >
                            Saqlash
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {addresses.length === 0 && !showAddressForm ? (
                    <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 text-center text-slate-400">
                      Hozircha manzillar yo'q. "Yangi manzil" tugmasi orqali qo'shing.
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <div key={addr.id} className={`rounded-3xl border p-4 ${
                        addr.isDefault ? 'border-amber-400/40 bg-amber-400/5' : 'border-slate-900 bg-slate-900/50'
                      }`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{addr.name}</span>
                              {addr.isDefault && (
                                <span className="text-[9px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">ASOSIY</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              {addr.region}, {addr.city}, {addr.street} {addr.house}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 font-mono">{addr.phone}</p>
                            {addr.comment && (
                              <p className="text-[10px] text-slate-500 mt-1 italic">{addr.comment}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {!addr.isDefault && (
                              <button
                                onClick={() => setDefaultAddress(addr.id)}
                                className="text-[10px] font-bold text-slate-400 hover:text-amber-300 transition-colors"
                              >
                                Asosiy qilish
                              </button>
                            )}
                            <button
                              onClick={() => deleteAddress(addr.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : activeSection === 'payments' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                      {savedCards.length} ta karta
                    </p>
                    <button
                      onClick={() => setShowCardForm(!showCardForm)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-2 text-[10px] font-black text-slate-950 uppercase tracking-widest shadow-glow-sm hover:from-amber-300 hover:to-yellow-400 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" /> Yangi karta
                    </button>
                  </div>

                  {showCardForm && (
                    <form onSubmit={handleAddCard} className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-5 space-y-3">
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Karta raqami *</label>
                        <input
                          type="text"
                          value={cardForm.cardNumber}
                          onChange={(e) => setCardForm({ ...cardForm, cardNumber: formatCardNumber(e.target.value) })}
                          placeholder="8600 0000 0000 0000"
                          className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/40 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Karta egasi *</label>
                        <input
                          type="text"
                          value={cardForm.cardHolder}
                          onChange={(e) => setCardForm({ ...cardForm, cardHolder: e.target.value.toUpperCase() })}
                          placeholder="ISKANDAROV AZIZ"
                          className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/40 font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Amal qilish muddati *</label>
                          <input
                            type="text"
                            value={cardForm.expiry}
                            onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
                            placeholder="MM/YY"
                            className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/40 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">CVV</label>
                          <div className="relative mt-1">
                            <input
                              type={showCvv ? 'text' : 'password'}
                              value={cardForm.cvv}
                              onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                              placeholder="***"
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/40 font-mono pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCvv(!showCvv)}
                              className="absolute right-3 top-2 text-slate-500 hover:text-white transition-colors"
                            >
                              {showCvv ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cardForm.isDefault}
                            onChange={(e) => setCardForm({ ...cardForm, isDefault: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-amber-400/20"
                          />
                          <span className="text-[10px] text-slate-400 font-bold">Asosiy karta qilish</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowCardForm(false)}
                            className="px-4 py-2 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
                          >
                            Bekor qilish
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-[10px] font-black text-slate-950 uppercase tracking-widest shadow-glow-sm hover:from-amber-300 hover:to-yellow-400 transition-colors"
                          >
                            Saqlash
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {savedCards.length === 0 && !showCardForm ? (
                    <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 text-center text-slate-400">
                      Hozircha kartalar yo'q. "Yangi karta" tugmasi orqali qo'shing.
                    </div>
                  ) : (
                    savedCards.map((card) => (
                      <div key={card.id} className={`rounded-3xl border p-4 ${
                        card.isDefault ? 'border-amber-400/40 bg-amber-400/5' : 'border-slate-900 bg-slate-900/50'
                      }`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border border-amber-400/30">
                              <CreditCard className="h-6 w-6 text-amber-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white font-mono">
                                  •••• •••• •••• {card.last4}
                                </span>
                                {card.isDefault && (
                                  <span className="text-[9px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">ASOSIY</span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">{card.cardHolder}</div>
                              <div className="text-[10px] text-slate-600 font-mono">Amal qilish: {card.expiry}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {!card.isDefault && (
                              <button
                                onClick={() => setDefaultCard(card.id)}
                                className="text-[10px] font-bold text-slate-400 hover:text-amber-300 transition-colors"
                              >
                                Asosiy qilish
                              </button>
                            )}
                            <button
                              onClick={() => deleteCard(card.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : activeSection === 'notifications' ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                        <BellRing className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Bildirishnoma sozlamalari</h4>
                        <p className="text-[10px] text-slate-500">Qaysi xabarlarni olishni tanlang</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {notificationOptions.map(({ key, label, desc, icon: Icon }) => (
                        <div key={key} className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/50 p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">{label}</div>
                              <div className="text-[10px] text-slate-500">{desc}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => updateNotificationSettings({ [key]: !notificationSettings[key] })}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                              notificationSettings[key] ? 'bg-amber-400' : 'bg-slate-800'
                            }`}
                          >
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                              notificationSettings[key] ? 'left-[22px]' : 'left-0.5'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-500/10 border border-slate-500/20 text-slate-400">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">So'nggi bildirishnomalar</h4>
                        <p className="text-[10px] text-slate-500">{notifications.length} ta xabar</p>
                      </div>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="text-center text-slate-500 text-xs py-6">
                        Hozircha bildirishnomalar yo'q.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                        {notifications.slice(0, 10).map((notif) => (
                          <div key={notif.id} className={`flex items-start gap-3 rounded-xl border border-slate-900 bg-slate-950/50 p-3 ${
                            notif.read ? 'opacity-50' : ''
                          }`}>
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                              notif.type === 'success' ? 'bg-amber-400/10 border-amber-400/20 text-amber-300' :
                              notif.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                              notif.type === 'warning' ? 'bg-amber-400/10 border-amber-400/20 text-amber-300' :
                              'bg-amber-400/10 border-amber-400/20 text-amber-300'
                            }`}>
                              <Bell className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                              <p className="text-[9px] text-slate-600 font-mono mt-1">
                                {new Date(notif.time).toLocaleString('uz-UZ')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : activeSection === 'settings' ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-500/10 border border-slate-500/20 text-slate-400">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Hisob sozlamalari</h4>
                        <p className="text-[10px] text-slate-500">Sayt parametrlarini boshqaring</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {settingsOptions.map(({ key, label, desc, icon: Icon }) => (
                        <div key={key} className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/50 p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">{label}</div>
                              <div className="text-[10px] text-slate-500">{desc}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => updateSettings({ [key]: !settings[key] })}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                              settings[key] ? 'bg-amber-400' : 'bg-slate-800'
                            }`}
                          >
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                              settings[key] ? 'left-[22px]' : 'left-0.5'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Til va valyuta</h4>
                        <p className="text-[10px] text-slate-500">Sayt tilini va valyutani tanlang</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Til</label>
                        <select
                          value={settings.language || 'uz'}
                          onChange={(e) => updateSettings({ language: e.target.value })}
                          className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400/40"
                        >
                          <option value="uz">O'zbekcha</option>
                          <option value="ru">Русский</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Valyuta</label>
                        <select
                          value={settings.currency || 'UZS'}
                          onChange={(e) => updateSettings({ currency: e.target.value })}
                          className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400/40"
                        >
                          <option value="UZS">UZS — so'm</option>
                          <option value="USD">USD — dollar</option>
                          <option value="RUB">RUB — rubl</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Xavfsizlik</h4>
                        <p className="text-[10px] text-slate-500">Hisobingiz xavfsizligi</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/50 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                          <Check className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Google orqali kirish</div>
                          <div className="text-[10px] text-slate-500">{siteUser?.email}</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">FAOL</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-6 text-slate-400">
                  Tanlovlangan bo'limni menyudan tanlang: Buyurtmalarim, Sevimlilarim, To'lov usullari, Manzillar, Bildirishnomalar yoki Sozlamalar.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/5 to-transparent backdrop-blur-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Premium a'zolik dasturi
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Har bir xaridda bonus ballar yig'ing, maxsus chegirmalardan foydalaning va
                    shaxsiy menejer bilan bepul maslahat oling.
                  </p>
                  <Link
                    to="/bonus-dasturi"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2 text-[10px] font-black text-slate-950 uppercase tracking-widest shadow-glow-sm hover:from-amber-300 hover:to-yellow-400 transition-colors"
                  >
                    Batafsil ma'lumot
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}