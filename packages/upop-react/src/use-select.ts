import {
  SelectGetters,
  SelectState,
  createSelectGetters,
  createSelectReducer,
  selectInitialState,
} from '@upop/core';
import { useCallback, useMemo, useReducer } from 'react';

import { useId } from './use-id';

type SelectOptions<Item> = {
  items: Item[];
  id?: string;
  itemToString?: (item: Item | null) => string;
};

type SelectResult<Item> = SelectState<Item> & SelectGetters<Item>;

export type UseSelect = typeof useSelect;

export function useSelect<Item>(
  options: SelectOptions<Item>,
): SelectResult<Item> {
  const { items } = options;
  const id = useId(options.id);

  const reducer = useCallback(createSelectReducer(items), [items]);
  const [state, dispatch] = useReducer(reducer, selectInitialState<Item>());

  const getters = useMemo(
    () => createSelectGetters(id, items, state, dispatch),
    [id, items, state, dispatch],
  );

  return {
    ...state,
    ...getters,
  };
}
