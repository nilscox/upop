import {
  SelectDispatch,
  SelectGetters,
  SelectState,
  createSelectGetters,
  createSelectReducer,
  selectInitialState,
} from '@upop/core';
import { createUniqueId, mergeProps } from 'solid-js';
import { createStore } from 'solid-js/store';

type SelectOptions<Item> = {
  items: Item[];
  id?: string;
  itemToString?: (item: Item | null) => string;
};

type SelectResult<Item> = SelectState<Item> & SelectGetters<Item>;

export type CreateSelect = typeof createSelect;

export function createSelect<Item>(
  options: SelectOptions<Item>,
): SelectResult<Item> {
  const { items } = options;
  const id = options.id ?? createUniqueId();

  const reducer = createSelectReducer(items);
  const [state, setState] = createStore(selectInitialState<Item>());

  const dispatch: SelectDispatch = (action) => {
    setState(reducer(state, action));
  };

  const getters = createSelectGetters(id, items, state, dispatch);

  return mergeProps(state, getters);
}
