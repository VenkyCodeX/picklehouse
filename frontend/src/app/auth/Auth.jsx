import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Auth() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (!user.isAdmin) {
        logout();
        toast.error('Access denied. Admins only.');
        return;
      }
      toast.success(`Welcome back, ${user.name}! 🫙`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-brand-black/10 bg-white text-brand-black focus:outline-none focus:border-brand-yellow transition-all";

  return (
    <div className="min-h-screen bg-brand-yellow-light flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-4 border-brand-yellow"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="bg-brand-yellow p-8 text-center">
            <Link to="/" className="text-4xl inline-block">🫙</Link>
            <h1 className="font-playfair text-3xl font-bold text-brand-black mt-2">Admin Login</h1>
            <p className="text-brand-black/60 text-sm mt-1 font-poppins">Sign in to your account</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-semibold text-brand-black/70 mb-1">Email</label>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-black/70 mb-1">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black/40 hover:text-brand-red transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-lg disabled:opacity-70">
                {loading ? 'Please wait...' : 'Sign In →'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
