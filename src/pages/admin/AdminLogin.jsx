import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter your admin password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(password.trim());
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.error || 'Incorrect password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during authentication. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-amoura-ivory relative overflow-hidden">
      
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amoura-sage/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-white border border-amoura-border rounded-3xl p-6 sm:p-8 shadow-elevated backdrop-blur-xl">
        
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-amoura-muted hover:text-amoura-forest transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main Website</span>
        </Link>

        {/* Lock Icon & Branding */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amoura-cream border border-amoura-border flex items-center justify-center mx-auto shadow-sm text-amoura-forest">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-widest text-amoura-sage-dark font-bold flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amoura-terracotta" /> Secure Portal
            </span>
            <h1 className="font-serif text-2xl font-bold text-amoura-charcoal mt-1">
              Amoura Crafts Admin
            </h1>
            <p className="text-xs text-amoura-muted mt-1">
              Sign in with your master password to manage catalog &amp; orders
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-amoura-charcoal mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-amoura-ivory border border-amoura-border text-sm text-amoura-charcoal placeholder-amoura-muted focus:outline-none focus:border-amoura-forest tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-amoura-muted hover:text-amoura-charcoal transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-amoura-forest text-amoura-ivory hover:bg-amoura-charcoal flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-75"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Panel'}</span>
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-amoura-border text-center text-[11px] text-amoura-muted">
          <span>Protected with PBKDF2 SHA-512 Authentication</span>
        </div>

      </div>
    </div>
  );
}
