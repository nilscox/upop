/* @refresh reload */
import { render } from 'solid-js/web';

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
        <header>Controlled</header>
        <SelectControlled />
      </section>
    </div>
  ),
  root!,
);
