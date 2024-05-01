import {
  ComboboxAction,
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
import { ChangeEvent, useCallback, useState } from 'react';

import { SelectProps } from './use-select';
import { useControlProp } from './use-control-prop';
import { useId } from './use-id';
import { useRefs } from './use-refs';

type ComboboxProps<Item> = SelectProps<Item> & {
  inputValue?: string;
  onInputValueChange?: (state: ComboboxState<Item>) => void;
};

export type UseCombobox<Item> = typeof useCombobox<Item>;

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

  const [state, setState] = useState(comboboxInitialState<Item>(props));

  const dispatch = (action: ComboboxAction) => {
    const prevState = state;
    const nextState = comboboxReducer(items, itemToString, state, action);

    setState(nextState);

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

  const getLabelProps = useCallback(() => {
    return getComboboxLabelAttributes(id);
  }, [id]);

  const getToggleButtonProps = useCallback(() => {
    return {
      ...getComboboxToggleButtonAttributes(id, state),
      onClick: () => dispatch(toggleButtonClick()),
    };
  }, [id, state, dispatch]);

  const getMenuProps = useCallback(() => {
    return {
      ...getComboboxMenuAttributes(id),
      onMouseLeave: () => dispatch(menuMouseLeave()),
    };
  }, [id, dispatch]);

  const getItemProps = useCallback(
    ({ item, index }: { item: Item; index: number }) => {
      return {
        ...getComboboxItemAttributes(id, index, state),
        ref: captureItemElement.bind(null, item),
        onClick: () => dispatch(itemClick(index)),
        onMouseMove: () => dispatch(itemMouseMove(index)),
      };
    },
    [id, state, dispatch],
  );

  const getInputProps = useCallback(() => {
    return {
      ...getComboboxInputAttributes(id, state),
      onClick: () => dispatch(inputClick()),
      onBlur: () => dispatch(inputBlur()),
      onKeyDown: ({ key }: React.KeyboardEvent) => dispatch(inputKeyDown(key)),
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        dispatch(inputValueChanged(event.target.value)),
    };
  }, [id, state, dispatch]);

  return {
    ...state,
    getLabelProps,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
    getInputProps,
  };
}
