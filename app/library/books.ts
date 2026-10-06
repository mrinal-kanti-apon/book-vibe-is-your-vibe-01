import booksData from '../../public/booksData.json';

export type Book = {
  bookId: number;
  bookName: string;
  author: string;
  image: string;
  review: string;
  totalPages: number;
  rating: number;
  category: string;
  tags: string[];
  publisher: string;
  yearOfPublishing: number;
};

export const books: Book[] = booksData;

export const getBookById = (id: string) =>
  books.find((book) => String(book.bookId) === id);

// Ekই category r book age, tarpor onno book//
export const getRelatedBooks = (book: Book, count = 3) => {
  const others = books.filter((b) => b.bookId !== book.bookId);
  const same = others.filter((b) => b.category === book.category);
  const rest = others.filter((b) => b.category !== book.category);
  return [...same, ...rest].slice(0, count);
};