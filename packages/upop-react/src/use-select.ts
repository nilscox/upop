import {
  SelectAction,
  SelectState,
  createSelectReducer,
  getItemAttributes,
  getLabelAttributes,
  getMenuAttributes,
  getToggleButtonAttributes,
  handleSelectSideEffects,
  highlightedIndexChanged,
  isOpenChanged,
  itemClick,
  itemMouseMove,
  menuMouseLeave,
  selectInitialState,
  selectedItemChanged,
  toggleButtonBlur,
  toggleButtonClick,
  toggleButtonKeyDown,
} from '@upop/core';
import { useCallback, useState } from 'react';

import { useControlProp } from './use-control-prop';
import { useId } from './use-id';
import { useRefs } from './use-refs';

type SelectProps<Item> = {
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

export function useSelect<Item>(props: SelectProps<Item>) {
  const { items, isOpen, selectedItem, highlightedIndex } = props;

  const id = useId(props.id);
  const [itemElements, captureItemElement] = useRefs<Item>();

  const reducer = useCallback(createSelectReducer(items), [items]);

  const [state, setState] = useState(selectInitialState<Item>(props));

  const dispatch = (action: SelectAction) => {
    const prevState = state;
    const nextState = reducer(state, action);

    setState(nextState);

    handleSelectSideEffects(prevState, nextState, action, {
      items,
      itemElements,
      onIsOpenChange: props.onIsOpenChange,
      onSelectedItemChange: props.onSelectedItemChange,
      onHighlightedIndexChange: props.onHighlightedIndexChange,
    });
  };

  useControlProp(isOpen, (value) => {
    dispatch(isOpenChanged(value));
  });

  useControlProp(selectedItem, (value) => {
    dispatch(selectedItemChanged(value));
  });

  useControlProp(highlightedIndex, (value) => {
    dispatch(highlightedIndexChanged(value));
  });

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
      onMouseLeave: () => dispatch(menuMouseLeave()),
    };
  }, [id, dispatch]);

  const getItemProps = useCallback(
    ({ item, index }: { item: Item; index: number }) => {
      return {
        ...getItemAttributes(id, index, items, state),
        ref: captureItemElement.bind(null, item),
        onClick: () => dispatch(itemClick(index)),
        onMouseMove: () => dispatch(itemMouseMove(index)),
      };
    },
    [id, state, dispatch],
  );

  return {
    ...state,
    getLabelProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  };
}
