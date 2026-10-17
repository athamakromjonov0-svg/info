import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const CART_KEYS = {
  cart: 'vortex_cart',
  wishlist: 'vortex_wishlist',
  wishlistHistory: 'vortex_wishlist_history',
  recentlyViewed: 'vortex_recent',
  compareList: 'vortex_compare',
  reviews: 'vortex_reviews',
};

const useCart = (showToast) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEYS.cart)) || []; }
    catch { return []; }
  });

  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEYS.wishlist)) || []; }
    catch { return []; }
  });

  const [wishlistHistory, setWishlistHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEYS.wishlistHistory)) || []; }
    catch { return []; }
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEYS.recentlyViewed)) || []; }
    catch { return []; }
  });

  const [compareList, setCompareList] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEYS.compareList)) || []; }
    catch { return []; }
  });

  const [reviews, setReviews] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEYS.reviews)) || {}; }
    catch { return {}; }
  });

  useEffect(() => { localStorage.setItem(CART_KEYS.cart, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(CART_KEYS.wishlist, JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem(CART_KEYS.wishlistHistory, JSON.stringify(wishlistHistory)); }, [wishlistHistory]);
  useEffect(() => { localStorage.setItem(CART_KEYS.recentlyViewed, JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem(CART_KEYS.compareList, JSON.stringify(compareList)); }, [compareList]);
  useEffect(() => { localStorage.setItem(CART_KEYS.reviews, JSON.stringify(reviews)); }, [reviews]);

  // REAL VAQT: boshqa oynalardagi savat/sevimlilar/solishtirish o'zgarishlarini darhol qabul qilish
  useEffect(() => {
    const syncFromStorage = (e) => {
      const { key, newValue } = e;
      const applyArray = (setter) => {
        if (newValue === null) { setter([]); return; }
        try { const parsed = JSON.parse(newValue); if (Array.isArray(parsed)) setter(parsed); } catch { /* ignore */ }
      };
      if (key === CART_KEYS.cart) applyArray(setCart);
      else if (key === CART_KEYS.wishlist) applyArray(setWishlist);
      else if (key === CART_KEYS.wishlistHistory) applyArray(setWishlistHistory);
      else if (key === CART_KEYS.recentlyViewed) applyArray(setRecentlyViewed);
      else if (key === CART_KEYS.compareList) applyArray(setCompareList);
      else if (key === CART_KEYS.reviews) {
        if (newValue === null) { setReviews({}); return; }
        try { const parsed = JSON.parse(newValue); if (parsed && typeof parsed === 'object') setReviews(parsed); } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prev => {
      const id = product._id || product.id;
      const exists = prev.find(i => (i._id || i.id) === id);
      if (exists) {
        return prev.map(i => (i._id || i.id) === id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const decreaseCartQuantity = useCallback((id) => {
    setCart(prev => {
      const item = prev.find(i => (i._id || i.id) === id);
      if (item?.quantity <= 1) {
        showToast("Obyekt savat modovidan olib tashlandi", "warning");
        return prev.filter(i => (i._id || i.id) !== id);
      }
      return prev.map(i => (i._id || i.id) === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  }, [showToast]);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => (i._id || i.id) !== id));
    showToast("Obyekt butunlay o'chirildi", "warning");
  }, [showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
    showToast("Savat tozalandi", "info");
  }, [showToast]);

  const updateCartItemQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(i => (i._id || i.id) === id ? { ...i, quantity } : i));
  }, [removeFromCart]);

  const toggleWishlist = useCallback((product) => {
    const id = product._id || product.id;
    const exists = (wishlist || []).some(i => (i._id || i.id) === id);
    const historyEntry = {
      id: `WH-${Date.now()}`,
      productId: id,
      action: exists ? 'removed' : 'added',
      time: new Date().toISOString(),
    };
    setWishlistHistory(prev => [historyEntry, ...prev].slice(0, 50));
    if (exists) {
      showToast("Mahsulot sevimlilardan olib tashlandi", "info");
      setWishlist(prev => prev.filter(i => (i._id || i.id) !== id));
    } else {
      showToast("Mahsulot sevimlilarga qo'shildi!", "success");
      setWishlist(prev => [...prev, product]);
    }
  }, [wishlist, showToast]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    showToast("Sevimlilar ro'yxati tozalandi", "info");
  }, [showToast]);

  const addAllWishlistToCart = useCallback(() => {
    if (wishlist.length === 0) return;
    wishlist.forEach(product => addToCart(product, 1));
    showToast(`Barcha sevimlilar savatga qo'shildi (${wishlist.length} ta)!`, "success");
  }, [wishlist, addToCart, showToast]);

  const addToRecentlyViewed = useCallback((product) => {
    if (!product) return;
    const id = product._id || product.id;
    setRecentlyViewed(prev => {
      const filtered = prev.filter(i => (i._id || i.id) !== id);
      return [{ ...product, viewedAt: Date.now() }, ...filtered].slice(0, 10);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    showToast("Yaqinda ko'rilganlar tozalandi", "info");
  }, [showToast]);

  const toggleCompare = useCallback((product) => {
    setCompareList(prev => {
      const id = product._id || product.id;
      const exists = prev.some(i => (i._id || i.id) === id);
      if (exists) {
        showToast("Mahsulot solishtirishdan olib tashlandi", "info");
        return prev.filter(i => (i._id || i.id) !== id);
      }
      if (prev.length >= 4) {
        showToast("Maksimum 4 ta mahsulot solishtirish mumkin!", "warning");
        return prev;
      }
      showToast("Mahsulot solishtirishga qo'shildi", "success");
      return [...prev, product];
    });
  }, [showToast]);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    showToast("Solishtirish ro'yxati tozalandi", "info");
  }, [showToast]);

  const addReview = useCallback((productId, reviewData, siteUser) => {
    const review = {
      id: `REV-${Date.now()}`,
      productId,
      ...reviewData,
      time: new Date().toISOString(),
      userName: reviewData.userName || siteUser?.name || 'Anonim',
    };
    setReviews(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), review],
    }));
    showToast("Sharhingiz qo'shildi, rahmat!", "success");

    // Backend API'ga saqlash
    axios.post(`${BASE}/api/reviews`, {
      productId,
      rating: review.rating,
      comment: review.comment,
      userName: review.userName,
    }).catch(() => {});

    return review;
  }, [showToast]);

  const deleteReview = useCallback((productId, reviewId) => {
    setReviews(prev => ({
      ...prev,
      [productId]: (prev[productId] || []).filter(r => r.id !== reviewId),
    }));
    showToast("Sharh o'chirildi", "warning");
    axios.delete(`${BASE}/api/reviews/${reviewId}`).catch(() => {});
  }, [showToast]);

  return {
    cart, wishlist, wishlistHistory, recentlyViewed, compareList, reviews,
    addToCart, decreaseCartQuantity, removeFromCart, clearCart, updateCartItemQuantity,
    toggleWishlist, clearWishlist, addAllWishlistToCart,
    addToRecentlyViewed, clearRecentlyViewed,
    toggleCompare, clearCompare,
    addReview, deleteReview,
  };
};

export default useCart;
