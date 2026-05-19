import { motion } from 'framer-motion';
import { useEffect } from 'react';
import logo from '../assets/pickleHouseLogo2.png';

export default function LoadingScreen({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2600);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-brand-yellow"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Floating spices */}
      {['🌶️', '🫙', '🌿', '✨', '🍋', '🧄', '🫚', '🌾'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute select-none text-2xl"
          style={{ left: `${10 + i * 11}%`, bottom: '-5%' }}
          animate={{ y: '-110vh', rotate: 720, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3 + i * 0.3, delay: i * 0.2, repeat: Infinity, ease: 'linear' }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Logo */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <motion.img
          src={logo}
          alt="Pickle House"
          className="h-36 w-auto object-contain mx-auto mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }}
        />
        <motion.p
          className="font-poppins text-brand-red text-xl mt-2 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          ...taste the original
        </motion.p>
        <motion.p
          className="font-telugu text-brand-black/60 text-sm mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          శ్రేష్టమైన నువ్వుల నూనె తో తయారు చేయబడిన పచ్చళ్ళు
        </motion.p>

        {/* Loading bar */}
        <motion.div className="mt-8 w-48 h-1.5 bg-brand-black/20 rounded-full mx-auto overflow-hidden">
          <motion.div
            className="h-full bg-brand-red rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
