import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function FadeUp({ children, delay = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }}>
      {children}
    </motion.div>
  );
}

const values = [
  { icon: '🌿', title: 'Natural Ingredients', desc: 'We source only the freshest, most natural ingredients. No compromises.' },
  { icon: '🫚', title: 'Pure Sesame Oil', desc: 'Every single jar is made with premium cold-pressed sesame oil — నువ్వుల నూనె.' },
  { icon: '🏠', title: 'Homemade Tradition', desc: 'Recipes passed down through generations. The same taste your grandparents loved.' },
  { icon: '❤️', title: 'Made with Love', desc: 'Small batches, personal attention, and genuine care in every jar we make.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-brand-yellow py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeUp>
            <span className="inline-block bg-brand-red text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">Our Story</span>
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-brand-black leading-tight">
              From Our Kitchen<br />to Your Table
            </h1>
            <p className="font-poppins text-brand-black/70 text-xl mt-6 leading-relaxed">
              "For years, we have been crafting pickles the way our grandmothers taught us — with pure sesame oil, fresh ingredients, and no shortcuts."
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-yellow">
                <img
                  src="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=700&q=80"
                  alt="Traditional pickle making"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
              </div>
              <motion.div
                className="absolute -bottom-6 -right-6 bg-brand-red text-white rounded-2xl p-5 shadow-2xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <p className="font-playfair text-3xl font-bold">10+</p>
                <p className="text-sm font-semibold">Years of Tradition</p>
              </motion.div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div>
              <p className="section-label mb-3">The Pickle House Story</p>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-brand-black mb-6">
                Authentic Taste,<br />Every Single Jar.
              </h2>
              <div className="space-y-4 text-brand-black/70 font-poppins leading-relaxed">
                <p>Pickle House was born from a simple belief — that the best food comes from the heart, made with patience, love, and the finest ingredients.</p>
                <p>Located in the heart of Vanasthalipuram, Hyderabad, we started as a small home kitchen operation, making pickles the traditional way — with pure sesame oil, hand-ground spices, and recipes that have been in our family for generations.</p>
                <p>Today, we serve over 1000+ families across Hyderabad and ship to NRI customers worldwide. But our process remains the same — small batches, personal attention, and zero shortcuts.</p>
                <p className="font-telugu text-brand-black/80 text-base">శ్రేష్టమైన నువ్వుల నూనె తో తయారు చేయబడిన పచ్చళ్ళు — ఇది మా వాగ్దానం.</p>
              </div>
              <div className="mt-8 flex gap-4">
                <Link to="/products" className="btn-primary">Shop Now →</Link>
                <Link to="/contact" className="btn-outline">Contact Us</Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="section-label text-brand-yellow mb-2">What We Stand For</p>
              <h2 className="font-playfair text-4xl font-bold text-white">Our Values</h2>
            </div>
          </FadeUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <motion.div
                  className="bg-brand-grey rounded-2xl p-6 text-center border-t-4 border-brand-yellow hover:border-brand-red transition-all"
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <div className="text-5xl mb-4">{v.icon}</div>
                  <h3 className="font-playfair font-bold text-white text-lg mb-2">{v.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-brand-yellow-light">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeUp>
            <h2 className="font-playfair text-4xl font-bold text-brand-black mb-4">Visit Us</h2>
            <p className="text-brand-black/70 font-poppins mb-2">
              #5-4-99/1, Kamala Nagar Road, Near Rythu Bazar,<br />
              Vanasthalipuram, Hyderabad - 500070, Telangana
            </p>
            <p className="text-brand-red font-semibold">Open daily until 10 PM</p>
            <p className="text-brand-black/60 mt-1">📞 9262342344 | 8801101745</p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
