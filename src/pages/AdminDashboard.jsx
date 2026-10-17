import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Plus, Trash2, Edit3, Search, Package,
  Coins, Layers, Check, X, Percent, AlertTriangle, Sparkles,
  ShieldAlert, RefreshCw, FolderPlus, ShoppingCart, Users,
  Settings, BarChart3, TrendingUp, DollarSign, CreditCard, Bell,
  Download, Upload, Eye, ChevronRight, Activity, MapPin, ArrowUpRight,
  Save, UserPlus, UserCheck, Ban, CheckCircle, XCircle, Info,
  ChevronLeft, Menu, Inbox, FileSpreadsheet, PackageCheck,
  BadgePercent, Database, ShoppingBag, Wallet, Receipt, Trophy,
  Terminal, Grid2X2, List as ListIcon, CheckCheck, PieChart, LineChart,
  ShieldCheck, Minus, Truck, Newspaper, FileText as FileTextIcon,
  Wifi, WifiOff, Radio, User
} from 'lucide-react';

/* ============================================================
   MODUL DARAJASIDAGI YORDAMCHI FUNKSIYALAR VA KONSTANTALAR
   ============================================================ */

const formatPrice = (price) => {
  return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(price) || 0)) + " so'm";
};

const formatShortNumber = (num) => {
  const n = Number(num) || 0;
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + ' mlrd';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + ' mln';
  if (n >= 1000) return (n / 1000).toFixed(1) + ' ming';
  return String(n);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const formatTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
};

