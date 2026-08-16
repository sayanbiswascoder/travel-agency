'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { TravelPackage } from '../lib/travel-data';

export default function BookingForm({ pkg }: { pkg: TravelPackage }) {
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    travelers: '2',
    travelMonth: 'April',
    roomType: 'Private villa',
    notes: '',
  });

  const handleFieldChange = (field: keyof typeof formState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const estimatedTotal = pkg.price + 310;

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              First name
              <input
                value={formState.firstName}
                onChange={(event) => handleFieldChange('firstName', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="Jane"
                required
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Last name
              <input
                value={formState.lastName}
                onChange={(event) => handleFieldChange('lastName', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="Doe"
                required
              />
            </label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Email address
              <input
                type="email"
                value={formState.email}
                onChange={(event) => handleFieldChange('email', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="jane@email.com"
                required
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Travelers
              <select
                value={formState.travelers}
                onChange={(event) => handleFieldChange('travelers', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
              >
                <option value="2">2 travelers</option>
                <option value="3">3 travelers</option>
                <option value="4">4 travelers</option>
                <option value="5+">5+ travelers</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Preferred month
              <select
                value={formState.travelMonth}
                onChange={(event) => handleFieldChange('travelMonth', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
              >
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Room type
              <select
                value={formState.roomType}
                onChange={(event) => handleFieldChange('roomType', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
              >
                <option value="Private villa">Private villa</option>
                <option value="Garden suite">Garden suite</option>
                <option value="Ocean-view suite">Ocean-view suite</option>
                <option value="Luxury spa villa">Luxury spa villa</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Notes
              <textarea
                rows={5}
                value={formState.notes}
                onChange={(event) => handleFieldChange('notes', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="Tell us about your dream trip, must-have experiences, or travel goals."
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">
            <Link href={`/packages/${pkg.slug}`} className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              ← Review package
            </Link>
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Send booking request
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Booking request sent</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">Thanks, {formState.firstName || 'traveler'}.</h2>
          <p className="mt-3 max-w-lg text-base leading-7 text-slate-700">
            Your {pkg.title} request has been prepared. Our travel advisors will be in touch within 24 hours to confirm availability and custom details.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link href="/" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              Back home
            </Link>
            <Link href={`/packages/${pkg.slug}`} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400">
              View package again
            </Link>
          </div>
        </div>
      )}

      <aside className="space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
          <img src={pkg.image} alt={pkg.title} className="h-52 w-full object-cover" />
          <div className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Selected trip</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">{pkg.title}</h3>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">{pkg.badge}</span>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Base package</span>
                <span className="font-semibold text-slate-900">${pkg.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Transfer & concierge</span>
                <span className="font-semibold text-slate-900">$310</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                <span>Estimated total</span>
                <span>${estimatedTotal}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-slate-900 p-7 text-slate-100 shadow-[0_20px_80px_rgba(15,23,42,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">What’s included</p>
          <ul className="mt-5 space-y-3 text-sm text-slate-200">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-300">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
