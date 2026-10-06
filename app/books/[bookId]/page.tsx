import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BookActions from '@/app/Components/BookActions';
import { books, getBookById, getRelatedBooks } from '@/app/library/books';

type Props = {
  params: Promise<{ bookId: string }>;
};

export function generateStaticParams() {
  return books.map((book) => ({ bookId: String(book.bookId) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookId } = await params;
  const book = getBookById(bookId);
  return { title: book ? `${book.bookName} | Book Vive` : 'Book not found' };
}

const StarSvg = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-current" aria-hidden="true">
    <path d="M12 2.8l2.8 5.7 6.3.9-4.5 4.4 1 6.3L12 17.2l-5.6 2.9 1-6.3L2.9 9.4l6.3-.9L12 2.8z" />
  </svg>
);

const Stars = ({ rating }: { rating: number }) => {
  const percent = Math.min(100, Math.max(0, (rating / 5) * 100));
  const stars = Array.from({ length: 5 }, (_, i) => <StarSvg key={i} />);
  return (
    <div role="img" aria-label={`Rated ${rating} out of 5`} className="relative inline-flex">
      <div className="flex text-stone-300 dark:text-stone-700">{stars}</div>
      <div
        className="absolute inset-y-0 left-0 flex overflow-hidden text-amber-400"
        style={{ width: `${percent}%` }}
      >
        {stars}
      </div>
    </div>
  );
};

const BookDetailsPage = async ({ params }: Props) => {
  const { bookId } = await params;
  const book = getBookById(bookId);

  if (!book) notFound();

  const related = getRelatedBooks(book, 3);
  const stats = [
    { label: 'Pages', value: book.totalPages },
    { label: 'Published', value: book.yearOfPublishing },
    { label: 'Publisher', value: book.publisher },
    { label: 'Rating', value: `${book.rating} / 5` },
  ];

  return (
    <main className="relative isolate overflow-x-clip">
      {/* Background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 -z-10 h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-80 -z-10 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-500/10"
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
            <li>
              <Link href="/" className="hover:text-emerald-700 dark:hover:text-emerald-300">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/#books-heading"
                className="hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                Books
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="truncate font-medium text-stone-800 dark:text-stone-200">
              {book.bookName}
            </li>
          </ol>
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Cover with a slight 3D tilt */}
          <div className="flex items-center justify-center rounded-3xl bg-linear-to-b from-stone-100 via-stone-100 to-emerald-50 p-8 shadow-xl shadow-emerald-900/5 ring-1 ring-stone-900/5 sm:p-12 lg:sticky lg:top-24 dark:from-stone-800 dark:via-stone-800 dark:to-emerald-950/40 dark:ring-white/5">
            <div className="w-full max-w-xs perspective-distant sm:max-w-sm">
              <div className="relative aspect-3/4 transition-transform duration-500 transform-[rotateY(-14deg)] hover:transform-[rotateY(0deg)] motion-reduce:transform-none">
                <Image
                  src={book.image}
                  alt={`Cover of ${book.bookName}`}
                  fill
                  priority
                  unoptimized
                  sizes="(min-width: 1024px) 384px, 80vw"
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-7">
            <header className="space-y-4">
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                {book.category}
              </span>
              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
                {book.bookName}
              </h1>
              <p className="text-lg text-stone-600 dark:text-stone-400">By {book.author}</p>
              <div className="flex items-center gap-3">
                <Stars rating={book.rating} />
                <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  {book.rating}
                </span>
              </div>
            </header>

            <section aria-labelledby="review-heading" className="space-y-2">
              <h2
                id="review-heading"
                className="text-sm font-semibold text-stone-900 dark:text-stone-100"
              >
                Review
              </h2>
              <p className="leading-relaxed text-stone-600 dark:text-stone-400">{book.review}</p>
            </section>

            <ul className="flex flex-wrap gap-2">
              {book.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                >
                  #{tag}
                </li>
              ))}
            </ul>

            <dl className="grid grid-cols-2 gap-3">
              {stats.map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-stone-200 bg-white/70 p-4 backdrop-blur dark:border-stone-800 dark:bg-stone-900/70"
                >
                  <dt className="text-xs text-stone-500 dark:text-stone-400">{label}</dt>
                  <dd className="mt-1 font-serif text-lg font-bold text-stone-900 dark:text-stone-50">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <BookActions bookId={book.bookId} bookName={book.bookName} />
          </div>
        </div>

        {/* Related books */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-20">
            <h2
              id="related-heading"
              className="mb-6 font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50"
            >
              You might also like
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.bookId}>
                  <Link
                    href={`/books/${item.bookId}`}
                    className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600/40 hover:shadow-lg hover:shadow-emerald-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-stone-800 dark:bg-stone-900"
                  >
                    <div className="relative h-24 w-16 shrink-0 rounded-lg bg-stone-100 dark:bg-stone-800">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        unoptimized
                        sizes="64px"
                        className="object-contain p-1 drop-shadow-md"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-serif text-base font-bold text-stone-900 dark:text-stone-50">
                        {item.bookName}
                      </p>
                      <p className="truncate text-sm text-stone-600 dark:text-stone-400">
                        {item.author}
                      </p>
                      <p className="mt-1 text-sm font-medium text-amber-600 dark:text-amber-400">
                        ★ {item.rating}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
};

export default BookDetailsPage;