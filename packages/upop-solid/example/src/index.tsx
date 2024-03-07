/* @refresh reload */
import { render } from 'solid-js/web';

import { Select } from './select';

import './main.css';

const root = document.getElementById('root');

render(() => <Select />, root!);
