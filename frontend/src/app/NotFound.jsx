import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-yellow flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          className="text-9xl mb-6"
          animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          🫙
        </motion.div>
        <h1 className="font-playfair text-8xl font-bold text-brand-red mb-4">404</h1>
        <h2 className="font-playfair text-3xl font-bold text-brand-black mb-3">Page Not Found</h2>
        <p className="text-brand-black/60 font-poppins mb-8">
          Looks like this pickle jar is empty!<br />The page you're looking for doesn't exist.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/products" className="btn-outline">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}
