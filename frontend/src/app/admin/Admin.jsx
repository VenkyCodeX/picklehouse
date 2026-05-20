import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Users, TrendingUp, Plus, Edit, Trash2, Upload, X, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const TABS = ['Dashboard', 'Products', 'Orders'];
const CATEGORIES = ['pickle', 'powder', 'spice', 'dryfruit', 'ghee', 'tea', 'sweet', 'other'];
const DEFAULT_PRICE_ROWS = [
  { weight: '250g', price: '', stock: '' },
  { weight: '500g', price: '', stock: '' },
  { weight: '1kg', price: '', stock: '' },
];
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80';
const EMPTY_PRODUCT = {
  name: '', nameTelugu: '', slug: '', category: 'pickle', description: '',
  prices: DEFAULT_PRICE_ROWS,
  isWithoutGarlic: false, featured: false, isActive: true, images: [],
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [uploading, setUploading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/login'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [a, p, o] = await Promise.all([
        api.get('/orders/admin/analytics'),
        api.get('/products?all=true'),
        api.get('/orders/admin/all'),
      ]);
      setAnalytics(a.data); setProducts(p.data); setOrders(o.data.orders);
    } catch { toast.error('Failed to load data'); }
  };

  const normalizePrices = (prices) => {
    const merged = [...DEFAULT_PRICE_ROWS];
    (prices || []).forEach((item, idx) => {
      if (merged[idx]) merged[idx] = { ...merged[idx], ...item };
      else merged.push({ weight: item.weight || 'unit', price: item.price || '', stock: item.stock || '' });
    });
    return merged;
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await api.post('/products/admin/seed');
      await api.post('/reviews/admin/seed');
      toast.success('Products & reviews seeded! 🎉');
      loadData();
    } catch { toast.error('Seed failed'); } finally { setSeeding(false); }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('image', file);
        const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        uploadedUrls.push(data.url);
      }
      setForm(f => ({ ...f, images: [...f.images, ...uploadedUrls] }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const addImageByUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) { toast.error('Enter an image URL'); return; }
    try {
      // basic validation
      new URL(url);
      setForm(f => ({ ...f, images: [...f.images, url] }));
      setImageUrlInput('');
      toast.success('Image added from URL');
    } catch (_) {
      toast.error('Invalid URL');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        prices: form.prices
          .filter((p) => p.price !== '' && p.price !== null)
          .map((p) => ({ ...p, price: Number(p.price), stock: Number(p.stock || 0) })),
      };
      if (!payload.slug) delete payload.slug;
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      setShowForm(false); setEditProduct(null); setForm(EMPTY_PRODUCT); loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Product deleted'); loadData();
  };

  const handleVisibilityToggle = async (id, currentActive) => {
    try {
      await api.put(`/products/${id}`, { isActive: !currentActive });
      toast.success(currentActive ? 'Product hidden from public site' : 'Product published');
      loadData();
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    toast.success('Status updated'); loadData();
  };

  const openOrderView = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderView = () => {
    setSelectedOrder(null);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      ...p,
      slug: p.slug || '',
      prices: normalizePrices(p.prices),
      isActive: p.isActive !== false,
    });
    setShowForm(true);
  };

  const statCards = [
    { label: 'Total Orders', value: analytics?.totalOrders || 0, icon: ShoppingBag, bg: 'bg-brand-red' },
    { label: 'Revenue', value: `₹${analytics?.revenue || 0}`, icon: TrendingUp, bg: 'bg-brand-black' },
    { label: 'Pending', value: analytics?.pending || 0, icon: Package, bg: 'bg-brand-yellow', text: 'text-brand-black' },
    { label: 'NRI Orders', value: analytics?.nriOrders || 0, icon: Users, bg: 'bg-brand-red-deep' },
  ];

  const inputClass = "w-full px-4 py-2.5 rounded-xl border-2 border-brand-black/10 bg-white text-brand-black focus:outline-none focus:border-brand-yellow transition-all";

  return (
    <div className="min-h-screen bg-brand-yellow-light pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-brand-yellow flex items-center justify-center text-2xl font-bold text-brand-black shadow-lg">PH</div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-red font-semibold">Pickle House</p>
              <h1 className="font-playfair text-3xl font-bold text-brand-black">Admin Dashboard</h1>
              <p className="text-brand-black/50 text-sm font-poppins">Welcome back, {user?.name}. Manage products, orders and WhatsApp confirmations.</p>
            </div>
          </div>
          <button onClick={handleSeed} disabled={seeding} className="btn-secondary text-sm disabled:opacity-70">
            {seeding ? 'Seeding...' : '🌱 Seed Data'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b-2 border-brand-yellow">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 -mb-0.5 ${
                tab === t ? 'border-brand-red text-brand-red' : 'border-transparent text-brand-black/50 hover:text-brand-red'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === 'Dashboard' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <motion.div key={i} className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-brand-yellow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <s.icon size={22} className={s.text || 'text-white'} />
                </div>
                <p className="font-playfair text-2xl font-bold text-brand-black">{s.value}</p>
                <p className="text-brand-black/50 text-sm font-poppins">{s.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Products */}
        {tab === 'Products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-brand-black/50 font-poppins">{products.length} products</p>
              <button onClick={() => { setEditProduct(null); setForm(EMPTY_PRODUCT); setShowForm(true); }} className="btn-primary flex items-center gap-2">
                <Plus size={16} /> Add Product
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border-t-4 border-brand-yellow">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-brand-yellow-light">
                    <tr>
                      {['Product', 'Category', 'Price (250g)', 'Stock', 'Featured', 'Visibility', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-brand-black/60 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-black/5">
                    {products.map(p => (
                      <tr key={p._id} className="hover:bg-brand-yellow-light/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=60'} alt="" className="w-10 h-10 rounded-lg object-cover border-2 border-brand-yellow" />
                            <div>
                              <p className="font-semibold text-brand-black text-sm">{p.name}</p>
                              <p className="font-telugu text-brand-black/40 text-xs">{p.nameTelugu}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="bg-brand-yellow text-brand-black text-xs font-semibold px-2 py-1 rounded-full capitalize">{p.category}</span></td>
                        <td className="px-4 py-3 text-brand-red font-bold text-sm">₹{p.prices?.[0]?.price || '—'}</td>
                        <td className="px-4 py-3 text-brand-black/50 text-sm">{p.prices?.[0]?.stock || 0}</td>
                        <td className="px-4 py-3">{p.featured ? <Check size={16} className="text-brand-red" /> : <X size={16} className="text-brand-black/20" />}</td>
                        <td className="px-4 py-3">
                          <button type="button" onClick={() => handleVisibilityToggle(p._id, p.isActive)}
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-brand-black/70'}`}>
                            {p.isActive ? 'Live' : 'Hidden'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-brand-yellow text-brand-black transition-all"><Edit size={14} /></button>
                            <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-red transition-all"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'Orders' && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border-t-4 border-brand-yellow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-yellow-light">
                  <tr>
                    {['Order ID', 'Customer', 'Contact', 'Address', 'Amount', 'Payment', 'Status', 'Update', 'View'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-brand-black/60 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-black/5">
                  {orders.map(o => {
                    const name = o.customer?.name || o.guestInfo?.name || 'Guest';
                    const phone = o.customer?.phone || o.guestInfo?.phone || 'N/A';
                    const email = o.customer?.email || o.guestInfo?.email || '—';
                    const address = o.shippingAddress || {};
                    const addressLines = [address.street, address.city, address.state, address.pincode, address.country].filter(Boolean).join(', ');
                    return (
                      <tr key={o._id} className="hover:bg-brand-yellow-light/50 transition-colors">
                        <td className="px-4 py-3 text-xs text-brand-black/40 font-mono">{o._id.slice(-8)}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-brand-black">{name}</p>
                          <p className="text-xs text-brand-black/40">{email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-brand-black">{phone}</p>
                          <p className="text-xs text-brand-black/40">{o.paymentMethod?.toUpperCase() || 'N/A'}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-brand-black/70">{addressLines || 'No address provided'}</td>
                        <td className="px-4 py-3 font-bold text-brand-red">₹{o.totalAmount}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-brand-yellow text-brand-black'}`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                            o.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                            o.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            o.orderStatus === 'processing' ? 'bg-purple-100 text-purple-700' :
                            'bg-brand-yellow text-brand-black'
                          }`}>{o.orderStatus}</span>
                        </td>
                        <td className="px-4 py-3">
                          <select value={o.orderStatus} onChange={e => handleStatusUpdate(o._id, e.target.value)}
                            className="text-xs border-2 border-brand-yellow rounded-lg px-2 py-1 bg-white text-brand-black focus:outline-none focus:border-brand-red">
                            {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button type="button" onClick={() => openOrderView(o)} className="text-xs font-semibold px-3 py-2 rounded-full bg-brand-black text-white hover:bg-brand-red transition-all">
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/70 backdrop-blur-sm">
          <motion.div
            className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-t-4 border-brand-yellow"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-2xl font-bold text-brand-black">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-brand-yellow transition-all"><X size={20} className="text-brand-black" /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-black/70 mb-1">Name (English) *</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-black/70 mb-1">Name (Telugu)</label>
                    <input type="text" value={form.nameTelugu} onChange={e => setForm({ ...form, nameTelugu: e.target.value })} className={`${inputClass} font-telugu`} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black/70 mb-1">Product URL slug</label>
                  <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated from name" className={inputClass} />
                  <p className="text-xs text-brand-black/40 mt-1">Leave blank to auto-generate from product name.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black/70 mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black/70 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className={`${inputClass} resize-none`} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isWithoutGarlic} onChange={e => setForm({ ...form, isWithoutGarlic: e.target.checked })} className="w-4 h-4 accent-brand-red" />
                    <span className="text-sm text-brand-black/70">Without Garlic</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-brand-red" />
                    <span className="text-sm text-brand-black/70">Featured</span>
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-brand-red" />
                    <span className="text-sm text-brand-black/70">Visible on public site</span>
                  </label>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-brand-black/70">Price tiers</label>
                    <button type="button" onClick={() => setForm({ ...form, prices: [...form.prices, { weight: 'unit', price: '', stock: '' }] })} className="text-sm text-brand-red font-semibold">+ Add tier</button>
                  </div>
                  <div className="space-y-3">
                    {form.prices.map((p, i) => (
                      <div key={i} className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-4">
                          <label className="text-xs text-brand-black/40 mb-1 block">Weight</label>
                          <select value={p.weight} onChange={e => {
                            const prices = [...form.prices];
                            prices[i] = { ...prices[i], weight: e.target.value };
                            setForm({ ...form, prices });
                          }} className={inputClass}>
                            {['250g', '500g', '1kg', 'unit'].map(w => <option key={w} value={w}>{w}</option>)}
                          </select>
                        </div>
                        <div className="col-span-4">
                          <label className="text-xs text-brand-black/40 mb-1 block">Price</label>
                          <input type="number" value={p.price} onChange={e => {
                            const prices = [...form.prices];
                            prices[i] = { ...prices[i], price: e.target.value };
                            setForm({ ...form, prices });
                          }} className={inputClass} />
                        </div>
                        <div className="col-span-3">
                          <label className="text-xs text-brand-black/40 mb-1 block">Stock</label>
                          <input type="number" value={p.stock} onChange={e => {
                            const prices = [...form.prices];
                            prices[i] = { ...prices[i], stock: e.target.value };
                            setForm({ ...form, prices });
                          }} className={inputClass} />
                        </div>
                        <div className="col-span-1">
                          {form.prices.length > 1 && (
                            <button type="button" onClick={() => {
                              const prices = form.prices.filter((_, index) => index !== i);
                              setForm({ ...form, prices });
                            }} className="text-brand-red text-sm font-bold">×</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-black/70 mb-2">Product Images</label>
                  <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-brand-yellow rounded-xl p-4 hover:bg-brand-yellow-light transition-all">
                    <Upload size={18} className="text-brand-red" />
                    <span className="text-sm text-brand-black/50">{uploading ? 'Uploading...' : 'Choose image to upload'}</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                  <div className="mt-3 flex gap-2 items-center">
                    <input type="text" placeholder="Paste image URL (http://...)" value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} className="w-full px-3 py-2 rounded-xl border-2 border-brand-black/10" />
                    <button type="button" onClick={addImageByUrl} className="btn-primary">Add</button>
                  </div>
                  {form.images?.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-3">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative rounded-2xl overflow-hidden border border-brand-black/10">
                          <img src={img} alt={`preview-${i}`} className="w-full h-24 object-cover" />
                          <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })}
                            className="absolute top-2 right-2 bg-white/90 rounded-full p-1 text-brand-red shadow-sm">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowForm(false); setEditProduct(null); setForm(EMPTY_PRODUCT); }} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">{editProduct ? 'Update' : 'Create'} Product</button>
                </div>
              </div>
              <aside className="space-y-4">
                <div className="rounded-3xl border border-brand-black/10 bg-brand-yellow-light p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-brand-black/40">Live preview</p>
                      <h3 className="font-playfair text-xl font-bold text-brand-black">What the public site will show</h3>
                    </div>
                    {form.featured && <span className="badge-yellow">Featured</span>}
                  </div>
                  <div className="rounded-3xl overflow-hidden bg-white shadow-sm">
                    <img src={form.images?.[0] || PLACEHOLDER_IMAGE} alt="preview image" className="w-full h-44 object-cover" />
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {form.isWithoutGarlic && <span className="badge-red">🌿 Without Garlic</span>}
                        <span className="bg-brand-yellow text-brand-black text-[11px] font-semibold uppercase px-3 py-1 rounded-full">{form.category}</span>
                      </div>
                      <h4 className="font-playfair text-xl font-bold text-brand-black">{form.name || 'Product title'}</h4>
                      {form.nameTelugu && <p className="font-telugu text-brand-black/50 text-sm mt-1">{form.nameTelugu}</p>}
                      <p className="text-brand-black/70 text-sm mt-3 leading-relaxed">{form.description || 'Add a rich description and your product will look polished on the public product page.'}</p>
                      <div className="mt-4 space-y-2">
                        {form.prices.filter((p) => p.price).length ? (
                          form.prices.filter((p) => p.price).map((p) => (
                            <div key={p.weight} className="flex items-center justify-between text-sm text-brand-black/90">
                              <span>{p.weight}</span>
                              <span className="font-semibold">₹{p.price} <span className="text-brand-black/40">/ {p.stock || 'stock'}</span></span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-brand-black/40">Add pricing tiers to preview pricing.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </form>
          </motion.div>
        </div>
      )}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/70 backdrop-blur-sm">
          <motion.div
            className="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border-t-4 border-brand-red"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-brand-black">Order Details</h2>
                <p className="text-sm text-brand-black/50 mt-1">Order #{selectedOrder._id.slice(-8)}</p>
              </div>
              <button onClick={closeOrderView} className="text-brand-black/60 hover:text-brand-red transition-colors text-3xl">×</button>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <section className="rounded-3xl border border-brand-black/10 bg-brand-yellow-light p-5">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-brand-black/40 mb-3">Customer</h3>
                  <p className="font-semibold text-brand-black">{selectedOrder.customer?.name || selectedOrder.guestInfo?.name || 'Guest'}</p>
                  <p className="text-sm text-brand-black/60">{selectedOrder.customer?.email || selectedOrder.guestInfo?.email || '—'}</p>
                  <p className="text-sm text-brand-black/60">{selectedOrder.customer?.phone || selectedOrder.guestInfo?.phone || 'N/A'}</p>
                </section>
                <section className="rounded-3xl border border-brand-black/10 bg-brand-yellow-light p-5">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-brand-black/40 mb-3">Shipping Address</h3>
                  <p className="text-sm text-brand-black/70">{selectedOrder.shippingAddress?.name || '—'}</p>
                  <p className="text-sm text-brand-black/70">{selectedOrder.shippingAddress?.phone || '—'}</p>
                  <p className="text-sm text-brand-black/70">{[selectedOrder.shippingAddress?.street, selectedOrder.shippingAddress?.city, selectedOrder.shippingAddress?.state].filter(Boolean).join(', ')}</p>
                  <p className="text-sm text-brand-black/70">{[selectedOrder.shippingAddress?.pincode, selectedOrder.shippingAddress?.country].filter(Boolean).join(', ')}</p>
                </section>
                <section className="rounded-3xl border border-brand-black/10 bg-brand-yellow-light p-5">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-brand-black/40 mb-3">Guest / Billing Info</h3>
                  <p className="text-sm text-brand-black/70">{selectedOrder.guestInfo?.name ? `Name: ${selectedOrder.guestInfo.name}` : 'Not provided'}</p>
                  <p className="text-sm text-brand-black/70">{selectedOrder.guestInfo?.email ? `Email: ${selectedOrder.guestInfo.email}` : ''}</p>
                  <p className="text-sm text-brand-black/70">{selectedOrder.guestInfo?.phone ? `Phone: ${selectedOrder.guestInfo.phone}` : ''}</p>
                </section>
              </div>
              <div className="space-y-4">
                <section className="rounded-3xl border border-brand-black/10 bg-brand-yellow-light p-5">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-brand-black/40 mb-3">Order Summary</h3>
                  <div className="grid gap-3 text-sm text-brand-black/70">
                    <div className="flex justify-between"><span>Order ID</span><strong className="font-semibold">{selectedOrder._id}</strong></div>
                    <div className="flex justify-between"><span>Status</span><strong className="capitalize">{selectedOrder.orderStatus}</strong></div>
                    <div className="flex justify-between"><span>Payment</span><strong className="capitalize">{selectedOrder.paymentStatus}</strong></div>
                    <div className="flex justify-between"><span>Method</span><strong className="capitalize">{selectedOrder.paymentMethod || 'N/A'}</strong></div>
                    <div className="flex justify-between"><span>Total</span><strong>₹{selectedOrder.totalAmount}</strong></div>
                    <div className="flex justify-between"><span>Placed</span><strong>{new Date(selectedOrder.createdAt).toLocaleString()}</strong></div>
                  </div>
                </section>
                <section className="rounded-3xl border border-brand-black/10 bg-brand-yellow-light p-5">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-brand-black/40 mb-3">Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="rounded-2xl bg-white p-4 border border-brand-black/5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-brand-black">{item.name}</p>
                            {item.nameTelugu && <p className="text-xs text-brand-black/40">{item.nameTelugu}</p>}
                          </div>
                          <p className="text-sm font-semibold text-brand-black">₹{item.price * item.quantity}</p>
                        </div>
                        <div className="mt-2 text-sm text-brand-black/70 flex justify-between">
                          <span>{item.weight}</span>
                          <span>Qty {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
