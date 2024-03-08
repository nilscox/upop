import React from 'react';
import ReactDOM from 'react-dom/client';

import { Select } from './select.tsx';
import { SelectControlled } from './select-controlled.tsx';

import './main.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
  </React.StrictMode>,
);
