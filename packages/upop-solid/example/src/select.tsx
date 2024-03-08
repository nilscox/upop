import { createSelect } from '@upop/solid';
import { unwrap } from 'solid-js/store';

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
  const select = createSelect({
    items: books,
    itemToString,
  });

  return (
    <div>
      <div class="w-72 flex flex-col gap-1">
        <label {...select.getLabelProps()}>Choose your favorite book:</label>
        <div
          class="p-2 bg-white flex justify-between cursor-pointer"
          {...select.getToggleButtonProps()}
        >
          <span>
            {select.selectedItem ? select.selectedItem.title : 'Best book ever'}
          </span>
          <span class="px-2">
            {select.isOpen ? <>&#8593;</> : <>&#8595;</>}
          </span>
        </div>
      </div>
      <ul
        class="absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10"
        classList={{ hidden: !select.isOpen }}
        {...select.getMenuProps()}
      >
        {select.isOpen &&
          books.map((item, index) => (
            <li
              class="py-2 px-3 shadow-sm flex flex-col"
              classList={{
                'bg-blue-300': select.highlightedIndex === index,
                'font-bold': unwrap(select.selectedItem) === item,
              }}
              {...select.getItemProps({ item, index })}
            >
              <span>{item.title}</span>
              <span class="text-sm text-gray-700">{item.author}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
