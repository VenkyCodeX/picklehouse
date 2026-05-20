import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { CheckCircle, Star } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import api from '../lib/api';
import { useLang } from '../context/LangContext';

function FadeUp({ children, delay = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

const features = [
  { icon: '🌿', title: '100% Natural', desc: 'Only fresh, natural ingredients. No shortcuts.' },
  { icon: '🚫', title: 'No Preservatives', desc: 'Made fresh in small batches. Pure and safe.' },
  { icon: '🎨', title: 'No Artificial Colors', desc: 'The color you see is from real spices.' },
  { icon: '🏠', title: 'Homemade Taste', desc: 'Traditional Hyderabadi recipes, just like grandma made.' },
  { icon: '✈️', title: 'NRI Shipping', desc: 'Vacuum-sealed, leak-proof. Delivered worldwide.' },
  { icon: '🫚', title: 'Pure Sesame Oil', desc: 'Every jar made with premium నువ్వుల నూనె.' },
  { icon: '🧄', title: 'Without Garlic', desc: 'Special Jain-friendly options available.' },
  { icon: '⭐', title: '5 Star Rated', desc: 'Trusted by 1000+ families. 100+ Google reviews.' },
];

const marqueeItems = [
  '🌶️ 100% Natural', '🏺 No Preservatives', '🌿 Pure Sesame Oil',
  '✈️ NRI Shipping Available', '⭐ 5 Star Rated', '🧄 Without Garlic Options',
  '🫙 Homemade Taste', '1000+ Happy Families',
];

const nriCountries = [
  { flag: '🇺🇸', name: 'USA' }, { flag: '🇬🇧', name: 'UK' }, { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇦🇺', name: 'Australia' }, { flag: '🇦🇪', name: 'UAE' }, { flag: '🇸🇬', name: 'Singapore' },
  { flag: '🇩🇪', name: 'Germany' }, { flag: '🇶🇦', name: 'Qatar' },
];

function FeaturedStrip({ products, onQuickView }) {
  const stripRef = useRef(null);
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.5;
    let raf;
    const animate = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    el.addEventListener('mouseenter', () => cancelAnimationFrame(raf));
    el.addEventListener('mouseleave', () => { raf = requestAnimationFrame(animate); });
    return () => cancelAnimationFrame(raf);
  }, [products]);

  const doubled = [...products, ...products];
  return (
    <div ref={stripRef} className="flex gap-6 overflow-x-hidden cursor-grab" style={{ scrollBehavior: 'auto' }}>
      {doubled.map((p, i) => (
        <div key={`${p._id}-${i}`} className="flex-shrink-0 w-64">
          <ProductCard product={p} onQuickView={onQuickView} />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [reviewIdx, setReviewIdx] = useState(0);
  const { t } = useLang();

  useEffect(() => {
    api.get('/products?featured=true').then(r => setFeatured(r.data)).catch(() => {});
    api.get('/reviews').then(r => setReviews(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(() => setReviewIdx(i => (i + 1) % reviews.length), 4000);
    return () => clearInterval(timer);
  }, [reviews]);

  return (
    <div className="overflow-x-hidden">
      <Hero />

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-white py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-brand-black/70 font-poppins font-medium text-sm mx-8">
              {item} <span className="text-brand-brown mx-4">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <FadeUp>
            <div className="text-center">
              <p className="section-label mb-2">Our Collection</p>
              <h2 className="section-title text-brand-black">Signature Pickles & Spices</h2>
              <p className="text-brand-black/50 mt-2 font-poppins">Made fresh with traditional recipes</p>
            </div>
          </FadeUp>
        </div>
        {featured.length > 0 && <FeaturedStrip products={featured} onQuickView={setQuickView} />}
        <div className="text-center mt-10">
          <Link to="/products" className="inline-block bg-brand-brown text-white font-bold text-base px-6 py-3 rounded-full shadow-sm hover:bg-brand-brown/90 transition-colors">
            View All Products →
          </Link>
        </div>
      </section>

      {/* ── ABOUT / STORY ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-brown">
                  <img
                    src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=700&q=80"
                    alt="Pickle House Shop"
                    className="w-full h-96 object-cover"
                    loading="lazy"
                  />
                </div>
                <motion.div
                  className="absolute -top-5 -right-5 bg-brand-brown/10 text-brand-black rounded-2xl p-4 shadow-xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <p className="font-playfair text-2xl font-bold">1000+</p>
                  <p className="text-xs font-poppins font-semibold">Happy Families</p>
                </motion.div>
                <motion.div
                  className="absolute -bottom-5 -left-5 bg-brand-brown text-white rounded-2xl p-4 shadow-xl"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                >
                  <p className="font-playfair text-2xl font-bold">5.0 ⭐</p>
                  <p className="text-xs font-poppins">Google Rated</p>
                </motion.div>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div>
                <p className="section-label text-brand-brown mb-3">Our Story</p>
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-brand-black leading-tight mb-6">
                  Made with Love,<br />Tradition & Pure<br />
                  <span className="text-brand-brown">Sesame Oil.</span>
                </h2>
                <p className="text-brand-black/70 font-poppins leading-relaxed mb-6">
                  For years, we have been crafting pickles the way our grandmothers taught us — with pure sesame oil,
                  the freshest vegetables, and absolutely no shortcuts. Every jar of Pickle House carries the authentic
                  taste of Hyderabad.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {[
                    'Traditional family recipes', 'Pure sesame oil only',
                    'Zero preservatives', 'Made fresh in small batches',
                    'Trusted by 1000+ families', 'NRI shipping worldwide',
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2 text-sm text-brand-black/70"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <CheckCircle size={16} className="text-brand-brown flex-shrink-0" />
                      {item}
                    </motion.div>
                  ))}
                </div>
                <Link to="/about" className="inline-block bg-brand-brown text-white font-bold text-base px-6 py-3 rounded-full shadow-sm hover:bg-brand-brown/90 transition-colors">
                  Read Our Story →
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── PROMISE SECTION ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="section-label mb-2">Why Choose Us</p>
              <h2 className="section-title text-brand-black">The Pickle House Promise</h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <motion.div
                  className="bg-white rounded-2xl p-6 text-center border-t-4 border-brand-brown hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
                  whileHover={{ boxShadow: '0 20px 40px rgba(122,79,30,0.25)' }}
                >
                  <div className="text-4xl mb-3">{f.icon}</div>
                  <h3 className="font-playfair font-bold text-brand-black text-sm md:text-base mb-1">{f.title}</h3>
                  <p className="text-brand-black/50 text-xs leading-relaxed hidden md:block">{f.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── NRI SECTION ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <FadeUp>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-brand-black mb-4">
              Missing Home?<br />We Ship Worldwide. 🌍
            </h2>
            <p className="text-brand-black/70 text-lg mb-10 font-poppins">
              Vacuum-sealed, leak-proof, customs-compliant packaging.<br />
              The taste of Hyderabad delivered to your door.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {nriCountries.map((c, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center gap-1"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <span className="text-4xl">{c.flag}</span>
                  <span className="text-brand-black/60 text-xs font-semibold">{c.name}</span>
                </motion.div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {[
                { num: '01', text: 'Order online or WhatsApp us' },
                { num: '02', text: 'We vacuum-seal & pack customs-compliant' },
                { num: '03', text: 'Delivered to your door worldwide' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 text-brand-black border border-brand-brown/20 shadow-sm">
                  <p className="font-playfair text-3xl font-bold text-brand-brown mb-2">{s.num}</p>
                  <p className="font-poppins text-sm text-brand-black/70">{s.text}</p>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.3}>
            <Link to="/nri-packing" className="inline-block bg-brand-brown text-white font-bold text-lg px-8 py-4 rounded-full shadow-sm hover:bg-brand-brown/90 transition-colors">
              Learn About NRI Packing →
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeUp>
            <p className="section-label mb-2">Customer Love</p>
            <h2 className="section-title text-brand-black mb-2">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2 mb-10">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-brand-brown text-brand-brown" />)}
              </div>
              <span className="font-playfair text-xl font-bold text-brand-black">5.0</span>
              <span className="text-brand-black/50 text-sm">· 100+ Google Reviews</span>
            </div>
          </FadeUp>

          {reviews.length > 0 && (
            <div className="relative">
              <motion.div
                key={reviewIdx}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-brand-brown"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={22} className="fill-brand-brown text-brand-brown" />)}
                </div>
                <p className="font-playfair text-brand-black/80 text-lg italic leading-relaxed mb-6">
                  "{reviews[reviewIdx]?.comment}"
                </p>
                <div>
                  <p className="font-playfair font-bold text-brand-brown text-lg">{reviews[reviewIdx]?.name}</p>
                  <p className="text-brand-black/50 text-sm">{reviews[reviewIdx]?.location}</p>
                </div>
              </motion.div>
              <div className="flex justify-center gap-2 mt-6">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIdx(i)}
                    className={`h-2.5 rounded-full transition-all ${i === reviewIdx ? 'bg-brand-brown w-6' : 'bg-brand-black/20 w-2.5'}`}
                  />
                ))}
              </div>
            </div>
          )}

          <Link to="/reviews" className="btn-outline mt-8 inline-block">Read All Reviews →</Link>
        </div>
      </section>

      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  );
}
