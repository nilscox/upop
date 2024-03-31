<script setup lang="ts">
import { useCombobox } from '@upop/vue';
import { ref, toRaw } from 'vue';

import { books, itemToString, getBooksFilter, Book } from './books';

const items = ref(books);
const isOpen = ref(false);
const selectedItem = ref<Book | null>(null);
const highlightedIndex = ref(-1);
const inputValue = ref('');

const combobox = useCombobox({
  items: books,
  itemToString,
  isOpen,
  onIsOpenChange(state) {
    isOpen.value = state.isOpen;
  },
  selectedItem,
  onSelectedItemChange(state) {
    selectedItem.value = state.selectedItem;
  },
  highlightedIndex,
  onHighlightedIndexChange(state) {
    highlightedIndex.value = state.highlightedIndex;
  },
  inputValue,
  onInputValueChange(state) {
    inputValue.value = state.inputValue;
    items.value = books.filter(getBooksFilter(state.inputValue));
  },
});
</script>

<template>
  <div>
    <div className="flex flex-col lg:flex-row gap-4 my-4">
      <button class="btn" @click="isOpen = !isOpen">Toggle open</button>

      <button class="btn" @click="highlightedIndex -= 1">
        Highlight previous item
      </button>

      <button class="btn" @click="highlightedIndex += 1">
        Highlight next item
      </button>

      <button
        class="btn"
        @click="selectedItem = books[books.indexOf(toRaw(selectedItem)!) - 1]"
      >
        Select previous item
      </button>

      <button
        class="btn"
        @click="selectedItem = books[books.indexOf(toRaw(selectedItem)!) + 1]"
      >
        Select next item
      </button>

      <button class="btn" @click="selectedItem = null">
        Clear selected item
      </button>

      <input class="input" placeholder="input value" v-model="inputValue" />
    </div>

    <div>
      <div class="w-72 flex flex-col gap-1">
        <label class="w-fit" v-bind="combobox.getLabelProps()">
          Choose your favorite book:
        </label>
        <div class="flex shadow-sm bg-white gap-0.5">
          <input
            placeholder="Best book ever"
            class="w-full p-1.5"
            v-bind="combobox.getInputProps()"
          />
          <button
            aria-label="toggle menu"
            class="px-2"
            type="button"
            v-bind="combobox.getToggleButtonProps()"
          >
            {{ combobox.isOpen ? '&#8593;' : '&#8595;' }}
          </button>
        </div>
      </div>
      <ul
        :class="[
          'absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10',
          { hidden: !(combobox.isOpen && items.length) },
        ]"
        v-bind="combobox.getMenuProps()"
      >
        <li
          v-if="combobox.isOpen"
          v-for="(item, index) in items"
          v-bind="combobox.getItemProps({ item, index })"
          :class="[
            'py-2 px-3 shadow-sm flex flex-col',
            {
              'bg-blue-300': combobox.highlightedIndex === index,
              'font-bold': combobox.selectedItem === item,
            },
          ]"
        >
          <span>{{ item.title }}</span>
          <span class="text-sm text-gray-700">{{ item.author }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
