import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as downshift from 'downshift';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import * as upop from './use-combobox';

type TestItem = {
  id: string;
  name: string;
};

type UseCombobox =
  | upop.UseCombobox<TestItem>
  | typeof downshift.useCombobox<TestItem>;

screen;

describe('useCombobox', () => {
  const libraries = {
    upop,
    downshift,
  };

  for (const [library, { useCombobox }] of Object.entries(libraries)) {
    describe(`input - ${library}`, () => {
      input(useCombobox);
    });

    describe(`toggleButton - ${library}`, () => {
      toggleButton(useCombobox);
    });

    describe(`label - ${library}`, () => {
      label(useCombobox);
    });

    describe(`menu - ${library}`, () => {
      menu(useCombobox);
    });

    describe(`menu item - ${library}`, () => {
      menuItem(useCombobox);
    });

    describe(`controlled props - ${library}`, () => {
      controlledProps(useCombobox);
    });
  }
});

const items: TestItem[] = [
  { id: '1', name: 'one' },
  { id: '2', name: 'two' },
];

function itemToString(item: TestItem | null) {
  return item?.name ?? '';
}

class Test {
  user: ReturnType<typeof userEvent.setup>;

  props: Parameters<UseCombobox>[0];

  rerender: () => void;

  constructor(
    private useCombobox: UseCombobox,
    props?: Partial<Parameters<UseCombobox>[0]>,
  ) {
    this.user = userEvent.setup();
    this.props = { items, id: 'combobox', itemToString, ...props };

    const result = render(<this.Combobox />);

    this.rerender = () => result.rerender(<this.Combobox />);
  }

  get input() {
    return document.getElementById('combobox-input')!;
  }

  get toggleButton() {
    return document.getElementById('combobox-toggle-button')!;
  }

  get label() {
    return document.getElementById('combobox-label')!;
  }

  get menu() {
    return document.getElementById('combobox-menu')!;
  }

  menuItem(index: number) {
    return document.getElementById(`combobox-item-${index}`)!;
  }

  expectState(state: {
    isOpen?: boolean;
    selectedItem?: TestItem | null;
    highlightedIndex?: number;
    inputValue?: string;
  }) {
    expect(this.state).toEqual({
      isOpen: false,
      selectedItem: null,
      highlightedIndex: -1,
      inputValue: '',
      ...state,
    });
  }

  focusInput() {
    act(() => this.input.focus());
  }

  private state!: {
    isOpen: boolean;
    selectedItem: TestItem | null;
    highlightedIndex: number;
    inputValue: string;
  };

  private Combobox = () => {
    // @ts-expect-error upop and downshift don't have the exact same api
    const result = this.useCombobox(this.props);

    this.state = {
      isOpen: result.isOpen,
      selectedItem: result.selectedItem,
      highlightedIndex: result.highlightedIndex,
      inputValue: result.inputValue,
    };

    return (
      <>
        <label {...result.getLabelProps()} />

        <div>
          <input {...result.getInputProps()} />
          <button {...result.getToggleButtonProps()} />
        </div>

        <ul {...result.getMenuProps()}>
          {this.props.items.map((item, index) => (
            <li key={item.id} {...result.getItemProps({ item, index })} />
          ))}
        </ul>
      </>
    );
  };
}

