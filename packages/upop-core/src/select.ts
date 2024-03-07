export type SelectState<Item> = {
  isOpen: boolean;
  highlightedIndex: number;
  selectedItem: Item | null;
};

export type SelectGetters<Item> = {
  getLabelProps: GetLabelProps;
  getToggleButtonProps: GetToggleButtonProps;
  getMenuProps: GetMenuProps;
  getItemProps: GetItemProps<Item>;
};

type ToggleButtonClick = {
  type: 'toggle-button-click';
};

type ToggleButtonKeyDown = {
  type: 'toggle-button-key-down';
  key: string;
};

type ToggleButtonBlur = {
  type: 'toggle-button-blur';
};

type MenuMouseOut = {
  type: 'menu-mouse-out';
};

type ItemClick = {
  type: 'item-click';
  index: number;
};

type ItemMouseMove = {
  type: 'item-mouse-move';
  index: number;
};

type SelectAction =
  | ToggleButtonClick
  | ToggleButtonKeyDown
  | ToggleButtonBlur
  | MenuMouseOut
  | ItemClick
  | ItemMouseMove;

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

    if (next.isOpen === false) {
      next.highlightedIndex = -1;
    }

    return next;
  };
}

export function createSelectGetters<Item>(
  id: string,
  items: Item[],
  state: SelectState<Item>,
  dispatch: SelectDispatch,
): SelectGetters<Item> {
  return {
    getLabelProps: () => {
      return getLabelProps(id);
    },
    getToggleButtonProps: () => {
      return getToggleButtonProps(id, state, dispatch);
    },
    getMenuProps: () => {
      return getMenuProps(id, dispatch);
    },
    getItemProps: ({ index }) => {
      return getItemProps(id, index, items, state, dispatch);
    },
  };
}

export type GetLabelProps = () => LabelProps;

export type LabelProps = {
  id: string;
  htmlFor: string;
};

function getLabelProps(id: string): LabelProps {
  return {
    id: `${id}-label`,
    htmlFor: `${id}-toggle-button`,
  };
}

export type GetToggleButtonProps = () => ToggleButtonProps;

export type ToggleButtonProps = {
  role: 'combobox';
  tabIndex: 0;
  id: string;
  'aria-activedescendant': string;
  'aria-controls': string;
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  'aria-labelledby': string;
  onClick: () => void;
  onKeyDown: (event: { key: string }) => void;
  onBlur: () => void;
};

function getToggleButtonProps<Item>(
  id: string,
  state: SelectState<Item>,
  dispatch: SelectDispatch,
): ToggleButtonProps {
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
    onClick: () => {
      dispatch({ type: 'toggle-button-click' });
    },
    onKeyDown: ({ key }) => {
      dispatch({ type: 'toggle-button-key-down', key });
    },
    onBlur: () => {
      dispatch({ type: 'toggle-button-blur' });
    },
  };
}

export type GetMenuProps = () => MenuProps;

export type MenuProps = {
  id: string;
  role: 'listbox';
  'aria-labelledby': string;
  onMouseOut: () => void;
};

function getMenuProps(id: string, dispatch: SelectDispatch): MenuProps {
  return {
    id: `${id}-menu`,
    role: 'listbox',
    'aria-labelledby': `${id}-label`,
    onMouseOut: () => {
      dispatch({ type: 'menu-mouse-out' });
    },
  };
}

export type GetItemProps<Item> = (param: {
  item: Item;
  index: number;
}) => ItemProps;

export type ItemProps = {
  id: string;
  role: 'option';
  'aria-disabled': boolean;
  'aria-selected': boolean;
  onClick: () => void;
  onMouseMove: () => void;
};

function getItemProps<Item>(
  id: string,
  index: number,
  items: Item[],
  state: SelectState<Item>,
  dispatch: SelectDispatch,
): ItemProps {
  return {
    id: `${id}-item-${index}`,
    role: 'option',
    'aria-disabled': false,
    'aria-selected': index === items.indexOf(state.selectedItem as Item),
    onClick: () => {
      dispatch({ type: 'item-click', index });
    },
    onMouseMove: () => {
      dispatch({ type: 'item-mouse-move', index });
    },
  };
}
