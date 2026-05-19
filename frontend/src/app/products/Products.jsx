import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import QuickViewModal from '../../components/QuickViewModal';
import api from '../../lib/api';
import { useLang } from '../../context/LangContext';

const CATEGORIES = [
  { key: 'all', label: 'All', labelTe: 'అన్నీ' },
  { key: 'pickle', label: 'Pickles', labelTe: 'పచ్చళ్ళు' },
  { key: 'powder', label: 'Powders', labelTe: 'పొడులు' },
  { key: 'spice', label: 'Spices', labelTe: 'మసాలాలు' },
  { key: 'dryfruit', label: 'Dry Fruits', labelTe: 'డ్రై ఫ్రూట్స్' },
  { key: 'ghee', label: 'Pure Ghee', labelTe: 'నెయ్యి' },
  { key: 'tea', label: 'Tea Powders', labelTe: 'తేపొడి' },
  { key: 'sweet', label: 'Sweets', labelTe: 'స్వీట్స్' },
  { key: 'other', label: 'Others', labelTe: 'ఇతరాలు' },
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border-t-4 border-brand-yellow">
      <div className="skeleton h-52 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="flex gap-2">{[1,2,3].map(i => <div key={i} className="skeleton h-7 w-14 rounded-full" />)}</div>
        <div className="flex justify-between items-center">
          <div className="skeleton h-8 w-20" />
          <div className="skeleton h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [withoutGarlic, setWithoutGarlic] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const { lang } = useLang();

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (search) params.set('search', search);
    if (withoutGarlic) params.set('withoutGarlic', 'true');
    api.get(`/products?${params}`).then(r => { setProducts(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [category, search, withoutGarlic]);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      {/* Page header */}
      <div className="bg-brand-yellow py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-brand-red text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              Handcrafted with Love
            </span>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-brand-black">All Products</h1>
            <p className="text-brand-black/60 mt-2 font-poppins">Pure sesame oil · No preservatives · Traditional recipes</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/40" />
            <input
              type="text"
              placeholder="Search pickles, powders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-brand-black/10 bg-white text-brand-black placeholder-brand-black/30 focus:outline-none focus:border-brand-yellow transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black/40 hover:text-brand-red">
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setWithoutGarlic(!withoutGarlic)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 font-semibold text-sm transition-all ${
              withoutGarlic ? 'bg-brand-red border-brand-red text-white' : 'border-brand-black/20 text-brand-black/70 hover:border-brand-red'
            }`}
          >
            <Filter size={16} />
            🧄 Without Garlic
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all border-2 ${
                category === cat.key
                  ? 'bg-brand-red border-brand-red text-white shadow-lg'
                  : 'bg-white border-brand-yellow text-brand-black hover:bg-brand-yellow'
              }`}
            >
              {lang === 'te' ? cat.labelTe : cat.label}
            </button>
          ))}
        </div>

        {!loading && (
          <p className="text-brand-black/40 text-sm mb-6">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="text-6xl">🫙</span>
              <p className="font-playfair text-2xl text-brand-black/50 mt-4">No products found</p>
              <button onClick={() => { setSearch(''); setCategory('all'); setWithoutGarlic(false); }} className="btn-primary mt-4">
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {products.map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <ProductCard product={p} onQuickView={setQuickView} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  );
}
