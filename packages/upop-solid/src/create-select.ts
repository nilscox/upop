import {
  SelectDispatch,
  SelectState,
  selectReducer,
  getSelectItemAttributes,
  getSelectLabelAttributes,
  getSelectMenuAttributes,
  getSelectToggleButtonAttributes,
  handleSelectSideEffects,
  itemClick,
  itemMouseMove,
  menuMouseLeave,
  selectInitialState,
  toggleButtonBlur,
  toggleButtonClick,
  toggleButtonKeyDown,
  controlPropIsOpenChanged,
  controlPropSelectedItemChanged,
  controlPropHighlightedIndexChanged,
} from '@upop/core';
import { createUniqueId, mergeProps } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';

import { createControlProp } from './create-control-prop';
import { createRefs } from './create-refs';

type SelectProps<Item> = {
  id?: string;
  items: Item[];
  itemToString?: (item: Item | null) => string;
  isOpen?: () => boolean;
  onIsOpenChange?: (state: SelectState<Item>) => void;
  selectedItem?: () => Item | null;
  onSelectedItemChange?: (state: SelectState<Item>) => void;
  highlightedIndex?: () => number;
  onHighlightedIndexChange?: (state: SelectState<Item>) => void;
};

export type CreateSelect = typeof createSelect;

export function createSelect<Item>(props: SelectProps<Item>) {
  const id = props.id ?? createUniqueId();
  const [itemElements, captureItemElement] = createRefs<Item>();

  const [state, setState] = createStore(
    selectInitialState<Item>({
      isOpen: props.isOpen?.(),
      selectedItem: props.selectedItem?.(),
      highlightedIndex: props.highlightedIndex?.(),
    }),
  );

  const dispatch: SelectDispatch = (action) => {
    const prevState = { ...unwrap(state) };
    const nextState = selectReducer(props.items, prevState, action);

    setState(nextState);

    handleSelectSideEffects(prevState, nextState, action, {
      items: props.items,
      itemElements,
      onIsOpenChange: props.onIsOpenChange,
      onSelectedItemChange: props.onSelectedItemChange,
      onHighlightedIndexChange: props.onHighlightedIndexChange,
    });
  };

  createControlProp(props.isOpen, (value) => {
    dispatch(controlPropIsOpenChanged(value));
  });

  createControlProp(props.selectedItem, (value) => {
    dispatch(controlPropSelectedItemChanged(value));
  });

  createControlProp(props.highlightedIndex, (value) => {
    dispatch(controlPropHighlightedIndexChanged(value));
  });

  const getLabelProps = () => {
    return getSelectLabelAttributes(id);
  };

  const getToggleButtonProps = () => {
    return {
      ...getSelectToggleButtonAttributes(id, state),
      onClick: () => dispatch(toggleButtonClick()),
      onKeyDown: ({ key }: KeyboardEvent) => dispatch(toggleButtonKeyDown(key)),
      onBlur: () => dispatch(toggleButtonBlur()),
    };
  };

  const getMenuProps = () => {
    return {
      ...getSelectMenuAttributes(id),
      onMouseLeave: () => dispatch(menuMouseLeave()),
    };
  };

  const getItemProps = ({ item, index }: { item: Item; index: number }) => {
    return {
      ...getSelectItemAttributes(id, index, props.items, state),
      ref: captureItemElement.bind(null, item),
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
