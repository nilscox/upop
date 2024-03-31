import { useCombobox } from '@upop/react';
import cx from 'classnames';
import { useState } from 'react';

import { Book, books, getBooksFilter, itemToString } from './books';

export function ComboboxControlled() {
  const [items, setItems] = useState(books);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedItem, setSelectedItem] = useState<Book | null>(null);
  const [inputValue, setInputValue] = useState('');

  const {
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
    getInputProps,
  } = useCombobox({
    items,
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
    inputValue,
    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue);
      setItems(books.filter(getBooksFilter(inputValue)));
    },
  });

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 my-4">
        <button className="btn" onClick={() => setIsOpen(!isOpen)}>
          Toggle open
        </button>

        <button
          className="btn"
          onClick={() => setHighlightedIndex(highlightedIndex - 1)}
        >
          Highlight previous item
        </button>

        <button
          className="btn"
          onClick={() => setHighlightedIndex(highlightedIndex + 1)}
        >
          Highlight next item
        </button>

        <button
          className="btn"
          onClick={() =>
            setSelectedItem(books[books.indexOf(selectedItem!) - 1])
          }
        >
          Select previous item
        </button>

        <button
          className="btn"
          onClick={() =>
            setSelectedItem(books[books.indexOf(selectedItem!) + 1])
          }
        >
          Select next item
        </button>

        <button className="btn" onClick={() => setSelectedItem(null)}>
          Clear selected item
        </button>

        <input
          className="input"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="input value"
        />
      </div>

      <div>
        <div className="w-72 flex flex-col gap-1">
          <label className="w-fit" {...getLabelProps()}>
            Choose your favorite book:
          </label>
          <div className="flex shadow-sm bg-white gap-0.5">
            <input
              placeholder="Best book ever"
              className="w-full p-1.5"
              {...getInputProps()}
            />
            <button
              aria-label="toggle menu"
              className="px-2"
              type="button"
              {...getToggleButtonProps()}
            >
              {isOpen ? <>&#8593;</> : <>&#8595;</>}
            </button>
          </div>
        </div>
        <ul
          className={`absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
            !(isOpen && items.length) && 'hidden'
          }`}
          {...getMenuProps()}
        >
          {isOpen &&
            items.map((item, index) => (
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
    </div>
  );
}
