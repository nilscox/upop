import cx from 'classnames';
import { useSelect } from '@upop/react';
import { useState } from 'react';

import { Book, books, itemToString } from './books';

export function SelectControlled() {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedItem, setSelectedItem] = useState<Book | null>(null);

  const { getToggleButtonProps, getLabelProps, getMenuProps, getItemProps } =
    useSelect({
      items: books,
      itemToString,
      isOpen,
      onIsOpenChange: ({ isOpen }) => {
        setIsOpen(isOpen);
      },
      highlightedIndex,
      onHighlightedIndexChange: ({ highlightedIndex }) => {
        setHighlightedIndex(highlightedIndex);
      },
      selectedItem,
      onSelectedItemChange: ({ selectedItem }) => {
        setSelectedItem(selectedItem);
      },
    });

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 my-4">
        <button onClick={() => setIsOpen(!isOpen)}>Toggle open</button>

        <button onClick={() => setHighlightedIndex(highlightedIndex - 1)}>
          Highlight previous item
        </button>

        <button onClick={() => setHighlightedIndex(highlightedIndex + 1)}>
          Highlight next item
        </button>

        <button
          onClick={() =>
            setSelectedItem(books[books.indexOf(selectedItem!) - 1])
          }
        >
          Select previous item
        </button>

        <button
          onClick={() =>
            setSelectedItem(books[books.indexOf(selectedItem!) + 1])
          }
        >
          Select next item
        </button>

        <button onClick={() => setSelectedItem(null)}>
          Clear selected item
        </button>
      </div>

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
