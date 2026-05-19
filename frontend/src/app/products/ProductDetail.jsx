import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, ArrowLeft, Share2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLang } from '../../context/LangContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useLang();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(r => {
        setProduct(r.data);
        setSelectedWeight(r.data.prices?.[0]?.weight || '250g');
        return api.get(`/products?category=${r.data.category}`);
      })
      .then(r => setRelated(r.data.filter(p => p._id !== id).slice(0, 4)))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  const selectedPrice = product?.prices?.find(p => p.weight === selectedWeight);

  const handleAdd = () => {
    if (!selectedPrice) return;
    setAdding(true);
    addToCart({
      productId: product._id,
      name: product.name,
      nameTelugu: product.nameTelugu,
      image: product.images?.[0] || PLACEHOLDER,
      weight: selectedWeight,
      price: selectedPrice.price,
    });
    setTimeout(() => setAdding(false), 800);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading) return (
    <div className="min-h-screen bg-cream dark:bg-[#1a0800] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div className="skeleton h-96 rounded-3xl" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="skeleton h-5 w-1/2 rounded" />
          <div className="skeleton h-24 w-full rounded" />
          <div className="flex gap-2">{[1,2,3].map(i => <div key={i} className="skeleton h-10 w-20 rounded-full" />)}</div>
          <div className="skeleton h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-cream dark:bg-[#1a0800] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-brown/50 dark:text-cream/50">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-saffron transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <span>/</span>
          <Link to="/products" className="hover:text-saffron transition-colors">Products</Link>
          <span>/</span>
          <span className="text-brown dark:text-cream">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-saffron/10"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={product.images?.[0] || PLACEHOLDER}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isWithoutGarlic && (
                <span className="bg-forest text-white text-xs font-bold px-3 py-1 rounded-full">🌿 Without Garlic</span>
              )}
              {product.featured && (
                <span className="bg-saffron text-white text-xs font-bold px-3 py-1 rounded-full">⭐ Featured</span>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-playfair text-3xl md:text-4xl font-bold text-brown dark:text-cream leading-tight">
                  {product.name}
                </h1>
                {product.nameTelugu && (
                  <p className="font-telugu text-brown/60 dark:text-cream/60 text-lg mt-1">{product.nameTelugu}</p>
                )}
              </div>
              <button onClick={handleShare} className="p-2 rounded-full hover:bg-brown/10 dark:hover:bg-cream/10 transition-all flex-shrink-0">
                <Share2 size={18} className="text-brown/50 dark:text-cream/50" />
              </button>
            </div>

            {product.ratings > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(product.ratings) ? 'fill-turmeric text-turmeric' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-sm text-brown/60 dark:text-cream/60">
                  {product.ratings} ({product.numReviews} reviews)
                </span>
              </div>
            )}

            <p className="font-merriweather text-brown/70 dark:text-cream/70 leading-relaxed mt-4 text-sm">
              {product.description || 'Authentic handcrafted pickle made with pure sesame oil and traditional Hyderabadi spices. No preservatives, no artificial colors.'}
            </p>

            <div className="mt-6">
              <p className="text-sm font-semibold text-brown/70 dark:text-cream/70 mb-3">Select Weight</p>
              <div className="flex gap-3 flex-wrap">
                {product.prices?.map(p => (
                  <button
                    key={p.weight}
                    onClick={() => setSelectedWeight(p.weight)}
                    className={`px-5 py-2.5 rounded-full font-semibold border-2 transition-all ${
                      selectedWeight === p.weight
                        ? 'bg-saffron border-saffron text-white shadow-lg shadow-saffron/30'
                        : 'border-brown/20 dark:border-cream/20 text-brown/70 dark:text-cream/70 hover:border-saffron'
                    }`}
                  >
                    {p.weight} — ₹{p.price}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <div>
                <span className="font-playfair text-4xl font-bold text-saffron">₹{selectedPrice?.price}</span>
                <span className="text-brown/50 dark:text-cream/50 text-sm ml-2">/{selectedWeight}</span>
              </div>
              <motion.button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 bg-saffron hover:bg-[#c96a28] text-white py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-saffron/30"
                whileTap={{ scale: 0.95 }}
                animate={adding ? { scale: [1, 1.05, 1] } : {}}
              >
                <ShoppingCart size={20} />
                {adding ? '✓ Added!' : t.addToCart}
              </motion.button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {['🌿 No Preservatives', '🫚 Sesame Oil', '🏠 Homemade'].map((badge, i) => (
                <div key={i} className="bg-white dark:bg-brown/20 rounded-xl p-3 text-center text-xs font-semibold text-brown/70 dark:text-cream/70 shadow-sm">
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-playfair text-2xl font-bold text-brown dark:text-cream mb-6">More from this Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <Link
                  key={p._id}
                  to={`/products/${p._id}`}
                  className="bg-white dark:bg-brown/30 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group"
                >
                  <img
                    src={p.images?.[0] || PLACEHOLDER}
                    alt={p.name}
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-3">
                    <p className="font-semibold text-brown dark:text-cream text-sm truncate">{p.name}</p>
                    <p className="text-saffron font-bold text-sm mt-1">₹{p.prices?.[0]?.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
