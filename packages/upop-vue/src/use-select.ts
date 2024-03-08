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
import { Ref, computed, shallowRef, toValue, watch } from 'vue';

import { useId } from './use-id';

type SelectOptions<Item> = {
  items: Item[];
  id?: string;
  itemToString?: (item: Item | null) => string;
  isOpen?: Ref<boolean>;
  onIsOpenChange?: (state: SelectState<Item>) => void;
  selectedItem?: Ref<Item | null>;
  onSelectedItemChange?: (state: SelectState<Item>) => void;
  highlightedIndex?: Ref<number>;
  onHighlightedIndexChange?: (state: SelectState<Item>) => void;
};

export type UseSelect = typeof useSelect;

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

  const state = shallowRef(
    selectInitialState<Item>({
      isOpen: isOpen?.value,
      selectedItem: selectedItem?.value,
      highlightedIndex: highlightedIndex?.value,
    }),
  );

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

  if (isOpen !== undefined) {
    watch(isOpen, () => {
      dispatch(isOpenChanged(toValue(isOpen)));
    });
  }

  if (selectedItem !== undefined) {
    watch(selectedItem, () => {
      dispatch(selectedItemChanged(toValue(selectedItem)));
    });
  }

  if (highlightedIndex !== undefined) {
    watch(highlightedIndex, () => {
      dispatch(highlightedIndexChanged(toValue(highlightedIndex)));
    });
  }

  watch(state, () => {
    onIsOpenChange?.(toValue(state));
    onSelectedItemChange?.(toValue(state));
    onHighlightedIndexChange?.(toValue(state));
  });

  return computed(() => ({
    ...toValue(state),
    getLabelProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  }));
}
