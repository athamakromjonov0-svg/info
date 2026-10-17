import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ORDERS_KEYS = {
  orders: 'vortex_orders',
  addresses: 'vortex_addresses',
  cards: 'vortex_cards',
  coupons: 'vortex_coupons',
  appliedCoupon: 'vortex_applied_coupon',
  bonusPoints: 'vortex_bonus_points',
  payment: 'vortex_payment',
  selectedZone: 'vortex_selected_zone',
  deliveryZones: 'vortex_delivery_zones',
  users: 'vortex_admin_users',
  activityLog: 'vortex_activity_log',
};

const DEFAULT_ADMIN_USERS = [
  { id: 'USR-001', name: 'Alisher Karimov', email: 'alisher@example.com', role: 'admin', status: 'active', joined: '2024-01-15', orders: 12, spent: 2450000 },
  { id: 'USR-002', name: 'Malika Tosheva', email: 'malika@example.com', role: 'user', status: 'active', joined: '2024-02-20', orders: 8, spent: 1890000 },
  { id: 'USR-003', name: 'Jasurbek Rahimov', email: 'jasur@example.com', role: 'user', status: 'blocked', joined: '2024-03-10', orders: 3, spent: 450000 },
  { id: 'USR-004', name: 'Dilnoza Aliyeva', email: 'dilnoza@example.com', role: 'user', status: 'active', joined: '2024-04-05', orders: 15, spent: 3200000 },
  { id: 'USR-005', name: 'Sarvar Usmonov', email: 'sarvar@example.com', role: 'moderator', status: 'active', joined: '2024-05-18', orders: 6, spent: 980000 },
];

const DEFAULT_ACTIVITIES = [
  { id: 'ACT-001', action: 'Mahsulot qo\'shildi', user: 'Alisher Karimov', time: '2 daqiqa oldin', type: 'product', icon: 'Plus' },
  { id: 'ACT-002', action: 'Buyurtma #ORD-1234 yangilandi', user: 'Malika Tosheva', time: '5 daqiqa oldin', type: 'order', icon: 'RefreshCcw' },
  { id: 'ACT-003', action: 'Yangi kategoriya yaratildi', user: 'Alisher Karimov', time: '10 daqiqa oldin', type: 'category', icon: 'FolderPlus' },
  { id: 'ACT-004', action: 'Kupon SUMMER20 faollashtirildi', user: 'Sarvar Usmonov', time: '15 daqiqa oldin', type: 'coupon', icon: 'Percent' },
  { id: 'ACT-005', action: 'Foydalanuvchi bloklandi', user: 'Alisher Karimov', time: '1 soat oldin', type: 'user', icon: 'Ban' },
  { id: 'ACT-006', action: 'Sevimlilar ro\'yxati tozalandi', user: 'Dilnoza Aliyeva', time: '2 soat oldin', type: 'wishlist', icon: 'Trash2' },
];

const DEFAULT_DELIVERY_ZONES = [
  { id: 'zone-1', name: "Toshkent shahri", price: 20000, days: '1-2 kun', freeFrom: 1000000 },
  { id: 'zone-2', name: "Toshkent viloyati", price: 25000, days: '2-3 kun', freeFrom: 1000000 },
  { id: 'zone-3', name: "Samarqand", price: 30000, days: '2-4 kun', freeFrom: 1500000 },
  { id: 'zone-4', name: "Buxoro", price: 35000, days: '3-5 kun', freeFrom: 1500000 },
  { id: 'zone-5', name: "Farg'ona vodiysi", price: 30000, days: '2-4 kun', freeFrom: 1500000 },
  { id: 'zone-6', name: "Qoraqalpog'iston", price: 40000, days: '4-6 kun', freeFrom: 2000000 },
  { id: 'zone-7', name: "Boshqa viloyatlar", price: 35000, days: '3-5 kun', freeFrom: 1500000 },
];

const DEFAULT_COUPONS = [
  { code: 'WELCOME10', discount: 10, minSpend: 500000, active: true },
  { code: 'SUMMER20', discount: 20, minSpend: 1000000, active: true },
  { code: 'NEWYEAR30', discount: 30, minSpend: 2000000, active: true },
];

