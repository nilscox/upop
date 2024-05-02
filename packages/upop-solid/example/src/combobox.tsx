import { createCombobox } from '@upop/solid';
import { createStore } from 'solid-js/store';

import { books, getBooksFilter, itemToString } from './books';

export function Combobox() {
  const [items, setItems] = createStore(books.slice());

  const combobox = createCombobox({
    items: () => items,
    itemToString,
    onInputValueChange({ inputValue }) {
      setItems(books.filter(getBooksFilter(inputValue)));
    },
  });

  return (
    <div>
      <div class="w-72 flex flex-col gap-1">
        <label class="w-fit" {...combobox.getLabelProps()}>
          Choose your favorite book:
        </label>
        <div class="flex shadow-sm bg-white gap-0.5">
          <input
            placeholder="Best book ever"
            class="w-full p-1.5"
            {...combobox.getInputProps()}
          />
          <button
            aria-label="toggle menu"
            class="px-2"
            type="button"
            {...combobox.getToggleButtonProps()}
          >
            {combobox.isOpen ? <>&#8593;</> : <>&#8595;</>}
          </button>
        </div>
      </div>
      <ul
        class="absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10"
        classList={{ hidden: !(combobox.isOpen && items.length) }}
        {...combobox.getMenuProps()}
      >
        {combobox.isOpen &&
          items.map((item, index) => (
            <li
              class="py-2 px-3 shadow-sm flex flex-col"
              classList={{
                'bg-blue-300': combobox.highlightedIndex === index,
                'font-bold': combobox.selectedItem === item,
              }}
              {...combobox.getItemProps({ item, index })}
            >
              <span>{item.title}</span>
              <span class="text-sm text-gray-700">{item.author}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
