import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
// Frontend zaxirasi — faqat mahsulot va kategoriyalar (parollar/buyurtmalar kirmaydi).
// Yangilash: node scripts/sync-seed-catalog.cjs
import seedDb from '../../data/seed-catalog.json';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Taym-aut bilan axios instansi — server yetib bo'lmasa (masalan, telefonda
// localhost) so'rovlar osilib qolmaydi va ilova tezda lokal rejimga o'tadi.
const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
});

// Lokal zaxira kalitlari — API mavjud bo'lmaganda ma'lumotlar yo'qolmaydi
const PRODUCTS_KEY = 'vortex_products_local';
const CATEGORIES_KEY = 'vortex_categories_local';

const loadLocal = (key) => {
  try { return JSON.parse(localStorage.getItem(key)); }
  catch { return null; }
};

const saveLocal = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { /* localStorage to'la bo'lishi mumkin */ }
};

// Neytral placeholder — mahsulotda rasm bo'lmasa boshqa mahsulot/galereya rasmi ishlatilmaydi (spec 2.1-band)
const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><rect width='600' height='600' fill='#0d1220'/><rect x='14' y='14' width='572' height='572' rx='28' fill='none' stroke='#F5C518' stroke-opacity='0.35' stroke-width='3'/><text x='300' y='300' text-anchor='middle' fill='#F5C518' font-family='Georgia, serif' font-size='44' font-weight='bold'>Grand Décor</text><text x='300' y='340' text-anchor='middle' fill='#8b93a7' font-family='Arial, sans-serif' font-size='20'>Mahsulot rasmi</text></svg>`
);

const normalizeImage = (image) => {
  if (!image) return FALLBACK_IMAGE;
  if (String(image).startsWith('http')) return image;
  return `${BASE}${image}`;
};

// Sayt deploy qilinganda (https) va API manzili hali localhost bo'lsa —
// server mavjud bo'la olmaydi. So'rov yubormay, db.json zaxirasini ishlatamiz.
const isLocalApi = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(BASE);
const isDeployed = typeof window !== 'undefined' && window.location.protocol === 'https:';
const useSeedMode = isLocalApi && isDeployed;

// db.json'dagi zaxira ma'lumotlar — server bo'lmasa ham do'kon to'liq ishlaydi
const seedProducts = (Array.isArray(seedDb.products) ? seedDb.products : [])
  .map(p => ({ ...p, image: normalizeImage(p.image) }));
const seedCategories = Array.isArray(seedDb.categories) ? seedDb.categories : [];

const useProducts = (showToast) => {
  const [products, setProducts] = useState(() => loadLocal(PRODUCTS_KEY) || []);
  const [categories, setCategories] = useState(() => loadLocal(CATEGORIES_KEY) || []);
  const [loading, setLoading] = useState(true);

  // Server mavjudligini kuzatish — real vaqtda yangilash uchun
  const serverAvailable = useRef(false);

  // Har qanday o'zgarishda localStorage'ga yozamiz (offline himoya)
  useEffect(() => { saveLocal(PRODUCTS_KEY, products); }, [products]);
  useEffect(() => { saveLocal(CATEGORIES_KEY, categories); }, [categories]);

  // REAL VAQT: boshqa oynalar (admin panel / do'kon) o'zgarishlarini darhol qabul qilish
  useEffect(() => {
    const syncFromStorage = (e) => {
      if (e.key === PRODUCTS_KEY) {
        if (e.newValue === null) { setProducts([]); return; }
        try { setProducts(JSON.parse(e.newValue)); } catch { /* ignore */ }
      } else if (e.key === CATEGORIES_KEY) {
        if (e.newValue === null) { setCategories([]); return; }
        try { setCategories(JSON.parse(e.newValue)); } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  // PERFORMANCE: ma'lumotlar o'zgarmasa state'ni yangilamaymiz (keraksiz re-renderlarni oldini olish)
  const lastProductsKey = useRef('');

  const productsKey = (list) => list
    .map(p => `${p.id}|${p.price}|${p.stock}|${p.discount}|${p.title}|${p.rating}|${p.reviewsCount}|${p.featured}|${p.image}`)
    .join('~');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      if (useSeedMode) throw new Error('SEED_MODE');
      const res = await api.get('/products');
      const data = res.data;
      const all = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      const normalized = all.map(p => ({ ...p, image: normalizeImage(p.image) }));
      const key = productsKey(normalized);
      if (key !== lastProductsKey.current) {
        lastProductsKey.current = key;
        setProducts(normalized);
      }
      serverAvailable.current = true;
    } catch (error) {
      console.error('fetchProducts xato:', error);
      serverAvailable.current = false;
      // Lokal zaxirada ma'lumot bor bo'lsa — u ishlatiladi (toast bermaymiz, yumshoq rejim)
      if (!loadLocal(PRODUCTS_KEY)) {
        if (seedProducts.length > 0) {
          // Server yo'q va lokal ham bo'sh — seed zaxirasini yuklaymiz
          const key2 = productsKey(seedProducts);
          if (key2 !== lastProductsKey.current) {
            lastProductsKey.current = key2;
            setProducts(seedProducts);
          }
          showToast(
            useSeedMode
              ? "Zaxira ma'lumotlar yuklandi"
              : "Server bilan aloqa yo'q. Zaxira ma'lumotlar ko'rsatilmoqda.",
            "warning"
          );
        } else {
          showToast("Server bilan aloqa yo'q. Lokal rejimda ishlanmoqda.", "warning");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const lastCategoriesKey = useRef('');

  const fetchCategories = useCallback(async () => {
    try {
      if (useSeedMode) throw new Error('SEED_MODE');
      const res = await api.get('/categories');
      const data = res.data;
      const all = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      const key = all.map(c => `${c.id}|${c.name}`).join('~');
      if (all.length > 0 && key !== lastCategoriesKey.current) {
        lastCategoriesKey.current = key;
        setCategories(all);
      }
    } catch (error) {
      console.error('fetchCategories xato:', error);
      // Server yo'q va kategoriyalar bo'sh bo'lsa — seed zaxirasi
      if (seedCategories.length > 0) {
        setCategories(prev => (prev.length > 0 ? prev : seedCategories));
      }
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchProducts();
      fetchCategories();
    }, 0);
    return () => clearTimeout(t);
  }, [fetchProducts, fetchCategories]);

  // REAL VAQT: server ulangan bo'lsa, katalog va kategoriyalarni davriy yangilab turamiz.
  // PERFORMANCE: sahifa ko'rinmas bo'lsa (boshqa tab) polling to'xtatiladi.
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.onLine && serverAvailable.current && document.visibilityState === 'visible') {
        fetchProducts();
        fetchCategories();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchProducts, fetchCategories]);

  // ---- KATEGORIYA CRUD (optimistic) ----

  const addCategory = useCallback(async (categoryData) => {
    const tempId = `cat-local-${Date.now()}`;
    const newCategory = { id: tempId, _id: tempId, ...categoryData };
    setCategories(prev => [...prev, newCategory]);
    try {
      const res = await api.post('/categories', categoryData);
      const created = res.data;
      if (created) {
        setCategories(prev => prev.map(c => (c.id === tempId || c._id === tempId) ? created : c));
      }
      showToast("Yangi kategoriya muvaffaqiyatli qo'shildi", "success");
      return true;
    } catch (error) {
      console.error('addCategory ichidagi xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true; // Lokal o'zgarish saqlanib qoladi
    }
  }, [showToast]);

  const updateCategory = useCallback(async (id, categoryData) => {
    setCategories(prev => prev.map(c => (c.id === id || c._id === id) ? { ...c, ...categoryData } : c));
    try {
      const res = await api.put(`/categories/${id}`, categoryData);
      const updated = res.data;
      if (updated) {
        setCategories(prev => prev.map(c => (c.id === id || c._id === id) ? updated : c));
      }
      showToast("Kategoriya muvaffaqiyatli yangilandi", "success");
      return true;
    } catch (error) {
      console.error('updateCategory xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true;
    }
  }, [showToast]);

  const deleteCategory = useCallback(async (id) => {
    setCategories(prev => prev.filter(c => c.id !== id && c._id !== id));
    try {
      await api.delete(`/categories/${id}`);
      showToast("Kategoriya o'chirildi", "warning");
      return true;
    } catch (error) {
      console.error('deleteCategory xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true;
    }
  }, [showToast]);

  // ---- MAHSULOT CRUD (optimistic) ----

  const addProduct = useCallback(async (product) => {
    const tempId = `prod-local-${Date.now()}`;
    const normalized = {
      ...product,
      id: product._id || product.id || tempId,
      image: normalizeImage(product.image || product.img),
    };
    setProducts(prev => [...prev, normalized]);
    try {
      const res = await api.post('/products', product);
      const created = res.data;
      if (created) {
        const serverNorm = { ...created, image: normalizeImage(created.image) };
        setProducts(prev => prev.map(p => (p.id === tempId) ? serverNorm : p));
      }
      showToast("Yangi mahsulot tizimga qo'shildi", "success");
      return true;
    } catch (error) {
      console.error('addProduct xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true;
    }
  }, [showToast]);

  const updateProduct = useCallback(async (id, updatedProduct) => {
    setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? { ...p, ...updatedProduct, image: normalizeImage(updatedProduct.image) } : p));
    try {
      const res = await api.put(`/products/${id}`, updatedProduct);
      const updated = res.data;
      if (updated) {
        const serverNorm = { ...updated, image: normalizeImage(updated.image) };
        setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? serverNorm : p));
      }
      showToast("Mahsulot muvaffaqiyatli yangilandi", "success");
      return true;
    } catch (error) {
      console.error('updateProduct xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true;
    }
  }, [showToast]);

  const deleteProduct = useCallback(async (id) => {
    setProducts(prev => prev.filter(p => p._id !== id && p.id !== id));
    try {
      await api.delete(`/products/${id}`);
      showToast("Mahsulot o'chirildi", "warning");
      return true;
    } catch (error) {
      console.error('deleteProduct xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true;
    }
  }, [showToast]);

  const bulkDeleteProducts = useCallback(async (ids) => {
    const idSet = new Set(ids);
    setProducts(prev => prev.filter(p => !idSet.has(p._id || p.id)));
    try {
      for (const id of ids) {
        await api.delete(`/products/${id}`);
      }
      showToast(`${ids.length} ta mahsulot o'chirildi`, "success");
      return true;
    } catch (error) {
      console.error('bulkDeleteProducts xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true;
    }
  }, [showToast]);

  return {
    products, categories, loading,
    fetchProducts, fetchCategories,
    addProduct, updateProduct, deleteProduct, bulkDeleteProducts,
    addCategory, updateCategory, deleteCategory,
  };
};

export default useProducts;
