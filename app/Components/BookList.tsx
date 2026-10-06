'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import type { Book } from '../library/books';

const StarIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4 fill-amber-400 stroke-amber-500"
    strokeWidth="1.5"
    strokeLinejoin="round"
  >
    <path d="M12 2.8l2.8 5.7 6.3.9-4.5 4.4 1 6.3L12 17.2l-5.6 2.9 1-6.3L2.9 9.4l6.3-.9L12 2.8z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

const BookList = ({ books }: { books: Book[] }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(books.map((b) => b.category).filter(Boolean) as string[]))],
    [books]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      const matchesCategory = category === 'All' || b.category === category;
      const haystack = `${b.bookName} ${b.author} ${(b.tags ?? []).join(' ')}`.toLowerCase();
      return matchesCategory && (!q || haystack.includes(q));
    });
  }, [books, query, category]);

  const reset = () => {
    setQuery('');
    setCategory('All');
  };

  return (
    <div>
      {/* Search + category filter */}
      <div className="mb-10 flex flex-col items-center gap-5">
        <div className="relative w-full max-w-md">
          <label htmlFor="book-search" className="sr-only">
            Search books
          </label>
          <SearchIcon />
          <input
            id="book-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author or tag"
            className="w-full rounded-full border border-stone-300 bg-white py-3 pl-12 pr-5 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/25 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
        </div>

        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                  category === c
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25'
                    : 'bg-white text-stone-700 ring-1 ring-stone-300 hover:bg-stone-100 dark:bg-stone-900 dark:text-stone-300 dark:ring-stone-700 dark:hover:bg-stone-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <p aria-live="polite" className="text-sm text-stone-500 dark:text-stone-400">
          Showing {filtered.length} of {books.length} books
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 p-10 text-center dark:border-stone-700">
          <p className="text-stone-600 dark:text-stone-400">No books match your search.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            Clear search
          </button>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((book) => (
            <li key={book.bookId}>
              <article className="group relative flex h-full flex-col gap-5 rounded-2xl border border-stone-900/15 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600/40 hover:shadow-xl hover:shadow-emerald-900/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-within:ring-2 focus-within:ring-emerald-600 sm:p-6 dark:border-stone-700 dark:bg-stone-900">
                {/* Cover */}
                <div className="flex h-56 items-center justify-center rounded-xl bg-linear-to-b from-stone-100 via-stone-100 to-emerald-50 ring-1 ring-stone-900/5 dark:from-stone-800 dark:via-stone-800 dark:to-emerald-950/40 dark:ring-white/5">
                  <div className="relative h-44 w-32 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                    <Image
                      src={book.image}
                      alt={`Cover of ${book.bookName}`}
                      fill
                      unoptimized
                      sizes="128px"
                      className="object-contain drop-shadow-xl"
                    />
                  </div>
                </div>

                {/* Tags */}
                {book.tags && book.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Title + author */}
                <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold leading-snug text-stone-900 dark:text-stone-50">
                  <Link
                     href={`/books/${book.bookId}`}
                     className="outline-none after:absolute after:inset-0 after:rounded-2xl"
                     >
                     {book.bookName}
                  </Link>
                </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">By: {book.author}</p>
                </div>

                {/* Category + rating */}
                <div className="mt-auto flex items-center justify-between border-t border-dashed border-stone-300 pt-4 text-sm text-stone-600 dark:border-stone-700 dark:text-stone-400">
                  <span>{book.category}</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-stone-800 dark:text-stone-200">
                    {Number(book.rating ?? 0).toFixed(2)}
                    <StarIcon />
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;