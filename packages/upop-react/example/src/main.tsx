import React from 'react';
import ReactDOM from 'react-dom/client';

import { ComboBox } from './combobox';
import { ComboboxControlled } from './combobox-controlled';
import { Select } from './select';
import { SelectControlled } from './select-controlled';

import './main.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
        <ComboBox />
      </section>

      <section>
        <header>Controlled combobox</header>
        <ComboboxControlled />
      </section>
    </div>
  </React.StrictMode>,
);
