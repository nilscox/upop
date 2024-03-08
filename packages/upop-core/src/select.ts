import { createAction } from './create-action';

export type SelectState<Item> = {
  isOpen: boolean;
  highlightedIndex: number;
  selectedItem: Item | null;
};

type SelectAction = ReturnType<
  | typeof toggleButtonClick
  | typeof toggleButtonKeyDown
  | typeof toggleButtonBlur
  | typeof menuMouseOut
  | typeof itemClick
  | typeof itemMouseMove
>;

export type SelectDispatch = (action: SelectAction) => void;

export function selectInitialState<Item>(): SelectState<Item> {
  return {
    isOpen: false,
    highlightedIndex: -1,
    selectedItem: null,
  };
}

export function createSelectReducer<Item>(items: Item[]) {
  return function (
    state: SelectState<Item>,
    action: SelectAction,
  ): SelectState<Item> {
    const { isOpen, highlightedIndex, selectedItem } = state;
    const next = { ...state };

    if (action.type === 'toggle-button-click') {
      next.isOpen = !isOpen;
    }

    if (action.type === 'toggle-button-key-down') {
      if (['Enter', ' '].includes(action.key)) {
        next.isOpen = !isOpen;

        if (highlightedIndex !== -1) {
          next.selectedItem = items[highlightedIndex] ?? null;
        }
      }

      if (['ArrowUp', 'ArrowDown'].includes(action.key)) {
        next.isOpen = true;
      }

      if (action.key === 'ArrowDown' && highlightedIndex < items.length - 1) {
        next.highlightedIndex += 1;
      }

      if (action.key === 'ArrowUp') {
        if (highlightedIndex === -1) {
          next.highlightedIndex = items.length - 1;
        } else if (highlightedIndex > 0) {
          next.highlightedIndex -= 1;
        }
      }

      if (action.key === 'Escape') {
        next.isOpen = false;
      }
    }

    if (action.type === 'toggle-button-blur') {
      next.isOpen = false;
      next.selectedItem = items[highlightedIndex] ?? selectedItem;
    }

    if (action.type === 'menu-mouse-out') {
      next.highlightedIndex = -1;
    }

    if (action.type === 'item-mouse-move') {
      next.highlightedIndex = action.index;
    }

    if (action.type === 'item-click' && action.index !== -1) {
      next.isOpen = false;
      next.selectedItem = items[action.index] ?? null;
    }

    if (!next.isOpen) {
      next.highlightedIndex = -1;
    }

    return next;
  };
}

export type LabelAttributes = {
  id: string;
  htmlFor: string;
};

export function getLabelAttributes(id: string): LabelAttributes {
  return {
    id: `${id}-label`,
    htmlFor: `${id}-toggle-button`,
  };
}

export type ToggleButtonAttributes = {
  role: 'combobox';
  tabIndex: 0;
  id: string;
  'aria-activedescendant': string;
  'aria-controls': string;
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  'aria-labelledby': string;
};

export function getToggleButtonAttributes<Item>(
  id: string,
  state: SelectState<Item>,
): ToggleButtonAttributes {
  const { isOpen, highlightedIndex } = state;

  return {
    role: 'combobox',
    tabIndex: 0,
    id: `${id}-toggle-button`,
    'aria-activedescendant':
      highlightedIndex >= 0 ? `${id}-item-${highlightedIndex}` : '',
    'aria-controls': `${id}-menu`,
    'aria-expanded': isOpen,
    'aria-haspopup': 'listbox',
    'aria-labelledby': `${id}-label`,
  };
}

export const toggleButtonClick = createAction('toggle-button-click');

export const toggleButtonKeyDown = createAction(
  'toggle-button-key-down',
  (key: string) => ({ key }),
);

export const toggleButtonBlur = createAction('toggle-button-blur');

export type MenuAttributes = {
  id: string;
  role: 'listbox';
  'aria-labelledby': string;
};

export function getMenuAttributes(id: string): MenuAttributes {
  return {
    id: `${id}-menu`,
    role: 'listbox',
    'aria-labelledby': `${id}-label`,
  };
}

export const menuMouseOut = createAction('menu-mouse-out');

export type ItemAttributes = {
  id: string;
  role: 'option';
  'aria-disabled': boolean;
  'aria-selected': boolean;
};

export function getItemAttributes<Item>(
  id: string,
  index: number,
  items: Item[],
  state: SelectState<Item>,
): ItemAttributes {
  return {
    id: `${id}-item-${index}`,
    role: 'option',
    'aria-disabled': false,
    'aria-selected': index === items.indexOf(state.selectedItem as Item),
  };
}

export const itemClick = createAction('item-click', (index: number) => ({
  index,
}));

export const itemMouseMove = createAction(
  'item-mouse-move',
  (index: number) => ({
    index,
  }),
);
