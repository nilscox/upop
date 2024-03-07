import cx from 'classnames';
import { useSelect } from '@upop/react';

type Book = { id: string; author: string; title: string };

const books: Book[] = [
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

function itemToString(item: Book | null) {
  return item ? item.title : '';
}

export function Select() {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: books,
    itemToString,
  });

  return (
    <div>
      <div className="w-72 flex flex-col gap-1">
        <label {...getLabelProps()}>Choose your favorite book:</label>
        <div
          className="p-2 bg-white flex justify-between cursor-pointer"
          {...getToggleButtonProps()}
        >
          <span>{selectedItem ? selectedItem.title : 'Best book ever'}</span>
          <span className="px-2">{isOpen ? <>&#8593;</> : <>&#8595;</>}</span>
        </div>
      </div>
      <ul
        className={`absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
          !isOpen && 'hidden'
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          books.map((item, index) => (
            <li
              className={cx(
                highlightedIndex === index && 'bg-blue-300',
                selectedItem === item && 'font-bold',
                'py-2 px-3 shadow-sm flex flex-col',
              )}
              key={item.id}
              {...getItemProps({ item, index })}
            >
              <span>{item.title}</span>
              <span className="text-sm text-gray-700">{item.author}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
