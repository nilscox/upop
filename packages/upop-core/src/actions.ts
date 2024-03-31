import { createAction } from './create-action';

export const isOpenChanged = createAction(
  'is-open-changed',
  (isOpen: boolean) => ({ isOpen }),
);

export const selectedItemChanged = createAction(
  'selected-item-changed',
  <Item>(item: Item | null) => ({ item }),
);

export const highlightedIndexChanged = createAction(
  'highlighted-index-changed',
  (index: number) => ({ index }),
);

export const toggleButtonClick = createAction('toggle-button-click');

export const toggleButtonKeyDown = createAction(
  'toggle-button-key-down',
  (key: string) => ({ key }),
);

export const toggleButtonBlur = createAction('toggle-button-blur');

export const menuMouseLeave = createAction('menu-mouse-leave');

export const itemClick = createAction('item-click', (index: number) => ({
  index,
}));

export const itemMouseMove = createAction(
  'item-mouse-move',
  (index: number) => ({
    index,
  }),
);

export const inputClick = createAction('input-click');

export const inputBlur = createAction('input-blur');

export const inputKeyDown = createAction('input-key-down', (key: string) => ({
  key,
}));

export const inputValueChanged = createAction(
  'input-value-changed',
  (inputValue: string) => ({ inputValue }),
);