const useOrders = (showToast) => {
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.orders)) || []; }
    catch { return []; }
  });

  const [deliveryZones, setDeliveryZones] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.deliveryZones)) || DEFAULT_DELIVERY_ZONES; }
    catch { return DEFAULT_DELIVERY_ZONES; }
  });

  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState(() => {
    return localStorage.getItem(ORDERS_KEYS.selectedZone) || 'zone-1';
  });

  const [addresses, setAddresses] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.addresses)) || []; }
    catch { return []; }
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    return localStorage.getItem(ORDERS_KEYS.payment) || 'cash';
  });

  const [savedCards, setSavedCards] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.cards)) || []; }
    catch { return []; }
  });

  const [coupons, setCoupons] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.coupons)) || DEFAULT_COUPONS; }
    catch { return DEFAULT_COUPONS; }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.appliedCoupon)) || null; }
    catch { return null; }
  });

  const [bonusPoints, setBonusPoints] = useState(() => {
    return Number(localStorage.getItem(ORDERS_KEYS.bonusPoints)) || 0;
  });

  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.users)) || DEFAULT_ADMIN_USERS; }
    catch { return DEFAULT_ADMIN_USERS; }
  });

  const [activityLog, setActivityLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.activityLog)) || DEFAULT_ACTIVITIES; }
    catch { return DEFAULT_ACTIVITIES; }
  });

  // REAL VAQT: yangi buyurtmalarni aniqlash uchun ma'lum ID'lar xotirasi
  const knownOrderIds = useRef(new Set(orders.map(o => o.id)));

  useEffect(() => {
    localStorage.setItem(ORDERS_KEYS.orders, JSON.stringify(orders));
    knownOrderIds.current = new Set(orders.map(o => o.id));
  }, [orders]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.addresses, JSON.stringify(addresses)); }, [addresses]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.cards, JSON.stringify(savedCards)); }, [savedCards]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.coupons, JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.appliedCoupon, JSON.stringify(appliedCoupon)); }, [appliedCoupon]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.bonusPoints, String(bonusPoints)); }, [bonusPoints]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.payment, paymentMethod); }, [paymentMethod]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.selectedZone, selectedDeliveryZone); }, [selectedDeliveryZone]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.deliveryZones, JSON.stringify(deliveryZones)); }, [deliveryZones]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.users, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.activityLog, JSON.stringify(activityLog)); }, [activityLog]);

  // Backend bilan sinxronizatsiya
  const syncWithBackend = useCallback(async () => {
    try {
      const [ordersRes, zonesRes, couponsRes, usersRes] = await Promise.allSettled([
        axios.get(`${BASE}/api/orders`, { timeout: 3000 }),
        axios.get(`${BASE}/api/delivery-zones`, { timeout: 3000 }),
        axios.get(`${BASE}/api/coupons`, { timeout: 3000 }),
        axios.get(`${BASE}/api/auth/users`, { timeout: 3000 }),
      ]);

      if (ordersRes.status === 'fulfilled') {
        const data = ordersRes.value.data;
        const arr = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        if (arr.length > 0) setOrders(arr);
      }
      if (zonesRes.status === 'fulfilled') {
        const data = zonesRes.value.data;
        const arr = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        if (arr.length > 0) setDeliveryZones(arr);
      }
      if (couponsRes.status === 'fulfilled') {
        const data = couponsRes.value.data;
        const arr = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        if (arr.length > 0) setCoupons(arr);
      }
      if (usersRes.status === 'fulfilled') {
        const data = usersRes.value.data;
        const arr = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        if (arr.length > 0) setUsers(arr);
      }
    } catch {
      // lokal zaxira davom etadi
    }
  }, []);

  // REAL VAQT: backend bilan davriy sinxronizatsiya (buyurtmalar, zonalar, kuponlar, foydalanuvchilar)
  // PERFORMANCE: sahifa ko'rinmas bo'lsa polling to'xtatiladi
  useEffect(() => {
    const t = setTimeout(syncWithBackend, 0);
    const interval = setInterval(() => {
      if (navigator.onLine && document.visibilityState === 'visible') syncWithBackend();
    }, 15000);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, [syncWithBackend]);

  // REAL VAQT: boshqa oynalardagi barcha o'zgarishlarni darhol qabul qilish
  useEffect(() => {
    const syncFromStorage = (e) => {
      const { key, newValue } = e;

      if (key === ORDERS_KEYS.orders) {
        if (newValue === null) { setOrders([]); knownOrderIds.current = new Set(); return; }
        try {
          const parsed = JSON.parse(newValue);
          if (Array.isArray(parsed)) {
            // Yangi buyurtma kelganda adminni darhol xabardor qilamiz
            const newOnes = parsed.filter(o => !knownOrderIds.current.has(o.id));
            if (newOnes.length > 0 && knownOrderIds.current.size > 0) {
              showToast(`${newOnes.length} ta yangi buyurtma qabul qilindi!`, 'success');
            }
            knownOrderIds.current = new Set(parsed.map(o => o.id));
            setOrders(parsed);
          }
        } catch { /* ignore */ }
        return;
      }
      if (key === ORDERS_KEYS.coupons) {
        if (newValue === null) { setCoupons([]); return; }
        try { const parsed = JSON.parse(newValue); if (Array.isArray(parsed)) setCoupons(parsed); } catch { /* ignore */ }
        return;
      }
      if (key === ORDERS_KEYS.deliveryZones) {
        if (newValue === null) { setDeliveryZones([]); return; }
        try { const parsed = JSON.parse(newValue); if (Array.isArray(parsed)) setDeliveryZones(parsed); } catch { /* ignore */ }
        return;
      }
      if (key === ORDERS_KEYS.users) {
        if (newValue === null) { setUsers([]); return; }
        try { const parsed = JSON.parse(newValue); if (Array.isArray(parsed)) setUsers(parsed); } catch { /* ignore */ }
        return;
      }
      if (key === ORDERS_KEYS.activityLog) {
        if (newValue === null) { setActivityLog([]); return; }
        try { const parsed = JSON.parse(newValue); if (Array.isArray(parsed)) setActivityLog(parsed); } catch { /* ignore */ }
        return;
      }
      if (key === ORDERS_KEYS.appliedCoupon) {
        try { setAppliedCoupon(newValue ? JSON.parse(newValue) : null); } catch { setAppliedCoupon(null); }
        return;
      }
      if (key === ORDERS_KEYS.bonusPoints) {
        setBonusPoints(Number(newValue) || 0);
        return;
      }
      if (key === ORDERS_KEYS.payment && newValue) {
        setPaymentMethod(newValue);
        return;
      }
      if (key === ORDERS_KEYS.selectedZone && newValue) {
        setSelectedDeliveryZone(newValue);
        return;
      }
      if (key === ORDERS_KEYS.addresses) {
        if (newValue === null) { setAddresses([]); return; }
        try { const parsed = JSON.parse(newValue); if (Array.isArray(parsed)) setAddresses(parsed); } catch { /* ignore */ }
        return;
      }
      if (key === ORDERS_KEYS.cards) {
        if (newValue === null) { setSavedCards([]); return; }
        try { const parsed = JSON.parse(newValue); if (Array.isArray(parsed)) setSavedCards(parsed); } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, [showToast]);

  const createOrder = useCallback((cartItems, orderInfo = {}) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return null;
    
    const subtotal = cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const hasDiscount = item.discount && Number(item.discount) > 0;
      const itemPrice = hasDiscount ? price * (1 - Number(item.discount) / 100) : price;
      return sum + itemPrice * (item.quantity || 1);
    }, 0);

    const couponDiscount = appliedCoupon && subtotal >= (appliedCoupon.minSpend || 0)
      ? subtotal * (Number(appliedCoupon.discount) / 100)
      : 0;

    const deliveryFee = orderInfo.deliveryFee ?? (subtotal >= 1000000 ? 0 : 20000);
    
    const newOrder = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1000)}`,
      items: cartItems.map((item) => ({
        id: item._id || item.id,
        name: item.name || item.title || '',
        image: item.image,
        quantity: item.quantity || 1,
        price: Number(item.price) || 0,
        discount: Number(item.discount) || 0,
      })),
      subtotal,
      couponDiscount,
      deliveryFee,
      total: subtotal - couponDiscount + deliveryFee,
      createdAt: new Date().toISOString(),
      status: 'Qabul qilindi',
      paymentMethod: orderInfo.paymentMethod || paymentMethod,
      address: orderInfo.address || null,
      deliveryZone: orderInfo.deliveryZone || null,
      notes: orderInfo.notes || '',
    };

    setOrders(prev => [newOrder, ...prev]);
    const pointsEarned = Math.floor(subtotal / 10000);
    if (pointsEarned > 0) {
      setBonusPoints(prev => prev + pointsEarned);
    }
    showToast("Buyurtma saqlandi va tarixi yangilandi!", "success");

    // Real Backend API'ga saqlash
    axios.post(`${BASE}/api/orders`, newOrder).catch(() => {});

    return newOrder;
  }, [appliedCoupon, paymentMethod, showToast]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    showToast(`Buyurtma statusi o'zgartirildi: ${newStatus}`, "success");
    axios.patch(`${BASE}/api/orders/${orderId}/status`, { status: newStatus }).catch(() => {});
  }, [showToast]);

  const cancelOrder = useCallback((orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'Bekor qilindi' } : order
    ));
    showToast("Buyurtma bekor qilindi", "warning");
    axios.patch(`${BASE}/api/orders/${orderId}/status`, { status: 'Bekor qilindi' }).catch(() => {});
  }, [showToast]);

  const addAddress = useCallback((addressData) => {
    const newAddress = {
      id: `ADDR-${Date.now()}`,
      ...addressData,
      isDefault: addresses.length === 0 ? true : (addressData.isDefault || false),
    };
    if (newAddress.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })));
    }
    setAddresses(prev => [...prev, newAddress]);
    showToast("Yangi manzil muvaffaqiyatli qo'shildi", "success");
    return newAddress;
  }, [addresses.length, showToast]);

  const updateAddress = useCallback((id, addressData) => {
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...addressData } : a));
    showToast("Manzil yangilandi", "success");
    return true;
  }, [showToast]);

  const deleteAddress = useCallback((id) => {
    setAddresses(prev => {
      const addressToDelete = prev.find(a => a.id === id);
      const filtered = prev.filter(a => a.id !== id);
      
      if (addressToDelete?.isDefault && filtered.length > 0) {
        return filtered.map((a, idx) => idx === 0 ? { ...a, isDefault: true } : a);
      }
      return filtered;
    });
    showToast("Manzil o'chirildi", "warning");
  }, [showToast]);

  const setDefaultAddress = useCallback((id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    showToast("Asosiy manzil yangilandi", "success");
  }, [showToast]);

  const addCard = useCallback((cardData) => {
    const newCard = {
      id: `CARD-${Date.now()}`,
      ...cardData,
      isDefault: savedCards.length === 0 ? true : (cardData.isDefault || false),
    };
    setSavedCards(prev => [...prev, newCard]);
    showToast("Yangi karta saqlandi", "success");
    return newCard;
  }, [savedCards.length, showToast]);

  const deleteCard = useCallback((id) => {
    setSavedCards(prev => prev.filter(c => c.id !== id));
    showToast("Karta o'chirildi", "warning");
  }, [showToast]);

  const setDefaultCard = useCallback((id) => {
    setSavedCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
    showToast("Asosiy karta yangilandi", "success");
  }, [showToast]);

  const applyCoupon = useCallback((code) => {
    const coupon = coupons.find(c => c.code === code.toUpperCase() && c.active);
    if (!coupon) {
      showToast("Bunday kupon mavjud emas yoki aktiv emas!", "error");
      return false;
    }
    showToast(`${coupon.discount}% chegirma kuponi qo'llandi!`, "success");
    setAppliedCoupon(coupon);
    return true;
  }, [coupons, showToast]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    showToast("Kupon olib tashlandi", "info");
  }, [showToast]);

  const addCoupon = useCallback((couponData) => {
    const newCoupon = {
      ...couponData,
      code: couponData.code.toUpperCase(),
      active: true,
    };
    setCoupons(prev => [...prev, newCoupon]);
    showToast("Yangi kupon yaratildi", "success");
    axios.post(`${BASE}/api/coupons`, couponData).catch(() => {});
    return true;
  }, [showToast]);

  const updateCoupon = useCallback((code, couponData) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, ...couponData } : c));
    showToast("Kupon muvaffaqiyatli yangilandi", "success");
    axios.put(`${BASE}/api/coupons/${code}`, couponData).catch(() => {});
    return true;
  }, [showToast]);

  const deleteCoupon = useCallback((code) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    showToast("Kupon o'chirildi", "warning");
    axios.delete(`${BASE}/api/coupons/${code}`).catch(() => {});
    return true;
  }, [showToast]);

  const addBonusPoints = useCallback((amount) => {
    const pointsEarned = Math.floor(amount / 10000);
    if (pointsEarned > 0) {
      setBonusPoints(prev => prev + pointsEarned);
    }
  }, []);

  const spendBonusPoints = useCallback((points) => {
    if (points > bonusPoints) return false;
    setBonusPoints(prev => prev - points);
    showToast(`${points} bonus bal ishlatildi`, "success");
    return true;
  }, [bonusPoints, showToast]);

  const addUser = useCallback((userData) => {
    const newUser = {
      id: `USR-${Date.now()}`,
      ...userData,
      status: 'active',
      joined: new Date().toISOString().slice(0, 10),
      orders: 0,
      spent: 0,
    };
    setUsers(prev => [...prev, newUser]);
    showToast("Yangi foydalanuvchi qo'shildi", "success");
    axios.post(`${BASE}/api/auth/users`, userData).catch(() => {});
    return true;
  }, [showToast]);

  const updateUser = useCallback((id, userData) => {
    setUsers(prev => prev.map(u => (u.id === id || u._id === id) ? { ...u, ...userData } : u));
    showToast("Foydalanuvchi yangilandi", "success");
    axios.put(`${BASE}/api/auth/users/${id}`, userData).catch(() => {});
    return true;
  }, [showToast]);

  const deleteUser = useCallback((id) => {
    setUsers(prev => prev.filter(u => u.id !== id && u._id !== id));
    showToast("Foydalanuvchi o'chirildi", "warning");
    axios.delete(`${BASE}/api/auth/users/${id}`).catch(() => {});
    return true;
  }, [showToast]);

  const addActivityLog = useCallback((activity) => {
    const newActivity = {
      id: `ACT-${Date.now()}`,
      time: 'hozir',
      ...activity,
    };
    setActivityLog(prev => [newActivity, ...prev].slice(0, 50));
    return newActivity;
  }, []);

  // Yetkazib berish zonasini yangilash
  const updateDeliveryZone = useCallback((id, zoneData) => {
    setDeliveryZones(prev => prev.map(z => z.id === id ? { ...z, ...zoneData } : z));
    showToast("Yetkazib berish zonasi yangilandi", "success");
    axios.put(`${BASE}/api/delivery-zones/${id}`, zoneData).catch(() => {});
    return true;
  }, [showToast]);

  // Yangi zona qo'shish
  const addDeliveryZone = useCallback((zoneData) => {
    const newZone = {
      id: `zone-${Date.now()}`,
      ...zoneData,
    };
    setDeliveryZones(prev => [...prev, newZone]);
    showToast("Yangi zona qo'shildi", "success");
    axios.post(`${BASE}/api/delivery-zones`, zoneData).catch(() => {});
    return newZone;
  }, [showToast]);

  // Zonani o'chirish
  const deleteDeliveryZone = useCallback((id) => {
    setDeliveryZones(prev => prev.filter(z => z.id !== id));
    showToast("Zona o'chirildi", "warning");
    axios.delete(`${BASE}/api/delivery-zones/${id}`).catch(() => {});
    return true;
  }, [showToast]);

  // Lokal ma'lumotlarni tozalashda zonalarni ham tiklash
  const resetDeliveryZones = useCallback(() => {
    setDeliveryZones(DEFAULT_DELIVERY_ZONES);
    showToast("Zonalar standart holatga qaytarildi", "info");
    return true;
  }, [showToast]);

  return {
    orders, addresses, savedCards, coupons, appliedCoupon, bonusPoints,
    paymentMethod, deliveryZones, selectedDeliveryZone,
    setPaymentMethod, setSelectedDeliveryZone,
    users, activityLog,
    createOrder, updateOrderStatus, cancelOrder,
    addAddress, updateAddress, deleteAddress, setDefaultAddress,
    addCard, deleteCard, setDefaultCard,
    applyCoupon, removeCoupon, addCoupon, updateCoupon, deleteCoupon,
    addBonusPoints, spendBonusPoints,
    addUser, updateUser, deleteUser, addActivityLog,
    updateDeliveryZone, addDeliveryZone, deleteDeliveryZone, resetDeliveryZones,
  };
};

export default useOrders;
