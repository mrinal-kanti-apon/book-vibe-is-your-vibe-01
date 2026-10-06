'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Book } from '../library/books';
import {
  READ_KEY,
  WISHLIST_KEY,
  removeSaved,
  useHydrated,
  useSavedIds,
} from '../library/savedBooks';

type SortKey = 'default' | 'rating' | 'pages' | 'year';
type TabId = 'read' | 'wishlist';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'rating', label: 'Rating' },
  { value: 'pages', label: 'Number of pages' },
  { value: 'year', label: 'Publisher year' },
];

const SORTERS: Record<SortKey, ((a: Book, b: Book) => number) | null> = {
  default: null,
  rating: (a, b) => b.rating - a.rating,
  pages: (a, b) => b.totalPages - a.totalPages,
  year: (a, b) => b.yearOfPublishing - a.yearOfPublishing,
};

const TABS: { id: TabId; label: string; key: string; empty: string }[] = [
  { id: 'read', label: 'Read Books', key: READ_KEY, empty: "You haven't marked any books as read yet." },
  { id: 'wishlist', label: 'Wishlist Books', key: WISHLIST_KEY, empty: 'Your wishlist is empty.' },
];

const Icon = ({ d, className = 'h-4 w-4' }: { d: string; className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  chevron: 'M6 9l6 6 6-6',
  calendar: 'M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  publisher: 'M4 21V8l8-5 8 5v13M9 21v-6h6v6',
  pages: 'M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4zM14 3v4h4',
  close: 'M6 6l12 12M18 6L6 18',
};

const SortMenu = ({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = SORT_OPTIONS.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-700 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-700/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        {value === 'default' ? 'Sort By' : `Sort: ${current?.label}`}
        <Icon d={ICONS.chevron} className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Sort books"
          className="absolute left-1/2 z-20 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl shadow-emerald-900/10 dark:border-stone-700 dark:bg-stone-900"
        >
          {SORT_OPTIONS.map((o) => (
            <li key={o.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                  o.value === value
                    ? 'bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300'
                    : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
              >
                {o.label}
                {o.value === value && <span aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ListedBookCard = ({ book, onRemove }: { book: Book; onRemove: () => void }) => (
  <li>
    <article className="group flex flex-col gap-5 rounded-2xl border border-stone-900/15 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-600/40 hover:shadow-xl hover:shadow-emerald-900/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:flex-row sm:p-5 dark:border-stone-700 dark:bg-stone-900">
      {/* Cover */}
      <div className="flex h-48 shrink-0 items-center justify-center rounded-xl bg-linear-to-b from-stone-100 via-stone-100 to-emerald-50 ring-1 ring-stone-900/5 sm:h-auto sm:min-h-44 sm:w-40 dark:from-stone-800 dark:via-stone-800 dark:to-emerald-950/40 dark:ring-white/5">
        <div className="relative h-36 w-24">
          <Image
            src={book.image}
            alt={`Cover of ${book.bookName}`}
            fill
            unoptimized
            sizes="96px"
            className="object-contain drop-shadow-xl"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl font-bold leading-snug text-stone-900 dark:text-stone-50">
              {book.bookName}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400">By : {book.author}</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${book.bookName} from this list`}
            className="shrink-0 rounded-full p-2 text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:hover:bg-rose-500/10"
          >
            <Icon d={ICONS.close} className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="font-semibold text-stone-900 dark:text-stone-100">Tag</span>
          <ul className="flex flex-wrap gap-2">
            {book.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
              >
                #{tag}
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
            <Icon d={ICONS.calendar} /> Year of Publishing: {book.yearOfPublishing}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-600 dark:text-stone-400">
          <span className="inline-flex items-center gap-1.5">
            <Icon d={ICONS.publisher} /> Publisher: {book.publisher}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon d={ICONS.pages} /> Page {book.totalPages}
          </span>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-stone-200 pt-4 dark:border-stone-800">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
            Category: {book.category}
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            Rating: {book.rating}
          </span>
          <Link
            href={`/books/${book.bookId}`}
            className="rounded-full bg-emerald-700 px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  </li>
);

const ListedBooks = ({ books }: { books: Book[] }) => {
  const hydrated = useHydrated();
  const readIds = useSavedIds(READ_KEY);
  const wishIds = useSavedIds(WISHLIST_KEY);
  const [tab, setTab] = useState<TabId>('read');
  const [sort, setSort] = useState<SortKey>('default');

  const activeTab = TABS.find((t) => t.id === tab) ?? TABS[0];
  const ids = tab === 'read' ? readIds : wishIds;

  const list = useMemo(() => {
    const items = ids.flatMap((id) => books.find((b) => b.bookId === id) ?? []);
    const sorter = SORTERS[sort];
    return sorter ? [...items].sort(sorter) : items;
  }, [ids, books, sort]);

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <SortMenu value={sort} onChange={setSort} />
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Book lists" className="mb-6 flex gap-1 border-b border-stone-200 dark:border-stone-800">
        {TABS.map((t) => {
          const selected = t.id === tab;
          const count = t.id === 'read' ? readIds.length : wishIds.length;
          return (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="books-panel"
              onClick={() => setTab(t.id)}
              className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                selected
                  ? 'border-emerald-600 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300'
                  : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
              }`}
            >
              {t.label}
              {hydrated && (
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div id="books-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {!hydrated ? (
          <div className="space-y-4" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-stone-200/60 dark:bg-stone-800/60" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 p-12 text-center dark:border-stone-700">
            <p className="text-stone-600 dark:text-stone-400">{activeTab.empty}</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              Browse books
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {list.map((book) => (
              <ListedBookCard
                key={book.bookId}
                book={book}
                onRemove={() => removeSaved(activeTab.key, book.bookId)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListedBooks;