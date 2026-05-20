import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, closeDrawer, removeFromCart, updateQty, total, count } = useCart();

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-brand-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-brand-yellow border-b-2 border-brand-black">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-brand-black" size={22} />
                <h2 className="font-playfair text-xl font-bold text-brand-black">
                  Your Cart {count > 0 && <span className="text-brand-red">({count})</span>}
                </h2>
              </div>
              <button onClick={closeDrawer} className="p-2 rounded-full hover:bg-brand-black/10 transition-all">
                <X size={20} className="text-brand-black" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-yellow-light">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-6xl mb-4">🫙</span>
                  <p className="font-playfair text-xl text-brand-black/60">Your cart is empty</p>
                  <p className="text-sm text-brand-black/40 mt-1">Add some delicious pickles!</p>
                  <button onClick={closeDrawer} className="btn-primary mt-6">Browse Products</button>
                </div>
              ) : (
                cart.items.map(item => {
                  const key = `${item.productId}-${item.weight}`;
                  return (
                    <motion.div
                      key={key}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 bg-white rounded-xl p-3 shadow-sm border-l-4 border-brand-yellow"
                    >
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-brand-black text-sm truncate">{item.name}</p>
                        <p className="text-xs text-brand-black/50">{item.weight}</p>
                        <p className="text-brand-red font-bold text-sm mt-1">₹{item.price * item.quantity}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => removeFromCart(key)} className="text-brand-red hover:text-brand-red-deep transition-colors">
                          <Trash2 size={14} />
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => item.quantity === 1 ? removeFromCart(key) : updateQty(key, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center hover:bg-brand-yellow-deep transition-all"
                          >
                            <Minus size={10} className="text-brand-black" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-brand-black">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(key, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center hover:bg-brand-yellow-deep transition-all"
                          >
                            <Plus size={10} className="text-brand-black" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="p-6 border-t-2 border-brand-yellow space-y-4 bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-poppins text-brand-black/70">Subtotal</span>
                  <span className="font-playfair text-2xl font-bold text-brand-red">₹{total}</span>
                </div>
                <p className="text-xs text-brand-black/40 text-center">Shipping calculated at checkout</p>
                <Link
                  to="/checkout"
                  onClick={closeDrawer}
                  className="btn-primary w-full text-center block text-lg"
                >
                  Proceed to Checkout →
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
