import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function FadeUp({ children, delay = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }}>
      {children}
    </motion.div>
  );
}

const countries = [
  { flag: '🇺🇸', name: 'USA' }, { flag: '🇬🇧', name: 'UK' }, { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇦🇺', name: 'Australia' }, { flag: '🇦🇪', name: 'UAE' }, { flag: '🇸🇬', name: 'Singapore' },
  { flag: '🇩🇪', name: 'Germany' }, { flag: '🇳🇱', name: 'Netherlands' }, { flag: '🇳🇿', name: 'New Zealand' },
  { flag: '🇶🇦', name: 'Qatar' },
];

const steps = [
  { num: '01', title: 'Order Online or WhatsApp', desc: 'Browse our products and place your order online, or simply WhatsApp us your requirements.' },
  { num: '02', title: 'We Pack Specially for You', desc: 'Vacuum-sealed, leak-proof, customs-compliant packaging designed for international travel.' },
  { num: '03', title: 'Delivered to Your Door', desc: 'Your taste of Hyderabad arrives safely anywhere in the world.' },
];

const packagingFeatures = [
  'Vacuum sealed for freshness', 'Leak-proof containers',
  'Customs compliant labeling', 'International food safety standards',
  'Safe for air travel', 'Shelf life 6-12 months',
];

export default function NRIPacking() {
  const [form, setForm] = useState({ name: '', country: '', products: '', quantity: '', whatsapp: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = `Hi Pickle House! 🌍 NRI Order Inquiry:\nName: ${form.name}\nCountry: ${form.country}\nProducts: ${form.products}\nQuantity: ${form.quantity}\nWhatsApp: ${form.whatsapp}`;
    window.open(`https://wa.me/919262342344?text=${encodeURIComponent(msg)}`, '_blank');
    setSubmitted(true);
    toast.success('Redirecting to WhatsApp! 🎉');
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-brand-black/10 bg-white text-brand-black placeholder-brand-black/30 focus:outline-none focus:border-brand-yellow transition-all";

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-brand-red py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <FadeUp>
            <div className="text-6xl mb-4">🌍</div>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white leading-tight">
              Missing Home?<br />
              <span className="text-brand-yellow">We Ship Worldwide.</span>
            </h1>
            <p className="font-poppins text-white/80 text-xl mt-6">
              Vacuum-sealed, leak-proof, customs-compliant packaging.<br />
              The taste of Hyderabad delivered to your door.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Countries */}
      <section className="py-16 bg-brand-black">
        <div className="max-w-5xl mx-auto px-4">
          <FadeUp>
            <h2 className="font-playfair text-3xl font-bold text-brand-yellow text-center mb-8">We Ship To</h2>
          </FadeUp>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {countries.map((c, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <motion.div className="flex flex-col items-center gap-1 cursor-default" whileHover={{ scale: 1.2, y: -5 }}>
                  <motion.span className="text-4xl" animate={{ y: [0, -4, 0] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity }}>
                    {c.flag}
                  </motion.span>
                  <span className="text-white/60 text-xs font-semibold">{c.name}</span>
                </motion.div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.3}>
            <p className="text-center text-white/30 text-sm mt-6">+ Many more countries. Contact us for your location.</p>
          </FadeUp>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-brand-yellow-light max-w-5xl mx-auto px-4">
        <FadeUp>
          <h2 className="font-playfair text-4xl font-bold text-brand-black text-center mb-12">How It Works</h2>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <FadeUp key={i} delay={i * 0.15}>
              <motion.div className="text-center relative" whileHover={{ y: -5 }}>
                <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="font-playfair text-white font-bold text-xl">{s.num}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-brand-red to-transparent" />
                )}
                <h3 className="font-playfair text-xl font-bold text-brand-black mb-2">{s.title}</h3>
                <p className="text-brand-black/60 text-sm leading-relaxed font-poppins">{s.desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Features + Form */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <FadeUp>
            <div className="bg-brand-black rounded-3xl p-8 text-white border-4 border-brand-yellow">
              <h3 className="font-playfair text-2xl font-bold text-brand-yellow mb-6">Our NRI Packaging</h3>
              <div className="space-y-3">
                {packagingFeatures.map((f, i) => (
                  <motion.div key={i} className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <CheckCircle size={18} className="text-brand-yellow flex-shrink-0" />
                    <span className="text-white/80 font-poppins text-sm">{f}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-brand-yellow/10 rounded-2xl border border-brand-yellow/30">
                <p className="text-brand-yellow font-semibold text-sm">💡 Pro Tip</p>
                <p className="text-white/60 text-sm mt-1 font-poppins">Order in bulk to save on shipping costs. We offer special rates for orders above ₹2000.</p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="bg-white rounded-3xl p-8 shadow-xl border-t-4 border-brand-yellow">
              <h3 className="font-playfair text-2xl font-bold text-brand-black mb-6">NRI Order Inquiry</h3>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✅</div>
                  <h4 className="font-playfair text-xl font-bold text-brand-black">Redirected to WhatsApp!</h4>
                  <p className="text-brand-black/60 mt-2 font-poppins">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-primary mt-4">Send Another Inquiry</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { key: 'name', label: 'Your Name', placeholder: 'Enter your full name', type: 'text' },
                    { key: 'country', label: 'Country', placeholder: 'e.g. USA, UK, Australia', type: 'text' },
                    { key: 'products', label: 'Products Needed', placeholder: 'e.g. Mango Pickle 500g x2', type: 'text' },
                    { key: 'quantity', label: 'Total Quantity', placeholder: 'e.g. 5 jars', type: 'text' },
                    { key: 'whatsapp', label: 'WhatsApp Number', placeholder: '+1 234 567 8900', type: 'tel' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-semibold text-brand-black/70 mb-1">{field.label}</label>
                      <input type={field.type} placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} required className={inputClass} />
                    </div>
                  ))}
                  <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4">
                    <MessageCircle size={20} /> Order via WhatsApp 💬
                  </button>
                </form>
              )}
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
