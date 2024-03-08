import {
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
import { useCallback, useReducer } from 'react';

import { useId } from './use-id';
import { useUpdateEffect } from './use-update-effect';

type SelectOptions<Item> = {
  items: Item[];
  id?: string;
  itemToString?: (item: Item | null) => string;
  isOpen?: boolean;
  onIsOpenChange?: (state: SelectState<Item>) => void;
  selectedItem?: Item | null;
  onSelectedItemChange?: (state: SelectState<Item>) => void;
  highlightedIndex?: number;
  onHighlightedIndexChange?: (state: SelectState<Item>) => void;
};

export type UseSelect<Item> = typeof useSelect<Item>;

export function useSelect<Item>(options: SelectOptions<Item>) {
  const {
    items,
    isOpen,
    onIsOpenChange,
    selectedItem,
    onSelectedItemChange,
    highlightedIndex,
    onHighlightedIndexChange,
  } = options;

  const id = useId(options.id);

  const reducer = useCallback(createSelectReducer(items), [items]);

  const [state, dispatch] = useReducer(
    reducer,
    selectInitialState<Item>(options),
  );

  const getLabelProps = useCallback(() => {
    return getLabelAttributes(id);
  }, [id]);

  const getToggleButtonProps = useCallback(() => {
    return {
      ...getToggleButtonAttributes(id, state),
      onClick: () => dispatch(toggleButtonClick()),
      onKeyDown: ({ key }: React.KeyboardEvent) =>
        dispatch(toggleButtonKeyDown(key)),
      onBlur: () => dispatch(toggleButtonBlur()),
    };
  }, [id, state, dispatch]);

  const getMenuProps = useCallback(() => {
    return {
      ...getMenuAttributes(id),
      onMouseOut: () => dispatch(menuMouseOut()),
    };
  }, [id, dispatch]);

  const getItemProps = useCallback(
    ({ index }: { item: Item; index: number }) => {
      return {
        ...getItemAttributes(id, index, items, state),
        onClick: () => dispatch(itemClick(index)),
        onMouseMove: () => dispatch(itemMouseMove(index)),
      };
    },
    [id, state, dispatch],
  );

  useUpdateEffect(() => {
    if (isOpen !== undefined) {
      dispatch(isOpenChanged(isOpen));
    }
  }, [isOpen]);

  useUpdateEffect(() => {
    onIsOpenChange?.(state);
  }, [state.isOpen]);

  useUpdateEffect(() => {
    if (selectedItem !== undefined) {
      dispatch(selectedItemChanged(selectedItem));
    }
  }, [selectedItem]);

  useUpdateEffect(() => {
    onSelectedItemChange?.(state);
  }, [state.selectedItem]);

  useUpdateEffect(() => {
    if (highlightedIndex !== undefined) {
      dispatch(highlightedIndexChanged(highlightedIndex));
    }
  }, [highlightedIndex]);

  useUpdateEffect(() => {
    onHighlightedIndexChange?.(state);
  }, [state.highlightedIndex]);

  return {
    ...state,
    getLabelProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  };
}
