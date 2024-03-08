<script setup lang="ts">
import { useSelect } from '@upop/vue';

type Book = { id: string; author: string; title: string };

const books: Book[] = [
  { id: 'book-1', author: 'Harper Lee', title: 'To Kill a Mockingbird' },
  { id: 'book-2', author: 'Lev Tolstoy', title: 'War and Peace' },
  { id: 'book-3', author: 'Fyodor Dostoyevsy', title: 'The Idiot' },
  { id: 'book-4', author: 'Oscar Wilde', title: 'A Picture of Dorian Gray' },
  { id: 'book-5', author: 'George Orwell', title: '1984' },
  { id: 'book-6', author: 'Jane Austen', title: 'Pride and Prejudice' },
  { id: 'book-7', author: 'Marcus Aurelius', title: 'Meditations' },
  {
    id: 'book-8',
    author: 'Fyodor Dostoevsky',
    title: 'The Brothers Karamazov',
  },
  { id: 'book-9', author: 'Lev Tolstoy', title: 'Anna Karenina' },
  { id: 'book-10', author: 'Fyodor Dostoevsky', title: 'Crime and Punishment' },
];

function itemToString(item: Book | null) {
  return item ? item.title : '';
}

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
