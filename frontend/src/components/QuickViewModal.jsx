import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(product?.prices?.[0]?.weight || '250g');
  const selectedPrice = product?.prices?.find(p => p.weight === selectedWeight);

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-brand-black/70 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl border-t-4 border-brand-yellow"
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-brand-yellow p-2 rounded-full hover:bg-brand-yellow-deep transition-all shadow-md">
            <X size={18} className="text-brand-black" />
          </button>
          <div className="grid md:grid-cols-2">
            <img
              src={product.images?.[0] || PLACEHOLDER}
              alt={product.name}
              className="w-full h-64 md:h-full object-cover"
            />
            <div className="p-6 flex flex-col justify-between">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-brand-black">{product.name}</h2>
                {product.nameTelugu && <p className="font-telugu text-brand-black/50 text-sm mt-1">{product.nameTelugu}</p>}
                {product.ratings > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < Math.round(product.ratings) ? 'fill-brand-yellow text-brand-yellow' : 'text-gray-300'} />
                    ))}
                    <span className="text-xs text-brand-black/40">({product.numReviews})</span>
                  </div>
                )}
                <p className="text-brand-black/70 text-sm mt-3 leading-relaxed">{product.description}</p>
                {product.isWithoutGarlic && (
                  <span className="inline-block mt-3 badge-red">🌿 Without Garlic — Jain Friendly</span>
                )}
              </div>
              <div className="mt-4">
                <div className="flex gap-2 flex-wrap mb-4">
                  {product.prices?.map(p => (
                    <button
                      key={p.weight}
                      onClick={() => setSelectedWeight(p.weight)}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                        selectedWeight === p.weight
                          ? 'bg-brand-yellow border-brand-yellow text-brand-black'
                          : 'border-brand-black/20 text-brand-black/60 hover:border-brand-yellow'
                      }`}
                    >
                      {p.weight} — ₹{p.price}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-playfair text-3xl font-bold text-brand-red">₹{selectedPrice?.price}</span>
                  <button
                    onClick={() => {
                      addToCart({
                        productId: product._id, name: product.name, nameTelugu: product.nameTelugu,
                        image: product.images?.[0] || PLACEHOLDER, weight: selectedWeight, price: selectedPrice?.price,
                      });
                      onClose();
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
