'use client';

import React, { useState, useSyncExternalStore } from 'react';

const READ_KEY = 'bookvive:read';
const WISHLIST_KEY = 'bookvive:wishlist';

const load = (key: string): number[] => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]');
  } catch {
    return [];
  }
};

// localStorage er pori-borton hole component ke jananor niyom
const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  window.addEventListener('bookvive', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('bookvive', callback);
  };
};

const useIsSaved = (key: string, id: number) =>
  useSyncExternalStore(
    subscribe,
    () => load(key).includes(id),
    () => false
  );

const toggle = (key: string, id: number) => {
  const ids = load(key);
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new Event('bookvive'));
  return next.includes(id);
};

const BookActions = ({ bookId, bookName }: { bookId: number; bookName: string }) => {
  const isRead = useIsSaved(READ_KEY, bookId);
  const isWished = useIsSaved(WISHLIST_KEY, bookId);
  const [message, setMessage] = useState('');

  const notify = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2500);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          aria-pressed={isRead}
          onClick={() =>
            notify(toggle(READ_KEY, bookId) ? `Marked "${bookName}" as read` : 'Removed from read list')
          }
          className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
            isRead
              ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
              : 'text-stone-700 ring-1 ring-stone-300 hover:bg-white hover:ring-stone-400 dark:text-stone-200 dark:ring-stone-700 dark:hover:bg-stone-800'
          }`}
        >
          {isRead && <span aria-hidden="true">✓</span>}
          {isRead ? 'Read' : 'Mark as read'}
        </button>

        <button
          type="button"
          aria-pressed={isWished}
          onClick={() =>
            notify(toggle(WISHLIST_KEY, bookId) ? 'Added to your wishlist' : 'Removed from your wishlist')
          }
          className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
            isWished
              ? 'bg-rose-600 text-white shadow-rose-600/30 hover:shadow-xl hover:shadow-rose-600/40'
              : 'bg-linear-to-r from-emerald-700 to-teal-600 text-white shadow-emerald-700/30 hover:shadow-xl hover:shadow-emerald-700/40'
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill={isWished ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          >
            <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.6 5.5 5.5 0 0 1 21.5 12C19 16.4 12 21 12 21z" />
          </svg>
          {isWished ? 'In wishlist' : 'Add to wishlist'}
        </button>
      </div>

      <p aria-live="polite" className="min-h-5 text-sm text-stone-500 dark:text-stone-400">
        {message}
      </p>
    </div>
  );
};

export default BookActions;