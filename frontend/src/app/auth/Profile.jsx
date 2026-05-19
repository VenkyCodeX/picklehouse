import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Package, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) { navigate('/login'); return null; }

  const [form, setForm] = useState({ name: user.name || '', phone: user.phone || '', password: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      await api.put('/auth/profile', payload);
      toast.success('Profile updated!');
      setForm(f => ({ ...f, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-brand-black/10 bg-white text-brand-black focus:outline-none focus:border-brand-yellow transition-all";

  return (
    <div className="min-h-screen bg-brand-yellow-light pt-20 pb-16">
      <div className="bg-brand-yellow py-10 mb-8">
        <div className="max-w-2xl mx-auto px-4">
          <p className="section-label mb-1">Account</p>
          <h1 className="font-playfair text-4xl font-bold text-brand-black">My Profile</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Link to="/my-orders" className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group mb-6 border-l-4 border-brand-yellow">
          <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center">
            <Package size={18} className="text-brand-black" />
          </div>
          <div>
            <p className="font-semibold text-brand-black text-sm">My Orders</p>
            <p className="text-xs text-brand-black/40">View your order history</p>
          </div>
          <span className="ml-auto text-brand-black/30 group-hover:text-brand-red transition-colors">→</span>
        </Link>

        <motion.div className="bg-white rounded-3xl p-8 shadow-xl border-t-4 border-brand-yellow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center text-white text-2xl font-bold font-playfair">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-playfair text-xl font-bold text-brand-black">{user.name}</p>
              <p className="text-brand-black/50 text-sm">{user.email}</p>
              {user.isAdmin && <span className="badge-red mt-1 inline-block">Admin</span>}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-brand-black/70 mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-black/70 mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-black/70 mb-1">Email</label>
              <input type="email" value={user.email} disabled className="w-full px-4 py-3 rounded-xl border-2 border-brand-black/5 bg-brand-black/5 text-brand-black/40 cursor-not-allowed" />
            </div>
            <div className="border-t border-brand-black/10 pt-4">
              <p className="text-sm font-semibold text-brand-black/70 mb-3">Change Password (optional)</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-brand-black/40 mb-1">New Password</label>
                  <input type="password" placeholder="Leave blank to keep current" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-brand-black/40 mb-1">Confirm Password</label>
                  <input type="password" placeholder="Repeat new password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className={inputClass} />
                </div>
              </div>
            </div>
            <button type="submit" disabled={saving} className="w-full btn-primary py-4 disabled:opacity-70">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>

        <button onClick={() => { logout(); navigate('/'); }}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-brand-red/30 text-brand-red hover:bg-brand-red/5 transition-all font-semibold text-sm">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}
