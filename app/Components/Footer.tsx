import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import logo from '@/assets/book.ico';

const EXPLORE = [
  { href: '/', label: 'Home' },
  { href: '/listed-books', label: 'Listed Books' },
  { href: '/pages-to-read', label: 'Pages to Read' },
];

const LIBRARY = [
  { href: '/listed-books', label: 'Books I have read' },
  { href: '/listed-books', label: 'My wishlist' },
  { href: '/pages-to-read', label: 'Reading stats' },
];

const linkClass =
  'rounded text-sm text-stone-600 transition-colors hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-stone-400 dark:hover:text-emerald-300';

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-stone-200 bg-linear-to-b from-stone-50 to-emerald-50/60 dark:border-stone-800 dark:from-stone-950 dark:to-emerald-950/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="max-w-sm space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
              <span className="rounded-xl bg-emerald-50 p-1.5 shadow-md shadow-emerald-900/15 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
                <Image src={logo} alt="" height={28} width={28} />
              </span>
              <span className="font-serif text-2xl font-bold tracking-tight text-emerald-900 dark:text-emerald-100">
                Book Vive
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              Keep every book you love in one place. Mark what you have read, save what you want to read next,
              and see how many pages are waiting for you.
            </p>
          </div>

          <nav aria-label="Explore">
            <h2 className="mb-4 font-serif text-lg font-bold text-stone-900 dark:text-stone-50">Explore</h2>
            <ul className="space-y-3">
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Your library">
            <h2 className="mb-4 font-serif text-lg font-bold text-stone-900 dark:text-stone-50">Your library</h2>
            <ul className="space-y-3">
              {LIBRARY.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-6 text-sm text-stone-500 sm:flex-row dark:border-stone-800 dark:text-stone-400">
          <p>© {new Date().getFullYear()} Book Vive. All rights reserved.</p>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium text-stone-700 ring-1 ring-stone-300 transition-colors hover:bg-white hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-stone-300 dark:ring-stone-700 dark:hover:bg-stone-900"
          >
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;