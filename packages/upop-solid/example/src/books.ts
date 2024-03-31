export type Book = { id: string; author: string; title: string };

export const books: Book[] = [
  { id: 'book-1', author: 'Harper Lee', title: 'To Kill a Mockingbird' },
  { id: 'book-2', author: 'Lev Tolstoy', title: 'War and Peace' },
  { id: 'book-3', author: 'Fyodor Dostoyevsy', title: 'The Idiot' },
  { id: 'book-4', author: 'Oscar Wilde', title: 'A Picture of Dorian Gray' },
  { id: 'book-5', author: 'George Orwell', title: '1984' },
  { id: 'book-6', author: 'Jane Austen', title: 'Pride and Prejudice' },
  { id: 'book-7', author: 'Marcus Aurelius', title: 'Meditations' },
  {
    id: 'book-8',
    author: 'Fyodor Dostoevsky',
    title: 'The Brothers Karamazov',
  },
  { id: 'book-9', author: 'Lev Tolstoy', title: 'Anna Karenina' },
  { id: 'book-10', author: 'Fyodor Dostoevsky', title: 'Crime and Punishment' },
];

export function itemToString(item: Book | null) {
  return item ? item.title : '';
}

export function getBooksFilter(inputValue: string) {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function booksFilter(book: Book) {
    return (
      !inputValue ||
      book.title.toLowerCase().includes(lowerCasedInputValue) ||
      book.author.toLowerCase().includes(lowerCasedInputValue)
    );
  };
}
