import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';
import logo from '../assets/pickleHouseLogo2.png';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'About Us', path: '/about' },
  { label: 'NRI Packing', path: '/nri-packing' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

const categories = ['Pickles', 'Powders', 'Pure Ghee', 'Tea Powders', 'Dry Fruits', 'Sweets'];

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white relative">
      {/* Top border */}
      <div className="h-1 bg-brand-yellow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="Pickle House" className="h-20 w-auto object-contain" />
            </Link>
            <p className="font-telugu text-white/50 text-sm leading-relaxed mb-4">
              శ్రేష్టమైన నువ్వుల నూనె తో తయారు చేయబడిన పచ్చళ్ళు
            </p>
            <div className="flex gap-3 mb-6">
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full border border-brand-yellow/30 flex items-center justify-center text-brand-yellow hover:bg-brand-yellow hover:text-brand-black transition-all">
                <Instagram size={16} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full border border-brand-yellow/30 flex items-center justify-center text-brand-yellow hover:bg-brand-yellow hover:text-brand-black transition-all">
                <Facebook size={16} />
              </a>
              <a href="https://wa.me/919262342344" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full border border-brand-yellow/30 flex items-center justify-center text-brand-yellow hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all">
                <MessageCircle size={16} />
              </a>
            </div>
            <motion.a
              href="https://alphadevs.in"
              target="_blank"
              rel="noreferrer"
              className="text-brand-yellow/50 text-xs hover:text-brand-yellow transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              Built with ❤️ by <span className="text-brand-yellow font-semibold">AlphaDevs</span> | alphadevs.in
            </motion.a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-bold text-brand-yellow mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-white/60 hover:text-brand-yellow transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="text-brand-yellow/0 group-hover:text-brand-yellow transition-all">→</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-playfair text-lg font-bold text-brand-yellow mb-4">Our Products</h4>
            <ul className="space-y-2">
              {categories.map(c => (
                <li key={c}>
                  <Link to={`/products?category=${c.toLowerCase()}`} className="text-white/60 hover:text-brand-yellow transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="text-brand-yellow/0 group-hover:text-brand-yellow transition-all">→</span>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair text-lg font-bold text-brand-yellow mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex gap-2 text-sm">
                <MapPin size={16} className="text-brand-yellow flex-shrink-0 mt-0.5" />
                <p className="text-white/60 leading-relaxed">
                  #5-4-99/1, Kamala Nagar Road,<br />
                  Near Rythu Bazar, Vanasthalipuram,<br />
                  Hyderabad - 500070, Telangana
                </p>
              </div>
              <div className="flex gap-2 text-sm items-center">
                <Phone size={16} className="text-brand-yellow flex-shrink-0" />
                <div>
                  <a href="tel:9262342344" className="text-brand-yellow hover:text-brand-yellow-deep transition-colors block font-semibold">9262342344</a>
                  <a href="tel:8801101745" className="text-brand-yellow hover:text-brand-yellow-deep transition-colors block font-semibold">8801101745</a>
                </div>
              </div>
              <div className="flex gap-2 text-sm items-center">
                <Clock size={16} className="text-brand-yellow flex-shrink-0" />
                <p className="text-white/60">Open daily until <span className="text-brand-red font-semibold">10 PM</span></p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-brand-yellow">⭐⭐⭐⭐⭐</span>
                <span className="text-white/50 text-xs">5.0 (100+ Reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2026 Pickle House. All rights reserved.</p>
          <p className="text-white/30 text-sm">Authentic Hyderabadi Pickles · Pure Sesame Oil · No Preservatives</p>
        </div>
      </div>
    </footer>
  );
}
