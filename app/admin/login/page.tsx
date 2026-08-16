'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (data.token) {
        if (typeof window !== 'undefined') localStorage.setItem('adminToken', data.token);
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f2ed] p-6">
      <form onSubmit={handleSubmit} className="max-w-md w-full rounded-xl bg-white p-8 shadow">
        <h2 className="text-2xl font-semibold mb-4">Admin login</h2>
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <label className="block mb-3">
          <div className="text-sm text-slate-600 mb-1">Email</div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded px-3 py-2 border" />
        </label>
        <label className="block mb-4">
          <div className="text-sm text-slate-600 mb-1">Password</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded px-3 py-2 border" />
        </label>
        <div className="flex items-center justify-between">
          <button disabled={loading} className="rounded bg-slate-900 text-white px-4 py-2">{loading ? 'Signing in...' : 'Sign in'}</button>
        </div>
      </form>
    </div>
  );
}
