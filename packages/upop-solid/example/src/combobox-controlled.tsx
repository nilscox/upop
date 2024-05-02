import { createCombobox } from '@upop/solid';
import { createStore, unwrap } from 'solid-js/store';

import { Book, books, getBooksFilter, itemToString } from './books';
import { createSignal } from 'solid-js';

export function ComboboxControlled() {
  const [items, setItems] = createStore(books.slice());
  const [isOpen, setIsOpen] = createSignal(false);
  const [selectedItem, setSelectedItem] = createSignal<Book | null>(null);
  const [highlightedIndex, setHighlightedIndex] = createSignal(-1);
  const [inputValue, setInputValue] = createSignal('');

  const combobox = createCombobox({
    items: () => items,
    itemToString,
    isOpen,
    onIsOpenChange: ({ isOpen }) => {
      setIsOpen(isOpen);
    },
    selectedItem,
    onSelectedItemChange: ({ selectedItem }) => {
      setSelectedItem(selectedItem);
    },
    highlightedIndex,
    onHighlightedIndexChange: ({ highlightedIndex }) => {
      setHighlightedIndex(highlightedIndex);
    },
    inputValue,
    onInputValueChange({ inputValue }) {
      setInputValue(inputValue);
      setItems(books.filter(getBooksFilter(inputValue)));
    },
  });

  return (
    <div>
      <div class="flex flex-col lg:flex-row gap-4 my-4">
        <button class="btn" onClick={() => setIsOpen(!isOpen())}>
          Toggle open
        </button>

        <button
          class="btn"
          onClick={() => setHighlightedIndex(highlightedIndex() - 1)}
        >
          Highlight previous item
        </button>

        <button
          class="btn"
          onClick={() => setHighlightedIndex(highlightedIndex() + 1)}
        >
          Highlight next item
        </button>

        <button
          class="btn"
          onClick={() =>
            setSelectedItem(books[books.indexOf(unwrap(selectedItem()!)) - 1])
          }
        >
          Select previous item
        </button>

        <button
          class="btn"
          onClick={() =>
            setSelectedItem(books[books.indexOf(unwrap(selectedItem()!)) + 1])
          }
        >
          Select next item
        </button>

        <button class="btn" onClick={() => setSelectedItem(null)}>
          Clear selected item
        </button>

        <input
          class="input"
          placeholder="input value"
          value={inputValue()}
          onInput={(event) => setInputValue(event.target.value)}
        />
      </div>

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
    </div>
  );
}
