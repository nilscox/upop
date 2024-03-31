import { createSelect } from '@upop/solid';
import { unwrap } from 'solid-js/store';

import { books, itemToString } from './books';

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
