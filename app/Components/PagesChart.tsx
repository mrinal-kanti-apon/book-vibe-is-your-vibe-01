'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import type { Book } from '../library/books';
import { READ_KEY, WISHLIST_KEY, useHydrated, useSavedIds } from '../library/savedBooks';

type Source = 'read' | 'wishlist';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#EF4444'];

const SOURCES: { id: Source; label: string; empty: string }[] = [
  { id: 'read', label: 'Read books', empty: "You haven't marked any books as read yet." },
  { id: 'wishlist', label: 'Wishlist', empty: 'Your wishlist is empty.' },
];

const PagesChart = ({ books }: { books: Book[] }) => {
  const hydrated = useHydrated();
  const readIds = useSavedIds(READ_KEY);
  const wishIds = useSavedIds(WISHLIST_KEY);
  const [source, setSource] = useState<Source>('read');
  const [activeId, setActiveId] = useState<number | null>(null);
  const [grown, setGrown] = useState(false);

  // Bar gulo 0 theke bere uthbe (animation)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const ids = source === 'read' ? readIds : wishIds;
  const items = useMemo(
    () => ids.flatMap((id) => books.find((b) => b.bookId === id) ?? []),
    [ids, books]
  );

  const totalPages = items.reduce((sum, b) => sum + b.totalPages, 0);
  const longest = items.reduce<Book | null>(
    (best, b) => (!best || b.totalPages > best.totalPages ? b : best),
    null
  );
  const average = items.length ? Math.round(totalPages / items.length) : 0;

  // Y axis: 340 er moto upor-er shima, 4 bhage bhag kora
  const top = Math.max(20, Math.ceil(Math.max(0, ...items.map((b) => b.totalPages)) / 20) * 20);
  const ticks = [0, 1, 2, 3, 4].map((i) => Math.round((top * i) / 4));
  const active = items.find((b) => b.bookId === activeId) ?? null;
  const currentSource = SOURCES.find((s) => s.id === source) ?? SOURCES[0];

  const stats = [
    { label: 'Total pages', value: totalPages.toLocaleString() },
    { label: 'Books', value: items.length },
    { label: 'Longest book', value: longest ? `${longest.totalPages} pages` : '-' },
    { label: 'Average', value: `${average} pages` },
  ];

  return (
    <div className="space-y-8">
      {/* Read / Wishlist switch */}
      <div className="flex justify-center">
        <div role="group" aria-label="Choose a list" className="inline-flex rounded-full bg-stone-100 p-1 dark:bg-stone-800">
          {SOURCES.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={source === s.id}
              onClick={() => {
                setSource(s.id);
                setActiveId(null);
              }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                source === s.id
                  ? 'bg-white text-emerald-800 shadow dark:bg-stone-950 dark:text-emerald-300'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
              }`}
            >
              {s.label}
              {hydrated && ` (${s.id === 'read' ? readIds.length : wishIds.length})`}
            </button>
          ))}
        </div>
      </div>

      {!hydrated ? (
        <div className="h-96 animate-pulse rounded-3xl bg-stone-200/60 dark:bg-stone-800/60" aria-hidden="true" />
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
          <p className="text-stone-600 dark:text-stone-400">{currentSource.empty}</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            Browse books
          </Link>
        </div>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900"
              >
                <dt className="text-xs text-stone-500 dark:text-stone-400">{label}</dt>
                <dd className="mt-1 font-serif text-xl font-bold text-stone-900 dark:text-stone-50">{value}</dd>
              </div>
            ))}
          </dl>

          <section
            aria-label="Pages per book"
            className="rounded-3xl bg-stone-50 p-5 ring-1 ring-stone-200 sm:p-8 dark:bg-stone-900 dark:ring-stone-800"
          >
            <div className="flex gap-3 pt-8">
              {/* Y axis */}
              <div className="relative h-72 w-9 shrink-0" aria-hidden="true">
                {ticks.map((t, i) => (
                  <span
                    key={i}
                    className="absolute right-0 translate-y-1/2 text-xs text-stone-500 dark:text-stone-400"
                    style={{ bottom: `${i * 25}%` }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="min-w-0 flex-1 overflow-x-auto pb-2">
                <div style={{ minWidth: items.length * 96 }}>
                  <div className="relative h-72">
                    {ticks.map((_, i) => (
                      <div
                        key={i}
                        aria-hidden="true"
                        className="absolute inset-x-0 border-t border-dashed border-stone-300 dark:border-stone-700"
                        style={{ bottom: `${i * 25}%` }}
                      />
                    ))}

                    <div className="absolute inset-0 flex">
                      {items.map((b, i) => {
                        const color = COLORS[i % COLORS.length];
                        const dimmed = activeId !== null && activeId !== b.bookId;
                        return (
                          <button
                            key={b.bookId}
                            type="button"
                            aria-label={`${b.bookName}, ${b.totalPages} pages`}
                            onMouseEnter={() => setActiveId(b.bookId)}
                            onMouseLeave={() => setActiveId(null)}
                            onFocus={() => setActiveId(b.bookId)}
                            onBlur={() => setActiveId(null)}
                            className={`flex h-full flex-1 flex-col items-center justify-end px-2 transition-opacity duration-200 focus:outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                              dimmed ? 'opacity-40' : 'opacity-100'
                            }`}
                          >
                            <div
                              className="relative w-full max-w-28 transition-[height] duration-700 ease-out motion-reduce:transition-none"
                              style={{ height: grown ? `${(b.totalPages / top) * 100}%` : '0%' }}
                            >
                              <span
                                className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold"
                                style={{ color }}
                              >
                                {b.totalPages}
                              </span>
                              <svg
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                className="h-full w-full"
                                aria-hidden="true"
                              >
                                <path d="M0 100C40 100 47 60 50 0C53 60 60 100 100 100Z" fill={color} />
                              </svg>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Book names */}
                  <div className="mt-3 flex">
                    {items.map((b) => (
                      <p
                        key={b.bookId}
                        className="line-clamp-2 flex-1 px-2 text-center text-xs text-stone-500 dark:text-stone-400"
                      >
                        {b.bookName}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p aria-live="polite" className="mt-6 min-h-6 text-center text-sm text-stone-600 dark:text-stone-400">
              {active ? (
                <>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{active.bookName}</span> by{' '}
                  {active.author} · {active.totalPages} pages · {active.yearOfPublishing}
                </>
              ) : (
                'Hover or focus a bar to see details.'
              )}
            </p>
          </section>
        </>
      )}
    </div>
  );
};

export default PagesChart;