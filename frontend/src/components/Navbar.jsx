import { useState, useEffect } from 'react';
import logo from '../assets/pickleHouseLogoMain.png';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Sun, Moon, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { key: 'home', path: '/' },
  { key: 'products', path: '/products' },
  { key: 'about', path: '/about' },
  { key: 'nri', path: '/nri-packing' },
  { key: 'gallery', path: '/gallery' },
  { key: 'reviews', path: '/reviews' },
  { key: 'contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, toggleDrawer } = useCart();
  const { t, lang, toggleLang } = useLang();
  const { user } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => setMobileOpen(false), [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome && !scrolled
          ? 'bg-transparent border-b border-white/10'
          : 'bg-brand-black border-b-2 border-brand-yellow'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <motion.img
                src={logo}
                alt="Pickle House"
                className="h-16 md:h-20 w-auto object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ key, path }) => (
                <NavLink
                  key={key}
                  to={path}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium transition-all duration-200 relative group ${
                      isActive ? 'text-brand-yellow' : 'text-white hover:text-brand-yellow'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {t[key]}
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-yellow transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLang}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-yellow/40 text-brand-yellow text-xs font-semibold hover:bg-brand-yellow/10 transition-all"
              >
                {lang === 'en' ? 'తెలుగు' : 'English'}
              </button>


              <button onClick={toggleDrawer} className="relative p-2 rounded-full text-brand-yellow hover:bg-brand-yellow/10 transition-all">
                <ShoppingCart size={22} />
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
              </button>

              {user && (
                <Link
                  to="/profile"
                  className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center text-brand-black font-bold text-sm hover:bg-brand-yellow-deep transition-all"
                  title={user.name}
                >
                  {user.name?.[0]?.toUpperCase()}
                </Link>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-full text-white hover:bg-white/10 transition-all">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-brand-black/70" onClick={() => setMobileOpen(false)} />
            <motion.div
              className="absolute top-0 right-0 h-full w-72 bg-brand-black border-l-2 border-brand-yellow flex flex-col pt-20 pb-8 px-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col gap-1">
                {navLinks.map(({ key, path }) => (
                  <NavLink
                    key={key}
                    to={path}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive ? 'bg-brand-red text-white' : 'text-white hover:text-brand-yellow hover:bg-white/5'
                      }`
                    }
                  >
                    {t[key]}
                  </NavLink>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-3">
                {user && (
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-3 rounded-xl text-white hover:bg-white/5 transition-all">
                    <div className="w-7 h-7 bg-brand-yellow rounded-full flex items-center justify-center text-brand-black text-xs font-bold">{user.name?.[0]?.toUpperCase()}</div>
                    {user.name}
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <button onClick={toggleLang} className="flex-1 py-2 rounded-full border border-brand-yellow/40 text-brand-yellow text-sm font-semibold hover:bg-brand-yellow/10 transition-all">
                    {lang === 'en' ? 'తెలుగు' : 'English'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
