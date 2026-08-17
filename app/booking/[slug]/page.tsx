import Link from 'next/link';
import { notFound } from 'next/navigation';
import BookingForm from '../../components/booking-form';

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/packages/${slug}`);
  if (!res.ok) {
    notFound();
  }
  const data = await res.json();
  const pkg = data?.package;

  if (!pkg) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f7f2ed] text-slate-900">
      <header className="mx-auto max-w-6xl px-6 py-6">
        <nav className="flex items-center justify-between rounded-full border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              A
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Astra</p>
              <p className="text-sm font-semibold text-slate-900">Travels</p>
            </div>
          </Link>
          <Link href={`/packages/${pkg.slug}`} className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">
            View package
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Reserve your stay</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Book {pkg.title}</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            ← Return home
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
          <img src={pkg.image} alt={pkg.title} className="h-64 w-full object-cover sm:h-80" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Selected trip</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">{pkg.title}</h2>
              </div>
              <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">{pkg.badge}</span>
            </div>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">{pkg.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">{pkg.duration}</span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">⭐ {pkg.rating}</span>
            </div>
          </div>
        </div>

        <BookingForm pkg={pkg} />
      </main>
    </div>
  );
}
