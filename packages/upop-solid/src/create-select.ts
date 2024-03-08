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
import { createUniqueId, mergeProps } from 'solid-js';
import { createStore } from 'solid-js/store';

type SelectOptions<Item> = {
  items: Item[];
  id?: string;
  itemToString?: (item: Item | null) => string;
};

export type CreateSelect = typeof createSelect;

export function createSelect<Item>(options: SelectOptions<Item>) {
  const { items } = options;
  const id = options.id ?? createUniqueId();

  const reducer = createSelectReducer(items);
  const [state, setState] = createStore(selectInitialState<Item>());

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

  return mergeProps(state, {
    getLabelProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  });
}
