'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image: string;
  handler: (response: RazorpaySuccessResponse) => Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

type InvoiceDownload = {
  filename: string;
  contentType: string;
  base64: string;
};

function PaymentContent() {
  const searchParams = useSearchParams();

  const [packageName, setPackageName] = useState('Travel package');
  const [slug, setSlug] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [travelers, setTravelers] = useState('1');
  const [travelDate, setTravelDate] = useState('');

  // Fetch session from server (session id stored in sessionStorage by the booking form)
  useEffect(() => {
    let cancelled = false;

    async function loadSessionOrFallback() {
      try {
        const sessionId = typeof window !== 'undefined' ? sessionStorage.getItem('paymentSessionId') : null;

        if (sessionId) {
          try {
            const res = await fetch('/api/notify/payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'fetch_session', sessionId }),
            });
            const data = await res.json();
            if (res.ok && data.session && !cancelled) {
              const s = data.session as any;
              setPackageName(s.title || s.packageName || 'Travel package');
              setSlug(s.slug || '');
              setTotalCost(Number(s.totalCost || 0));
              setEmail(s.email || '');
              setFirstName(s.firstName || '');
              setLastName(s.lastName || '');
              setMobile(s.mobile || '');
              setTravelers(s.travelers || '1');
              setTravelDate(s.travelDate || '');
              return;
            }
          } catch (err) {
            console.error('Failed to load payment session', err);
          }
        }

        // fallback to reading from URL (backwards compatibility)
        const pkgName = searchParams.get('title') || 'Travel package';
        const slugFromUrl = searchParams.get('slug') || '';
        const totalCostFromUrl = Number(searchParams.get('totalCost') || '0');
        const emailFromUrl = searchParams.get('email') || '';
        const firstNameFromUrl = searchParams.get('firstName') || '';
        const lastNameFromUrl = searchParams.get('lastName') || '';
        const mobileFromUrl = searchParams.get('mobile') || '';
        const travelersFromUrl = searchParams.get('travelers') || '1';
        const travelDateFromUrl = searchParams.get('travelDate') || '';

        if (!cancelled) {
          setPackageName(pkgName);
          setSlug(slugFromUrl);
          setTotalCost(totalCostFromUrl);
          setEmail(emailFromUrl);
          setFirstName(firstNameFromUrl);
          setLastName(lastNameFromUrl);
          setMobile(mobileFromUrl);
          setTravelers(travelersFromUrl);
          setTravelDate(travelDateFromUrl);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadSessionOrFallback();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const advanceAmount = Math.max(0, Math.round(totalCost * 0.25));
  const [isScriptLoaded, setIsScriptLoaded] = useState(() =>
    typeof document !== 'undefined' && Boolean(document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]'))
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'success' | 'error'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [invoicePdf, setInvoicePdf] = useState<InvoiceDownload | null>(null);

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');

    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => setPaymentState('error');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleInvoiceDownload = () => {
    if (!invoicePdf) {
      return;
    }

    const byteCharacters = atob(invoicePdf.base64);
    const byteNumbers = Array.from(byteCharacters, (character) => character.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: invoicePdf.contentType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = invoicePdf.filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handlePayment = async () => {
    if (!window.Razorpay) {
      setPaymentState('error');
      return;
    }

    setIsProcessing(true);
    setPaymentState('idle');
    setPaymentMessage('');
    setInvoicePdf(null);

    try {
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: advanceAmount,
          currency: 'INR',
          receipt: `booking-${Date.now()}`,
          note: `Advance payment for ${packageName}`,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.orderId) {
        throw new Error(data.message || 'Unable to create Razorpay order.');
      }

      const key = data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

      const razorpay = new window.Razorpay({
        key,
        amount: Number(data.amount || advanceAmount * 100),
        currency: data.currency || 'INR',
        order_id: data.orderId,
        name: 'Astra Travels',
        description: `Advance payment for ${packageName}`,
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=200&q=80',
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            setIsProcessing(true);

            const payload = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              email: email || '',
              firstName: firstName || '',
              lastName: lastName || '',
              mobile: mobile || '',
              packageName,
              amount: Number(data.amount || advanceAmount * 100),
              travelers,
              travelDate,
            };

            const notifyRes = await fetch('/api/notify/payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            const notifyData = await notifyRes.json();

            if (!notifyRes.ok) {
              throw new Error(notifyData.message || 'Server failed to verify payment.');
            }

            if (notifyData.invoice) {
              setInvoicePdf(notifyData.invoice);
            }

            if (notifyData.email && !notifyData.email.sent) {
              setPaymentMessage(
                notifyData.email.message
                  ? `Payment verified. Invoice email was not sent: ${notifyData.email.message}`
                  : 'Payment verified. Invoice email was not sent.'
              );
            }

            setPaymentState('success');
          } catch (err) {
            console.error(err);
            setPaymentMessage(err instanceof Error ? err.message : 'Payment verification failed.');
            setPaymentState('error');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${firstName || ''} ${lastName || ''}`.trim(),
          email: email || '',
          contact: mobile || '',
        },
        theme: {
          color: '#0f172a',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      });

      razorpay.open();
    } catch (error) {
      setPaymentMessage(error instanceof Error ? error.message : 'Unable to start payment.');
      setPaymentState('error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2ed] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Secure payment</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Pay booking advance</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            ← Home
          </Link>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-600">Package</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{packageName}</h2>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Booking cost</span>
              <span className="font-semibold text-slate-900">₹{totalCost}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Advance due now</span>
              <span className="font-semibold text-emerald-700">₹{advanceAmount}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
              <span>Amount to pay</span>
              <span>₹{advanceAmount}</span>
            </div>
          </div>
        </div>

        {paymentState === 'error' && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {paymentMessage || (
              <>
                Razorpay checkout could not be loaded. Please add your Razorpay key in <span className="font-semibold">.env.local</span> using NEXT_PUBLIC_RAZORPAY_KEY_ID.
              </>
            )}
          </div>
        )}

        {paymentState === 'success' ? (
          <div className="mt-8 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Payment received</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">Your advance payment is confirmed.</h3>
            <p className="mt-3 text-base leading-7 text-slate-700">
              We have received the 25% advance for {packageName}. Our travel advisors will follow up with confirmation and final itinerary details.
            </p>
            {paymentMessage ? (
              <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {paymentMessage}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-4">
              {invoicePdf ? (
                <button
                  type="button"
                  onClick={handleInvoiceDownload}
                  className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Download invoice PDF
                </button>
              ) : null}
              <Link href="/" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                Back home
              </Link>
              {slug ? (
                <Link href={`/packages/${slug}`} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400">
                  View package
                </Link>
              ) : null}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handlePayment}
            disabled={!isScriptLoaded || isProcessing || totalCost <= 0}
            className="mt-8 w-full rounded-full bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isProcessing ? 'Processing...' : `Pay ₹${advanceAmount} with Razorpay`}
          </button>
        )}
      </div>
    </div>
  );
}

function PaymentFallback() {
  return (
    <div className="min-h-screen bg-[#f7f2ed] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Secure payment</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Pay booking advance</h1>
        <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          Loading payment details...
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentFallback />}>
      <PaymentContent />
    </Suspense>
  );
}
