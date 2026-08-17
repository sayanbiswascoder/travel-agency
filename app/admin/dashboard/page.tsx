'use client';

import { useEffect, useState } from 'react';

type TravelPackage = {
  slug: string;
  title: string;
  price: number;
  summary?: string;
  description?: string;
  badge?: string;
  image?: string;
};

type Booking = any;

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<TravelPackage>>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    setToken(t);
  }, []);

  useEffect(() => {
    fetchPackages();
    fetchBookings();
  }, [token]);

  async function fetchPackages() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/packages');
      const data = await res.json();
      setPackages(data.packages || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBookings() {
    try {
      const url = token ? '/api/admin/bookings' : '/api/bookings';
      const headers: Record<string,string> = {};
      if (token) headers['x-admin-token'] = token;
      const res = await fetch(url, { headers });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (e) {
      console.error(e);
    }
  }

  function startEdit(pkg: TravelPackage) {
    setEditing(pkg.slug);
    setForm({ ...pkg });
    setMsg(null);
  }

  function cancelEdit() {
    setEditing(null);
    setForm({});
  }

  async function saveEdit() {
    if (!editing) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/packages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'x-admin-token': token } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save');
      setMsg('Saved successfully');
      setEditing(null);
      setForm({});
      fetchPackages();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f2ed] p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin dashboard</h1>
          <div>
            {token ? <span className="text-sm text-slate-600">Signed in</span> : <a href="/admin/login" className="text-sm text-rose-600">Sign in</a>}
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Packages</h2>
          {loading && <div className="text-sm text-slate-600 mb-2">Loading…</div>}
          <div className="grid gap-4">
            {packages.map((p) => (
              <div key={p.slug} className="rounded border bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-slate-500">{p.slug}</div>
                    <div className="text-lg font-semibold">{p.title}</div>
                    <div className="text-sm text-slate-600">₹{p.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(p)} className="px-3 py-1 rounded border">Edit</button>
                  </div>
                </div>

                {editing === p.slug && (
                  <div className="mt-3">
                    <label className="block mb-2">
                      <div className="text-sm text-slate-600">Title</div>
                      <input value={String(form.title || '')} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className="w-full border rounded px-2 py-1" />
                    </label>
                    <label className="block mb-2">
                      <div className="text-sm text-slate-600">Price</div>
                      <input type="number" value={Number(form.price || 0)} onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))} className="w-full border rounded px-2 py-1" />
                    </label>
                    <label className="block mb-2">
                      <div className="text-sm text-slate-600">Summary</div>
                      <textarea value={String(form.summary || '')} onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))} className="w-full border rounded px-2 py-1" />
                    </label>
                    <label className="block mb-2">
                      <div className="text-sm text-slate-600">Description</div>
                      <textarea value={String(form.description || '')} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} className="w-full border rounded px-2 py-1" />
                    </label>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="px-3 py-1 rounded bg-emerald-600 text-white">Save</button>
                      <button onClick={cancelEdit} className="px-3 py-1 rounded border">Cancel</button>
                    </div>
                    {msg && <div className="mt-2 text-sm text-slate-600">{msg}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Bookings</h2>
          <div className="grid gap-3">
            {bookings.length === 0 && <div className="text-sm text-slate-600">No bookings yet</div>}
            {bookings.map((b) => (
              <div key={b.id} className="rounded border bg-white p-3">
                <div className="text-sm text-slate-500">{new Date(b.createdAt).toLocaleString()}</div>
                <div className="text-lg font-semibold">{b.firstName} {b.lastName} — {b.packageName || b.slug}</div>
                <div className="text-sm text-slate-600">Email: {b.email} • Mobile: {b.phone || b.mobileNumber}</div>
                <div className="mt-2 text-sm">Travelers: {b.guests}</div>
                <div className="mt-1 text-sm">Date: {b.startDate}</div>
                <div className="mt-2 text-sm text-slate-700">Notes: {b.notes}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
