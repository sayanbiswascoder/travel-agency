import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`http://localhost:3000/api/packages/${slug}`);
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
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link href="/">Home</Link>
            <Link href="/#packages">Packages</Link>
            <Link href="/#experience">Experience</Link>
          </div>
          <Link href={`/booking/${pkg.slug}`} className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
            Book now
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">
          ← Back to all packages
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
              <img src={pkg.image} alt={pkg.title} className="h-[420px] w-full object-cover" />
            </div>

            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    {pkg.badge}
                  </span>
                  <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{pkg.title}</h1>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-left sm:text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">From</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-900">${pkg.price}</p>
                </div>
              </div>

              <p className="mt-6 text-lg leading-8 text-slate-600">{pkg.description}</p>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-700">
                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                  <span className="font-semibold text-slate-900">★ {pkg.rating}</span> Guest rating
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                  <span className="font-semibold text-slate-900">{pkg.duration}</span>
                </div>
              </div>

              
            </div>

          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-slate-900 p-7 text-slate-100 shadow-[0_20px_80px_rgba(15,23,42,0.12)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Included</p>
              
              <Link href={`/booking/${pkg.slug}`} className="mt-8 block rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Book this getaway
              </Link>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Need a custom trip?</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Let us tailor your route.</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                We can adjust your nights, add private experiences, or build a premium route around your style.
              </p>
              <Link href={`/booking/${pkg.slug}`} className="mt-6 inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">
                Start custom booking
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
