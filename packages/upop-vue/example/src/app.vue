<script setup lang="ts">
import Combobox from './combobox.vue';
import ComboboxControlled from './combobox-controlled.vue';
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
      <header>Controlled select</header>
      <SelectControlled />
    </section>

    <section>
      <header>Basic combobox</header>
      <Combobox />
    </section>

    <section>
      <header>Controlled combobox</header>
      <ComboboxControlled />
    </section>
  </div>
</template>
