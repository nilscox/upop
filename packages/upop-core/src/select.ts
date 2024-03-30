import { createAction } from './create-action';
import { removeUndefined } from './remove-undefined';

export type SelectState<Item> = {
  isOpen: boolean;
  highlightedIndex: number;
  selectedItem: Item | null;
};

export type SelectAction = ReturnType<
  | typeof isOpenChanged
  | typeof selectedItemChanged
  | typeof highlightedIndexChanged
  | typeof toggleButtonClick
  | typeof toggleButtonKeyDown
  | typeof toggleButtonBlur
  | typeof menuMouseLeave
  | typeof itemClick
  | typeof itemMouseMove
>;

export type SelectDispatch = (action: SelectAction) => void;

export function selectInitialState<Item>(
  state: Partial<SelectState<Item>>,
): SelectState<Item> {
  return {
    isOpen: false,
    highlightedIndex: -1,
    selectedItem: null,
    ...removeUndefined(state),
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

    if (action.type === 'is-open-changed') {
      next.isOpen = action.isOpen;
    }

    if (action.type === 'selected-item-changed') {
      next.selectedItem = action.item as Item | null;
    }

    if (action.type === 'highlighted-index-changed') {
      next.highlightedIndex = action.index;
    }

    return next;
  };
}

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

export const menuMouseLeave = createAction('menu-mouse-leave');

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

type SelectSideEffectProps<Item> = {
  items: Item[];
  itemElements: Map<Item, HTMLElement>;
  onIsOpenChange?: (state: SelectState<Item>) => void;
  onSelectedItemChange?: (state: SelectState<Item>) => void;
  onHighlightedIndexChange?: (state: SelectState<Item>) => void;
};

export function handleSelectSideEffects<Item>(
  prevState: SelectState<Item>,
  state: SelectState<Item>,
  action: SelectAction,
  props: SelectSideEffectProps<Item>,
) {
  if (prevState.isOpen !== state.isOpen) {
    props.onIsOpenChange?.(state);
  }

  if (prevState.selectedItem !== state.selectedItem) {
    props.onSelectedItemChange?.(state);
  }

  if (prevState.highlightedIndex !== state.highlightedIndex) {
    props.onHighlightedIndexChange?.(state);
  }

  if (
    action.type === 'toggle-button-key-down' &&
    prevState.highlightedIndex !== state.highlightedIndex
  ) {
    const item = props.items[state.highlightedIndex];
    const element = props.itemElements.get(item as Item);

    if (element) {
      element.scrollIntoView({ block: 'nearest' });
    }
  }
}
