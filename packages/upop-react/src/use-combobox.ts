import {
  ComboboxAction,
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
import { ChangeEvent, useCallback, useState } from 'react';

import { useControlProp } from './use-control-prop';
import { useId } from './use-id';
import { useRefs } from './use-refs';
import { SelectProps } from './use-select';

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

  const [state, setState] = useState(
    comboboxInitialState<Item>(props, itemToString),
  );

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
      onKeyDown: (event: React.KeyboardEvent) =>
        dispatch(inputKeyDown(event.nativeEvent)),
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
