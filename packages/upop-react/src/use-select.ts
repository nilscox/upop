import {
  createSelectReducer,
  getItemAttributes,
  getLabelAttributes,
  getMenuAttributes,
  getToggleButtonAttributes,
  itemClick,
  itemMouseMove,
  menuMouseOut,
  selectInitialState,
  toggleButtonBlur,
  toggleButtonClick,
  toggleButtonKeyDown,
} from '@upop/core';
import { useCallback, useReducer } from 'react';

import { useId } from './use-id';

type SelectOptions<Item> = {
  items: Item[];
  id?: string;
  itemToString?: (item: Item | null) => string;
};

export type UseSelect = typeof useSelect;

export function useSelect<Item>(options: SelectOptions<Item>) {
  const { items } = options;
  const id = useId(options.id);

  const reducer = useCallback(createSelectReducer(items), [items]);
  const [state, dispatch] = useReducer(reducer, selectInitialState<Item>());

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

  return {
    ...state,
    getLabelProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  };
}
