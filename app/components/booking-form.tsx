'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TravelPackage } from '../lib/package-store2';

export default function BookingForm({ pkg }: { pkg: TravelPackage }) {
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    travelers: '2',
    travelDate: '',
    notes: '',
  });

  const handleFieldChange = (field: keyof typeof formState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // send booking request to server so admin can view it
    try {
      const payload = {
        slug: pkg.slug,
        packageName: pkg.title,
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email,
        mobile: formState.mobileNumber,
        travelers: formState.travelers,
        travelDate: formState.travelDate,
        notes: formState.notes,
      };
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to send booking');
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Unable to send booking');
      return;
    }

    setSubmitted(true);
  };

  const travelerCount = Math.max(1, Number.parseInt(formState.travelers, 10) || 1);
  const bookingCost = pkg.price * travelerCount;
  const depositAmount = Math.round(bookingCost * 0.25);

    const router = useRouter();
    const [isCreatingSession, setIsCreatingSession] = useState(false);

    const handlePayNow = async () => {
      setIsCreatingSession(true);
      try {
        const res = await fetch('/api/notify/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_session',
            slug: pkg.slug,
            title: pkg.title,
            amount: bookingCost,
            email: formState.email,
            firstName: formState.firstName,
            lastName: formState.lastName,
            mobile: formState.mobileNumber,
            travelers: formState.travelers,
            travelDate: formState.travelDate,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.sessionId) {
          throw new Error(data.message || 'Failed to create payment session.');
        }

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('paymentSessionId', data.sessionId);
        }

        router.push('/payment');
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : 'Unable to start payment session.');
      } finally {
        setIsCreatingSession(false);
      }
    };

  return (
    <div className="mt-10">
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
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Mobile number
              <input
                type="tel"
                value={formState.mobileNumber}
                onChange={(event) => handleFieldChange('mobileNumber', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                placeholder="+91 98765 43210"
                required
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Travelers
              <input
                type="number"
                min="1"
                value={formState.travelers}
                onChange={(event) => handleFieldChange('travelers', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                required
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Preferred date
              <input
                type="date"
                value={formState.travelDate}
                onChange={(event) => handleFieldChange('travelDate', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                required
              />
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

          <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Package price</span>
              <span className="font-semibold text-slate-900">₹{pkg.price} each</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
              <span>Travelers</span>
              <span className="font-semibold text-slate-900">{travelerCount}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
              <span>Booking cost</span>
              <span className="font-semibold text-slate-900">₹{bookingCost}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
              <span>Pay now (25%)</span>
              <span className="font-semibold text-emerald-700">₹{depositAmount}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
              <span>Estimated total</span>
              <span>₹{bookingCost}</span>
            </div>
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
          <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-white/70 p-4">
            <p className="text-sm font-medium text-slate-600">Booking cost</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">₹{bookingCost}</p>
            <p className="mt-1 text-sm text-slate-600">Advance due now: ₹{depositAmount} (25%)</p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <button
                          type="button"
                          onClick={handlePayNow}
                          disabled={isCreatingSession}
                          className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
                        >
                          {isCreatingSession ? 'Starting payment...' : 'Pay 25% now'}
                        </button>
            <Link href="/" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              Back home
            </Link>
            <Link href={`/packages/${pkg.slug}`} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400">
              View package again
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
