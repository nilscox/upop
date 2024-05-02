import {
  controlPropInputValueChanged,
  inputBlur,
  inputClick,
  inputKeyDown,
  inputValueChanged,
  controlPropIsOpenChanged,
  itemClick,
  itemMouseMove,
  menuMouseLeave,
  controlPropSelectedItemChanged,
  toggleButtonClick,
  controlPropHighlightedIndexChanged,
} from './actions';

export type ComboboxState<Item> = {
  isOpen: boolean;
  highlightedIndex: number;
  selectedItem: Item | null;
  inputValue: string;
};

export type ComboboxAction = ReturnType<
  | typeof controlPropIsOpenChanged
  | typeof controlPropSelectedItemChanged
  | typeof controlPropHighlightedIndexChanged
  | typeof controlPropInputValueChanged
  | typeof toggleButtonClick
  | typeof menuMouseLeave
  | typeof itemClick
  | typeof itemMouseMove
  | typeof inputClick
  | typeof inputBlur
  | typeof inputKeyDown
  | typeof inputValueChanged
>;

export type ComboboxDispatch = (action: ComboboxAction) => void;

export function comboboxInitialState<Item>(
  state: Partial<ComboboxState<Item>>,
  itemToString: (item: Item | null) => string,
): ComboboxState<Item> {
  return {
    isOpen: state.isOpen ?? false,
    highlightedIndex: state.highlightedIndex ?? -1,
    selectedItem: state.selectedItem ?? null,
    inputValue: state.inputValue ?? itemToString(state.selectedItem ?? null),
  };
}

export function comboboxReducer<Item>(
  items: Item[],
  itemToString: (item: Item | null) => string,
  state: ComboboxState<Item>,
  action: ComboboxAction,
) {
  const { isOpen, highlightedIndex } = state;
  const next = { ...state };

  const selectItem = (item: Item | null) => {
    next.selectedItem = item;
    next.inputValue = itemToString(next.selectedItem);
  };

  const selectHighlightedItem = () => {
    if (highlightedIndex !== -1) {
      selectItem(items[highlightedIndex] ?? null);
    }
  };

  if (action.type === 'input-click') {
    next.isOpen = !isOpen;
  }

  if (action.type === 'input-key-down') {
    if (action.key === 'ArrowDown' || action.key === 'ArrowUp') {
      next.isOpen = true;
    }

    if (action.key === 'ArrowDown') {
      next.highlightedIndex += 1;
      next.highlightedIndex %= items.length;
    }

    if (action.key === 'ArrowUp') {
      next.highlightedIndex -= 1;

      if (next.highlightedIndex < 0) {
        next.highlightedIndex = items.length - 1;
      }
    }

    if (action.key === 'Enter' && next.isOpen) {
      action.preventDefault();
      next.isOpen = false;
      selectHighlightedItem();
    }

    if (action.key === 'Escape') {
      next.isOpen = false;
    }
  }

  if (action.type === 'input-value-changed') {
    next.isOpen = true;
    next.inputValue = action.inputValue;
  }

  if (action.type === 'input-blur') {
    next.isOpen = false;
    selectHighlightedItem();
  }

  if (action.type === 'toggle-button-click') {
    next.isOpen = !state.isOpen;
  }

  if (action.type === 'item-click') {
    selectItem(items[action.index] ?? null);
  }

  if (action.type === 'menu-mouse-leave') {
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

  if (action.type === 'control-prop-is-open-changed') {
    next.isOpen = action.isOpen;
  }

  if (action.type === 'control-prop-highlighted-index-changed') {
    next.highlightedIndex = action.index;
  }

  if (action.type === 'control-prop-selected-item-changed') {
    selectItem(action.item as Item | null);
  }

  if (action.type === 'control-prop-input-value-changed') {
    next.inputValue = action.inputValue;
  }

  return next;
}

export type ComboboxLabelAttributes = {
  id: string;
  htmlFor: string;
};

export function getComboboxLabelAttributes(
  id: string,
): ComboboxLabelAttributes {
  return {
    id: `${id}-label`,
    htmlFor: `${id}-input`,
  };
}

export type ComboboxInputAttributes = {
  id: string;
  role: 'combobox';
  autoComplete: 'off';
  value: string;
  'aria-activedescendant': string;
  'aria-autocomplete': 'list';
  'aria-controls': string;
  'aria-expanded': boolean;
  'aria-labelledby': string;
};

export function getComboboxInputAttributes<Item>(
  id: string,
  { isOpen, highlightedIndex, inputValue }: ComboboxState<Item>,
): ComboboxInputAttributes {
  return {
    id: `${id}-input`,
    role: 'combobox',
    autoComplete: 'off',
    value: inputValue,
    'aria-activedescendant':
      highlightedIndex >= 0 ? `${id}-item-${String(highlightedIndex)}` : '',
    'aria-autocomplete': 'list',
    'aria-controls': `${id}-menu`,
    'aria-expanded': isOpen,
    'aria-labelledby': `${id}-label`,
  };
}

export type ComboboxToggleButtonAttributes = {
  id: string;
  tabIndex: -1;
  'aria-controls': string;
  'aria-expanded': boolean;
};

export function getComboboxToggleButtonAttributes<Item>(
  id: string,
  { isOpen }: ComboboxState<Item>,
): ComboboxToggleButtonAttributes {
  return {
    id: `${id}-toggle-button`,
    tabIndex: -1,
    'aria-controls': `${id}-menu`,
    'aria-expanded': isOpen,
  };
}

export type ComboboxMenuAttributes = {
  id: string;
  role: 'listbox';
  'aria-labelledby': string;
};

export function getComboboxMenuAttributes(id: string): ComboboxMenuAttributes {
  return {
    id: `${id}-menu`,
    role: 'listbox',
    'aria-labelledby': `${id}-label`,
  };
}

export type ComboboxItemAttributes = {
  id: string;
  role: 'option';
  'aria-disabled': boolean;
  'aria-selected': boolean;
};

export function getComboboxItemAttributes<Item>(
  id: string,
  index: number,
  state: ComboboxState<Item>,
): ComboboxItemAttributes {
  return {
    id: `${id}-item-${String(index)}`,
    role: 'option',
    'aria-disabled': false,
    'aria-selected': index === state.highlightedIndex,
  };
}

type ComboboxSideEffectProps<Item> = {
  items: Item[];
  itemElements: Map<Item, HTMLElement>;
  onIsOpenChange?: (state: ComboboxState<Item>) => void;
  onSelectedItemChange?: (state: ComboboxState<Item>) => void;
  onHighlightedIndexChange?: (state: ComboboxState<Item>) => void;
  onInputValueChange?: (state: ComboboxState<Item>) => void;
};

export function handleComboboxSideEffects<Item>(
  prevState: ComboboxState<Item>,
  state: ComboboxState<Item>,
  action: ComboboxAction,
  props: ComboboxSideEffectProps<Item>,
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

  if (prevState.inputValue !== state.inputValue) {
    props.onInputValueChange?.(state);
  }

  if (
    action.type === 'input-key-down' &&
    prevState.highlightedIndex !== state.highlightedIndex
  ) {
    const item = props.items[state.highlightedIndex];
    const element = props.itemElements.get(item as Item);

    if (element) {
      element.scrollIntoView({ block: 'nearest' });
    }
  }
}
