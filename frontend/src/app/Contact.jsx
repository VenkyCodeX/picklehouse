import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, MessageCircle, Instagram, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    const msg = `Hi Pickle House! 🫙\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nMessage: ${form.message}`;
    window.open(`https://wa.me/919262342344?text=${encodeURIComponent(msg)}`, '_blank');
    setTimeout(() => {
      setSending(false);
      setForm({ name: '', email: '', phone: '', message: '' });
      toast.success('Message sent via WhatsApp! 🎉');
    }, 1000);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-brand-black/10 bg-white text-brand-black placeholder-brand-black/30 focus:outline-none focus:border-brand-yellow transition-all";

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-brand-yellow py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-brand-red text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Get in Touch</span>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-brand-black">Contact Us</h1>
            <p className="text-brand-black/60 mt-2 font-poppins">We'd love to hear from you. Order, inquire, or just say hello!</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map + Details */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="rounded-3xl overflow-hidden shadow-2xl mb-8 h-72 border-4 border-brand-yellow">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.5!2d78.5!3d17.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zVmFuYXN0aGFsaXB1cmFtLCBIeWRlcmFiYWQ!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Pickle House Location"
              />
            </div>
            <div className="space-y-3">
              {[
                { icon: MapPin, label: 'Address', content: '#5-4-99/1, Kamala Nagar Road, Near Rythu Bazar,\nVanasthalipuram, Hyderabad - 500070, Telangana' },
                { icon: Phone, label: 'Phone', content: '9262342344\n8801101745', isPhone: true },
                { icon: Clock, label: 'Hours', content: 'Open daily until 10 PM' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-brand-yellow-light rounded-2xl border-l-4 border-brand-yellow">
                  <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-brand-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-black text-sm">{item.label}</p>
                    {item.isPhone ? (
                      <div>
                        {item.content.split('\n').map((p, j) => (
                          <a key={j} href={`tel:${p}`} className="text-brand-red hover:underline text-sm block font-semibold">{p}</a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-brand-black/60 text-sm whitespace-pre-line">{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <a href="https://wa.me/919262342344" target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-2xl font-semibold hover:bg-[#1da851] transition-all">
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-semibold hover:opacity-90 transition-all">
                  <Instagram size={18} /> Instagram
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="bg-brand-yellow rounded-3xl p-8 shadow-xl border-4 border-brand-black">
              <h2 className="font-playfair text-2xl font-bold text-brand-black mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-black/70 mb-1">Name *</label>
                    <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-black/70 mb-1">Phone</label>
                    <input type="tel" placeholder="Your phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black/70 mb-1">Email</label>
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black/70 mb-1">Message *</label>
                  <textarea placeholder="Tell us what you need..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} className={`${inputClass} resize-none`} />
                </div>
                <button type="submit" disabled={sending} className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-70">
                  <Send size={18} />
                  {sending ? 'Sending...' : 'Send via WhatsApp'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
