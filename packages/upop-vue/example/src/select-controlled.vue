<script setup lang="ts">
import { useSelect } from '@upop/vue';
import { ref, toRaw } from 'vue';

import { Book, books, itemToString } from './books';

const isOpen = ref(false);
const selectedItem = ref<Book | null>(null);
const highlightedIndex = ref(-1);

const select = useSelect({
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
});
</script>

<template>
  <div>
    <div className="flex flex-col lg:flex-row gap-4 my-4">
      <button @click="isOpen = !isOpen">Toggle open</button>

      <button @click="highlightedIndex -= 1">Highlight previous item</button>

      <button @click="highlightedIndex += 1">Highlight next item</button>

      <button
        @click="selectedItem = books[books.indexOf(toRaw(selectedItem)!) - 1]"
      >
        Select previous item
      </button>

      <button
        @click="selectedItem = books[books.indexOf(toRaw(selectedItem)!) + 1]"
      >
        Select next item
      </button>

      <button @click="selectedItem = null">Clear selected item</button>
    </div>

    <div class="w-72 flex flex-col gap-1">
      <label v-bind="select.getLabelProps()">Choose your favorite book:</label>
      <div
        class="p-2 bg-white flex justify-between cursor-pointer"
        v-bind="select.getToggleButtonProps()"
      >
        <span>{{
          select.selectedItem ? select.selectedItem.title : 'Best book ever'
        }}</span>
        <span class="px-2">{{ select.isOpen ? '&#8593;' : '&#8595;' }}</span>
      </div>
    </div>
    <ul
      :class="[
        'absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10',
        { hidden: !select.isOpen },
      ]"
      v-bind="select.getMenuProps()"
    >
      <li
        v-if="select.isOpen"
        v-for="(item, index) in books"
        v-bind="select.getItemProps({ item, index })"
        :class="[
          'py-2 px-3 shadow-sm flex flex-col',
          {
            'bg-blue-300': select.highlightedIndex === index,
            'font-bold': toRaw(select.selectedItem) === item,
          },
        ]"
      >
        <span>{{ item.title }}</span>
        <span class="text-sm text-gray-700">{{ item.author }}</span>
      </li>
    </ul>
  </div>
</template>
