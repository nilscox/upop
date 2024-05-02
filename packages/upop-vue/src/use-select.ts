import {
  SelectDispatch,
  SelectState,
  controlPropHighlightedIndexChanged,
  controlPropIsOpenChanged,
  controlPropSelectedItemChanged,
  getSelectItemAttributes,
  getSelectLabelAttributes,
  getSelectMenuAttributes,
  getSelectToggleButtonAttributes,
  handleSelectSideEffects,
  itemClick,
  itemMouseMove,
  menuMouseLeave,
  selectInitialState,
  selectReducer,
  toggleButtonBlur,
  toggleButtonClick,
  toggleButtonKeyDown,
} from '@upop/core';
import { Ref, computed, shallowRef, toValue } from 'vue';

import { useControlProp } from './use-control-prop';
import { useId } from './use-id';
import { useRefs } from './use-refs';

type SelectProps<Item> = {
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

export function useSelect<Item>(props: SelectProps<Item>) {
  const { items, isOpen, selectedItem, highlightedIndex } = props;

  const id = useId(props.id);
  const [itemElements, captureItemElement] = useRefs<Item>();

  const state = shallowRef(
    selectInitialState<Item>({
      isOpen: isOpen?.value,
      selectedItem: selectedItem?.value,
      highlightedIndex: highlightedIndex?.value,
    }),
  );

  const dispatch: SelectDispatch = (action) => {
    const prevState = state.value;
    const nextState = selectReducer(items, state.value, action);

    state.value = nextState;

    handleSelectSideEffects(prevState, nextState, action, {
      items,
      itemElements,
      onIsOpenChange: props.onIsOpenChange,
      onSelectedItemChange: props.onSelectedItemChange,
      onHighlightedIndexChange: props.onHighlightedIndexChange,
    });
  };

  useControlProp(isOpen, (value) => {
    dispatch(controlPropIsOpenChanged(value));
  });

  useControlProp(selectedItem, (value) => {
    dispatch(controlPropSelectedItemChanged(value));
  });

  useControlProp(highlightedIndex, (value) => {
    dispatch(controlPropHighlightedIndexChanged(value));
  });

  const getLabelProps = () => {
    return getSelectLabelAttributes(id);
  };

  const getToggleButtonProps = () => {
    return {
      ...getSelectToggleButtonAttributes(id, state.value),
      onClick: () => dispatch(toggleButtonClick()),
      onKeydown: ({ key }: KeyboardEvent) => dispatch(toggleButtonKeyDown(key)),
      onBlur: () => dispatch(toggleButtonBlur()),
    };
  };

  const getMenuProps = () => {
    return {
      ...getSelectMenuAttributes(id),
      onMouseleave: () => dispatch(menuMouseLeave()),
    };
  };

  const getItemProps = ({ item, index }: { item: Item; index: number }) => {
    return {
      ...getSelectItemAttributes(id, index, items, state.value),
      ref: captureItemElement.bind(null, item),
      onClick: () => dispatch(itemClick(index)),
      onMousemove: () => dispatch(itemMouseMove(index)),
    };
  };

  return computed(() => ({
    ...toValue(state),
    getLabelProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  }));
}
