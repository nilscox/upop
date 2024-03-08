import cx from 'classnames';
import { useSelect } from '@upop/react';

import { books, itemToString } from './books';

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
