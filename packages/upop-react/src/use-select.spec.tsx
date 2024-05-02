import { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as downshift from 'downshift';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import * as upop from './use-select';

type TestItem = {
  id: string;
  name: string;
};

type UseSelect =
  | upop.UseSelect<TestItem>
  | typeof downshift.useSelect<TestItem>;

screen;

describe('useSelect', () => {
  const libraries = {
    upop,
    downshift,
  };

  for (const [library, { useSelect }] of Object.entries(libraries)) {
    describe(`toggleButton - ${library}`, () => {
      toggleButton(useSelect);
    });

    describe(`label - ${library}`, () => {
      label(useSelect);
    });

    describe(`menu - ${library}`, () => {
      menu(useSelect);
    });

    describe(`menu item - ${library}`, () => {
      menuItem(useSelect);
    });

    describe(`controlled props - ${library}`, () => {
      controlledProps(useSelect);
    });
  }
});

const items: TestItem[] = [
  { id: '1', name: 'one' },
  { id: '2', name: 'two' },
];

class Test {
  user: ReturnType<typeof userEvent.setup>;

  props: Parameters<UseSelect>[0];

  rerender: () => void;

  constructor(
    private useSelect: UseSelect,
    props?: Partial<Parameters<UseSelect>[0]>,
  ) {
    this.user = userEvent.setup();
    this.props = { items, id: 'select', ...props };

    const result = render(<this.Select />);

    this.rerender = () => result.rerender(<this.Select />);
  }

  get toggleButton() {
    return document.getElementById('select-toggle-button')!;
  }

  get label() {
    return document.getElementById('select-label')!;
  }

  get menu() {
    return document.getElementById('select-menu')!;
  }

  menuItem(index: number) {
    return document.getElementById(`select-item-${String(index)}`)!;
  }

  expectState(state: {
    isOpen?: boolean;
    selectedItem?: TestItem | null;
    highlightedIndex?: number;
  }) {
    expect(this.state).toEqual({
      isOpen: false,
      selectedItem: null,
      highlightedIndex: -1,
      ...state,
    });
  }

  focusToggleButton() {
    act(() => this.toggleButton.focus());
  }

  private state!: {
    isOpen: boolean;
    selectedItem: TestItem | null;
    highlightedIndex: number;
  };

  private Select = () => {
    // @ts-expect-error upop and downshift don't have the exact same api
    const result = this.useSelect(this.props);

    this.state = {
      isOpen: result.isOpen,
      selectedItem: result.selectedItem,
      highlightedIndex: result.highlightedIndex,
    };

    return (
      <>
        <label {...result.getLabelProps()} />

        <div {...result.getToggleButtonProps()} />

        <ul {...result.getMenuProps()}>
          {this.props.items.map((item, index) => (
            <li key={item.id} {...result.getItemProps({ item, index })} />
          ))}
        </ul>
      </>
    );
  };
}

function toggleButton(useSelect: UseSelect) {
  let test: Test;
  let toggleButton: HTMLElement;

  beforeEach(() => {
    test = new Test(useSelect);
    toggleButton = test.toggleButton;
    test.focusToggleButton();
  });

  it('toggles the popup on click', async () => {
    await act(() => test.user.click(toggleButton));
    test.expectState({ isOpen: true });

    await act(() => test.user.click(toggleButton));
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

  it('toggles the popup with the enter key', async () => {
    await act(() => test.user.keyboard('{Enter}'));
    test.expectState({ isOpen: true });

    await act(() => test.user.keyboard('{Enter}'));
    test.expectState({ isOpen: false });
  });

  it('selects the highlighted item with the enter key', async () => {
    await act(() => test.user.keyboard('{ArrowDown}'));
    await act(() => test.user.keyboard('{Enter}'));
    test.expectState({ isOpen: false, selectedItem: items[0] });
  });

  it('toggles the popup with the space key', async () => {
    await act(() => test.user.keyboard(' '));
    test.expectState({ isOpen: true });

    await act(() => test.user.keyboard(' '));
    test.expectState({ isOpen: false });
  });

  it('selects the highlighted item with the space key', async () => {
    await act(() => test.user.keyboard('{ArrowDown}'));
    await act(() => test.user.keyboard(' '));
    test.expectState({ isOpen: false, selectedItem: items[0] });
  });

  it('closes the popup with the escape key', async () => {
    await act(() => test.user.keyboard('{ArrowDown}'));
    await act(() => test.user.keyboard('{Escape}'));
    test.expectState({ isOpen: false });
  });

  it('highlights the items with the down arrow key', async () => {
    await act(() => test.user.keyboard('{ArrowDown}'));
    test.expectState({ isOpen: true, highlightedIndex: 0 });

    await act(() => test.user.keyboard('{ArrowDown}'));
    test.expectState({ isOpen: true, highlightedIndex: 1 });

    await act(() => test.user.keyboard('{ArrowDown}'));
    test.expectState({ isOpen: true, highlightedIndex: 1 });
  });

  it('highlights the items with the up arrow key', async () => {
    await act(() => test.user.keyboard('{ArrowUp}'));
    test.expectState({ isOpen: true, highlightedIndex: 1 });

    await act(() => test.user.keyboard('{ArrowUp}'));
    test.expectState({ isOpen: true, highlightedIndex: 0 });

    await act(() => test.user.keyboard('{ArrowUp}'));
    test.expectState({ isOpen: true, highlightedIndex: 0 });
  });

  it('selects the highlighted item on blur when none is selected', async () => {
    await act(async () => test.user.keyboard('{ArrowDown}'));
    await act(async () => test.user.tab());
    test.expectState({ isOpen: false, selectedItem: items[0] });
  });

  it('keeps the selected item on blur', async () => {
    await act(async () => test.user.keyboard('{ArrowDown}'));
    await act(async () => test.user.keyboard('{Enter}'));
    await act(async () => test.user.keyboard('{Enter}'));
    await act(async () => test.user.tab());
    test.expectState({ isOpen: false, selectedItem: items[0] });
  });

  describe('accessibility', () => {
    it('role', () => {
      expect(toggleButton).toHaveAttribute('role', 'combobox');
    });

    it('tabindex', () => {
      expect(toggleButton).toHaveAttribute('tabindex', '0');
    });

    it('aria-activedescendant', async () => {
      expect(toggleButton).toHaveAttribute('aria-activedescendant', '');

      test.focusToggleButton();
      await act(() => test.user.keyboard('{ArrowDown}'));

      expect(toggleButton).toHaveAttribute(
        'aria-activedescendant',
        'select-item-0',
      );
    });

    it('aria-controls', () => {
      expect(toggleButton).toHaveAttribute('aria-controls', 'select-menu');
    });

    it('aria-expanded', async () => {
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

      await act(() => test.user.click(toggleButton));
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('aria-haspopup', () => {
      expect(toggleButton).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('aria-labelledby', () => {
      expect(toggleButton).toHaveAttribute('aria-labelledby', 'select-label');
    });
  });
}

function label(useSelect: UseSelect) {
  let test: Test;
  let label: HTMLElement;

  beforeEach(() => {
    test = new Test(useSelect);
    label = test.label;
  });

  it('accessibility', () => {
    expect(label).toHaveAttribute('for', 'select-toggle-button');
  });
}

function menu(useSelect: UseSelect) {
  let test: Test;
  let menu: HTMLElement;

  beforeEach(() => {
    test = new Test(useSelect);
    menu = test.menu;
  });

  it('clears the highlighted item on mouse out', async () => {
    test.focusToggleButton();

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
      expect(menu).toHaveAttribute('aria-labelledby', 'select-label');
    });
  });
}

function menuItem(useSelect: UseSelect) {
  let test: Test;
  let menuItem1: HTMLElement;
  let menuItem2: HTMLElement;

  beforeEach(async () => {
    test = new Test(useSelect);
    menuItem1 = test.menuItem(0);
    menuItem2 = test.menuItem(1);

    test.focusToggleButton();
    await act(() => test.user.keyboard('{Enter}'));
  });

  it('highlight an item on mouse move', async () => {
    await act(() => test.user.pointer({ target: menuItem1 }));
    test.expectState({ isOpen: true, highlightedIndex: 0 });
  });

  it('select an item on click', async () => {
    await act(() => test.user.click(menuItem1));
    test.expectState({ isOpen: false, selectedItem: items[0] });
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

      await act(() => test.user.click(menuItem1));

      expect(menuItem1).toHaveAttribute('aria-selected', 'true');
      expect(menuItem2).toHaveAttribute('aria-selected', 'false');
    });
  });
}

function controlledProps(useSelect: UseSelect) {
  describe('controlled state', () => {
    it('controls the open state', () => {
      const test = new Test(useSelect, {
        isOpen: true,
      });

      test.expectState({ isOpen: true });

      test.props.isOpen = false;
      test.rerender();

      test.expectState({ isOpen: false });
    });

    it('controls the selected item', () => {
      const test = new Test(useSelect, {
        selectedItem: items[0],
      });

      test.expectState({ selectedItem: items[0] });

      test.props.selectedItem = null;
      test.rerender();

      test.expectState({ selectedItem: null });
    });

    it("controls the highlighted item's index", () => {
      const test = new Test(useSelect, {
        highlightedIndex: 0,
      });

      test.expectState({ highlightedIndex: 0 });

      test.props.highlightedIndex = -1;
      test.rerender();

      test.expectState({ highlightedIndex: -1 });
    });
  });

  describe('controlled side effects', () => {
    let test: Test;

    let onIsOpenChange: Mock;
    let onSelectedItemChange: Mock;
    let onHighlightedIndexChange: Mock;

    beforeEach(() => {
      onIsOpenChange = vi.fn();
      onSelectedItemChange = vi.fn();
      onHighlightedIndexChange = vi.fn();

      test = new Test(useSelect, {
        onIsOpenChange,
        onSelectedItemChange,
        onHighlightedIndexChange,
      });
    });

    it('onIsOpenChange', async () => {
      await act(() => test.user.click(test.toggleButton));
      expect(onIsOpenChange).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: true }),
      );

      await act(() => test.user.click(test.toggleButton));
      expect(onIsOpenChange).toHaveBeenCalledWith(
        expect.objectContaining({ isOpen: false }),
      );
    });

    it('onSelectedItemChange', async () => {
      await act(() => test.user.click(test.toggleButton));
      await act(() => test.user.click(test.menuItem(0)));
      expect(onSelectedItemChange).toHaveBeenCalledWith(
        expect.objectContaining({ selectedItem: items[0] }),
      );
    });

    it('onHighlightedIndexChange', async () => {
      test.focusToggleButton();
      await act(() => test.user.keyboard('{ArrowDown}'));
      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({ highlightedIndex: 0 }),
      );
    });

    it('does not call a side effect when it does not change', async () => {
      await act(() => test.user.click(test.toggleButton));
      expect(onSelectedItemChange).not.toHaveBeenCalled();
    });
  });
}
