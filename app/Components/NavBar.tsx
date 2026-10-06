'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import logo from '@/assets/book.ico';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/listed-books', label: 'Listed Books' },
  { href: '/pages-to-read', label: 'Pages to Read' },
];

const NavBar = () => {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Scroll korle border + colored shadow ashbe
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu khola thakle: Escape ba baire click korle bondho hobe
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onClickOutside);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 motion-reduce:transition-none ${
        scrolled || open
          ? 'border-stone-200 bg-stone-50/90 shadow-lg shadow-emerald-900/10 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-950/90'
          : 'border-transparent bg-stone-50/60 backdrop-blur-md dark:bg-stone-950/50'
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          <span className="rounded-xl bg-emerald-50 p-1.5 shadow-md shadow-emerald-900/15 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
            <Image src={logo} alt="Book Vive logo" height={28} width={28} priority />
          </span>
          <span className="font-serif text-2xl font-bold tracking-tight text-emerald-900 dark:text-emerald-100">
            Book Vive
          </span>
        </Link>

        {/* Desktop links: active page e bookmark ribbon jhule thake */}
        <ul className="hidden h-16 items-center lg:flex">
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <li key={href} className="h-full">
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex h-full items-center rounded-md px-5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 ${
                    active
                      ? 'text-emerald-800 dark:text-emerald-300'
                      : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                  }`}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-0 h-4 w-3 -translate-x-1/2 bg-emerald-600 [clip-path:polygon(0_0,100%_0,100%_100%,50%_70%,0_100%)] dark:bg-emerald-400"
                    />
                  )}
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/signin"
            className="rounded-full px-5 py-2 text-sm font-semibold text-stone-700 ring-1 ring-stone-300 transition-colors hover:bg-stone-100 hover:ring-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-stone-200 dark:ring-stone-700 dark:hover:bg-stone-800"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-linear-to-r from-emerald-700 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-700/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-700 ring-1 ring-stone-300 transition-colors hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-stone-200 dark:ring-stone-700 dark:hover:bg-stone-800 lg:hidden"
        >
          <span
            className={`absolute h-0.5 w-5 rounded bg-current transition-transform duration-300 motion-reduce:transition-none ${
              open ? 'rotate-45' : '-translate-y-1.5'
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded bg-current transition-opacity duration-200 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded bg-current transition-transform duration-300 motion-reduce:transition-none ${
              open ? '-rotate-45' : 'translate-y-1.5'
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none lg:hidden ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div
          className={`overflow-hidden transition-all duration-300 ${
            open ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
        >
          <div className="mx-auto max-w-7xl space-y-4 px-4 pb-5 pt-2 sm:px-6">
            <ul className="space-y-1">
              {NAV_LINKS.map(({ href, label }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`block rounded-xl border-l-4 px-4 py-3 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                        active
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-300'
                          : 'border-transparent text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="grid grid-cols-2 gap-3 border-t border-stone-200 pt-4 dark:border-stone-800">
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="rounded-full px-5 py-2.5 text-center text-sm font-semibold text-stone-700 ring-1 ring-stone-300 transition-colors hover:bg-stone-100 dark:text-stone-200 dark:ring-stone-700 dark:hover:bg-stone-800"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="rounded-full bg-linear-to-r from-emerald-700 to-teal-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-700/30"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;