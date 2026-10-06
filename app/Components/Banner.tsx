import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import bannerHeroLogo from '@/assets/hero_img.jpg';

const Banner = () => {
  return (
    <section className="relative isolate overflow-hidden  bg-linear-to-br from-stone-100 via-stone-50 to-emerald-50 ring-1 ring-stone-200 dark:from-stone-900 dark:via-stone-950 dark:to-emerald-950/40 dark:ring-stone-800">
      {/* Soft background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-20 -z-10 h-80 w-80 rounded-full bg-teal-300/25 blur-3xl dark:bg-teal-500/10"
      />

      <div className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-3xl flex-col items-center justify-center gap-12 px-6 py-12 text-center sm:px-10 lg:py-16">
        {/* Image: sobar upore, majhkhane */}
        <div className="relative w-full max-w-xs sm:max-w-sm">
          {/* Pichoner pata-er stack */}
          <div
            aria-hidden="true"
            className="absolute inset-y-3 left-4 -right-3.5 rounded-l-md rounded-r-2xl bg-stone-200 dark:bg-stone-800"
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-1.5 left-2 -right-2 rounded-l-md rounded-r-2xl bg-stone-100 ring-1 ring-stone-200 dark:bg-stone-700 dark:ring-stone-600"
          />

          <div className="relative overflow-hidden rounded-l-md rounded-r-2xl shadow-2xl shadow-emerald-900/25 ring-1 ring-black/5">
            <Image
              alt="Featured books"
              src={bannerHeroLogo}
              priority
              placeholder="blur"
              sizes="(min-width: 640px) 384px, 80vw"
              className="h-auto w-full object-cover"
            />
            {/* Book spine shading */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-linear-to-r from-black/30 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-3 w-px bg-black/15"
            />
          </div>
        </div>

        {/* Text: image er niche, majhkhane */}
        <div className="flex flex-col items-center gap-6">
          <h1 className="font-serif text-4xl font-bold italic leading-[1.15] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl dark:text-stone-50">
            Books to freshen up <br className="hidden sm:block" /> your bookshelf
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-stone-600 dark:text-stone-400">
            Save the books you love, keep your reading list in one place, and
            see how many pages are waiting for you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/listed-books"
              className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-emerald-700 to-teal-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-700/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              View the list
            </Link>
            <Link
              href="/pages-to-read"
              className="inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-stone-700 ring-1 ring-stone-300 transition-colors hover:bg-white hover:ring-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-stone-200 dark:ring-stone-700 dark:hover:bg-stone-800"
            >
              Pages to read
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;