import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="bg-white dark:bg-brown/30 rounded-2xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-saffron/10 rounded-full flex items-center justify-center">
            <Package size={18} className="text-saffron" />
          </div>
          <div>
            <p className="font-semibold text-brown dark:text-cream text-sm">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-brown/50 dark:text-cream/50">
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
            {order.orderStatus}
          </span>
          <span className="font-playfair font-bold text-saffron">₹{order.totalAmount}</span>
          {open ? <ChevronUp size={16} className="text-brown/40 dark:text-cream/40" /> : <ChevronDown size={16} className="text-brown/40 dark:text-cream/40" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-brown/10 dark:border-cream/10 p-5 space-y-4">
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=80'}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brown dark:text-cream truncate">{item.name}</p>
                  <p className="text-xs text-brown/50 dark:text-cream/50">{item.weight} × {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-saffron">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-brown/10 dark:border-cream/10 pt-3 grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-semibold text-brown/70 dark:text-cream/70 mb-1">Shipping To</p>
              <p className="text-brown/60 dark:text-cream/60 text-xs leading-relaxed">
                {order.shippingAddress?.name}<br />
                {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
                {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
            </div>
            <div>
              <p className="font-semibold text-brown/70 dark:text-cream/70 mb-1">Payment</p>
              <p className="text-brown/60 dark:text-cream/60 text-xs capitalize">{order.paymentMethod}</p>
              <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {order.paymentStatus}
              </span>
              {order.trackingNumber && (
                <p className="text-xs text-saffron mt-1">Tracking: {order.trackingNumber}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/orders/my').then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-cream dark:bg-[#1a0800] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-saffron font-semibold text-sm uppercase tracking-widest mb-1">Account</p>
          <h1 className="section-title">My Orders</h1>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-brown/30 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="skeleton h-4 w-40 rounded" />
                    <div className="skeleton h-3 w-24 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">🛒</span>
            <p className="font-playfair text-2xl text-brown/60 dark:text-cream/60 mt-4">No orders yet</p>
            <button onClick={() => navigate('/products')} className="btn-primary mt-4">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => <OrderCard key={order._id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
