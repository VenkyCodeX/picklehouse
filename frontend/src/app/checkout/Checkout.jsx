import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const SHIPPING = 80;
const FREE_SHIPPING_THRESHOLD = 500;

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [address, setAddress] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: '', city: '', state: '', pincode: '', country: 'India',
  });

  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING;
  const grandTotal = total + shipping;

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-brand-black/10 bg-white text-brand-black focus:outline-none focus:border-brand-yellow transition-all";

  const redirectToWhatsApp = (order) => {
    const productsText = order.items.map(item => `- ${item.name} (${item.weight}) x${item.quantity}`).join('\n');
    const addressText = [address.street, address.city, address.state, address.pincode, address.country].filter(Boolean).join(', ');
    const msg = `Hi Pickle House! 🌶️\nI confirm my order.\n\nName: ${address.name}\nPhone: ${address.phone}\nAddress: ${addressText}\n\nProducts:\n${productsText}\n\nTotal: ₹${order.totalAmount}\nOrder ID: ${order._id}`;
    const whatsappNumber = '919262342344';
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    setTimeout(() => window.open(url, '_blank'), 100);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: cart.items.map(i => ({
          product: i.productId, name: i.name, nameTelugu: i.nameTelugu,
          image: i.image, weight: i.weight, price: i.price, quantity: i.quantity,
        })),
        shippingAddress: address,
        itemsTotal: total, shippingCharge: shipping, totalAmount: grandTotal,
        paymentMethod: 'whatsapp',
        guestInfo: !user ? { name: address.name, phone: address.phone } : undefined,
      };
      const { data: order } = await api.post('/orders', orderData);
      setOrderId(order._id);
      clearCart();
      setStep(3);
      redirectToWhatsApp(order);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-brand-yellow-light pt-24 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">🛒</span>
          <p className="font-playfair text-2xl text-brand-black/60 mt-4">Your cart is empty</p>
          <button onClick={() => navigate('/products')} className="btn-primary mt-4">Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-yellow-light pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-playfair text-4xl font-bold text-brand-black mb-8 text-center">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {['Shipping', 'Confirm', 'Confirmed'].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > i + 1 ? 'bg-brand-red text-white' : step === i + 1 ? 'bg-brand-yellow text-brand-black border-2 border-brand-black' : 'bg-brand-black/10 text-brand-black/40'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-semibold hidden sm:block ${step === i + 1 ? 'text-brand-red' : 'text-brand-black/40'}`}>{s}</span>
              {i < 2 && <div className="w-8 h-0.5 bg-brand-black/10" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-3xl p-8 shadow-xl border-t-4 border-brand-yellow">
                    <h2 className="font-playfair text-xl font-bold text-brand-black mb-6 flex items-center gap-2">
                      <Truck size={20} className="text-brand-red" /> Shipping Address
                    </h2>
                    <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[{ key: 'name', label: 'Full Name', placeholder: 'Your full name' }, { key: 'phone', label: 'Phone', placeholder: '10-digit mobile' }].map(f => (
                          <div key={f.key}>
                            <label className="block text-sm font-semibold text-brand-black/70 mb-1">{f.label} *</label>
                            <input type="text" placeholder={f.placeholder} value={address[f.key]} onChange={e => setAddress({ ...address, [f.key]: e.target.value })} required className={inputClass} />
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-brand-black/70 mb-1">Street Address *</label>
                        <input type="text" placeholder="House no, Street, Area" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} required className={inputClass} />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {[{ key: 'city', label: 'City', placeholder: 'City' }, { key: 'state', label: 'State', placeholder: 'State' }, { key: 'pincode', label: 'Pincode', placeholder: '500070' }].map(f => (
                          <div key={f.key}>
                            <label className="block text-sm font-semibold text-brand-black/70 mb-1">{f.label} *</label>
                            <input type="text" placeholder={f.placeholder} value={address[f.key]} onChange={e => setAddress({ ...address, [f.key]: e.target.value })} required className={inputClass} />
                          </div>
                        ))}
                      </div>
                      <button type="submit" className="w-full btn-primary py-4 text-lg">Continue to Confirm →</button>
                    </form>
                  </div>
                </div>
                <OrderSummary items={cart.items} total={total} shipping={shipping} grandTotal={grandTotal} />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-3xl p-8 shadow-xl border-t-4 border-brand-yellow">
                    <h2 className="font-playfair text-xl font-bold text-brand-black mb-6 flex items-center gap-2">
                      <CreditCard size={20} className="text-brand-red" /> Confirm Order
                    </h2>
                    <p className="text-brand-black/60 mb-6 font-poppins">We will not show online payment. Your order will be confirmed and then sent to WhatsApp with your details.</p>
                    <div className="bg-brand-yellow-light rounded-3xl p-5 border border-brand-yellow mb-6">
                      <p className="font-semibold text-brand-black mb-2">Order confirmation process</p>
                      <ul className="list-disc list-inside text-sm text-brand-black/70 space-y-2">
                        <li>Confirm your order details.</li>
                        <li>Receive an order confirmation message.</li>
                        <li>You will be redirected to WhatsApp automatically.</li>
                      </ul>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="btn-outline flex-1">← Back</button>
                      <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 py-4 text-lg disabled:opacity-70">
                        {loading ? 'Confirming...' : `Confirm Order ₹${grandTotal}`}
                      </button>
                    </div>
                  </div>
                </div>
                <OrderSummary items={cart.items} total={total} shipping={shipping} grandTotal={grandTotal} />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 0.8 }} className="text-8xl mb-6">🎉</motion.div>
              <CheckCircle size={64} className="text-brand-red mx-auto mb-4" />
              <h2 className="font-playfair text-4xl font-bold text-brand-black mb-3">Order Confirmed!</h2>
              <p className="text-brand-black/60 text-lg mb-2 font-poppins">Thank you for your order!</p>
              {orderId && <p className="text-brand-red font-semibold text-sm mb-8">Order ID: {orderId}</p>}
              <p className="text-brand-black/60 mb-8 font-poppins">We'll contact you on {address.phone} to confirm delivery.</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => navigate('/products')} className="btn-primary">Continue Shopping</button>
                <button onClick={() => navigate('/')} className="btn-outline">Go Home</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OrderSummary({ items, total, shipping, grandTotal }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl h-fit border-t-4 border-brand-yellow">
      <h3 className="font-playfair text-lg font-bold text-brand-black mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4">
        {items.map(item => (
          <div key={`${item.productId}-${item.weight}`} className="flex gap-3">
            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0 border-2 border-brand-yellow" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brand-black truncate">{item.name}</p>
              <p className="text-xs text-brand-black/40">{item.weight} × {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-brand-red">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-brand-black/10 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-brand-black/60"><span>Subtotal</span><span>₹{total}</span></div>
        <div className="flex justify-between text-sm text-brand-black/60">
          <span>Shipping</span>
          <span>{shipping === 0 ? <span className="text-brand-red font-semibold">FREE</span> : `₹${shipping}`}</span>
        </div>
        <div className="flex justify-between font-bold text-brand-black text-lg border-t border-brand-black/10 pt-2">
          <span>Total</span><span className="text-brand-red">₹{grandTotal}</span>
        </div>
      </div>
      {shipping > 0 && <p className="text-xs text-brand-black/40 mt-2 text-center">Add ₹{500 - total} more for free shipping!</p>}
    </div>
  );
}
