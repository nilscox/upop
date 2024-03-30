import {
  SelectDispatch,
  SelectState,
  createSelectReducer,
  getItemAttributes,
  getLabelAttributes,
  getMenuAttributes,
  getToggleButtonAttributes,
  handleSelectSideEffects,
  highlightedIndexChanged,
  isOpenChanged,
  itemClick,
  itemMouseMove,
  menuMouseLeave,
  selectInitialState,
  selectedItemChanged,
  toggleButtonBlur,
  toggleButtonClick,
  toggleButtonKeyDown,
} from '@upop/core';
import { createUniqueId, mergeProps } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';
import { createControlProp } from './create-control-prop';
import { createRefs } from './create-refs';

type SelectProps<Item> = {
  items: Item[];
  id?: string;
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
  const {
    items,
    isOpen,
    onIsOpenChange,
    highlightedIndex,
    onHighlightedIndexChange,
    selectedItem,
    onSelectedItemChange,
  } = props;

  const id = props.id ?? createUniqueId();
  const [itemElements, captureItemElement] = createRefs<Item>();

  const reducer = createSelectReducer(items);

  const [state, setState] = createStore(
    selectInitialState<Item>({
      isOpen: isOpen?.(),
      selectedItem: selectedItem?.(),
      highlightedIndex: highlightedIndex?.(),
    }),
  );

  const dispatch: SelectDispatch = (action) => {
    const prevState = { ...unwrap(state) };
    const nextState = reducer(prevState, action);

    setState(nextState);

    handleSelectSideEffects(prevState, nextState, action, {
      items,
      itemElements,
      onIsOpenChange,
      onSelectedItemChange,
      onHighlightedIndexChange,
    });
  };

  createControlProp(isOpen, (value) => {
    dispatch(isOpenChanged(value));
  });

  createControlProp(selectedItem, (value) => {
    dispatch(selectedItemChanged(value));
  });

  createControlProp(highlightedIndex, (value) => {
    dispatch(highlightedIndexChanged(value));
  });

  const getLabelProps = () => {
    return getLabelAttributes(id);
  };

  const getToggleButtonProps = () => {
    return {
      ...getToggleButtonAttributes(id, state),
      onClick: () => dispatch(toggleButtonClick()),
      onKeyDown: ({ key }: KeyboardEvent) => dispatch(toggleButtonKeyDown(key)),
      onBlur: () => dispatch(toggleButtonBlur()),
    };
  };

  const getMenuProps = () => {
    return {
      ...getMenuAttributes(id),
      onMouseLeave: () => dispatch(menuMouseLeave()),
    };
  };

  const getItemProps = ({ item, index }: { item: Item; index: number }) => {
    return {
      ...getItemAttributes(id, index, items, state),
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
