import {
  ComboboxDispatch,
  ComboboxState,
  comboboxInitialState,
  createComboboxReducer,
  getComboboxInputAttributes,
  getComboboxItemAttributes,
  getComboboxLabelAttributes,
  getComboboxMenuAttributes,
  getComboboxToggleButtonAttributes,
  handleComboboxSideEffects,
  highlightedIndexChanged,
  inputBlur,
  inputClick,
  inputKeyDown,
  inputValueChanged,
  isOpenChanged,
  itemClick,
  itemMouseMove,
  menuMouseLeave,
  selectedItemChanged,
  toggleButtonClick,
} from '@upop/core';
import { Ref, computed, shallowRef, toValue } from 'vue';

import { useControlProp } from './use-control-prop';
import { useId } from './use-id';
import { useRefs } from './use-refs';

type ComboboxProps<Item> = {
  items: Item[];
  id?: string;
  itemToString?: (item: Item | null) => string;
  isOpen?: Ref<boolean>;
  onIsOpenChange?: (state: ComboboxState<Item>) => void;
  selectedItem?: Ref<Item | null>;
  onSelectedItemChange?: (state: ComboboxState<Item>) => void;
  highlightedIndex?: Ref<number>;
  onHighlightedIndexChange?: (state: ComboboxState<Item>) => void;
  inputValue?: Ref<string>;
  onInputValueChange?: (state: ComboboxState<Item>) => void;
};

export type UseCombobox = typeof useCombobox;

export function useCombobox<Item>(props: ComboboxProps<Item>) {
  const {
    items,
    itemToString,
    isOpen,
    selectedItem,
    highlightedIndex,
    inputValue,
  } = props;

  const id = useId(props.id);
  const [itemElements, captureItemElement] = useRefs<Item>();

  const state = shallowRef(
    comboboxInitialState<Item>({
      isOpen: isOpen?.value,
      selectedItem: selectedItem?.value,
      highlightedIndex: highlightedIndex?.value,
      inputValue: inputValue?.value,
    }),
  );

  const reducer = createComboboxReducer(items, itemToString ?? String);

  const dispatch: ComboboxDispatch = (action) => {
    const prevState = state.value;
    const nextState = reducer(state.value, action);

    state.value = nextState;

    handleComboboxSideEffects(prevState, nextState, action, {
      items,
      itemElements,
      onIsOpenChange: props.onIsOpenChange,
      onSelectedItemChange: props.onSelectedItemChange,
      onHighlightedIndexChange: props.onHighlightedIndexChange,
      onInputValueChange: props.onInputValueChange,
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

  useControlProp(inputValue, (value) => {
    dispatch(inputValueChanged(value));
  });

  const getLabelProps = () => {
    return getComboboxLabelAttributes(id);
  };

  const getToggleButtonProps = () => {
    return {
      ...getComboboxToggleButtonAttributes(id, state.value),
      onClick: () => dispatch(toggleButtonClick()),
    };
  };

  const getMenuProps = () => {
    return {
      ...getComboboxMenuAttributes(id),
      onMouseleave: () => dispatch(menuMouseLeave()),
    };
  };

  const getItemProps = ({ item, index }: { item: Item; index: number }) => {
    return {
      ...getComboboxItemAttributes(id, index, state.value),
      ref: captureItemElement.bind(null, item),
      onClick: () => dispatch(itemClick(index)),
      onMousemove: () => dispatch(itemMouseMove(index)),
    };
  };

  const getInputProps = () => {
    return {
      ...getComboboxInputAttributes(id, state.value),
      onClick: () => dispatch(inputClick()),
      onBlur: () => dispatch(inputBlur()),
      onKeydown: ({ key }: KeyboardEvent) => dispatch(inputKeyDown(key)),
      onInput: (event: { target: HTMLInputElement }) => {
        dispatch(inputValueChanged(event.target.value));
      },
    };
  };

  return computed(() => ({
    ...toValue(state),
    getLabelProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
    getInputProps,
  }));
}