import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import VanillaTilt from 'vanilla-tilt';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80';

export default function ProductCard({ product, onQuickView }) {
  const tiltRef = useRef(null);
  const { addToCart } = useCart();
  const { lang, t } = useLang();
  const [selectedWeight, setSelectedWeight] = useState(product.prices?.[0]?.weight || '250g');
  const [adding, setAdding] = useState(false);

  const selectedPrice = product.prices?.find(p => p.weight === selectedWeight);

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, { max: 8, speed: 400, glare: true, 'max-glare': 0.1, scale: 1.02 });
    }
    return () => tiltRef.current?.vanillaTilt?.destroy();
  }, []);

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

  return (
    <motion.div
      ref={tiltRef}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border-t-4 border-brand-yellow transition-all duration-300 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={product.images?.[0] || PLACEHOLDER}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isWithoutGarlic && (
            <span className="badge-red">🌿 Without Garlic</span>
          )}
          {product.featured && (
            <span className="badge-yellow">⭐ Featured</span>
          )}
        </div>

        {/* Quick View */}
        <button
          onClick={() => onQuickView?.(product)}
          className="absolute top-3 right-3 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-brand-yellow shadow-md"
        >
          <Eye size={14} className="text-brand-black" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-playfair font-bold text-brand-black text-lg leading-tight">
          <Link to={`/products/${product._id}`} className="hover:text-brand-red transition-colors">
            {product.name}
          </Link>
        </h3>
        {product.nameTelugu && (
          <p className="font-telugu text-brand-black/50 text-sm mt-0.5">{product.nameTelugu}</p>
        )}

        {product.ratings > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={i < Math.round(product.ratings) ? 'fill-brand-yellow text-brand-yellow' : 'text-gray-300'} />
            ))}
            <span className="text-xs text-brand-black/40">({product.numReviews})</span>
          </div>
        )}

        {/* Weight Selector */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {product.prices?.map(p => (
            <button
              key={p.weight}
              onClick={() => setSelectedWeight(p.weight)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border-2 transition-all ${
                selectedWeight === p.weight
                  ? 'bg-brand-yellow border-brand-yellow text-brand-black'
                  : 'border-brand-black/20 text-brand-black/60 hover:border-brand-yellow'
              }`}
            >
              {p.weight}
            </button>
          ))}
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="font-playfair text-2xl font-bold text-brand-red">
              ₹{selectedPrice?.price || '—'}
            </span>
            <span className="text-xs text-brand-black/40 ml-1">/{selectedWeight}</span>
          </div>
          <motion.button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-brand-red hover:bg-brand-red-deep text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-md"
            whileTap={{ scale: 0.9 }}
            animate={adding ? { scale: [1, 1.2, 1] } : {}}
          >
            <ShoppingCart size={14} />
            {adding ? '✓' : 'Add'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
