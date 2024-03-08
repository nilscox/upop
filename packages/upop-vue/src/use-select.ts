import {
  SelectDispatch,
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
import { computed, shallowRef } from 'vue';

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

  const state = shallowRef(selectInitialState<Item>());
  const reducer = createSelectReducer(items);

  const dispatch: SelectDispatch = (action) => {
    state.value = reducer(state.value, action);
  };

  const getLabelProps = () => {
    return getLabelAttributes(id);
  };

  const getToggleButtonProps = () => {
    return {
      ...getToggleButtonAttributes(id, state.value),
      onClick: () => dispatch(toggleButtonClick()),
      onKeydown: ({ key }: KeyboardEvent) => dispatch(toggleButtonKeyDown(key)),
      onBlur: () => dispatch(toggleButtonBlur()),
    };
  };

  const getMenuProps = () => {
    return {
      ...getMenuAttributes(id),
      onMouseout: () => dispatch(menuMouseOut()),
    };
  };

  const getItemProps = ({ index }: { item: Item; index: number }) => {
    return {
      ...getItemAttributes(id, index, items, state.value),
      onClick: () => dispatch(itemClick(index)),
      onMousemove: () => dispatch(itemMouseMove(index)),
    };
  };

  return computed(() => ({
    ...state.value,
    getLabelProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  }));
}
