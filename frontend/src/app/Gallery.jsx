import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80', alt: 'Gongura Pickle' },
  { src: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80', alt: 'Mango Pickle' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', alt: 'Pickle Jars' },
  { src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80', alt: 'Traditional Cooking' },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', alt: 'Spices' },
  { src: 'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?w=600&q=80', alt: 'Pickle Making' },
  { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80', alt: 'Food Spread' },
  { src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', alt: 'Healthy Food' },
  { src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', alt: 'Fresh Ingredients' },
  { src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80', alt: 'Homemade Pickles' },
  { src: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80', alt: 'Sesame Oil' },
  { src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80', alt: 'Traditional Recipe' },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="min-h-screen bg-brand-black pt-20">
      {/* Header */}
      <div className="bg-brand-yellow py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-brand-red text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Visual Story</span>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-brand-black">Our Gallery</h1>
            <p className="text-brand-black/60 mt-2 font-poppins">A glimpse into our kitchen, our craft, and our passion</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl shadow-md border-2 border-transparent hover:border-brand-yellow transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setLightbox(img)}
            >
              <img src={img.src} alt={img.alt} className="w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/50 transition-all duration-300 flex items-center justify-center">
                <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-brand-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-semibold">{img.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 bg-brand-yellow p-3 rounded-full text-brand-black hover:bg-brand-yellow-deep transition-all" onClick={() => setLightbox(null)}>
              <X size={24} />
            </button>
            <motion.img
              src={lightbox.src.replace('w=600', 'w=1200')}
              alt={lightbox.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border-4 border-brand-yellow"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            />
            <p className="absolute bottom-6 text-white/70 text-sm">{lightbox.alt}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
