import {
  SelectDispatch,
  SelectState,
  createSelectReducer,
  getItemAttributes,
  getLabelAttributes,
  getMenuAttributes,
  getToggleButtonAttributes,
  highlightedIndexChanged,
  isOpenChanged,
  itemClick,
  itemMouseMove,
  menuMouseOut,
  selectInitialState,
  selectedItemChanged,
  toggleButtonBlur,
  toggleButtonClick,
  toggleButtonKeyDown,
} from '@upop/core';
import { createEffect, createUniqueId, mergeProps, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

type SelectOptions<Item> = {
  items: Item[];
  id?: string;
  itemToString?: (item: Item | null) => string;
  isOpen?: () => boolean;
  onIsOpenChange?: (state: SelectState<Item>) => void;
  selectedItem?: () => Item | null;
  onSelectedItemChange?: (state: SelectState<Item>) => void;
  highlightedIndex?: () => number;
  onHighlightedIndexChange?: (state: SelectState<Item>) => void;
};

export type CreateSelect = typeof createSelect;

export function createSelect<Item>(options: SelectOptions<Item>) {
  const {
    items,
    isOpen,
    onIsOpenChange,
    highlightedIndex,
    onHighlightedIndexChange,
    selectedItem,
    onSelectedItemChange,
  } = options;

  const id = options.id ?? createUniqueId();

  const reducer = createSelectReducer(items);

  const [state, setState] = createStore(
    selectInitialState<Item>({
      isOpen: isOpen?.(),
      selectedItem: selectedItem?.(),
      highlightedIndex: highlightedIndex?.(),
    }),
  );

  const dispatch: SelectDispatch = (action) => {
    setState(reducer(state, action));
  };

  const getLabelProps = () => {
    return getLabelAttributes(id);
  };

  const getToggleButtonProps = () => {
    return {
      ...getToggleButtonAttributes(id, state),
      onClick: () => dispatch(toggleButtonClick()),
      onKeyDown: ({ key }: KeyboardEvent) => dispatch(toggleButtonKeyDown(key)),
      onBlur: () => dispatch(toggleButtonBlur()),
    };
  };

  const getMenuProps = () => {
    return {
      ...getMenuAttributes(id),
      onMouseOut: () => dispatch(menuMouseOut()),
    };
  };

  const getItemProps = ({ index }: { item: Item; index: number }) => {
    return {
      ...getItemAttributes(id, index, items, state),
      onClick: () => dispatch(itemClick(index)),
      onMouseMove: () => dispatch(itemMouseMove(index)),
    };
  };

  let isInitialMount = true;

  onMount(() => {
    isInitialMount = false;
  });

  createEffect(() => {
    const value = isOpen?.();

    if (value !== undefined && !isInitialMount) {
      dispatch(isOpenChanged(value));
    }
  });

  createEffect(() => {
    onIsOpenChange?.(state);
  });

  createEffect(() => {
    const value = selectedItem?.();

    if (value !== undefined && !isInitialMount) {
      dispatch(selectedItemChanged(value));
    }
  });

  createEffect(() => {
    onSelectedItemChange?.(state);
  });

  createEffect(() => {
    const value = highlightedIndex?.();

    if (value !== undefined && !isInitialMount) {
      dispatch(highlightedIndexChanged(value));
    }
  });

  createEffect(() => {
    onHighlightedIndexChange?.(state);
  });

  return mergeProps(state, {
    getLabelProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  });
}
