import { useState, lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PrivateRoute from './components/PrivateRoute';
import SiteSidebar from './components/SiteSidebar';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import CookieConsent from './components/CookieConsent';
import FloatingContact from './components/FloatingContact';

// Sahifalar — LAZY (code-splitting): har bir sahifa alohida chunk bo'lib
// yuklanadi. Bu boshlang'ich bundle hajmini keskin kamaytiradi va
// mobil qurilmalarda sayt tezroq ochiladi.
const MainWebsite = lazy(() => import('./pages/MainWebsite'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CartPage = lazy(() => import('./pages/CartPage'));
const SiteLoginPage = lazy(() => import('./pages/SiteLoginPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const DiscountsPage = lazy(() => import('./pages/DiscountsPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const LoyaltyPage = lazy(() => import('./pages/LoyaltyPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const DeliveryPage = lazy(() => import('./pages/DeliveryPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const AiPage = lazy(() => import('./pages/AiPage'));

// Sahifa nomlari (document.title) — SEO va foydalanuvchi tajribasi uchun
const PAGE_TITLES = [
  { path: '/login', title: 'Admin Kirish' },
  { path: '/sayt/kirish', title: 'Kirish / Ro\'yxatdan o\'tish' },
  { path: '/sayt/profil', title: 'Shaxsiy kabinet' },
  { path: '/sevimlilar', title: 'Sevimlilar' },
  { path: '/chegirmalar', title: 'Chegirmalar' },
  { path: '/savat', title: 'Savat' },
  { path: '/buyurtma', title: 'Buyurtma rasmiylashtirish' },
  { path: '/solishtirish', title: 'Solishtirish' },
  { path: '/katalog', title: 'Barcha mahsulotlar' },
  { path: '/yangi-kelganlar', title: 'Yangi kelganlar' },
  { path: '/buyurtmalarim', title: 'Buyurtmalarim' },
  { path: '/bonus-dasturi', title: 'Bonus dasturi' },
  { path: '/aloqa', title: 'Aloqa' },
  { path: '/faq', title: 'FAQ' },
  { path: '/yetkazib-berish', title: 'Yetkazib berish' },
  { path: '/tolov-usullari', title: 'To\'lov usullari' },
  { path: '/qaytarish', title: 'Qaytarish' },
  { path: '/blog', title: 'Blog / Yangiliklar' },
  { path: '/maxfiylik', title: 'Maxfiylik siyosati' },
  { path: '/shartlar', title: 'Foydalanish shartlari' },
  { path: '/ommaviy-oferta', title: 'Ommaviy oferta' },
  { path: '/admin', title: 'Admin panel' },
  { path: '/qidiruv', title: 'Qidiruv natijalari' },
  { path: '/ai', title: 'Grand AI — Tahlilchi va Yordamchi' },
];

const getPageTitle = (pathname) => {
  // Dinamik sahifalar (product/:id, kategoriya/:slug) avval tekshiriladi
  if (pathname.startsWith('/product/')) return 'Mahsulot detali';
  if (pathname.startsWith('/kategoriya/')) return 'Kategoriya';
  if (pathname.startsWith('/blog/')) return 'Blog maqolasi';

  const match = PAGE_TITLES.find(p => p.path === pathname);
  return match ? match.title : 'Bosh sahifa';
};

// Yuklanish paytida ko'rsatiladigan fallback
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-2xl border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest animate-pulse">
          Yuklanmoqda...
        </p>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Har bir sahifada document.title yangilanadi (SEO / UX)
  useEffect(() => {
    const title = getPageTitle(location.pathname);
    document.title = `${title} — Grand Decor`;
  }, [location.pathname]);

  // Admin, login va AI sahifalarida alohida to'liq layout (musrsiz butun page)
  const isAiPage = location.pathname === '/ai';
  const hideShell = location.pathname === '/login'
    || location.pathname === '/sayt/kirish'
    || location.pathname.startsWith('/admin')
    || isAiPage;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col select-none">
      <ScrollToTop />
      {/* Saytning yuqori qismi — o'ng sidebar uchun joy ajratiladi */}
      <div className={`flex flex-col flex-1 ${hideShell ? '' : 'xl:pr-64'}`}>
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

        <div className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ASOSIY SAHIFA */}
              <Route path="/" element={<MainWebsite />} />

              {/* ADMIN LOGIN SAHIFASI (Admin Dashboard uchun) */}
              <Route path="/login" element={<LoginPage />} />

              {/* SAYT LOGIN SAHIFASI (Google/Firebase bilan) */}
              <Route path="/sayt/kirish" element={<SiteLoginPage />} />

              {/* SAYT PROFIL SAHIFASI (Private - faqat tizimga kirganlar uchun) */}
              <Route
                path="/sayt/profil"
                element={
                  <PrivateRoute>
                    <UserProfilePage />
                  </PrivateRoute>
                }
              />

              {/* MAHSULOT BATAFSIL SAHIFASI */}
              <Route path="/product/:id" element={<ProductDetail />} />

              {/* QIDIRUV NATIJALARI SAHIFASI */}
              <Route path="/qidiruv" element={<SearchResults />} />

              {/* KATEGORIYA SAHIFASI */}
              <Route path="/kategoriya/:slug" element={<CategoryPage />} />

              {/* SEVIMLILAR SAHIFASI */}
              <Route path="/sevimlilar" element={<WishlistPage />} />

              {/* CHEGIRMALAR SAHIFASI */}
              <Route path="/chegirmalar" element={<DiscountsPage />} />

              {/* SAVAT SAHIFASI */}
              <Route path="/savat" element={<CartPage />} />

              {/* BUYURTMA RASMIYLASHTIRISH SAHIFASI */}
              <Route path="/buyurtma" element={<CheckoutPage />} />

              {/* SOLISHTIRISH SAHIFASI */}
              <Route path="/solishtirish" element={<ComparePage />} />

              {/* KATALOG — BARCHA MAHSULOTLAR */}
              <Route path="/katalog" element={<CatalogPage />} />

              {/* YANGI KELGANLAR */}
              <Route path="/yangi-kelganlar" element={<NewArrivalsPage />} />

              {/* BUYURTMALARIM */}
              <Route path="/buyurtmalarim" element={<OrdersPage />} />

              {/* BONUS DASTURI */}
              <Route path="/bonus-dasturi" element={<LoyaltyPage />} />

              {/* ALOQA */}
              <Route path="/aloqa" element={<ContactPage />} />

              {/* FAQ */}
              <Route path="/faq" element={<FaqPage />} />

              {/* YETKAZIB BERISH */}
              <Route path="/yetkazib-berish" element={<DeliveryPage />} />

              {/* TO'LOV USULLARI */}
              <Route path="/tolov-usullari" element={<PaymentPage />} />

              {/* QAYTARISH */}
              <Route path="/qaytarish" element={<ReturnsPage />} />

              {/* BLOG */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />

              {/* HUQUQIY SAHIFALAR */}
              <Route path="/maxfiylik" element={<LegalPage />} />
              <Route path="/shartlar" element={<LegalPage />} />
              <Route path="/ommaviy-oferta" element={<LegalPage />} />

              {/* GRAND AI TAHLILCHI VA YORDAMCHI */}
              <Route path="/ai" element={<AiPage />} />

              {/* ADMIN PANELI (Yopiq Route) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* XATO SAHIFA (404) */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>

        {/* Saytning quyi qismi */}
        {!isAiPage && <Footer />}
      </div>

      {/* O'NG TOMON SIDEBAR — barcha sahifalar */}
      {!hideShell && (
        <SiteSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Global bildirishnomalar */}
      <Toast />

      {/* Back to top tugmasi */}
      {!hideShell && <BackToTop />}

      {/* Cookie consent banner */}
      <CookieConsent />

      {/* WhatsApp / Telegram floating bog'lanish */}
      {!hideShell && <FloatingContact />}
    </div>
  );
}

export default App;