function input(useCombobox: UseCombobox) {
  let test: Test;
  let input: HTMLElement;

  beforeEach(() => {
    test = new Test(useCombobox);
    input = test.input;
    test.focusInput();
  });

  it('toggles the popup on click', () => {
    act(() => input.click());
    test.expectState({ isOpen: true });

    act(() => input.click());
    test.expectState({ isOpen: false });
  });

  it('opens the popup with the down arrow key', async () => {
    await act(() => test.user.keyboard('{ArrowDown}'));
    test.expectState({ isOpen: true, highlightedIndex: 0 });
  });

  it('opens the popup with the up arrow key', async () => {
    await act(() => test.user.keyboard('{ArrowUp}'));
    test.expectState({ isOpen: true, highlightedIndex: 1 });
  });

  it('highlights the items with the down arrow key', async () => {
    await act(() => test.user.keyboard('{ArrowDown}'));
    test.expectState({ isOpen: true, highlightedIndex: 0 });

    await act(() => test.user.keyboard('{ArrowDown}'));
    test.expectState({ isOpen: true, highlightedIndex: 1 });

    await act(() => test.user.keyboard('{ArrowDown}'));
    test.expectState({ isOpen: true, highlightedIndex: 0 });
  });

  it('highlights the items with the up arrow key', async () => {
    await act(() => test.user.keyboard('{ArrowUp}'));
    test.expectState({ isOpen: true, highlightedIndex: 1 });

    await act(() => test.user.keyboard('{ArrowUp}'));
    test.expectState({ isOpen: true, highlightedIndex: 0 });

    await act(() => test.user.keyboard('{ArrowUp}'));
    test.expectState({ isOpen: true, highlightedIndex: 1 });
  });

  it('selects the highlighted item with the enter key', async () => {
    await act(() => test.user.keyboard('{ArrowDown}'));
    await act(() => test.user.keyboard('{Enter}'));

    test.expectState({
      isOpen: false,
      selectedItem: items[0],
      inputValue: 'one',
    });

    await act(() => test.user.clear(input));

    await act(() => test.user.keyboard('{ArrowDown}'));
    await act(() => test.user.keyboard('{ArrowDown}'));
    await act(() => test.user.keyboard('{Enter}'));

    test.expectState({
      isOpen: false,
      selectedItem: items[1],
      inputValue: 'two',
    });
  });

  it('selects the highlighted item on blur', async () => {
    await act(() => test.user.keyboard('{ArrowDown}'));
    act(() => input.blur());

    test.expectState({
      isOpen: false,
      selectedItem: items[0],
      inputValue: 'one',
    });
  });

  it('closes the popup with the escape key', async () => {
    await act(() => test.user.keyboard('{ArrowDown}'));
    await act(() => test.user.keyboard('{Escape}'));
    test.expectState({ isOpen: false });
  });

  it("controls the input's value", async () => {
    await act(() => test.user.keyboard('{ArrowDown}'));
    await act(() => test.user.keyboard('{Enter}'));
    expect(input).toHaveValue('one');
  });

  describe('accessibility', () => {
    it('role', () => {
      expect(input).toHaveAttribute('role', 'combobox');
    });

    it('tabindex', () => {
      expect(input).not.toHaveAttribute('tabindex');
    });

    it('aria-activedescendant', async () => {
      expect(input).toHaveAttribute('aria-activedescendant', '');

      test.focusInput();
      await act(() => test.user.keyboard('{ArrowDown}'));

      expect(input).toHaveAttribute('aria-activedescendant', 'combobox-item-0');
    });

    it('aria-controls', () => {
      expect(input).toHaveAttribute('aria-controls', 'combobox-menu');
    });

    it('aria-expanded', async () => {
      expect(input).toHaveAttribute('aria-expanded', 'false');

      await act(() => test.user.click(input));
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('aria-haspopup', () => {
      // implicit when role="combobox"
      expect(input).not.toHaveAttribute('aria-haspopup');
    });

    it('aria-labelledby', () => {
      expect(input).toHaveAttribute('aria-labelledby', 'combobox-label');
    });
  });
}

function toggleButton(useCombobox: UseCombobox) {
  let test: Test;
  let toggleButton: HTMLElement;

  beforeEach(() => {
    test = new Test(useCombobox);
    toggleButton = test.toggleButton;
  });

  it('toggles the popup on click', async () => {
    await act(() => test.user.click(toggleButton));
    test.expectState({ isOpen: true });

    await act(() => test.user.click(toggleButton));
    test.expectState({ isOpen: false });
  });

  describe('accessibility', () => {
    it('tabindex', () => {
      expect(toggleButton).toHaveAttribute('tabindex', '-1');
    });

    it('aria-controls', () => {
      expect(toggleButton).toHaveAttribute('aria-controls', 'combobox-menu');
    });

    it('aria-expanded', async () => {
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

      await act(async () => {
        await test.user.click(toggleButton);
      });

      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });
  });
}

function label(useCombobox: UseCombobox) {
  let test: Test;
  let label: HTMLElement;

  beforeEach(() => {
    test = new Test(useCombobox);
    label = test.label;
  });

  it('accessibility', () => {
    expect(label).toHaveAttribute('for', 'combobox-input');
  });
}

function menu(useCombobox: UseCombobox) {
  let test: Test;
  let menu: HTMLElement;

  beforeEach(() => {
    test = new Test(useCombobox);
    menu = test.menu;
  });

  it('clears the highlighted item on mouse out', async () => {
    test.focusInput();

    await act(() => test.user.keyboard('{ArrowDown}'));

    await act(async () => {
      await test.user.pointer([
        { target: menu },
        { target: document.documentElement },
      ]);
    });

    test.expectState({ isOpen: true, highlightedIndex: -1 });
  });

  describe('accessibility', () => {
    it('role', () => {
      expect(menu).toHaveAttribute('role', 'listbox');
    });

    it('aria-labelledby', () => {
      expect(menu).toHaveAttribute('aria-labelledby', 'combobox-label');
    });
  });
}

function menuItem(useCombobox: UseCombobox) {
  let test: Test;
  let menuItem1: HTMLElement;
  let menuItem2: HTMLElement;

  beforeEach(async () => {
    test = new Test(useCombobox);
    menuItem1 = test.menuItem(0);
    menuItem2 = test.menuItem(1);

    test.focusInput();
    await act(() => test.user.click(test.toggleButton));
  });

  it('highlight an item on mouse move', async () => {
    await act(() => test.user.pointer({ target: menuItem1 }));
    test.expectState({ isOpen: true, highlightedIndex: 0 });
  });

  it('select an item on click', async () => {
    await act(() => test.user.click(menuItem1));

    test.expectState({
      isOpen: false,
      selectedItem: items[0],
      inputValue: 'one',
    });
  });

  describe('accessibility', () => {
    it('role', () => {
      expect(menuItem1).toHaveAttribute('role', 'option');
    });

    it('aria-disabled', () => {
      expect(menuItem1).toHaveAttribute('aria-disabled', 'false');
    });

    it('aria-selected', async () => {
      expect(menuItem1).toHaveAttribute('aria-selected', 'false');

      await act(() => test.user.pointer({ target: menuItem1 }));

      expect(menuItem1).toHaveAttribute('aria-selected', 'true');
      expect(menuItem2).toHaveAttribute('aria-selected', 'false');

      await act(() => test.user.click(menuItem1));

      expect(menuItem1).toHaveAttribute('aria-selected', 'false');
      expect(menuItem2).toHaveAttribute('aria-selected', 'false');
    });
  });
}

function controlledProps(useCombobox: UseCombobox) {
  describe('controlled state', () => {
    it('controls the open state', () => {
      const test = new Test(useCombobox, {
        isOpen: true,
      });

      test.expectState({ isOpen: true });

      test.props.isOpen = false;
      test.rerender();

      test.expectState({ isOpen: false });
    });

    it('controls the selected item', () => {
      const test = new Test(useCombobox, {
        selectedItem: items[0],
      });

      test.expectState({ selectedItem: items[0], inputValue: 'one' });

      test.props.selectedItem = null;
      test.rerender();

      test.expectState({ selectedItem: null });
    });

    it("controls the highlighted item's index", () => {
      const test = new Test(useCombobox, {
        highlightedIndex: 0,
      });

      test.expectState({ highlightedIndex: 0 });

      test.props.highlightedIndex = -1;
      test.rerender();

      test.expectState({ highlightedIndex: -1 });
    });

    it("controls the input's value", () => {
      const test = new Test(useCombobox, {
        inputValue: 'value',
      });

      test.expectState({ inputValue: 'value' });

      test.props.inputValue = 'changed';
      test.rerender();

      test.expectState({ inputValue: 'changed' });
    });
  });

  describe('controlled side effects', () => {
    let test: Test;

    let onIsOpenChange: Mock;
    let onSelectedItemChange: Mock;
    let onHighlightedIndexChange: Mock;
    let onInputValueChange: Mock;

    beforeEach(() => {
      onIsOpenChange = vi.fn();
      onSelectedItemChange = vi.fn();
      onHighlightedIndexChange = vi.fn();
      onInputValueChange = vi.fn();

      test = new Test(useCombobox, {
        onIsOpenChange,
        onSelectedItemChange,
        onHighlightedIndexChange,
        onInputValueChange,
      });
    });

    it('onIsOpenChange', async () => {
      await act(() => test.user.click(test.input));
      expect(onIsOpenChange).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: true }),
      );

      await act(() => test.user.click(test.input));
      expect(onIsOpenChange).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: false }),
      );
    });

    it('onSelectedItemChange', async () => {
      await act(() => test.user.click(test.input));
      await act(() => test.user.click(test.menuItem(0)));
      expect(onSelectedItemChange).toHaveBeenCalledWith(
        expect.objectContaining({ selectedItem: items[0] }),
      );
    });

    it('onHighlightedIndexChange', async () => {
      test.focusInput();
      await act(() => test.user.keyboard('{ArrowDown}'));
      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({ highlightedIndex: 0 }),
      );
    });

    it('onInputValueChange', async () => {
      test.focusInput();
      await act(() => test.user.click(test.menuItem(0)));
      expect(onInputValueChange).toHaveBeenCalledWith(
        expect.objectContaining({ inputValue: 'one' }),
      );
    });

    it('does not call a side effect when it does not change', async () => {
      await act(() => test.user.click(test.input));
      expect(onSelectedItemChange).not.toHaveBeenCalled();
    });
  });
}
