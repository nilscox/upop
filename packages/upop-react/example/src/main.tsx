import React from 'react';
import ReactDOM from 'react-dom/client';

import { Select } from './select.tsx';

import './main.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Select />
  </React.StrictMode>,
);
