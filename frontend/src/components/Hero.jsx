import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import vegBg from '../assets/HomeBgVeg.png';
import mangoBg from '../assets/HomePageBgMango.png';
import vegBgMobile from '../assets/HomeBgVegMobile.png';
import mangoBgMobile from '../assets/HomePageBgMangoMobile.png';

const slides = [
  {
    image: mangoBg,
    imageMobile: mangoBgMobile,
    title: 'Irresistible Mango\nPickle Flavours',
    subtitle: 'Sun-dried raw mangoes blended with aromatic spices and pure sesame oil — the taste of every Telugu home.',
  },
  {
    image: vegBg,
    imageMobile: vegBgMobile,
    title: 'Farm Fresh\nVegetable Pickles',
    subtitle: 'Handpicked vegetables, traditional Hyderabadi masalas, zero preservatives. Pure goodness in every jar.',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent(p => (p + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">

      {/* Slides */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, x: direction * 120 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -120 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <img
            src={isMobile ? slides[current].imageMobile : slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover filter brightness-95 saturate-90"
          />
          <div className="absolute inset-0 bg-brand-brown/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 whitespace-pre-line">
              {slides[current].title}
            </h1>
            <p className="font-poppins text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              {slides[current].subtitle}
            </p>
            <Link
              to="/products"
              className="inline-block bg-brand-brown text-white font-bold text-base px-8 py-4 hover:bg-brand-brown/90 transition-colors duration-200"
            >
              Shop Now
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`transition-all duration-300 rounded-full border-2 border-white ${
              i === current ? 'w-4 h-4 bg-white' : 'w-3 h-3 bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 z-20 text-white/50 font-poppins text-sm">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  );
}
