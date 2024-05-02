import {
  ComboboxDispatch,
  ComboboxState,
  comboboxInitialState,
  comboboxReducer,
  controlPropHighlightedIndexChanged,
  controlPropInputValueChanged,
  controlPropIsOpenChanged,
  controlPropSelectedItemChanged,
  getComboboxInputAttributes,
  getComboboxItemAttributes,
  getComboboxLabelAttributes,
  getComboboxMenuAttributes,
  getComboboxToggleButtonAttributes,
  handleComboboxSideEffects,
  inputBlur,
  inputClick,
  inputKeyDown,
  inputValueChanged,
  itemClick,
  itemMouseMove,
  menuMouseLeave,
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
    itemToString = String,
    isOpen,
    selectedItem,
    highlightedIndex,
    inputValue,
  } = props;

  const id = useId(props.id);
  const [itemElements, captureItemElement] = useRefs<Item>();

  const state = shallowRef(
    comboboxInitialState<Item>(
      {
        isOpen: isOpen?.value,
        selectedItem: selectedItem?.value,
        highlightedIndex: highlightedIndex?.value,
        inputValue: inputValue?.value,
      },
      itemToString,
    ),
  );

  const dispatch: ComboboxDispatch = (action) => {
    const prevState = state.value;
    const nextState = comboboxReducer(items, itemToString, state.value, action);

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
    dispatch(controlPropIsOpenChanged(value));
  });

  useControlProp(selectedItem, (value) => {
    dispatch(controlPropSelectedItemChanged(value));
  });

  useControlProp(highlightedIndex, (value) => {
    dispatch(controlPropHighlightedIndexChanged(value));
  });

  useControlProp(inputValue, (value) => {
    dispatch(controlPropInputValueChanged(value));
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
      onKeydown: (event: KeyboardEvent) => dispatch(inputKeyDown(event)),
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
