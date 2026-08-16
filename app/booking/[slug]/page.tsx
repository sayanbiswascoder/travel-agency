import Link from 'next/link';
import { notFound } from 'next/navigation';
import BookingForm from '../../components/booking-form';
import { getPackageBySlug } from '../../lib/travel-data';

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);

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

        <BookingForm pkg={pkg} />
      </main>
    </div>
  );
}
