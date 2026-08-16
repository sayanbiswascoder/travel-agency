import Link from 'next/link';
import ScrollLink from './components/scroll-link';
import { destination } from './lib/travel-data';
import { getPackages } from './lib/package-store2';

const packages = getPackages();

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f2ed] text-slate-900">
      <header className="mx-auto max-w-6xl px-6 py-6">
        <nav className="flex items-center justify-between rounded-full border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              A
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Astra</p>
              <p className="text-sm font-semibold text-slate-900">Travels</p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <ScrollLink targetId="packages">Packages</ScrollLink>
            <ScrollLink targetId="experience">Experience</ScrollLink>
            <ScrollLink targetId="reviews">Reviews</ScrollLink>
          </div>

          <Link href={`/booking/${packages[0].slug}`} className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
            Plan my trip
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:pt-16">
          <div>
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Sundarban specialists
            </span>
            <h1 className="mt-6 max-w-xl text-5xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-6xl">
              Let Sundarban slow your life down.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">{destination.summary}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <ScrollLink targetId="packages" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                Explore packages
              </ScrollLink>
              <Link href={`/booking/${packages[0].slug}`} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">
                Book a getaway
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Guest rating', value: '4.9/5' },
                { label: 'Tailored trips', value: '120+' },
                { label: 'Average stay', value: '5 nights' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                  <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_100px_rgba(15,23,42,0.12)]">
              <img src={packages[0].image} alt={packages[0].title} className="h-[620px] w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 rounded-[1.6rem] border border-white/50 bg-white/80 p-5 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Featured escape</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{packages[0].title}</h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">From</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">₹{packages[0].price}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="packages" className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Our packages</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Pick your Sundarban mood</h2>
            </div>
            <Link href={`/booking/${packages[0].slug}`} className="text-sm font-semibold text-slate-700 transition hover:text-slate-900">
              Need help choosing? Let’s plan it.
            </Link>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {packages.map((pkg) => (
              <article key={pkg.slug} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(15,23,42,0.09)]">
                <div className="overflow-hidden">
                  <img src={pkg.image} alt={pkg.title} className="h-60 w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      {pkg.badge}
                    </span>
                    <span className="text-sm font-medium text-slate-500">★ {pkg.rating}</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{pkg.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{pkg.summary}</p>

                  <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
                    <span>{pkg.duration}</span>
                    <span className="text-lg font-semibold text-slate-900">₹{pkg.price}</span>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link href={`/packages/${pkg.slug}`} className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">
                      View details
                    </Link>
                    <Link href={`/booking/${pkg.slug}`} className="flex-1 rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-700">
                      Book now
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="bg-slate-900 py-20 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">A calmer way to travel</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight">Everything curated around your rhythm.</h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Thoughtful stays',
                  description: 'Boutique villas, cliffside suites, and oceanfront hideaways chosen for comfort, calm, and beauty.',
                },
                {
                  title: 'Local guidance',
                  description: 'Private drivers, culture-led itineraries, and insider recommendations from people who know Sundarban best.',
                },
                {
                  title: 'Easy planning',
                  description: 'Flexible dates, concierge support, and a seamless trip flow from pickup to departure.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-lg text-emerald-300">✦</div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-12">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">What travelers say</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Loved from arrival to airport drop-off.</h2>
              </div>
              <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">4.9 average guest score</div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {[
                '“The villas were beautiful, the itinerary felt effortless, and every detail felt carefully considered.”',
                '“We wanted a romantic Sundarban trip and got exactly that—sunset dinners, scenic views, and zero stress.”',
                '“Astra took the overwhelm out of planning. It felt premium without being complicated.”',
              ].map((quote, index) => (
                <blockquote key={quote} className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-6 text-slate-700">
                  <p className="text-lg leading-8">{quote}</p>
                  <footer className="mt-6 text-sm font-semibold text-slate-900">
                    {index === 0 ? 'Maya & Leo' : index === 1 ? 'Aisha R.' : 'Daniel K.'}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/80 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">A</div>
            <span className="font-medium text-slate-800">Astra Travels</span>
          </div>
          <p>Crafting Sundarban journeys with thoughtful design and effortless ease.</p>
        </div>
      </footer>
    </div>
  );
}