const STATUS_COLORS = {
  'Qabul qilindi': 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  'Jarayonda': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Yetkazilmoqda': 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  'Yetkazildi': 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  'Bekor qilindi': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Qaytarildi': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const ORDER_STATUSES = [
  'Qabul qilindi',
  'Jarayonda',
  'Yetkazilmoqda',
  'Yetkazildi',
  'Bekor qilindi',
  'Qaytarildi',
];

const PAYMENT_METHODS = {
  cash: { label: 'Naqd pul', icon: 'Banknote', color: 'text-amber-300 bg-amber-400/10 border-amber-400/20' },
  card: { label: 'Bank kartasi', icon: 'CreditCard', color: 'text-amber-300 bg-amber-400/10 border-amber-400/20' },
  click: { label: 'Click', icon: 'Zap', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  payme: { label: 'Payme', icon: 'Zap', color: 'text-amber-300 bg-amber-400/10 border-amber-400/20' },
};

const ROLE_COLORS = {
  admin: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  moderator: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  user: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
};

const USER_STATUS_COLORS = {
  active: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  blocked: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

// Qora + oltin palitra
const CHART_COLORS = ['#FFC107', '#E5B20D', '#CC9A00', '#FFD966', '#B08A00', '#FDEBAF', '#8F6E00', '#FEF7DC'];

const WEEKDAYS_UZ = ['Yak', 'Du', 'Se', 'Cho', 'Pay', 'Ju', 'Sha'];

const SIDEBAR_SECTIONS = [
  {
    title: 'NAVIGATSIYA',
    items: [
      { id: 'dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard, badge: null },
      { id: 'products', label: 'Mahsulotlar', icon: Package, badge: null },
      { id: 'categories', label: 'Kategoriyalar', icon: Layers, badge: null },
      { id: 'orders', label: 'Buyurtmalar', icon: ShoppingCart, badge: null },
      { id: 'coupons', label: 'Kuponlar', icon: Percent, badge: null },
      { id: 'users', label: 'Foydalanuvchilar', icon: Users, badge: null },
      { id: 'blog', label: 'Blog', icon: Newspaper, badge: null },
    ],
  },
  {
    title: 'TAHLIL VA NAZORAT',
    items: [
      { id: 'activity', label: 'Faoliyat logi', icon: Activity, badge: null },
      { id: 'analytics', label: 'Analitika hisobot', icon: BarChart3, badge: null },
    ],
  },
  {
    title: 'TIZIM',
    items: [
      { id: 'notifications', label: 'Bildirishnomalar', icon: Bell, badge: null },
      { id: 'settings', label: 'Sozlamalar', icon: Settings, badge: null },
    ],
  },
];

/* ============================================================
   ADMIN DASHBOARD ASOSIY KOMPONENTI
   ============================================================ */
export default function AdminDashboard() {
  const {
    products, addProduct, updateProduct, deleteProduct, bulkDeleteProducts,
    categories, addCategory, updateCategory, deleteCategory,
    showToast,
    orders, updateOrderStatus, cancelOrder,
    coupons, addCoupon, updateCoupon, deleteCoupon,
    users: contextUsers, addUser, updateUser, deleteUser,
    activityLog, addActivityLog,
    deliveryZones, updateDeliveryZone, addDeliveryZone, deleteDeliveryZone, resetDeliveryZones,
    blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
    settings, updateSettings,
    notification, clearNotification,
    notificationSettings, updateNotificationSettings,
    notifications, markAllNotificationsRead, markNotificationRead, clearAllNotifications,
    bonusPoints, addBonusPoints, spendBonusPoints, networkStatus,
    siteUser, user,
  } = useApp();

  /* ============================================================
     ASOSIY HOLATLAR (STATE)
     ============================================================ */
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteTargetLabel, setDeleteTargetLabel] = useState('');
  const [deleteTargetType, setDeleteTargetType] = useState('product');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCatSubmitting, setIsCatSubmitting] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [dateRange, setDateRange] = useState('7days');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('all');
  const [selectedUserRole, setSelectedUserRole] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', minSpend: '', active: true });

  // Mobil sidebar ochilganda orqa sahifa skroll qilinmasin (lg + katta ekranda lock kerak emas)
  useEffect(() => {
    if (mobileSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
    return undefined;
  }, [mobileSidebarOpen]);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all');
  const [settingsTab, setSettingsTab] = useState('general');
  const [tempSettings, setTempSettings] = useState(settings || {});
  const [newZone, setNewZone] = useState({ name: '', price: '', days: '', freeFrom: '' });
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [zoneEdit, setZoneEdit] = useState({ name: '', price: '', days: '', freeFrom: '' });
  const [couponSearch, setCouponSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAllOrders, setSelectAllOrders] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [lowStockFilter, setLowStockFilter] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDataset, setExportDataset] = useState('products');
  const [previewProduct, setPreviewProduct] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectAllProducts, setSelectAllProducts] = useState(false);
  const [showProductBulkConfirm, setShowProductBulkConfirm] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [categoryEditId, setCategoryEditId] = useState(null);
  const [categoryEditName, setCategoryEditName] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('all');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [bonusAmount, setBonusAmount] = useState('');
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', category: 'Maslahatlar', date: '', readTime: 5, image: '', author: 'Grand Decor Studio', content: '' });
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [productViewMode, setProductViewMode] = useState('table');
  const [sortBy, setSortBy] = useState('default');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [now, setNow] = useState(() => new Date());

  // REAL VAQT: jonli soat — har soniyada yangilanadi
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Sektor tanlang',
    image: '',
    discount: '0',
    stock: '10',
    isNew: false,
    specs: ''
  });

  /* ============================================================
     TAB ALMASHISH YORDAMCHISI
     ============================================================ */
  const changeTab = (tab) => {
    setActiveTab(tab);
    setSelectedOrders([]);
    setSelectAllOrders(false);
    setCurrentPage(1);
    setSelectedProductIds([]);
    setSelectAllProducts(false);
    setMobileSidebarOpen(false);
  };

  /* ============================================================
     DINAMIK KATEGORIYALAR MATRIXI
     ============================================================ */
  const dbCategories = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map(c => ({ id: c._id || c.id, name: c.name }));
    }
    if (!products) return [];
    const uniqueMap = new Map();
    products.forEach(p => {
      if (p.category && typeof p.category === 'object' && p.category._id) {
        uniqueMap.set(p.category._id, p.category.name);
      } else if (p.category && typeof p.category === 'string') {
        uniqueMap.set(p.category, p.category);
      }
    });
    return Array.from(uniqueMap.entries()).map(([id, name]) => ({ id, name }));
  }, [products, categories]);

  /* ============================================================
     ANALITIK METRIKALAR
     ============================================================ */
  const analytics = useMemo(() => {
    const total = products ? products.length : 0;
    const grossValuation = products ? products.reduce((acc, curr) => {
      return acc + (Number(curr.price) || 0) * (Number(curr.stock) || 1);
    }, 0) : 0;
    const discountedCount = products ? products.filter(p => Number(p.discount) > 0).length : 0;
    const lowStockCount = products ? products.filter(p => p.stock && Number(p.stock) < 5).length : 0;
    return { total, grossValuation, categoriesCount: dbCategories.length, discountedCount, lowStockCount };
  }, [products, dbCategories]);

  // Real vaqtda qidirish va filtrlar (mahsulotlar)
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = products.filter((p) => {
      const catName = typeof p.category === 'object' ? p.category?.name : p.category;
      const catId = typeof p.category === 'object' ? p.category?._id : p.category;
      const pTitle = String(p.name || p.title || '').toLowerCase();
      const pCategoryName = String(catName || '').toLowerCase();
      const pId = String(p._id || p.id || '');
      const matchesSearch = pTitle.includes(search.toLowerCase()) || pCategoryName.includes(search.toLowerCase()) || pId.includes(search);
      // Kategoriya ID ham, nom ham bo'lishi mumkin — ikkalasini ham solishtiramiz
      const selectedCatName = dbCategories.find(c => c.id === selectedCategory)?.name;
      const matchesCategory = selectedCategory === 'ALL'
        || catId === selectedCategory
        || String(catName || '').toUpperCase() === String(selectedCategory).toUpperCase()
        || (selectedCatName && String(catName || '').toUpperCase() === String(selectedCatName).toUpperCase());
      const matchesStock = !onlyInStock || Number(p.stock) > 0;
      const matchesDiscount = !onlyDiscount || Number(p.discount) > 0;
      const matchesMaxPrice = !maxPrice || (Number(p.price) || 0) <= Number(maxPrice);
      const matchesLowStock = lowStockFilter === 'all' || (lowStockFilter === 'low' && Number(p.stock) < 5) || (lowStockFilter === 'out' && Number(p.stock) === 0);
      return matchesSearch && matchesCategory && matchesStock && matchesDiscount && matchesMaxPrice && matchesLowStock;
    });

    switch (sortBy) {
      case 'price_asc': result = [...result].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0)); break;
      case 'price_desc': result = [...result].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0)); break;
      case 'discount': result = [...result].sort((a, b) => (Number(b.discount) || 0) - (Number(a.discount) || 0)); break;
      case 'stock': result = [...result].sort((a, b) => (Number(b.stock) || 0) - (Number(a.stock) || 0)); break;
      case 'name_asc': result = [...result].sort((a, b) => (a.name || a.title || '').localeCompare(b.name || b.title || '')); break;
      case 'name_desc': result = [...result].sort((a, b) => (b.name || b.title || '').localeCompare(a.name || a.title || '')); break;
      default: break;
    }
    return result;
  }, [products, search, selectedCategory, onlyInStock, onlyDiscount, maxPrice, lowStockFilter, sortBy, dbCategories]);

  // Mahsulotlar uchun pagination
  const totalProductPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safeProductPage = Math.min(currentPage, totalProductPages);
  const paginatedProducts = useMemo(() => {
    const start = (safeProductPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, safeProductPage, itemsPerPage]);

  // Buyurtmalar filtri
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(o => {
      const matchesStatus = selectedOrderStatus === 'all' || o.status === selectedOrderStatus;
      const searchStr = String(o.id || '').toLowerCase();
      const customer = String(o.customer?.name || o.address?.name || '').toLowerCase();
      const matchesSearch = searchStr.includes(orderSearch.toLowerCase()) || customer.includes(orderSearch.toLowerCase());
      const createdAt = o.createdAt ? new Date(o.createdAt) : null;
      let matchesDate = true;
      if (dateFrom && createdAt) matchesDate = matchesDate && createdAt >= new Date(dateFrom);
      if (dateTo && createdAt) matchesDate = matchesDate && createdAt <= new Date(dateTo + 'T23:59:59');
      return matchesStatus && matchesSearch && matchesDate;
    });
  }, [orders, selectedOrderStatus, orderSearch, dateFrom, dateTo]);

  // Kuponlar filtri
  const filteredCoupons = useMemo(() => {
    if (!coupons) return [];
    return coupons.filter(c => {
      const code = String(c.code || '').toLowerCase();
      return code.includes(couponSearch.toLowerCase());
    });
  }, [coupons, couponSearch]);

  // Foydalanuvchilar filtri
  const filteredUsers = useMemo(() => {
    if (!contextUsers) return [];
    return contextUsers.filter(u => {
      const matchesRole = selectedUserRole === 'all' || u.role === selectedUserRole;
      const name = String(u.name || '').toLowerCase();
      const email = String(u.email || '').toLowerCase();
      const matchesSearch = name.includes(userSearch.toLowerCase()) || email.includes(userSearch.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [contextUsers, selectedUserRole, userSearch]);

  // Faoliyat logi filtri
  const filteredActivities = useMemo(() => {
    if (!activityLog) return [];
    if (activityFilter === 'all') return activityLog;
    return activityLog.filter(a => a.type === activityFilter);
  }, [activityLog, activityFilter]);

  // Bildirishnomalar filtri
  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];
    if (notificationFilter === 'all') return notifications;
    if (notificationFilter === 'unread') return notifications.filter(n => !n.read);
    if (notificationFilter === 'read') return notifications.filter(n => n.read);
    return notifications;
  }, [notifications, notificationFilter]);

  // Dashboard uchun 7 kunlik daromad grafigi
  const revenueByDay = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ key, date: d, label: WEEKDAYS_UZ[d.getDay()], total: 0, count: 0 });
    }
    (orders || []).forEach(o => {
      if (!o.createdAt) return;
      const oDate = new Date(o.createdAt);
      if (Number.isNaN(oDate.getTime())) return;
      const key = oDate.toISOString().slice(0, 10);
      const day = days.find(x => x.key === key);
      if (day && o.status !== 'Bekor qilindi' && o.status !== 'Qaytarildi') {
        day.total += Number(o.total) || 0;
        day.count += 1;
      }
    });
    const max = Math.max(...days.map(d => d.total), 1);
    return { days, max };
  }, [orders]);

  // Buyurtma statuslari bo'yicha taqsimot
  const statusDistribution = useMemo(() => {
    const dist = ORDER_STATUSES.map(s => ({ status: s, count: 0 }));
    (orders || []).forEach(o => {
      const item = dist.find(x => x.status === o.status);
      if (item) item.count += 1;
    });
    return dist;
  }, [orders]);

  // Kategoriya bo'yicha mahsulot taqsimoti
  const categoryDistribution = useMemo(() => {
    const map = new Map();
    (products || []).forEach(p => {
      const name = typeof p.category === 'object' ? p.category?.name : p.category;
      const key = String(name || 'Noma\'lum').toUpperCase();
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [products]);

  // Eng ko'p sotilgan mahsulotlar
  const topProducts = useMemo(() => {
    const map = new Map();
    (orders || []).forEach(o => {
      (o.items || []).forEach(item => {
        const id = item.id;
        const key = String(id);
        const existing = map.get(key) || { name: item.name || 'Mahsulot', qty: 0, revenue: 0, image: item.image };
        existing.qty += Number(item.quantity) || 0;
        existing.revenue += (Number(item.price) || 0) * (Number(item.quantity) || 0);
        map.set(key, existing);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  // Kam zaxirali mahsulotlar
  const lowStockProducts = useMemo(() => {
    return (products || []).filter(p => Number(p.stock) < 5).sort((a, b) => Number(a.stock) - Number(b.stock)).slice(0, 6);
  }, [products]);

  // Oxirgi buyurtmalar
  const recentOrders = useMemo(() => {
    return [...(orders || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  }, [orders]);

  // Umumiy daromad va o'rtacha buyurtma qiymati
  const orderStats = useMemo(() => {
    const valid = (orders || []).filter(o => o.status !== 'Bekor qilindi' && o.status !== 'Qaytarildi');
    const totalRevenue = valid.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const avgOrder = valid.length ? Math.round(totalRevenue / valid.length) : 0;
    const totalItems = valid.reduce((s, o) => s + (o.items || []).reduce((si, it) => si + (Number(it.quantity) || 0), 0), 0);
    return { totalRevenue, avgOrder, totalItems, count: valid.length };
  }, [orders]);

  // Unread notifications
  const unreadCount = useMemo(() => (notifications || []).filter(n => !n.read).length, [notifications]);

  /* ============================================================
     HANDLERLAR (HODISA FUNKSIYALARI)
     ============================================================ */

  // Kategoriya qo'shish
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showToast("Kategoriya nomini kiriting!", "error");
      return;
    }
    setIsCatSubmitting(true);
    try {
      if (addCategory) {
        await addCategory({ name: newCategoryName.trim() });
        addActivityLog?.({ action: `Yangi kategoriya yaratildi: ${newCategoryName.trim()}`, user: 'Admin', type: 'category' });
        showToast("Yangi kategoriya tizimga muvaffaqiyatli kiritildi!", "success");
        setNewCategoryName('');
      } else {
        showToast("Context ichida addCategory funksiyasi topilmadi.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Kategoriya qo'shishda xatolik yuz berdi.", "error");
    } finally {
      setIsCatSubmitting(false);
    }
  };

  // Kategoriyani tahrirlashni boshlash
  const handleCategoryEditInit = (cat) => {
    setCategoryEditId(cat.id);
    setCategoryEditName(cat.name);
  };

  // Kategoriyani yangilash
  const handleCategoryUpdate = async () => {
    if (!categoryEditName.trim()) {
      showToast("Kategoriya nomini kiriting!", "error");
      return;
    }
    try {
      await updateCategory(categoryEditId, { name: categoryEditName.trim() });
      addActivityLog?.({ action: `Kategoriya yangilandi: ${categoryEditName.trim()}`, user: 'Admin', type: 'category' });
      setCategoryEditId(null);
      setCategoryEditName('');
    } catch {
      showToast("Kategoriyani yangilashda xatolik", "error");
    }
  };

  // Kategoriyani o'chirish
  const handleCategoryDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteCategory(deleteConfirmId);
      addActivityLog?.({ action: 'Kategoriya o\'chirildi', user: 'Admin', type: 'category' });
      setDeleteConfirmId(null);
      showToast("Kategoriya o'chirildi", "warning");
    } catch {
      showToast("Kategoriyani o'chirishda xatolik", "error");
    }
  };

  // Mahsulot qo'shish/yangilash
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || form.category === 'Sektor tanlang' || !form.image) {
      showToast("Kritik maydonlar (nom, narx, sektor, rasm) to'ldirilishi shart!", "error");
      return;
    }
    setIsSubmitting(true);
    const specsArray = form.specs ? form.specs.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
    const productPayload = {
      title: form.title,
      name: form.title,
      description: form.description || "Premium mahsulot.",
      price: Number(form.price),
      category: form.category,
      image: form.image,
      img: form.image,
      discount: Number(form.discount) || 0,
      stock: Number(form.stock) || 0,
      isNew: Boolean(form.isNew),
      specs: specsArray
    };
    try {
      if (editingId) {
        await updateProduct(editingId, productPayload);
        addActivityLog?.({ action: `Mahsulot yangilandi: ${form.title}`, user: 'Admin', type: 'product' });
        setEditingId(null);
        resetForm();
        showToast("Resurs muvaffaqiyatli yangilandi!", "success");
      } else {
        await addProduct({ ...productPayload, rating: 5.0, reviewsCount: 0 });
        addActivityLog?.({ action: `Yangi mahsulot qo'shildi: ${form.title}`, user: 'Admin', type: 'product' });
        resetForm();
        showToast("Yangi resurs konveyerga qo'shildi!", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Mahsulot qo'shish operatsiyasida xatolik.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kupon qo'shish/yangilash
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim() || !newCoupon.discount) {
      showToast("Kupon kodi va chegirma foizini kiriting!", "error");
      return;
    }
    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon.code, {
          code: newCoupon.code,
          discount: Number(newCoupon.discount),
          minSpend: Number(newCoupon.minSpend) || 0,
          active: newCoupon.active,
        });
        addActivityLog?.({ action: `Kupon yangilandi: ${newCoupon.code.toUpperCase()}`, user: 'Admin', type: 'coupon' });
        showToast("Kupon muvaffaqiyatli yangilandi", "success");
      } else {
        await addCoupon({
          code: newCoupon.code,
          discount: Number(newCoupon.discount),
          minSpend: Number(newCoupon.minSpend) || 0,
          active: true,
        });
        addActivityLog?.({ action: `Yangi kupon yaratildi: ${newCoupon.code.toUpperCase()}`, user: 'Admin', type: 'coupon' });
        showToast("Yangi kupon yaratildi", "success");
      }
      setShowCouponModal(false);
      setEditingCoupon(null);
      setNewCoupon({ code: '', discount: '', minSpend: '', active: true });
    } catch {
      showToast("Kupon saqlashda xatolik", "error");
    }
  };

  // Kuponni tahrirlash
  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setNewCoupon({ code: coupon.code, discount: String(coupon.discount), minSpend: String(coupon.minSpend || ''), active: coupon.active });
    setShowCouponModal(true);
  };

  // Kuponni o'chirish
  const handleDeleteCoupon = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteCoupon(deleteConfirmId);
      addActivityLog?.({ action: `Kupon o'chirildi: ${deleteConfirmId}`, user: 'Admin', type: 'coupon' });
      setDeleteConfirmId(null);
    } catch {
      showToast("Kuponni o'chirishda xatolik", "error");
    }
  };

  // Kupon faolligini almashtirish
  const toggleCouponActive = async (coupon) => {
    try {
      await updateCoupon(coupon.code, { active: !coupon.active });
    } catch {
      showToast("Kupon holatini o'zgartirishda xatolik", "error");
    }
  };

  // Foydalanuvchi qo'shish/yangilash
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      showToast('Barcha maydonlarni to\'ldiring', 'error');
      return;
    }
    try {
      if (editingUser) {
        await updateUser(editingUser._id || editingUser.id, {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        });
        addActivityLog?.({ action: `Foydalanuvchi yangilandi: ${newUser.name}`, user: 'Admin', type: 'user' });
        showToast('Foydalanuvchi yangilandi', 'success');
      } else {
        await addUser({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          password: newUser.password,
        });
        addActivityLog?.({ action: `Yangi foydalanuvchi qo'shildi: ${newUser.name}`, user: 'Admin', type: 'user' });
        showToast('Yangi foydalanuvchi qo\'shildi', 'success');
      }
      setShowUserModal(false);
      setEditingUser(null);
      setNewUser({ name: '', email: '', role: 'user', password: '' });
    } catch {
      showToast('Foydalanuvchi saqlashda xatolik', 'error');
    }
  };

  // Foydalanuvchini tahrirlash
  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ name: user.name, email: user.email, role: user.role, password: '••••••••' });
    setShowUserModal(true);
  };

  // Foydalanuvchi statusini o'zgartirish (bloklash/faollashtirish)
  const toggleUserStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    try {
      await updateUser(user._id || user.id, { status: newStatus });
      addActivityLog?.({
        action: newStatus === 'blocked' ? `Foydalanuvchi bloklandi: ${user.name}` : `Foydalanuvchi faollashtirildi: ${user.name}`,
        user: 'Admin',
        type: 'user',
      });
      showToast(newStatus === 'blocked' ? 'Foydalanuvchi bloklandi' : 'Foydalanuvchi faollashtirildi', newStatus === 'blocked' ? 'warning' : 'success');
    } catch {
      showToast('Status o\'zgartirishda xatolik', 'error');
    }
  };

  // Foydalanuvchini o'chirish
  const handleDeleteUser = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteUser(deleteConfirmId);
      addActivityLog?.({ action: 'Foydalanuvchi o\'chirildi', user: 'Admin', type: 'user' });
      setDeleteConfirmId(null);
      showToast("Foydalanuvchi o'chirildi", "warning");
    } catch {
      showToast("Foydalanuvchini o'chirishda xatolik", "error");
    }
  };

  // Buyurtma statusini o'zgartirish
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      addActivityLog?.({ action: `Buyurtma ${orderId} statusi: ${newStatus}`, user: 'Admin', type: 'order' });
    } catch {
      showToast("Status o'zgartirishda xatolik", "error");
    }
  };

  // Buyurtmani bekor qilish
  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      addActivityLog?.({ action: `Buyurtma bekor qilindi: ${orderId}`, user: 'Admin', type: 'order' });
    } catch {
      showToast("Bekor qilishda xatolik", "error");
    }
  };

  // Ommaviy buyurtma amali
  const handleBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) return;
    try {
      for (const orderId of selectedOrders) {
        if (bulkAction === 'delete') {
          await cancelOrder(orderId);
        } else {
          await updateOrderStatus(orderId, bulkAction);
        }
      }
      addActivityLog?.({ action: `${selectedOrders.length} ta buyurtma uchun ommaviy amal: ${bulkAction}`, user: 'Admin', type: 'order' });
      showToast(`${selectedOrders.length} ta buyurtma uchun amal bajarildi`, 'success');
      setSelectedOrders([]);
      setSelectAllOrders(false);
      setBulkAction('');
      setShowBulkConfirm(false);
    } catch {
      showToast('Ommaviy amalni bajarishda xatolik', 'error');
    }
  };

  // Mahsulotlarni ommaviy o'chirish
  const handleBulkDeleteProducts = async () => {
    if (selectedProductIds.length === 0) return;
    try {
      await bulkDeleteProducts(selectedProductIds);
      addActivityLog?.({ action: `${selectedProductIds.length} ta mahsulot ommaviy o'chirildi`, user: 'Admin', type: 'product' });
      setSelectedProductIds([]);
      setSelectAllProducts(false);
      setShowProductBulkConfirm(false);
    } catch {
      showToast('Ommaviy o\'chirishda xatolik', 'error');
    }
  };

  // Tahrirlashni boshlash
  const handleEditInit = (p) => {
    const currentId = p._id || p.id;
    let catValue = typeof p.category === 'object' ? p.category?._id : p.category;
    // Kategoriya nomi bo'lsa, forma selectiga mos keladigan ID ga o'tkazamiz
    if (catValue && !dbCategories.some(c => c.id === catValue)) {
      const byName = dbCategories.find(c => String(c.name || '').toUpperCase() === String(catValue).toUpperCase());
      if (byName) catValue = byName.id;
    }
    setEditingId(currentId);
    setForm({
      title: p.name || p.title || '',
      description: p.description || '',
      price: String(p.price || ''),
      category: catValue || 'Sektor tanlang',
      image: p.image || p.img || '',
      discount: String(p.discount || '0'),
      stock: String(p.stock || '10'),
      isNew: Boolean(p.isNew),
      specs: Array.isArray(p.specs) ? p.specs.join(', ') : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mahsulotni o'chirishni tasdiqlash
  const handleConfirmWipe = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteProduct(deleteConfirmId);
      addActivityLog?.({ action: 'Mahsulot o\'chirildi', user: 'Admin', type: 'product' });
      if (editingId === deleteConfirmId) resetForm();
      setDeleteConfirmId(null);
      showToast("Resurs tizimdan o'chirildi.", "success");
    } catch {
      showToast("O'chirishda xatolik yuz berdi.", "error");
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      price: '',
      category: 'Sektor tanlang',
      image: '',
      discount: '0',
      stock: '10',
      isNew: false,
      specs: ''
    });
    setEditingId(null);
  };

  // Sozlamalarni saqlash
  const handleSettingsSave = (e) => {
    e.preventDefault();
    updateSettings(tempSettings);
    addActivityLog?.({ action: 'Tizim sozlamalari yangilandi', user: 'Admin', type: 'settings' });
  };

  // Bildirishnoma sozlamalarini saqlash
  const handleNotificationSettingsSave = (e) => {
    e.preventDefault();
    updateNotificationSettings(notificationSettings);
    showToast("Bildirishnoma sozlamalari saqlandi", "success");
  };

  // Blog maqola qo'shish/yangilash
  const handleBlogSubmit = (e) => {
    e.preventDefault();
    if (!blogForm.title.trim()) {
      showToast("Maqola sarlavhasini kiriting!", "error");
      return;
    }
    const payload = {
      title: blogForm.title.trim(),
      excerpt: blogForm.excerpt.trim() || blogForm.title.trim(),
      category: blogForm.category || 'Maslahatlar',
      date: blogForm.date || new Date().toISOString().slice(0, 10),
      readTime: Number(blogForm.readTime) || 5,
      image: blogForm.image || '/banner/banner1.png',
      author: blogForm.author.trim() || 'Grand Decor Studio',
      content: blogForm.content,
    };
    if (editingBlogId) {
      updateBlogPost(editingBlogId, payload);
      addActivityLog?.({ action: `Blog maqola yangilandi: ${payload.title}`, user: 'Admin', type: 'product' });
      showToast("Maqola yangilandi", "success");
    } else {
      addBlogPost(payload);
      addActivityLog?.({ action: `Yangi blog maqola yaratildi: ${payload.title}`, user: 'Admin', type: 'product' });
      showToast("Yangi maqola yaratildi", "success");
    }
    setShowBlogModal(false);
    setEditingBlogId(null);
    setBlogForm({ title: '', excerpt: '', category: 'Maslahatlar', date: '', readTime: 5, image: '', author: 'Grand Decor Studio', content: '' });
  };

  // Blog maqolani tahrirlash
  const handleEditBlog = (post) => {
    setEditingBlogId(post.id);
    setBlogForm({
      title: post.title || '',
      excerpt: post.excerpt || '',
      category: post.category || 'Maslahatlar',
      date: post.date || '',
      readTime: String(post.readTime || 5),
      image: post.image || '',
      author: post.author || 'Grand Decor Studio',
      content: Array.isArray(post.content) ? post.content.join('\n') : String(post.content || ''),
    });
    setShowBlogModal(true);
  };

  // Blog maqolani o'chirish
  const handleDeleteBlog = (post) => {
    deleteBlogPost(post.id);
    addActivityLog?.({ action: `Blog maqola o'chirildi: ${post.title}`, user: 'Admin', type: 'product' });
    showToast("Maqola o'chirildi", "warning");
  };

  // Lokal ma'lumotlarni tozalash
  const handleResetData = () => {
    Object.keys(localStorage)
      .filter(k => k.startsWith('vortex_'))
      .forEach(k => localStorage.removeItem(k));
    addActivityLog?.({ action: 'Lokal ma\'lumotlar bazasi tozalandi', user: 'Admin', type: 'settings' });
    setConfirmReset(false);
    showToast("Lokal ma'lumotlar tozalandi. Sahifa yangilanadi...", "info");
    setTimeout(() => window.location.reload(), 1200);
  };

  // CSV qiymatini xavfsiz formatlash (vergul, qo'shtirnoq, yangi qatorlardan himoya)
  const csvCell = (value) => {
    if (value === null || value === undefined) return '';
    let v = value;
    if (typeof v === 'object') v = JSON.stringify(v);
    v = String(v).replace(/"/g, '""');
    if (/[,"\n\r;]/.test(v)) v = `"${v}"`;
    return v;
  };

  // Umumiy eksport — CSV / JSON / XLS (HTML jadval asosidagi haqiqiy Excel fayl)
  const exportData = (data, filename, label, format = 'csv') => {
    if (!data || data.length === 0) {
      showToast('Eksport qilish uchun ma\'lumot topilmadi', 'error');
      return;
    }
    if (format === 'csv') {
      const headers = Object.keys(data[0]);
      const rows = data.map(item => headers.map(h => csvCell(item[h])).join(','));
      // BOM — Excel o'zbekcha belgilarni to'g'ri ochishi uchun
      const csv = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(`${label} CSV formatda eksport qilindi`, 'success');
    } else if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(`${label} JSON formatda eksport qilindi`, 'success');
    } else if (format === 'xls') {
      // Haqiqiy Excel .xls — HTML jadval asosida, Excel to'liq ochadi
      const headers = Object.keys(data[0]);
      const rows = data.map(item =>
        '<tr>' + headers.map(h => `<td>${csvCell(item[h])}</td>`).join('') + '</tr>'
      ).join('');
      const html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${filename}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
        <body><table border="1"><tr>${headers.map(h => `<th>${csvCell(h)}</th>`).join('')}</tr>${rows}</table></body></html>`;
      const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.xls`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(`${label} Excel (XLS) formatda eksport qilindi`, 'success');
    } else {
      showToast('Noma\'lum format', 'error');
    }
  };

  // CSV qatorini to'g'ri parse qilish (qo'shtirnoqli qiymatlar bilan)
  const parseCsvLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') { current += '"'; i++; }
          else inQuotes = false;
        } else current += ch;
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result.map(v => v.trim());
  };

  // Import — fayldagi ma'lumotlar HAQIQATAN bazaga qo'shiladi
  const importData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      let imported = [];
      try {
        const content = event.target.result;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          imported = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.products) ? parsed.products : []);
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split(/\r?\n/).filter(line => line.trim());
          if (lines.length > 1) {
            const headers = parseCsvLine(lines[0]);
            imported = lines.slice(1).map(line => {
              const values = parseCsvLine(line);
              const obj = {};
              headers.forEach((h, i) => { obj[h.trim()] = values[i] !== undefined ? values[i] : ''; });
              return obj;
            });
          }
        } else {
          showToast('Faqat CSV yoki JSON fayl qo\'llab-quvvatlanadi', 'error');
          return;
        }

        if (imported.length === 0) {
          showToast('Import qilinadigan ma\'lumot topilmadi', 'error');
          return;
        }

        // Har bir mahsulotni bazaga qo'shamiz
        let successCount = 0;
        let failCount = 0;
        setShowImportModal(false);
        showToast(`${imported.length} ta mahsulot import qilinmoqda...`, 'info');

        for (const raw of imported) {
          // CSV/JSON maydonlarini mahsulot formatiga moslashtirish
          const title = raw.title || raw.name || raw.nomi || '';
          if (!title) { failCount++; continue; }

          let catValue = raw.category || raw.kategoriya || 'GENERAL';
          // Kategoriya ID o'rniga nom berilgan bo'lsa — nomini saqlaymiz (katalog nom bilan ishlaydi)
          if (catValue && dbCategories.some(c => c.id === catValue)) {
            // allaqachon ID — shunday qoldiramiz
          } else if (typeof catValue === 'string') {
            const found = dbCategories.find(c => String(c.name || '').toUpperCase() === String(catValue).toUpperCase());
            if (found) catValue = found.id;
          }

          const productPayload = {
            title,
            name: title,
            description: raw.description || raw.tavsif || 'Premium mahsulot.',
            price: Number(raw.price || raw.narx) || 0,
            category: catValue,
            image: raw.image || raw.img || raw.rasm || '',
            img: raw.image || raw.img || raw.rasm || '',
            discount: Number(raw.discount || raw.chegirma) || 0,
            stock: Number(raw.stock || raw.zaxira) || 0,
            isNew: Boolean(raw.isNew === true || raw.isNew === 'true' || raw.isNew === 1 || raw.yangi === 'true'),
            specs: typeof raw.specs === 'string'
              ? raw.specs.split(',').map(s => s.trim()).filter(Boolean)
              : (Array.isArray(raw.specs) ? raw.specs : []),
            rating: Number(raw.rating) || 5.0,
            reviewsCount: Number(raw.reviewsCount) || 0,
          };

          try {
            await addProduct(productPayload);
            successCount++;
          } catch {
            failCount++;
          }
        }

        addActivityLog?.({ action: `${successCount} ta mahsulot import qilindi (fayl: ${file.name})`, user: 'Admin', type: 'product' });
        showToast(
          successCount > 0
            ? `${successCount} ta mahsulot muvaffaqiyatli import qilindi${failCount > 0 ? `, ${failCount} ta xato` : ''}`
            : 'Importda xatolik yuz berdi',
          failCount > successCount ? 'error' : 'success'
        );
      } catch (err) {
        console.error('Import xatosi:', err);
        showToast('Faylni o\'qishda xatolik yuz berdi', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // O'chirish dialogini ochish (universal)
  const openDeleteConfirm = (id, label, type = 'product') => {
    setDeleteConfirmId(id);
    setDeleteTargetLabel(label);
    setDeleteTargetType(type);
  };

  // Universal o'chirish boshqaruvchisi
  const handleUniversalDelete = async () => {
    if (!deleteConfirmId) return;
    if (deleteTargetType === 'category') await handleCategoryDelete();
    else if (deleteTargetType === 'coupon') await handleDeleteCoupon();
    else if (deleteTargetType === 'user') await handleDeleteUser();
    else await handleConfirmWipe();
  };

  /* ============================================================
     RENDER YORDAMCHILARI
     ============================================================ */

  // SIDEBAR RENDER
  const renderSidebar = () => {
    const counts = {
      products: (products || []).length,
      orders: (orders || []).length,
      users: (contextUsers || []).length,
      notifications: unreadCount,
      coupons: (coupons || []).length,
    };

    return (
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-400/20">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white">GRAND<span className="text-amber-400">DECOR</span></p>
              <p className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">Admin Cluster v2.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-5">
          {SIDEBAR_SECTIONS.map((section, si) => (
            <div key={si}>
              <p className="px-3 mb-2 text-[9px] font-mono font-bold text-slate-600 uppercase tracking-[0.2em]">{section.title}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  let badge = item.badge;
                  if (item.id === 'products') badge = counts.products;
                  if (item.id === 'orders') badge = counts.orders;
                  if (item.id === 'users') badge = counts.users;
                  if (item.id === 'notifications') badge = counts.notifications;
                  if (item.id === 'coupons') badge = counts.coupons;

                  return (
                    <button
                      key={item.id}
                      onClick={() => changeTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group relative ${
                        isActive
                          ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20 shadow-[0_0_20px_rgba(255,193,7,0.12)]'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 transition ${isActive ? 'text-amber-300' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {badge !== null && badge !== undefined && (item.id !== 'notifications' || badge > 0) && (
                        <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md min-w-[20px] text-center ${
                          item.id === 'notifications' && badge > 0
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}>
                          {badge}
                        </span>
                      )}
                      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-amber-400 rounded-full" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom status */}
        <div className="px-5 py-4 border-t border-slate-900">
          <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/60 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className={`relative flex h-2.5 w-2.5`}>
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${networkStatus === 'online' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${networkStatus === 'online' ? 'bg-amber-400' : 'bg-rose-500'}`} />
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                {networkStatus === 'online' ? 'Tarmoq: Ulangan' : 'Tarmoq: Uzilgan'}
              </span>
            </div>
            <span className="text-[9px] font-mono text-slate-600">v2.0</span>
          </div>
        </div>
      </div>
    );
  };

  // DASHBOARD TAB
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* REAL VAQT HOLAT PANELI */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] backdrop-blur-xl px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping bg-amber-400" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-amber-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5" /> Real vaqt rejimi: yoqilgan
            </p>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">
              Barcha o'zgarishlar (buyurtma, mahsulot, kupon, sozlamalar) boshqa oynalarga darhol yetkaziladi •{' '}
              {networkStatus === 'online' ? 'Server: ulangan' : 'Lokal rejim'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
          {now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} •{' '}
          {now.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* KPI KARTALARI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 shadow-xl relative overflow-hidden group hover:border-amber-400/30 transition-all duration-300">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-400/5 blur-2xl group-hover:bg-amber-400/10 transition" />
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-amber-400/10 text-amber-300 rounded-xl border border-amber-400/20"><DollarSign className="h-5 w-5" /></div>
            <ArrowUpRight className="h-4 w-4 text-amber-300" />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Umumiy daromad</p>
          <p className="text-lg font-black text-white mt-1 font-mono tracking-tight">{formatShortNumber(orderStats.totalRevenue)}</p>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">{orderStats.count} ta faol buyurtma</p>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 shadow-xl relative overflow-hidden group hover:border-amber-400/30 transition-all duration-300">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-400/5 blur-2xl group-hover:bg-amber-400/10 transition" />
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-amber-400/10 text-amber-300 rounded-xl border border-amber-400/20"><ShoppingCart className="h-5 w-5" /></div>
            <ArrowUpRight className="h-4 w-4 text-amber-300" />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Jami buyurtmalar</p>
          <p className="text-lg font-black text-white mt-1 font-mono">{(orders || []).length} <span className="text-xs text-slate-600 font-normal">ta</span></p>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">{orderStats.count} ta faol buyurtma</p>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 shadow-xl relative overflow-hidden group hover:border-amber-400/30 transition-all duration-300">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-400/5 blur-2xl group-hover:bg-amber-400/10 transition" />
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-amber-400/10 text-amber-300 rounded-xl border border-amber-400/20"><Package className="h-5 w-5" /></div>
            <TrendingUp className="h-4 w-4 text-amber-300" />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Katalog hajmi</p>
          <p className="text-lg font-black text-white mt-1 font-mono">{analytics.total} <span className="text-xs text-slate-600 font-normal">tovar</span></p>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">{analytics.categoriesCount} ta kategoriya</p>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 shadow-xl relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl group-hover:bg-amber-500/10 transition" />
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20"><Coins className="h-5 w-5" /></div>
            <ArrowUpRight className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">O'rtacha buyurtma</p>
          <p className="text-lg font-black text-white mt-1 font-mono">{formatShortNumber(orderStats.avgOrder)}</p>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">{orderStats.count} ta buyurtma asosida</p>
        </div>
      </div>

      {/* BONUS BOSHQARUVI */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.06] to-transparent backdrop-blur-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Coins className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Bonus balansni boshqarish</h3>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">Loyallik dasturi • joriy balans: <span className="text-amber-400 font-black">{bonusPoints} ball</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <input
              type="number"
              value={bonusAmount}
              onChange={(e) => setBonusAmount(e.target.value)}
              placeholder="Ballar soni..."
              min="1"
              className="flex-1 lg:w-36 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30 transition"
            />
            <button
              onClick={() => {
                const amount = Number(bonusAmount);
                if (!amount || amount <= 0) { showToast("Ballar sonini kiriting!", "error"); return; }
                addBonusPoints(amount * 10000);
                addActivityLog?.({ action: `${amount} bonus bal qo'shildi`, user: 'Admin', type: 'user' });
                setBonusAmount('');
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-amber-300 transition flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Qo'shish
            </button>
            <button
              onClick={() => {
                const amount = Number(bonusAmount);
                if (!amount || amount <= 0) { showToast("Ballar sonini kiriting!", "error"); return; }
                if (!spendBonusPoints(amount)) { showToast("Balansda yetarli ball yo'q!", "error"); return; }
                addActivityLog?.({ action: `${amount} bonus bal yechib olindi`, user: 'Admin', type: 'user' });
                setBonusAmount('');
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-wider hover:bg-rose-500/20 transition flex items-center gap-1.5"
            >
              <Minus className="h-3.5 w-3.5" /> Yechish
            </button>
          </div>
        </div>
      </div>

      {/* DAROMAD GRAFIGI + STATUS TAQSIMOTI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7 kunlik daromad */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <LineChart className="h-4 w-4 text-amber-300" /> 7 Kunlik Daromad Dinamikasi
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">Oxirgi 7 kun ichidagi savdo faolligi</p>
            </div>
            <div className="flex items-center gap-2">
              {['7days', '14days', '30days'].map(r => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition border ${
                    dateRange === r ? 'bg-amber-400/10 text-amber-300 border-amber-400/30' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-white'
                  }`}
                >
                  {r.replace('days', ' kun')}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 sm:gap-3 h-44">
            {revenueByDay.days.map((day) => {
              const h = Math.max(4, Math.round((day.total / revenueByDay.max) * 100));
              return (
                <div key={day.key} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[9px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition font-bold">{formatShortNumber(day.total)}</span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-amber-500/20 to-amber-400/80 group-hover:to-amber-300 transition-all duration-300 relative overflow-hidden"
                    style={{ height: `${h}%`, transition: 'height 0.6s ease' }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 uppercase">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status taqsimoti */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl">
          <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-6">
            <PieChart className="h-4 w-4 text-amber-300" /> Buyurtma Statuslari
          </h3>
          <div className="space-y-3">
            {statusDistribution.map((s, i) => {
              const total = Math.max(orderStats.count, 1);
              const pct = Math.round((s.count / total) * 100);
              return (
                <div key={s.status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.status}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">{s.count} ta ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* OXIRGI BUYURTMALAR + KAM ZAXIRA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Oxirgi buyurtmalar */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900">
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Receipt className="h-4 w-4 text-amber-400" /> Oxirgi Buyurtmalar
            </h3>
            <button onClick={() => changeTab('orders')} className="flex items-center gap-1 text-[10px] font-bold text-amber-300 hover:text-amber-200 transition">
              Barchasi <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-900">
            {recentOrders.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-600 font-mono uppercase">
                <Inbox className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                Hozircha buyurtmalar yo'q
              </div>
            )}
            {recentOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setOrderDetails(order)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-900/40 transition text-left group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-500 group-hover:text-amber-300 group-hover:border-amber-400/30 transition">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">{order.id}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {formatDate(order.createdAt)} • {(order.items || []).length} ta mahsulot
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-amber-300 font-mono">{formatPrice(order.total)}</p>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-bold border mt-1 ${STATUS_COLORS[order.status] || 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                    {order.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Kam zaxira */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900">
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" /> Kritik Zaxira
            </h3>
            <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded-lg border ${lowStockProducts.length > 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' : 'bg-amber-400/10 text-amber-300 border-amber-400/20'}`}>
              {lowStockProducts.length} TA
            </span>
          </div>
          <div className="divide-y divide-slate-900">
            {lowStockProducts.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-600 font-mono uppercase">
                <ShieldCheck className="h-6 w-6 text-amber-300 mx-auto mb-2" />
                Zaxira yetarli
              </div>
            )}
            {lowStockProducts.map((p) => (
              <div key={p._id || p.id} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-900/40 transition">
                <div className="h-9 w-9 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                  <img src={p.image || p.img} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">{p.name || p.title}</p>
                  <p className="text-[9px] text-slate-600 font-mono">{formatPrice(p.price)}</p>
                </div>
                <span className={`text-[10px] font-mono font-black px-2 py-1 rounded-lg border ${
                  Number(p.stock) === 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {p.stock || 0} ta
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP MAHSULOTLAR */}
      {topProducts.length > 0 && (
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl">
          <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-5">
            <Trophy className="h-4 w-4 text-amber-400" /> Eng Ko'p Sotilgan Mahsulotlar
          </h3>
          <div className="space-y-3">
            {topProducts.map((tp, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-6 text-center text-xs font-black font-mono text-slate-600">{i + 1}</span>
                <div className="h-9 w-9 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                  {tp.image && <img src={tp.image} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{tp.name}</p>
                  <div className="h-1.5 rounded-full bg-slate-900 mt-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500/60 to-amber-400" style={{ width: `${Math.min(100, (tp.qty / Math.max(topProducts[0].qty, 1)) * 100)}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-white font-mono">{tp.qty} dona</p>
                  <p className="text-[9px] text-slate-500 font-mono">{formatShortNumber(tp.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // MAHSULOTLAR TAB
  const renderProducts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* CHAP: FORMA */}
      <div className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-24">
        {/* Kategoriya qo'shish */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl border-t-amber-400/20">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
            <h2 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <FolderPlus className="h-4 w-4 text-amber-300" /> Yangi Kategoriya Qo'shish
            </h2>
          </div>
          <form onSubmit={handleCategorySubmit} className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition font-medium"
                placeholder="Masalan: iPhone, Aksessuarlar..."
              />
            </div>
            <button type="submit" disabled={isCatSubmitting} className="bg-amber-400 text-slate-950 px-4 rounded-xl flex items-center justify-center transition active:scale-95 disabled:opacity-50">
              {isCatSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 font-black" />}
            </button>
          </form>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {dbCategories.slice(0, 8).map((cat) => (
              <span key={cat.id} className="inline-flex items-center gap-1 rounded-md bg-slate-900 border border-slate-800 px-2 py-1 text-[9px] font-bold text-slate-400 font-mono">
                {cat.name}
                <button onClick={() => handleCategoryEditInit(cat)} className="text-slate-600 hover:text-amber-400 transition"><Edit3 className="h-3 w-3" /></button>
              </span>
            ))}
            {dbCategories.length > 8 && <span className="text-[9px] font-mono text-slate-600 self-center">+{dbCategories.length - 8} ta</span>}
          </div>
        </div>

        {/* Mahsulot formasi */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl border-t-amber-400/20">
          <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-5">
            <h2 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300" />
              {editingId ? "Sxemani O'zgartirish" : "Yangi Resurs Kiritish"}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-[9px] font-mono font-bold text-rose-400 hover:text-rose-300 transition flex items-center gap-1 uppercase">
                <X className="h-3 w-3" /> Bekor qilish
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Mahsulot Tizimli Nomi</label>
              <input
                type="text" required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition font-medium"
                placeholder='Masalan: MacBook Pro 16"'
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Baza Narxi (UZS)</label>
                <input
                  type="number" required value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition font-mono"
                  placeholder="3499000" min="0"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Sektor (Kategoriya)</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition font-medium"
                >
                  <option disabled value="Sektor tanlang">Sektor tanlang</option>
                  {dbCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Chegirma Foizi (%)</label>
                <input
                  type="number" value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition font-mono"
                  min="0" max="99"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Ombor Kvant Zaxirasi</label>
                <input
                  type="number" value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition font-mono"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url" required value={form.image}
                  onChange={(e) => { setForm({ ...form, image: e.target.value }); setImagePreview(e.target.value); }}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition"
                  placeholder="Rasm havolasini kiriting..."
                />
                <button type="button" onClick={() => setImagePreview(form.image)} className="p-2.5 rounded-xl border border-slate-900 bg-slate-950 text-slate-500 hover:text-amber-300 hover:border-amber-400/30 transition shrink-0">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
              {imagePreview && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-900 h-16 w-16 bg-slate-950/60">
                  <img src={imagePreview} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.style.opacity = 0.2; }} />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Texnik Xususiyatlar</label>
              <input
                type="text" value={form.specs}
                onChange={(e) => setForm({ ...form, specs: e.target.value })}
                className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition"
                placeholder="M3 Max, 48GB RAM, 1TB SSD"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Tavsif</label>
              <textarea
                rows="2" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition font-light"
                placeholder="Mahsulot haqida tavsif..."
              />
            </div>

            <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-900">
              <input
                type="checkbox" id="isNew" checked={form.isNew}
                onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                className="h-4 w-4 rounded bg-slate-950 text-amber-400 accent-amber-400 cursor-pointer"
              />
              <label htmlFor="isNew" className="text-[10px] font-bold text-slate-300 uppercase tracking-wider cursor-pointer font-mono select-none">
                "Yangi" Statusini Yoqish
              </label>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="submit" disabled={isSubmitting}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black uppercase tracking-wider transition active:scale-[0.98] disabled:opacity-50 ${
                  editingId ? 'bg-amber-400 text-slate-950' : 'bg-amber-400 text-slate-950'
                }`}
              >
                {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : editingId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingId ? "Sxemani Yangilash" : "Konveyerga Qo'shish"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="p-3 rounded-xl border border-slate-900 bg-slate-950 text-slate-500 hover:text-white transition">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* O'NG: JADVAL */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl overflow-hidden shadow-xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-900 bg-slate-950/80 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
              <input
                type="text" placeholder="Tizimdan qidirish..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-900 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-400/30 transition"
              />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowExportModal(true)} className="px-3 py-2 rounded-xl border border-slate-900 bg-slate-950 text-slate-400 hover:text-amber-300 hover:border-amber-400/30 transition flex items-center gap-1.5 text-[10px] font-bold uppercase font-mono">
                <Download className="h-3.5 w-3.5" /> Eksport
              </button>
              <button onClick={() => setShowImportModal(true)} className="px-3 py-2 rounded-xl border border-slate-900 bg-slate-950 text-slate-400 hover:text-amber-300 hover:border-amber-400/30 transition flex items-center gap-1.5 text-[10px] font-bold uppercase font-mono">
                <Upload className="h-3.5 w-3.5" /> Import
              </button>
              <div className="flex items-center gap-1 p-1 rounded-xl border border-slate-900 bg-slate-950">
                <button onClick={() => setProductViewMode('table')} className={`p-1.5 rounded-lg transition ${productViewMode === 'table' ? 'bg-amber-400/10 text-amber-300' : 'text-slate-500 hover:text-white'}`}>
                  <Grid2X2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setProductViewMode('cards')} className={`p-1.5 rounded-lg transition ${productViewMode === 'cards' ? 'bg-amber-400/10 text-amber-300' : 'text-slate-500 hover:text-white'}`}>
                  <ListIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Kategoriya filtrlari */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition shrink-0 ${
                selectedCategory === 'ALL' ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Barchasi
            </button>
            {dbCategories.map((cat) => (
              <button
                key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition border shrink-0 ${
                  selectedCategory === cat.id ? 'bg-amber-400 border-amber-400 text-slate-950' : 'bg-slate-900 border-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Qo'shimcha filtrlar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-900/60">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-[10px] font-bold font-mono text-amber-300 focus:outline-none cursor-pointer">
              <option value="default" className="bg-slate-950 text-slate-400">Standart tartib</option>
              <option value="price_asc" className="bg-slate-950 text-slate-400">Narx: O'sish</option>
              <option value="price_desc" className="bg-slate-950 text-slate-400">Narx: Kamayish</option>
              <option value="discount" className="bg-slate-950 text-slate-400">Chegirma bo'yicha</option>
              <option value="stock" className="bg-slate-950 text-slate-400">Zaxira bo'yicha</option>
              <option value="name_asc" className="bg-slate-950 text-slate-400">Nomi: A-Z</option>
              <option value="name_desc" className="bg-slate-950 text-slate-400">Nomi: Z-A</option>
            </select>
            <select value={lowStockFilter} onChange={(e) => setLowStockFilter(e.target.value)} className="bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-[10px] font-bold font-mono text-amber-400 focus:outline-none cursor-pointer">
              <option value="all" className="bg-slate-950 text-slate-400">Barcha zaxiralar</option>
              <option value="low" className="bg-slate-950 text-slate-400">Kam zaxira (&lt;5)</option>
              <option value="out" className="bg-slate-950 text-slate-400">Zaxirasi tugagan</option>
            </select>
            <input
              type="number" placeholder="Maks. narx" value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-[10px] font-mono text-white focus:outline-none focus:border-amber-400/30 transition w-28"
            />
            <button
              onClick={() => setOnlyDiscount(!onlyDiscount)}
              className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition ${
                onlyDiscount ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' : 'border-slate-900 text-slate-500 hover:text-white'
              }`}
            >
              <Percent className="h-3 w-3 inline mr-1" /> Chegirmalilar
            </button>
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition ${
                onlyInStock ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' : 'border-slate-900 text-slate-500 hover:text-white'
              }`}
            >
              <PackageCheck className="h-3 w-3 inline mr-1" /> Omborida bor
            </button>
            {selectedProductIds.length > 0 && (
              <button
                onClick={() => setShowProductBulkConfirm(true)}
                className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-wider transition hover:bg-rose-500/20"
              >
                <Trash2 className="h-3 w-3 inline mr-1" /> {selectedProductIds.length} ta o'chirish
              </button>
            )}
          </div>
        </div>

        {/* JADVAL / KARTALAR */}
        {productViewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectAllProducts && paginatedProducts.length > 0}
                      onChange={(e) => {
                        setSelectAllProducts(e.target.checked);
                        setSelectedProductIds(e.target.checked ? paginatedProducts.map(p => p._id || p.id) : []);
                      }}
                      className="h-3.5 w-3.5 accent-amber-400 cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Resurs (Node)</th>
                  <th className="p-4">Sektor Class</th>
                  <th className="p-4">Chegirma</th>
                  <th className="p-4">Kvant Zaxira</th>
                  <th className="p-4">Birlik Qiymati</th>
                  <th className="p-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs">
                {paginatedProducts.map((p) => {
                  const currentId = p._id || p.id;
                  const isLowStock = p.stock && Number(p.stock) < 5;
                  const displayDiscount = Number(p.discount) || 0;
                  const catName = typeof p.category === 'object' ? p.category?.name : p.category;
                  const isChecked = selectedProductIds.includes(currentId);

                  return (
                    <tr key={currentId} className={`hover:bg-slate-900/40 transition-colors group ${isChecked ? 'bg-amber-400/5' : ''}`}>
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProductIds(prev => [...prev, currentId]);
                            } else {
                              setSelectedProductIds(prev => prev.filter(id => id !== currentId));
                              setSelectAllProducts(false);
                            }
                          }}
                          className="h-3.5 w-3.5 accent-amber-400 cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                            <img src={p.image || p.img} alt="" className="h-full w-full object-cover group-hover:scale-110 transition" />
                            {displayDiscount > 0 && (
                              <div className="absolute top-0 left-0 bg-amber-400 text-[8px] font-black text-slate-950 px-1 py-0.5 rounded-br">-{displayDiscount}%</div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white uppercase group-hover:text-amber-300 transition">{p.name || p.title}</p>
                            <p className="text-[9px] text-slate-600 font-mono">ID: #{currentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-md bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400 font-mono">{catName}</span>
                      </td>
                      <td className="p-4 font-mono font-bold">
                        {displayDiscount > 0 ? <span className="text-amber-300">-{displayDiscount}%</span> : <span className="text-slate-700">—</span>}
                      </td>
                      <td className="p-4 font-mono font-bold">
                        <span className={isLowStock ? 'text-rose-400' : 'text-slate-300'}>{p.stock || 0} ta</span>
                      </td>
                      <td className="p-4 font-mono font-black text-slate-200">{formatPrice(p.price)}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => { setPreviewProduct(p); setShowPreviewModal(true); }} className="p-2 text-slate-500 hover:text-amber-300 transition">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleEditInit(p)} className="p-2 text-slate-500 hover:text-amber-400 transition">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => openDeleteConfirm(currentId, p.name || p.title, 'product')} className="p-2 text-slate-600 hover:text-rose-400 transition">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {paginatedProducts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-14 text-xs text-slate-600 font-mono uppercase">
                      <ShieldAlert className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                      Hech qanday resurs topilmadi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[560px] overflow-y-auto custom-scrollbar">
            {paginatedProducts.map((p) => {
              const currentId = p._id || p.id;
              const catName = typeof p.category === 'object' ? p.category?.name : p.category;
              return (
                <div key={currentId} className="rounded-xl border border-slate-900 bg-slate-950/60 p-3 flex gap-3 hover:border-amber-400/30 transition group">
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                    <img src={p.image || p.img} alt="" className="h-full w-full object-cover group-hover:scale-110 transition" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white truncate uppercase">{p.name || p.title}</p>
                    <p className="text-[9px] text-slate-600 font-mono mt-0.5">{catName} • ID: {currentId}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] font-black text-amber-300 font-mono">{formatPrice(p.price)}</span>
                      <span className={`text-[9px] font-mono font-bold ${Number(p.stock) < 5 ? 'text-rose-400' : 'text-slate-500'}`}>{p.stock || 0} ta</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => handleEditInit(p)} className="p-1.5 text-slate-500 hover:text-amber-400 transition"><Edit3 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => openDeleteConfirm(currentId, p.name || p.title, 'product')} className="p-1.5 text-slate-600 hover:text-rose-400 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalProductPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-900">
            <p className="text-[10px] font-mono text-slate-500">
              {filteredProducts.length} tadan {(safeProductPage - 1) * itemsPerPage + 1}–{Math.min(safeProductPage * itemsPerPage, filteredProducts.length)} ko'rsatilmoqda
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safeProductPage === 1}
                className="p-2 rounded-lg border border-slate-900 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: totalProductPages }, (_, i) => i + 1).slice(0, 5).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-lg border text-[10px] font-mono font-bold transition ${
                    safeProductPage === page ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-slate-900 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalProductPages, p + 1))}
                disabled={safeProductPage === totalProductPages}
                className="p-2 rounded-lg border border-slate-900 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // KATEGORIYALAR TAB
  const renderCategories = () => {
    const catsWithCount = dbCategories.map(cat => ({
      ...cat,
      count: (products || []).filter(p => {
        const catName = typeof p.category === 'object' ? p.category?.name : p.category;
        return String(catName || '').toUpperCase() === String(cat.name || '').toUpperCase();
      }).length,
    }));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Qo'shish formasi */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl border-t-amber-400/20 lg:sticky lg:top-24">
          <h2 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-5">
            <FolderPlus className="h-4 w-4 text-amber-300" /> Yangi Kategoriya
          </h2>
          <form onSubmit={handleCategorySubmit} className="space-y-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition"
              placeholder="Kategoriya nomi..."
            />
            <button type="submit" disabled={isCatSubmitting} className="w-full bg-amber-400 text-slate-950 rounded-xl py-3 text-xs font-black uppercase tracking-wider hover:bg-amber-300 transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
              {isCatSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Qo'shish
            </button>
          </form>
          <div className="mt-5 pt-5 border-t border-slate-900">
            <p className="text-[10px] font-mono text-slate-500 mb-3 flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-amber-300" /> Jami: {dbCategories.length} ta kategoriya
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-3 text-center">
                <p className="text-lg font-black text-amber-300 font-mono">{catsWithCount.filter(c => c.count > 0).length}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono mt-0.5">Faol</p>
              </div>
              <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-3 text-center">
                <p className="text-lg font-black text-slate-400 font-mono">{catsWithCount.filter(c => c.count === 0).length}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono mt-0.5">Bo'sh</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kategoriya jadvali */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-900 flex items-center justify-between">
            <h2 className="text-xs font-black text-white uppercase tracking-wider font-mono">Kategoriyalar Matriksi</h2>
            <span className="text-[10px] font-mono text-slate-500">{dbCategories.length} ta yozuv</span>
          </div>
          <div className="divide-y divide-slate-900">
            {catsWithCount.map((cat) => (
              <div key={cat.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-900/30 transition group">
                <div className="h-10 w-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                  <Layers className="h-4 w-4 text-amber-300" />
                </div>
                <div className="flex-1 min-w-0">
                  {categoryEditId === cat.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={categoryEditName}
                        onChange={(e) => setCategoryEditName(e.target.value)}
                        className="flex-1 rounded-lg border border-amber-500/30 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <button onClick={handleCategoryUpdate} className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black uppercase"><Check className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setCategoryEditId(null)} className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-white uppercase">{cat.name}</p>
                  )}
                  <p className="text-[10px] text-slate-600 font-mono mt-0.5">ID: {cat.id}</p>
                </div>
                <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 shrink-0">
                  {cat.count} ta tovar
                </span>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => categoryEditId === cat.id ? setCategoryEditId(null) : handleCategoryEditInit(cat)}
                    className="p-2 text-slate-500 hover:text-amber-400 transition"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => openDeleteConfirm(cat.id, cat.name, 'category')} className="p-2 text-slate-600 hover:text-rose-400 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {catsWithCount.length === 0 && (
              <div className="text-center py-14 text-xs text-slate-600 font-mono uppercase">
                <Layers className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                Kategoriyalar topilmadi
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // BUYURTMALAR TAB
  const renderOrders = () => (
    <div className="space-y-6">
      {/* Statistika chizig'i */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Jami buyurtmalar</p>
          <p className="text-xl font-black text-white mt-1 font-mono">{(orders || []).length}</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Faol (yakunlanmagan)</p>
          <p className="text-xl font-black text-amber-400 mt-1 font-mono">{(orders || []).filter(o => !['Yetkazildi', 'Bekor qilindi', 'Qaytarildi'].includes(o.status)).length}</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Yakunlangan</p>
          <p className="text-xl font-black text-amber-300 mt-1 font-mono">{(orders || []).filter(o => o.status === 'Yetkazildi').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Bekor qilingan</p>
          <p className="text-xl font-black text-rose-400 mt-1 font-mono">{(orders || []).filter(o => o.status === 'Bekor qilindi').length}</p>
        </div>
      </div>

      {/* Filtrlar */}
      <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
            <input
              type="text" placeholder="Buyurtma ID yoki mijoz qidirish..." value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-900 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-400/30 transition"
            />
          </div>
          <select
            value={selectedOrderStatus}
            onChange={(e) => setSelectedOrderStatus(e.target.value)}
            className="bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono"
          >
            <option value="all">Barcha statuslar</option>
            {ORDER_STATUSES.map(s => <option key={s} value={s} className="bg-slate-950 text-slate-400">{s}</option>)}
          </select>
          <input
            type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono [color-scheme:dark]"
          />
          <input
            type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono [color-scheme:dark]"
          />
        </div>

        {/* Ommaviy amallar */}
        {selectedOrders.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-900/60">
            <span className="text-[10px] font-mono font-bold text-amber-300">{selectedOrders.length} ta tanlandi:</span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-[10px] font-bold font-mono text-white focus:outline-none"
            >
              <option value="">Amal tanlang...</option>
              {ORDER_STATUSES.filter(s => s !== 'Bekor qilindi').map(s => (
                <option key={s} value={s} className="bg-slate-950 text-slate-400">Status: {s}</option>
              ))}
              <option value="delete" className="bg-slate-950 text-rose-400">Bekor qilish</option>
            </select>
            <button
              onClick={() => setShowBulkConfirm(true)}
              disabled={!bulkAction}
              className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider disabled:opacity-40 transition hover:bg-amber-300"
            >
              Qo'llash
            </button>
            <button onClick={() => { setSelectedOrders([]); setSelectAllOrders(false); }} className="px-3 py-1.5 rounded-lg border border-slate-900 text-slate-400 hover:text-white text-[10px] font-bold uppercase transition">
              Tozalash
            </button>
          </div>
        )}
      </div>

      {/* Buyurtmalar jadvali */}
      <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectAllOrders && filteredOrders.length > 0}
                    onChange={(e) => {
                      setSelectAllOrders(e.target.checked);
                      setSelectedOrders(e.target.checked ? filteredOrders.map(o => o.id) : []);
                    }}
                    className="h-3.5 w-3.5 accent-amber-400 cursor-pointer"
                  />
                </th>
                <th className="p-4">Buyurtma ID</th>
                <th className="p-4">Sana</th>
                <th className="p-4">Mahsulotlar</th>
                <th className="p-4">To'lov</th>
                <th className="p-4">Summa</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-xs">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrders.includes(order.id);
                const payMethod = PAYMENT_METHODS[order.paymentMethod];
                return (
                  <tr key={order.id} className={`hover:bg-slate-900/40 transition-colors group ${isSelected ? 'bg-amber-400/5' : ''}`}>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders(prev => [...prev, order.id]);
                          } else {
                            setSelectedOrders(prev => prev.filter(id => id !== order.id));
                            setSelectAllOrders(false);
                          }
                        }}
                        className="h-3.5 w-3.5 accent-amber-400 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <button onClick={() => setOrderDetails(order)} className="font-bold text-amber-300 hover:text-amber-200 transition font-mono group-hover:underline">
                        {order.id}
                      </button>
                    </td>
                    <td className="p-4 text-slate-400 font-mono">
                      <p>{formatDate(order.createdAt)}</p>
                      <p className="text-[9px] text-slate-600">{formatTime(order.createdAt)}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {(order.items || []).slice(0, 3).map((item, i) => (
                            <div key={i} className="h-7 w-7 rounded-lg overflow-hidden border-2 border-slate-950 bg-slate-900">
                              {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{(order.items || []).length} dona</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-bold border font-mono ${payMethod?.color || 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                        {payMethod?.label || order.paymentMethod || '—'}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-black text-amber-300">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                        className={`rounded-lg border px-2 py-1 text-[10px] font-bold font-mono focus:outline-none cursor-pointer ${STATUS_COLORS[order.status] || 'bg-slate-900 text-slate-400 border-slate-800'}`}
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s} className="bg-slate-950 text-slate-300">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => setOrderDetails(order)} className="p-2 text-slate-500 hover:text-amber-300 transition">
                          <Eye className="h-4 w-4" />
                        </button>
                        {order.status !== 'Bekor qilindi' && order.status !== 'Yetkazildi' && (
                          <button onClick={() => handleCancelOrder(order.id)} className="p-2 text-slate-600 hover:text-rose-400 transition">
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-14 text-xs text-slate-600 font-mono uppercase">
                    <ShoppingCart className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                    Buyurtmalar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // KUPONLAR TAB
  const renderCoupons = () => (
    <div className="space-y-6">
      {/* Sarlavha + qo'shish */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-slate-500">Chegirma kodlari boshqaruvi</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
            <input
              type="text" placeholder="Kupon qidirish..." value={couponSearch}
              onChange={(e) => setCouponSearch(e.target.value)}
              className="w-full sm:w-56 rounded-xl border border-slate-900 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-400/30 transition"
            />
          </div>
          <button
            onClick={() => { setEditingCoupon(null); setNewCoupon({ code: '', discount: '', minSpend: '', active: true }); setShowCouponModal(true); }}
            className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-amber-300 transition flex items-center gap-2 shrink-0"
          >
            <Plus className="h-4 w-4" /> Yangi kupon
          </button>
        </div>
      </div>

      {/* Kuponlar grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoupons.map((coupon) => {
          const active = coupon.active !== false;
          return (
            <div key={coupon.code} className={`rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
              active ? 'border-amber-400/20 bg-gradient-to-br from-amber-400/5 to-slate-950/40' : 'border-slate-900 bg-slate-950/40 opacity-70'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl border ${active ? 'bg-amber-400/10 border-amber-400/20 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    <Percent className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white font-mono tracking-widest">{coupon.code}</p>
                    <p className="text-[9px] text-slate-500 font-mono uppercase">{active ? 'Faol' : 'O\'chirilgan'}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleCouponActive(coupon)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${active ? 'bg-amber-400' : 'bg-slate-800'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-slate-950/60 border border-slate-900 p-3 text-center">
                  <p className="text-lg font-black text-amber-300 font-mono">-{coupon.discount}%</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono mt-0.5">Chegirma</p>
                </div>
                <div className="rounded-xl bg-slate-950/60 border border-slate-900 p-3 text-center">
                  <p className="text-sm font-black text-white font-mono">{formatShortNumber(coupon.minSpend || 0)}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono mt-0.5">Min. xarid</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditCoupon(coupon)} className="flex-1 rounded-xl border border-slate-900 bg-slate-950 py-2 text-[10px] font-bold uppercase text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition flex items-center justify-center gap-1.5">
                  <Edit3 className="h-3 w-3" /> Tahrirlash
                </button>
                <button onClick={() => openDeleteConfirm(coupon.code, `Kupon ${coupon.code}`, 'coupon')} className="flex-1 rounded-xl border border-slate-900 bg-slate-950 py-2 text-[10px] font-bold uppercase text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition flex items-center justify-center gap-1.5">
                  <Trash2 className="h-3 w-3" /> O'chirish
                </button>
              </div>
            </div>
          );
        })}
        {filteredCoupons.length === 0 && (
          <div className="col-span-full text-center py-16 text-xs text-slate-600 font-mono uppercase">
            <Percent className="h-6 w-6 text-slate-700 mx-auto mb-2" />
            Kuponlar topilmadi
          </div>
        )}
      </div>
    </div>
  );

  // FOYDALANUVCHILAR TAB
  const renderUsers = () => (
    <div className="space-y-6">
      {/* Statistika */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Jami foydalanuvchilar</p>
          <p className="text-xl font-black text-white mt-1 font-mono">{(contextUsers || []).length}</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Adminlar</p>
          <p className="text-xl font-black text-rose-400 mt-1 font-mono">{(contextUsers || []).filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Moderatorlar</p>
          <p className="text-xl font-black text-amber-300 mt-1 font-mono">{(contextUsers || []).filter(u => u.role === 'moderator').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Bloklanganlar</p>
          <p className="text-xl font-black text-amber-400 mt-1 font-mono">{(contextUsers || []).filter(u => u.status === 'blocked').length}</p>
        </div>
      </div>

      {/* Filtrlar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
          <input
            type="text" placeholder="Foydalanuvchi qidirish..." value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-900 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-400/30 transition"
          />
        </div>
        <select
          value={selectedUserRole}
          onChange={(e) => setSelectedUserRole(e.target.value)}
          className="bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono"
        >
          <option value="all">Barcha rollar</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="user">Foydalanuvchi</option>
        </select>
        <button
          onClick={() => { setEditingUser(null); setNewUser({ name: '', email: '', role: 'user', password: '' }); setShowUserModal(true); }}
          className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-amber-300 transition flex items-center gap-2 shrink-0"
        >
          <UserPlus className="h-4 w-4" /> Yangi foydalanuvchi
        </button>
      </div>

      {/* Foydalanuvchilar jadvali */}
      <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                <th className="p-4">Foydalanuvchi</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Status</th>
                <th className="p-4">Qo'shilgan sana</th>
                <th className="p-4">Buyurtmalar</th>
                <th className="p-4">Sarflangan</th>
                <th className="p-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-xs">
              {filteredUsers.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-slate-900/40 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
                        user.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        user.role === 'moderator' ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' :
                        'bg-amber-400/10 text-amber-300 border-amber-400/20'
                      }`}>
                        {(user.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-amber-300 transition">{user.name}</p>
                        <p className="text-[9px] text-slate-600 font-mono">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-bold border font-mono uppercase ${ROLE_COLORS[user.role] || 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[9px] font-bold border font-mono uppercase ${USER_STATUS_COLORS[user.status] || 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-amber-400' : user.status === 'blocked' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                      {user.status === 'active' ? 'Faol' : user.status === 'blocked' ? 'Bloklangan' : 'Kutilmoqda'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{formatDate(user.joined)}</td>
                  <td className="p-4 font-mono font-bold text-slate-300">{user.orders || 0}</td>
                  <td className="p-4 font-mono font-black text-amber-300">{formatShortNumber(user.spent)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => toggleUserStatus(user)} className={`p-2 transition ${user.status === 'active' ? 'text-slate-500 hover:text-amber-400' : 'text-slate-500 hover:text-amber-300'}`} title={user.status === 'active' ? 'Bloklash' : 'Faollashtirish'}>
                        {user.status === 'active' ? <Ban className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      <button onClick={() => handleEditUser(user)} className="p-2 text-slate-500 hover:text-amber-400 transition">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => openDeleteConfirm(user._id || user.id, user.name, 'user')} className="p-2 text-slate-600 hover:text-rose-400 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-14 text-xs text-slate-600 font-mono uppercase">
                    <Users className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                    Foydalanuvchilar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // FAOLIYAT TAB
  const renderActivity = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-slate-500">Tizim o'zgarishlari va hodisalar tarixi</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'product', 'order', 'user', 'coupon', 'category'].map(f => (
            <button
              key={f}
              onClick={() => setActivityFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition border ${
                activityFilter === f ? 'bg-amber-400/10 text-amber-300 border-amber-400/30' : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-white'
              }`}
            >
              {f === 'all' ? 'Barchasi' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Vaqt chizig'i */}
      <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl">
        <div className="relative space-y-1">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-900" />
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="relative flex items-start gap-4 p-3 rounded-xl hover:bg-slate-900/30 transition group">
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-800 bg-slate-950 group-hover:border-amber-400/30 transition">
                <Activity className="h-3.5 w-3.5 text-amber-300" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-xs font-bold text-white">{activity.action}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{activity.user} • {activity.time}</p>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase font-mono shrink-0 ${
                activity.type === 'product' ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' :
                activity.type === 'order' ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' :
                activity.type === 'user' ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' :
                activity.type === 'coupon' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                activity.type === 'category' ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' :
                'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {activity.type}
              </span>
            </div>
          ))}
          {filteredActivities.length === 0 && (
            <div className="text-center py-14 text-xs text-slate-600 font-mono uppercase">
              <Activity className="h-6 w-6 text-slate-700 mx-auto mb-2" />
              Faoliyat tarixi bo'sh
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ANALITIKA TAB
  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Yuqori ko'rsatkichlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-amber-400/10 text-amber-300 rounded-xl border border-amber-400/20"><TrendingUp className="h-4 w-4" /></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Umumiy savdo</p>
          </div>
          <p className="text-lg font-black text-white font-mono">{formatShortNumber(orderStats.totalRevenue)}</p>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">barcha vaqt davri</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-amber-400/10 text-amber-300 rounded-xl border border-amber-400/20"><ShoppingBag className="h-4 w-4" /></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Sotilgan tovarlar</p>
          </div>
          <p className="text-lg font-black text-white font-mono">{orderStats.totalItems} <span className="text-xs text-slate-600 font-normal">dona</span></p>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">buyurtmalar bo'yicha</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-amber-400/10 text-amber-300 rounded-xl border border-amber-400/20"><Wallet className="h-4 w-4" /></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">O'rtacha chek</p>
          </div>
          <p className="text-lg font-black text-white font-mono">{formatShortNumber(orderStats.avgOrder)}</p>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">{orderStats.count} ta buyurtma asosida</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20"><Coins className="h-4 w-4" /></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Bonus balans</p>
          </div>
          <p className="text-lg font-black text-white font-mono">{bonusPoints} <span className="text-xs text-slate-600 font-normal">bal</span></p>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">mijozlar dasturi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kategoriya taqsimoti */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl">
          <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-6">
            <Layers className="h-4 w-4 text-amber-300" /> Kategoriyalar bo'yicha taqsimot
          </h3>
          <div className="space-y-3">
            {categoryDistribution.map((cat, i) => {
              const max = Math.max(categoryDistribution[0]?.count || 1, 1);
              const pct = Math.round((cat.count / max) * 100);
              return (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 truncate text-[10px] font-bold text-slate-400 uppercase tracking-wider">{cat.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  </div>
                  <span className="w-12 text-right text-[10px] font-mono font-bold text-slate-500">{cat.count}</span>
                </div>
              );
            })}
            {categoryDistribution.length === 0 && (
              <p className="text-center py-8 text-xs text-slate-600 font-mono uppercase">Ma'lumot yo'q</p>
            )}
          </div>
        </div>

        {/* Status donut */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl">
          <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-6">
            <PieChart className="h-4 w-4 text-amber-300" /> Status Dastasi (Donut)
          </h3>
          {(() => {
            const total = statusDistribution.reduce((s, d) => s + d.count, 0);
            let acc = 0;
            const segments = statusDistribution.filter(d => d.count > 0).map((d, i) => {
              const start = (acc / Math.max(total, 1)) * 360;
              acc += d.count;
              const end = (acc / Math.max(total, 1)) * 360;
              return `conic-gradient(${CHART_COLORS[i % CHART_COLORS.length]} ${start}deg ${end}deg)`;
            });
            const background = segments.length > 0 ? segments.join(', ') : 'conic-gradient(#17140f 0deg 360deg)';
            return (
              <div className="flex flex-col items-center gap-6">
                <div className="relative h-40 w-40 rounded-full" style={{ background }}>
                  <div className="absolute inset-4 rounded-full bg-slate-950 flex items-center justify-center flex-col">
                    <p className="text-2xl font-black text-white font-mono">{total}</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">buyurtma</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {statusDistribution.filter(d => d.count > 0).map((d, i) => (
                    <div key={d.status} className="flex items-center gap-2 rounded-lg bg-slate-950/60 border border-slate-900 px-3 py-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-[10px] text-slate-400 flex-1 truncate">{d.status}</span>
                      <span className="text-[10px] font-mono font-bold text-white">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Yalpi qiymatlar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-2 flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-amber-300" /> Katalog qiymati
          </p>
          <p className="text-xl font-black text-white font-mono">{formatShortNumber(analytics.grossValuation)}</p>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">{analytics.total} ta mahsulot x ombor narxi</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-2 flex items-center gap-2">
            <BadgePercent className="h-3.5 w-3.5 text-amber-400" /> Chegirmali tovarlar
          </p>
          <p className="text-xl font-black text-amber-300 font-mono">{analytics.discountedCount} <span className="text-xs text-slate-600 font-normal">ta</span></p>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">umumiy katalogning {analytics.total ? Math.round((analytics.discountedCount / analytics.total) * 100) : 0}%</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-2 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Kam zaxira xavfi
          </p>
          <p className="text-xl font-black text-amber-400 font-mono">{analytics.lowStockCount} <span className="text-xs text-slate-600 font-normal">tovar</span></p>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">5 donadan kam omborda</p>
        </div>
      </div>
    </div>
  );

  // BLOG TAB
  const renderBlog = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-amber-300" /> Blog boshqaruvi
          </h2>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">{(blogPosts || []).length} ta maqola • saytda avtomatik ko'rsatiladi</p>
        </div>
        <button
          onClick={() => { setEditingBlogId(null); setBlogForm({ title: '', excerpt: '', category: 'Maslahatlar', date: '', readTime: 5, image: '', author: 'Grand Decor Studio', content: '' }); setShowBlogModal(true); }}
          className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-amber-300 transition flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Yangi maqola
        </button>
      </div>

      {/* Maqolalar jadvali */}
      <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                <th className="p-4">Maqola</th>
                <th className="p-4">Kategoriya</th>
                <th className="p-4">Sana</th>
                <th className="p-4">Ko'rishlar</th>
                <th className="p-4">Layklar</th>
                <th className="p-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-xs">
              {(blogPosts || []).map(post => (
                <tr key={post.id} className="hover:bg-slate-900/40 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shrink-0">
                        <img src={post.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white group-hover:text-amber-300 transition line-clamp-1 max-w-xs">{post.title}</p>
                        <p className="text-[9px] text-slate-600 font-mono mt-0.5">{post.author} • {post.readTime} daqiqa</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex rounded-md px-2 py-0.5 text-[9px] font-bold border font-mono uppercase bg-amber-500/10 text-amber-400 border-amber-500/20">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{formatDate(post.date)}</td>
                  <td className="p-4 font-mono font-bold text-slate-300 flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-slate-600" /> {post.views || 0}
                  </td>
                  <td className="p-4 font-mono font-bold text-amber-300">{post.likes || 0}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => handleEditBlog(post)} className="p-2 text-slate-500 hover:text-amber-400 transition">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteBlog(post)} className="p-2 text-slate-600 hover:text-rose-400 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(blogPosts || []).length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-14 text-xs text-slate-600 font-mono uppercase">
                    <Newspaper className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                    Maqolalar yo'q
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BLOG MODAL */}
      {showBlogModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar bg-slate-950 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-black text-white font-mono uppercase flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-amber-300" />
                {editingBlogId ? 'Maqolani Tahrirlash' : 'Yangi Maqola'}
              </h3>
              <button onClick={() => setShowBlogModal(false)} className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Sarlavha *</label>
                <input
                  type="text" required value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition"
                  placeholder="Maqola sarlavhasi..."
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Kategoriya</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition"
                  >
                    <option>Interyer</option>
                    <option>Maslahatlar</option>
                    <option>Dekor</option>
                    <option>Yangiliklar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Sana</label>
                  <input
                    type="date" value={blogForm.date}
                    onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition font-mono [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">O'qish (daqiqa)</label>
                  <input
                    type="number" min="1" value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Muallif</label>
                  <input
                    type="text" value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Rasm URL</label>
                <input
                  type="text" value={blogForm.image}
                  onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition"
                  placeholder="/banner/banner1.png yoki https://..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Qisqacha tavsif (kartada)</label>
                <textarea
                  rows="2" value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition resize-none"
                  placeholder="Maqola haqida qisqacha..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Maqola matni (har bir qator — alohida xatboshi)</label>
                <textarea
                  rows="8" value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition resize-y"
                  placeholder="Birinchi xatboshi...&#10;Ikkinchi xatboshi..."
                />
              </div>
              <button type="submit" className="w-full bg-amber-400 text-slate-950 rounded-xl py-3 text-xs font-black uppercase tracking-wider hover:bg-amber-300 transition">
                {editingBlogId ? 'Yangilash' : "Qo'shish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // BILDIRISHNOMALAR TAB
  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
              <Bell className="h-5 w-5" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-black text-white font-mono uppercase">Bildirishnoma Markazi</p>
            <p className="text-[10px] text-slate-500 font-mono">{unreadCount} ta o'qilmagan</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl border border-slate-900 bg-slate-950">
            {['all', 'unread', 'read'].map(f => (
              <button
                key={f}
                onClick={() => setNotificationFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition ${
                  notificationFilter === f ? 'bg-amber-400/10 text-amber-300' : 'text-slate-500 hover:text-white'
                }`}
              >
                {f === 'all' ? 'Barchasi' : f === 'unread' ? "O'qilmagan" : 'O\'qilgan'}
              </button>
            ))}
          </div>
          <button
            onClick={markAllNotificationsRead}
            className="px-3 py-2 rounded-xl border border-slate-900 bg-slate-950 text-slate-400 hover:text-amber-300 hover:border-amber-400/30 transition flex items-center gap-1.5 text-[10px] font-bold uppercase font-mono"
          >
            <CheckCheck className="h-3.5 w-3.5" /> Hammasini o'qildi
          </button>
          <button
            onClick={clearAllNotifications}
            className="px-3 py-2 rounded-xl border border-slate-900 bg-slate-950 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition flex items-center gap-1.5 text-[10px] font-bold uppercase font-mono"
          >
            <Trash2 className="h-3.5 w-3.5" /> Tozalash
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl overflow-hidden shadow-xl divide-y divide-slate-900">
        {filteredNotifications.length === 0 && (
          <div className="text-center py-16 text-xs text-slate-600 font-mono uppercase">
            <Bell className="h-6 w-6 text-slate-700 mx-auto mb-2" />
            Bildirishnomalar yo'q
          </div>
        )}
        {filteredNotifications.map((notif) => (
          <button
            key={notif.id}
            onClick={() => markNotificationRead(notif.id)}
            className={`w-full flex items-start gap-4 px-6 py-4 transition text-left hover:bg-slate-900/30 ${!notif.read ? 'bg-amber-400/[0.03]' : 'opacity-60'}`}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
              notif.type === 'success' ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' :
              notif.type === 'error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
              notif.type === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              'bg-amber-400/10 text-amber-300 border-amber-400/20'
            }`}>
              {notif.type === 'success' && <CheckCircle className="h-4 w-4" />}
              {notif.type === 'error' && <XCircle className="h-4 w-4" />}
              {notif.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
              {notif.type === 'info' && <Info className="h-4 w-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold ${!notif.read ? 'text-white' : 'text-slate-400'}`}>{notif.message}</p>
              <p className="text-[10px] text-slate-600 mt-1 font-mono">{formatDate(notif.time)} • {formatTime(notif.time)}</p>
            </div>
            {!notif.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );

  // SOZLAMALAR TAB
  const renderSettings = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Sozlamalar menyusi */}
      <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-4 lg:sticky lg:top-24">
        {[
          { id: 'general', label: 'Umumiy sozlamalar', icon: Settings },
          { id: 'delivery', label: 'Yetkazib berish', icon: Truck },
          { id: 'notification', label: 'Bildirishnomalar', icon: Bell },
          { id: 'danger', label: 'Xavfli zona', icon: AlertTriangle },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setSettingsTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold transition mb-1 ${
                settingsTab === item.id
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Icon className={`h-4 w-4 ${settingsTab === item.id ? 'text-amber-300' : 'text-slate-500'}`} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Sozlamalar kontenti */}
      <div className="lg:col-span-2 space-y-6">
        {settingsTab === 'general' && (
          <form onSubmit={handleSettingsSave} className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-900">
              <Settings className="h-4 w-4 text-amber-300" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Umumiy sozlamalar</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Sayt tili</label>
                <select
                  value={tempSettings.language || 'uz'}
                  onChange={(e) => setTempSettings({ ...tempSettings, language: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition"
                >
                  <option value="uz" className="bg-slate-950 text-slate-400">O'zbek tili</option>
                  <option value="ru" className="bg-slate-950 text-slate-400">Русский язык</option>
                  <option value="en" className="bg-slate-950 text-slate-400">English</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Valyuta</label>
                <select
                  value={tempSettings.currency || 'UZS'}
                  onChange={(e) => setTempSettings({ ...tempSettings, currency: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition"
                >
                  <option value="UZS" className="bg-slate-950 text-slate-400">UZS — So'm</option>
                  <option value="USD" className="bg-slate-950 text-slate-400">USD — Dollar</option>
                  <option value="RUB" className="bg-slate-950 text-slate-400">RUB — Rubl</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { key: 'notifications', label: 'Tizim bildirishnomalari', desc: 'Global bildirishnoma to\'xtashini yoqish/o\'chirish' },
                { key: 'autoSave', label: 'Avtomatik saqlash', desc: 'O\'zgarishlarni avtomatik sinxronlash' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/60 p-4">
                  <div>
                    <p className="text-xs font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTempSettings({ ...tempSettings, [item.key]: !tempSettings[item.key] })}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ${tempSettings[item.key] ? 'bg-amber-400' : 'bg-slate-800'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${tempSettings[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>

            <button type="submit" className="w-full bg-amber-400 text-slate-950 rounded-xl py-3 text-xs font-black uppercase tracking-wider hover:bg-amber-300 transition flex items-center justify-center gap-2">
              <Save className="h-4 w-4" /> Sozlamalarni saqlash
            </button>
          </form>
        )}

        {settingsTab === 'delivery' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-amber-300" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Yetkazib berish zonalari</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetDeliveryZones}
                    className="px-3 py-1.5 rounded-lg border border-slate-900 text-[10px] font-bold text-slate-400 hover:text-white transition"
                  >
                    Standartga qaytarish
                  </button>
                  <span className="text-[10px] font-mono text-slate-500">{deliveryZones?.length || 0} ta zona</span>
                </div>
              </div>

              {/* Yangi zona qo'shish */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
                <input
                  type="text"
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  placeholder="Zona nomi"
                  className="col-span-2 sm:col-span-2 rounded-xl border border-slate-900 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-amber-400/30 focus:outline-none"
                />
                <input
                  type="number"
                  value={newZone.price}
                  onChange={(e) => setNewZone({ ...newZone, price: e.target.value })}
                  placeholder="Narx (so'm)"
                  className="rounded-xl border border-slate-900 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-amber-400/30 focus:outline-none font-mono"
                />
                <input
                  type="text"
                  value={newZone.days}
                  onChange={(e) => setNewZone({ ...newZone, days: e.target.value })}
                  placeholder="Muddat (1-2 kun)"
                  className="rounded-xl border border-slate-900 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-amber-400/30 focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newZone.freeFrom}
                    onChange={(e) => setNewZone({ ...newZone, freeFrom: e.target.value })}
                    placeholder="Bepul (so'm)"
                    className="flex-1 rounded-xl border border-slate-900 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-amber-400/30 focus:outline-none font-mono"
                  />
                  <button
                    onClick={() => {
                      if (!newZone.name.trim() || !newZone.price) { showToast("Zona nomi va narxini kiriting!", "error"); return; }
                      addDeliveryZone({
                        name: newZone.name.trim(),
                        price: Number(newZone.price) || 0,
                        days: newZone.days || '1-2 kun',
                        freeFrom: Number(newZone.freeFrom) || 0,
                      });
                      addActivityLog?.({ action: `Yangi zona qo'shildi: ${newZone.name.trim()}`, user: 'Admin', type: 'settings' });
                      setNewZone({ name: '', price: '', days: '', freeFrom: '' });
                    }}
                    className="px-3 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 transition shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Zonalar jadvali */}
              <div className="mt-5 space-y-2">
                {(deliveryZones || []).map(zone => (
                  <div key={zone.id} className="rounded-xl border border-slate-900 bg-slate-950/60 p-3">
                    {editingZoneId === zone.id ? (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <input
                          type="text" value={zoneEdit.name}
                          onChange={(e) => setZoneEdit({ ...zoneEdit, name: e.target.value })}
                          className="col-span-2 rounded-lg border border-amber-500/30 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none"
                        />
                        <input
                          type="number" value={zoneEdit.price}
                          onChange={(e) => setZoneEdit({ ...zoneEdit, price: e.target.value })}
                          className="rounded-lg border border-amber-500/30 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                        />
                        <input
                          type="text" value={zoneEdit.days}
                          onChange={(e) => setZoneEdit({ ...zoneEdit, days: e.target.value })}
                          className="rounded-lg border border-amber-500/30 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none"
                        />
                        <div className="flex gap-1.5">
                          <input
                            type="number" value={zoneEdit.freeFrom}
                            onChange={(e) => setZoneEdit({ ...zoneEdit, freeFrom: e.target.value })}
                            className="flex-1 rounded-lg border border-amber-500/30 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                          />
                          <button
                            onClick={() => {
                              updateDeliveryZone(zone.id, {
                                name: zoneEdit.name.trim() || zone.name,
                                price: Number(zoneEdit.price) || 0,
                                days: zoneEdit.days || zone.days,
                                freeFrom: Number(zoneEdit.freeFrom) || 0,
                              });
                              addActivityLog?.({ action: `Zona yangilandi: ${zoneEdit.name || zone.name}`, user: 'Admin', type: 'settings' });
                              setEditingZoneId(null);
                            }}
                            className="px-2.5 rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition shrink-0"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingZoneId(null)}
                            className="px-2.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition shrink-0"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300">
                          <Truck className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white">{zone.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{zone.days} • Bepul: {formatShortNumber(zone.freeFrom)} dan</p>
                        </div>
                        <span className="text-xs font-mono font-black text-amber-300 shrink-0">{formatPrice(zone.price)}</span>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setEditingZoneId(zone.id);
                              setZoneEdit({ name: zone.name, price: String(zone.price), days: zone.days, freeFrom: String(zone.freeFrom) });
                            }}
                            className="p-2 text-slate-500 hover:text-amber-400 transition"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if ((deliveryZones || []).length <= 1) { showToast("Kamida 1 ta zona qolishi kerak!", "error"); return; }
                              deleteDeliveryZone(zone.id);
                              addActivityLog?.({ action: `Zona o'chirildi: ${zone.name}`, user: 'Admin', type: 'settings' });
                            }}
                            className="p-2 text-slate-600 hover:text-rose-400 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {(deliveryZones || []).length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-600 font-mono uppercase">Zonalar mavjud emas</div>
                )}
              </div>
            </div>

            <p className="text-[10px] text-slate-600 font-light flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" /> Zonalar mijozlar buyurtma sahifasida avtomatik ko'rsatiladi va hisob-kitobda ishlatiladi.
            </p>
          </div>
        )}

        {settingsTab === 'notification' && (
          <form onSubmit={handleNotificationSettingsSave} className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-900">
              <Bell className="h-4 w-4 text-amber-300" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Bildirishnoma sozlamalari</h3>
            </div>
            {[
              { key: 'orderUpdates', label: 'Buyurtma yangilanishlari', desc: 'Buyurtma statusi o\'zgarganda xabar berish' },
              { key: 'promotions', label: 'Aksiyalar', desc: 'Yangi kampaniya va aksiyalar haqida xabar' },
              { key: 'newArrivals', label: 'Yangi kelganlar', desc: 'Yangi mahsulotlar qo\'shilganda xabar' },
              { key: 'priceDrops', label: 'Narx pasayishi', desc: 'Narx o\'zgarganda ogohlantirish' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-950/60 p-4">
                <div>
                  <p className="text-xs font-bold text-white">{item.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateNotificationSettings({ [item.key]: !notificationSettings[item.key] })}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ${notificationSettings[item.key] ? 'bg-amber-400' : 'bg-slate-800'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${notificationSettings[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
            <button type="submit" className="w-full bg-amber-400 text-slate-950 rounded-xl py-3 text-xs font-black uppercase tracking-wider hover:bg-amber-300 transition flex items-center justify-center gap-2">
              <Save className="h-4 w-4" /> Saqlash
            </button>
          </form>
        )}

        {settingsTab === 'danger' && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] backdrop-blur-xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-rose-500/20">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <h3 className="text-xs font-black text-rose-400 uppercase tracking-wider font-mono">Xavfli zona</h3>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
              <p className="text-xs font-bold text-white">Lokal ma'lumotlarni tozalash</p>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                Barcha lokal saqlangan ma'lumotlar (buyurtmalar, kuponlar, foydalanuvchilar, sozlamalar) o'chiriladi va sayt boshlang'ich holatga qaytadi. Bu amalni ortga qaytarib bo'lmaydi!
              </p>
              <button
                onClick={() => setConfirmReset(true)}
                className="mt-4 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black uppercase tracking-wider hover:bg-rose-500 transition flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" /> Tozalashni boshlash
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // KUPON MODAL
  const renderCouponModal = () => {
    if (!showCouponModal) return null;
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowCouponModal(false)}>
        <div className="max-w-md w-full bg-slate-950 rounded-2xl border border-slate-800 p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-black text-white font-mono uppercase flex items-center gap-2">
              <Percent className="h-4 w-4 text-amber-300" />
              {editingCoupon ? 'Kuponni Tahrirlash' : 'Yangi Kupon'}
            </h3>
            <button onClick={() => setShowCouponModal(false)} className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleCouponSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Kupon kodi</label>
              <input
                type="text" required value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs font-mono font-bold text-white uppercase tracking-widest focus:border-amber-400/50 focus:outline-none transition"
                placeholder="SUMMER20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Chegirma (%)</label>
                <input
                  type="number" required min="1" max="99" value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition font-mono"
                  placeholder="20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Min. xarid (so'm)</label>
                <input
                  type="number" min="0" value={newCoupon.minSpend}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minSpend: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition font-mono"
                  placeholder="1000000"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-amber-400 text-slate-950 rounded-xl py-3 text-xs font-black uppercase tracking-wider hover:bg-amber-300 transition">
              {editingCoupon ? 'Yangilash' : "Qo'shish"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // BUYURTMA TAFSILOTLARI MODALI
  const renderOrderDetailsModal = () => {
    if (!orderDetails) return null;
    const payMethod = PAYMENT_METHODS[orderDetails.paymentMethod];
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" onClick={() => setOrderDetails(null)}>
        <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar bg-slate-950 rounded-2xl border border-slate-800" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-900 flex items-start justify-between sticky top-0 bg-slate-950 z-10">
            <div>
              <p className="text-sm font-black text-amber-300 font-mono uppercase">{orderDetails.id}</p>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                {formatDate(orderDetails.createdAt)} • {formatTime(orderDetails.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold border font-mono ${STATUS_COLORS[orderDetails.status] || 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                {orderDetails.status}
              </span>
              <button onClick={() => setOrderDetails(null)} className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Mahsulotlar */}
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-3">Buyurtmadagi mahsulotlar ({orderDetails.items?.length || 0})</h4>
              <div className="space-y-2">
                {(orderDetails.items || []).map((item, i) => {
                  const itemPrice = Number(item.discount) > 0 ? Number(item.price) * (1 - Number(item.discount) / 100) : Number(item.price);
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-900 bg-slate-950/60 p-3">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.name}</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">{item.quantity} × {formatPrice(itemPrice)}</p>
                      </div>
                      <p className="text-xs font-black text-amber-300 font-mono shrink-0">{formatPrice(itemPrice * item.quantity)}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hisob-kitob */}
            <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="font-mono">Ostiyig'indisi</span>
                <span className="font-mono font-bold text-white">{formatPrice(orderDetails.subtotal)}</span>
              </div>
              {Number(orderDetails.couponDiscount) > 0 && (
                <div className="flex justify-between text-xs text-rose-400">
                  <span className="font-mono">Kupon chegirmasi</span>
                  <span className="font-mono font-bold">-{formatPrice(orderDetails.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-slate-400">
                <span className="font-mono">Yetkazish</span>
                <span className="font-mono font-bold text-white">{formatPrice(orderDetails.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-900">
                <span className="font-black text-white uppercase font-mono">Jami</span>
                <span className="font-black text-amber-300 font-mono">{formatPrice(orderDetails.total)}</span>
              </div>
            </div>

            {/* To'lov va manzil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-amber-300" /> To'lov usuli
                </p>
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold border font-mono ${payMethod?.color || 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                  {payMethod?.label || orderDetails.paymentMethod || '—'}
                </span>
              </div>
              <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" /> Manzil
                </p>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  {orderDetails.address?.name || 'Noma\'lum'} <br />
                  <span className="text-slate-500">{orderDetails.deliveryZone || 'Zona ko\'rsatilmagan'}</span>
                </p>
              </div>
            </div>

            {orderDetails.notes && (
              <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2">Izoh</p>
                <p className="text-xs text-slate-300 leading-relaxed">{orderDetails.notes}</p>
              </div>
            )}

            {/* Status boshqaruvi */}
            <div className="flex gap-2 flex-wrap">
              <select
                value={orderDetails.status}
                onChange={(e) => { handleOrderStatusChange(orderDetails.id, e.target.value); setOrderDetails({ ...orderDetails, status: e.target.value }); }}
                className="flex-1 rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:outline-none font-mono"
              >
                {ORDER_STATUSES.map(s => <option key={s} value={s} className="bg-slate-950 text-slate-300">{s}</option>)}
              </select>
              {orderDetails.status !== 'Bekor qilindi' && (
                <button
                  onClick={() => { handleCancelOrder(orderDetails.id); setOrderDetails(null); }}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black uppercase tracking-wider hover:bg-rose-500 transition"
                >
                  Bekor qilish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ============================================================
     ASOSIY RENDER
     ============================================================ */
  return (
    <div className="min-h-screen text-white font-sans relative">
      {/* Kiber fon */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1c1914_1px,transparent_1px),linear-gradient(to_bottom,#1c1914_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 border-r border-slate-900 bg-slate-950/90 backdrop-blur-xl z-40 transition-all duration-300 ${sidebarOpen ? '' : '-translate-x-full'}`}>
        {renderSidebar()}
      </aside>

      {/* MOBILE SIDEBAR */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 border-r border-slate-900 bg-slate-950 flex flex-col animate-in slide-in-from-left duration-200">
            {renderSidebar()}
          </aside>
        </div>
      )}

      {/* ASOSIY KONTENT */}
      <div className={`relative transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-slate-900 bg-slate-950/85 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex p-2 rounded-xl border border-slate-900 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-800 transition">
                {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 rounded-xl border border-slate-900 bg-slate-950 text-slate-400 hover:text-white transition">
                <Menu className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 text-amber-300 border border-slate-800">
                  <LayoutDashboard className="h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-sm font-black tracking-wider uppercase font-mono">
                    Control <span className="text-amber-300">Terminal</span>
                  </h1>
                  <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase hidden sm:block">
                    {SIDEBAR_SECTIONS.flatMap(s => s.items).find(i => i.id === activeTab)?.label || 'Boshqaruv'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* JORIY HISOB — qaysi akkaunt kirgan bo'lsa */}
              {(siteUser || user) && (
                <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5" title="Joriy hisob">
                  {siteUser?.photoURL ? (
                    <img src={siteUser.photoURL} alt="" className="h-5 w-5 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950">
                      <User className="h-3 w-3" />
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-white">{siteUser?.name || user?.name || 'Admin'}</span>
                </div>
              )}

              {/* REAL VAQT: jonli soat */}
              <div className="hidden md:flex flex-col items-end rounded-lg border border-slate-800 bg-slate-950 px-3 py-1">
                <span className="text-[11px] font-mono font-black text-amber-300 tabular-nums leading-none">
                  {now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
                  {now.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              {/* REAL VAQT: sinxronlash holati */}
              <span className={`hidden sm:inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase bg-slate-900 px-3 py-1.5 rounded-lg border transition ${
                networkStatus === 'online' ? 'border-amber-400/20 text-amber-300' : 'border-rose-500/30 text-rose-400'
              }`}>
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${networkStatus === 'online' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${networkStatus === 'online' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                </span>
                {networkStatus === 'online'
                  ? <><Wifi className="h-3 w-3" /> REAL TIME: SYNC</>
                  : <><WifiOff className="h-3 w-3" /> REAL TIME: OFFLINE</>}
              </span>
              <button
                onClick={() => changeTab('notifications')}
                className="relative p-2 rounded-xl border border-slate-900 bg-slate-950 text-slate-400 hover:text-white transition"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* TAB KONTENTI */}
        <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'coupons' && renderCoupons()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'activity' && renderActivity()}
          {activeTab === 'blog' && renderBlog()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'settings' && renderSettings()}
        </main>
      </div>

      {/* MODALLAR */}
      {renderCouponModal()}
      {renderOrderDetailsModal()}

      {/* EKSPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-950 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-white font-mono uppercase">Eksport</h3>
              <button onClick={() => setShowExportModal(false)} className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">1. Ma'lumot turini tanlang</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { id: 'products', label: 'Mahsulotlar', icon: Package },
                { id: 'orders', label: 'Buyurtmalar', icon: ShoppingCart },
                { id: 'coupons', label: 'Kuponlar', icon: Percent },
                { id: 'users', label: 'Foydalanuvchilar', icon: Users },
              ].map(opt => {
                const Icon = opt.icon;
                const count = opt.id === 'products' ? (products || []).length :
                  opt.id === 'orders' ? (orders || []).length :
                  opt.id === 'coupons' ? (coupons || []).length :
                  (contextUsers || []).length;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setExportDataset(opt.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left transition ${
                      exportDataset === opt.id
                        ? 'border-amber-400/40 bg-amber-400/10 text-white'
                        : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-amber-300 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-[9px] text-slate-500 font-mono">{count} ta</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">2. Formatni tanlang</p>
            <div className="space-y-2">
              {['csv', 'json', 'xls'].map((format) => (
                <button
                  key={format}
                  onClick={() => {
                    const dataset =
                      exportDataset === 'orders' ? (orders || []) :
                      exportDataset === 'coupons' ? (coupons || []) :
                      exportDataset === 'users' ? (contextUsers || []) :
                      (products || []);
                    const label =
                      exportDataset === 'orders' ? 'Buyurtmalar' :
                      exportDataset === 'coupons' ? 'Kuponlar' :
                      exportDataset === 'users' ? 'Foydalanuvchilar' :
                      'Mahsulotlar';
                    exportData(dataset, exportDataset, label, format);
                    setShowExportModal(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/30 transition hover:border-amber-400/30"
                >
                  <FileSpreadsheet className="h-5 w-5 text-amber-300" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white uppercase">{format.toUpperCase()}</p>
                    <p className="text-[10px] text-slate-500">
                      {format === 'csv' ? 'Kompyuter jadvali formati' : format === 'json' ? 'Ma\'lumotlar formati' : 'Excel (XLS) formati'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-950 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-white font-mono uppercase">Ma'lumotlarni Import</h3>
              <button onClick={() => setShowImportModal(false)} className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center hover:border-amber-400/30 transition">
              <Upload className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-xs text-slate-400 mb-3">CSV yoki JSON fayl yuklang</p>
              <label className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-amber-400 transition">
                <Upload className="h-4 w-4" /> Fayl Tanlash
                <input type="file" accept=".csv,.json" onChange={importData} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* MAHSULOT PREVIEW MODAL */}
      {showPreviewModal && previewProduct && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-2xl w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="relative h-64 bg-slate-900">
              <img src={previewProduct.image || previewProduct.img} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
              <button onClick={() => setShowPreviewModal(false)} className="absolute top-4 right-4 p-2 rounded-lg bg-slate-950/80 text-white hover:bg-slate-900 transition">
                <X className="h-4 w-4" />
              </button>
              {Number(previewProduct.discount) > 0 && (
                <div className="absolute top-4 left-4 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full">
                  -{previewProduct.discount}%
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-black text-white mb-2">{previewProduct.name || previewProduct.title}</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">{previewProduct.description}</p>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-xl font-black text-amber-300 font-mono">{formatPrice(previewProduct.price)}</p>
                {Number(previewProduct.discount) > 0 && (
                  <p className="text-sm text-slate-500 line-through font-mono">{formatPrice(previewProduct.price * (1 + Number(previewProduct.discount) / 100))}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                  previewProduct.isNew ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  {previewProduct.isNew ? 'YANGI' : 'ODDIY'}
                </span>
                <span className="text-xs text-slate-500 font-mono">Zaxira: {previewProduct.stock || 0} ta</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OMMAVIY BUYURTMA AMALI MODALI */}
      {showBulkConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-sm w-full bg-slate-950 rounded-2xl border border-amber-500/30 p-6 text-center">
            <h3 className="text-base font-black text-white font-mono uppercase">Ommaviy Amalni Tasdiqlang</h3>
            <p className="text-xs text-slate-400 mt-2 mb-6 font-light">
              {bulkAction === 'delete'
                ? `${selectedOrders.length} ta buyurtma bekor qilinsinmi?`
                : `${selectedOrders.length} ta buyurtma uchun "${bulkAction}" statusi o'rnatilsinmi?`}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowBulkConfirm(false)} className="flex-1 rounded-xl bg-slate-900 border border-slate-800 py-2.5 text-xs text-slate-400 uppercase">Bekor qilish</button>
              <button onClick={handleBulkAction} className="flex-1 rounded-xl bg-amber-500 text-slate-950 font-black py-2.5 text-xs uppercase">Tasdiqlash</button>
            </div>
          </div>
        </div>
      )}

      {/* MAHSULOTLAR OMMAVIY O'CHIRISH MODALI */}
      {showProductBulkConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-sm w-full bg-slate-950 rounded-2xl border border-rose-500/30 p-6 text-center">
            <h3 className="text-base font-black text-white font-mono uppercase">Ommaviy O'chirishni Tasdiqlang</h3>
            <p className="text-xs text-slate-400 mt-2 mb-6 font-light">
              {selectedProductIds.length} ta mahsulot tizimdan o'chirilsinmi? Bu amalni ortga qaytarib bo'lmaydi!
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowProductBulkConfirm(false)} className="flex-1 rounded-xl bg-slate-900 border border-slate-800 py-2.5 text-xs text-slate-400 uppercase">Bekor qilish</button>
              <button onClick={handleBulkDeleteProducts} className="flex-1 rounded-xl bg-rose-600 text-white font-black py-2.5 text-xs uppercase">O'chirish</button>
            </div>
          </div>
        </div>
      )}

      {/* FOYDALANUVCHI FORMA MODALI */}
      {showUserModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-950 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-white font-mono uppercase">
                {editingUser ? 'Foydalanuvchini Tahrirlash' : 'Yangi Foydalanuvchi'}
              </h3>
              <button onClick={() => { setShowUserModal(false); setEditingUser(null); setNewUser({ name: '', email: '', role: 'user', password: '' }); }} className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Ism</label>
                <input
                  type="text" required value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition"
                  placeholder="Alisher Karimov"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Email</label>
                <input
                  type="email" required value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition"
                  placeholder="alisher@example.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Parol</label>
                <input
                  type="password" required value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Rol</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-amber-400/50 focus:outline-none transition"
                >
                  <option value="user">Foydalanuvchi</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-amber-400 text-slate-950 rounded-xl py-2.5 text-xs font-black uppercase tracking-wider hover:bg-amber-400 transition">
                {editingUser ? 'Yangilash' : "Qo'shish"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW MODALI */}
      {imagePreview && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md" onClick={() => setImagePreview(null)}>
          <div className="max-w-4xl w-full rounded-2xl overflow-hidden border border-slate-800">
            <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain" />
          </div>
        </div>
      )}

      {/* UNIVERSAL O'CHIRISH DIALOGI */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-sm w-full bg-slate-950 rounded-2xl border border-rose-500/30 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30">
              <Trash2 className="h-5 w-5 text-rose-400" />
            </div>
            <h3 className="text-base font-black text-white font-mono uppercase">O'chirishni tasdiqlang</h3>
            <p className="text-xs text-slate-400 mt-2 mb-6 font-light">
              <span className="text-white font-bold">"{deleteTargetLabel}"</span> — bu amalni ortga qaytarib bo'lmaydi!
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-xl bg-slate-900 border border-slate-800 py-2.5 text-xs text-slate-400 uppercase">Bekor qilish</button>
              <button
                onClick={handleUniversalDelete}
                className="flex-1 rounded-xl bg-rose-600 text-white font-black py-2.5 text-xs uppercase"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOKAL MA'LUMOTLARNI TOZALASH MODALI */}
      {confirmReset && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-sm w-full bg-slate-950 rounded-2xl border border-rose-500/30 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
            </div>
            <h3 className="text-base font-black text-white font-mono uppercase">Ogohlantirish!</h3>
            <p className="text-xs text-slate-400 mt-2 mb-6 font-light">
              Barcha lokal ma'lumotlar (buyurtmalar, kuponlar, foydalanuvchilar, sozlamalar) butunlay o'chiriladi. Davom etasizmi?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmReset(false)} className="flex-1 rounded-xl bg-slate-900 border border-slate-800 py-2.5 text-xs text-slate-400 uppercase">Bekor qilish</button>
              <button onClick={handleResetData} className="flex-1 rounded-xl bg-rose-600 text-white font-black py-2.5 text-xs uppercase">Ha, tozalash</button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL TOAST */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[130] flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl max-w-sm animate-in slide-in-from-bottom-4 duration-200">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
            notification.type === 'success' ? 'bg-amber-400/10 text-amber-300' :
            notification.type === 'error' ? 'bg-rose-500/10 text-rose-400' :
            notification.type === 'warning' ? 'bg-amber-500/10 text-amber-400' :
            'bg-amber-400/10 text-amber-300'
          }`}>
            {notification.type === 'success' && <CheckCircle className="h-4 w-4" />}
            {notification.type === 'error' && <XCircle className="h-4 w-4" />}
            {notification.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
            {notification.type === 'info' && <Info className="h-4 w-4" />}
          </div>
          <p className="text-xs text-white font-medium flex-1">{notification.message}</p>
          <button onClick={clearNotification} className="p-1 rounded hover:bg-slate-800 transition text-slate-400 hover:text-white shrink-0">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
