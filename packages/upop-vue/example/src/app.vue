<script setup lang="ts">
import Select from './select.vue';
import SelectControlled from './select-controlled.vue';
</script>

<template>
  <div className="flex flex-col gap-8">
    <section>
      <header>Basic select</header>
      <Select />
    </section>
    <section>
      <header>Controlled</header>
      <SelectControlled />
    </section>
  </div>
</template>
