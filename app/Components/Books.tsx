import React from 'react';
import { books } from '../library/books';
import BookList from './BookList';

const Books = () => {
  return (
    <section
      aria-labelledby="books-heading"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mb-8 text-center">
        <h2
          id="books-heading"
          className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50"
        >
          Books
        </h2>
        <p className="mt-3 text-stone-600 dark:text-stone-400">
          Browse every book in the collection.
        </p>
      </div>

      <BookList books={books} />
    </section>
  );
};

export default Books;