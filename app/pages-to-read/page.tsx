import type { Metadata } from 'next';
import PagesChart from '@/app/Components/PagesChart';
import { books } from '@/app/library/books';

export const metadata: Metadata = { title: 'Pages to Read | Book Vive' };

const PagesToReadPage = () => {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <header className="mb-10 rounded-3xl bg-linear-to-br from-stone-100 via-stone-50 to-emerald-50 px-6 py-10 text-center ring-1 ring-stone-200 dark:from-stone-900 dark:via-stone-950 dark:to-emerald-950/40 dark:ring-stone-800">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
          Pages to Read
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          See how many pages each of your books holds.
        </p>
      </header>

      <PagesChart books={books} />
    </main>
  );
};

export default PagesToReadPage;