<script setup lang="ts">
import { useSelect } from '@upop/vue';

import { books, itemToString } from './books';

const select = useSelect({
  items: books,
  itemToString,
});
</script>

<template>
  <div>
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
            'font-bold': select.selectedItem === item,
          },
        ]"
      >
        <span>{{ item.title }}</span>
        <span class="text-sm text-gray-700">{{ item.author }}</span>
      </li>
    </ul>
  </div>
</template>
