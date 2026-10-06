import Link from 'next/link';
import React from 'react';

const ComingSoon = ({ title }: { title: string }) => (
  <main className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-24 text-center">
    <h1 className="font-serif text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
      {title}
    </h1>
    <p className="mt-4 text-stone-600 dark:text-stone-400">
      This page is coming soon. For now you can browse books and build your reading list without an account.
    </p>
    <Link
      href="/"
      className="mt-8 rounded-full bg-linear-to-r from-emerald-700 to-teal-600 px-7 py-3 font-semibold text-white shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-700/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      Back to home
    </Link>
  </main>
);

export default ComingSoon;