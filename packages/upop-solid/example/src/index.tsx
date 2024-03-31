/* @refresh reload */
import { render } from 'solid-js/web';

import { Combobox } from './combobox';
import { ComboboxControlled } from './combobox-controlled';
import { Select } from './select';
import { SelectControlled } from './select-controlled';

import './main.css';

const root = document.getElementById('root');

render(
  () => (
    <div class="flex flex-col gap-8">
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
  ),
  root!,
);
