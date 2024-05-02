import { useCombobox } from '@upop/react';
import cx from 'classnames';
import { useState } from 'react';

import { books, getBooksFilter, itemToString } from './books';

export function ComboBox() {
  const [items, setItems] = useState(books);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    getInputProps,
    selectedItem,
  } = useCombobox({
    items,
    itemToString,
    onInputValueChange({ inputValue }) {
      setItems(books.filter(getBooksFilter(inputValue)));
    },
  });

  return (
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
        className={cx(
          `absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10`,
          { hidden: !(isOpen && items.length) },
        )}
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
  );
}
