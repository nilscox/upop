import {
  ComboboxDispatch,
  ComboboxState,
  comboboxInitialState,
  comboboxReducer,
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
import { createUniqueId, mergeProps } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';

import { createControlProp } from './create-control-prop';
import { createRefs } from './create-refs';

type ComboboxProps<Item> = {
  id?: string;
  items: Item[];
  itemToString?: (item: Item | null) => string;
  isOpen?: () => boolean;
  onIsOpenChange?: (state: ComboboxState<Item>) => void;
  selectedItem?: () => Item | null;
  onSelectedItemChange?: (state: ComboboxState<Item>) => void;
  highlightedIndex?: () => number;
  onHighlightedIndexChange?: (state: ComboboxState<Item>) => void;
  inputValue?: () => string;
  onInputValueChange?: (state: ComboboxState<Item>) => void;
};

export type CreateCombobox = typeof createCombobox;

export function createCombobox<Item>(props: ComboboxProps<Item>) {
  const id = props.id ?? createUniqueId();
  const [itemElements, captureItemElement] = createRefs<Item>();

  const [state, setState] = createStore(
    comboboxInitialState({
      isOpen: props.isOpen?.(),
      selectedItem: props.selectedItem?.(),
      highlightedIndex: props.highlightedIndex?.(),
      inputValue: props.inputValue?.(),
    }),
  );

  const dispatch: ComboboxDispatch = (action) => {
    const prevState = { ...unwrap(state) };
    const nextState = comboboxReducer(
      props.items,
      props.itemToString ?? String,
      prevState,
      action,
    );

    setState(nextState);

    handleComboboxSideEffects(prevState, nextState, action, {
      items: props.items,
      itemElements,
      onIsOpenChange: props.onIsOpenChange,
      onSelectedItemChange: props.onSelectedItemChange,
      onHighlightedIndexChange: props.onHighlightedIndexChange,
      onInputValueChange: props.onInputValueChange,
    });
  };

  createControlProp(props.isOpen, (value) => {
    dispatch(isOpenChanged(value));
  });

  createControlProp(props.selectedItem, (value) => {
    dispatch(selectedItemChanged(value));
  });

  createControlProp(props.highlightedIndex, (value) => {
    dispatch(highlightedIndexChanged(value));
  });

  createControlProp(props.inputValue, (value) => {
    dispatch(inputValueChanged(value));
  });

  const getLabelProps = () => {
    return getComboboxLabelAttributes(id);
  };

  const getToggleButtonProps = () => {
    return {
      ...getComboboxToggleButtonAttributes(id, state),
      onClick: () => dispatch(toggleButtonClick()),
    };
  };

  const getMenuProps = () => {
    return {
      ...getComboboxMenuAttributes(id),
      onMouseLeave: () => dispatch(menuMouseLeave()),
    };
  };

  const getItemProps = ({ item, index }: { item: Item; index: number }) => {
    return {
      ...getComboboxItemAttributes(id, index, state),
      ref: captureItemElement.bind(null, item),
      onClick: () => dispatch(itemClick(index)),
      onMouseMove: () => dispatch(itemMouseMove(index)),
    };
  };

  const getInputProps = () => {
    return {
      ...getComboboxInputAttributes(id, state),
      onClick: () => dispatch(inputClick()),
      onBlur: () => dispatch(inputBlur()),
      onKeyDown: ({ key }: KeyboardEvent) => dispatch(inputKeyDown(key)),
      onInput: (event: { target: HTMLInputElement }) =>
        dispatch(inputValueChanged(event.target.value)),
    };
  };

  return mergeProps(state, {
    getLabelProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
    getInputProps,
  });
}
