import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { LangProvider } from './context/LangContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';
import BackToTop from './components/BackToTop';

import Home from './app/Home';
import Products from './app/products/Products';
import About from './app/About';
import NRIPacking from './app/NRIPacking';
import Gallery from './app/Gallery';
import Reviews from './app/Reviews';
import Contact from './app/Contact';
import Checkout from './app/checkout/Checkout';
import Auth from './app/auth/Auth';
import Profile from './app/auth/Profile';
import MyOrders from './app/orders/MyOrders';
import ProductDetail from './app/products/ProductDetail';
import Admin from './app/admin/Admin';
import NotFound from './app/NotFound';

import { useCursor } from './hooks/useCursor';

function AdminGuard({ children }) {
  const location = useLocation();
  const stored = JSON.parse(localStorage.getItem('pickleUser') || 'null');
  if (!stored?.isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  useCursor();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div>
      <div className="min-h-screen bg-white transition-colors duration-300">
        {!isAdmin && <Navbar />}
        <CartDrawer />
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/nri-packing" element={<NRIPacking />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
        {!isAdmin && <Footer />}
        <WhatsAppButton />
        <BackToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#CC0000', color: '#FFFFFF', borderRadius: '12px', fontFamily: 'Poppins, sans-serif' },
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <LangProvider>
            <AppContent />
          </LangProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
