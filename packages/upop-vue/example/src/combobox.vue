<script setup lang="ts">
import { useCombobox } from '@upop/vue';
import { ref } from 'vue';

import { books, itemToString, getBooksFilter } from './books';

const items = ref(books);

const combobox = useCombobox({
  items: books,
  itemToString,
  onInputValueChange(state) {
    items.value = books.filter(getBooksFilter(state.inputValue));
  },
});
</script>

<template>
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
</template>
