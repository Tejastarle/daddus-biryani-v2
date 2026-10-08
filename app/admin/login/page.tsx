'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple password check (for production, use proper authentication)
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid password. Try again.');
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent font-playfair mb-2">🍛</h1>
          <h2 className="text-3xl font-bold mb-2">Admin Panel</h2>
          <p className="text-muted">Daddu&apos;s Biryani</p>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-3 bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg"
              >
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Admin Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="input-field pl-10"
                  autoFocus
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Logging in...' : 'Login to Admin Panel'}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-muted text-sm mt-8">
          © 2026 Daddu&apos;s Biryani Admin Panel
        </p>
      </motion.div>
    </main>
  );
}
