import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as downshift from 'downshift';
import { beforeEach, describe, expect, it } from 'vitest';

import * as upop from './use-select';

type UseSelect = upop.UseSelect | typeof downshift.useSelect;
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
  }
});

const items = [
  { id: '1', name: 'one' },
  { id: '2', name: 'two' },
];

function Select({ useSelect }: { useSelect: UseSelect }) {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items,
    id: 'select',
  });

  return (
    <>
      <label {...getLabelProps()} />

      <div {...getToggleButtonProps()} />

      <ul {...getMenuProps()}>
        {items.map((item, index) => (
          <li key={item.id} {...getItemProps({ item, index })} />
        ))}
      </ul>

      <div id="is-open" data-value={isOpen} />
      <div id="selected-item" data-value={selectedItem?.id ?? 'null'} />
      <div id="highlighted-index" data-value={highlightedIndex} />
    </>
  );
}

class Test {
  user: ReturnType<typeof userEvent.setup>;

  constructor(useSelect: UseSelect) {
    this.user = userEvent.setup();

    render(<Select useSelect={useSelect} />);
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
    return document.getElementById(`select-item-${index}`)!;
  }

  expectState(state: {
    isOpen?: boolean;
    selectedItem?: string | null;
    highlightedIndex?: number;
  }) {
    expect(this.getDataValue('is-open')).toEqual(String(state.isOpen ?? false));

    expect(this.getDataValue('selected-item')).toEqual(
      String(state.selectedItem ?? null),
    );

    expect(this.getDataValue('highlighted-index')).toEqual(
      String(state.highlightedIndex ?? -1),
    );
  }

  private getDataValue(id: string) {
    return document.getElementById(id)?.getAttribute('data-value');
  }
}

function toggleButton(useSelect: UseSelect) {
  let test: Test;
  let toggleButton: HTMLElement;

  beforeEach(() => {
    test = new Test(useSelect);
    toggleButton = test.toggleButton;
    act(() => {
      toggleButton.focus();
    });
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
    test.expectState({ isOpen: false, selectedItem: '1' });
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
    test.expectState({ isOpen: false, selectedItem: '1' });
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
    test.expectState({ isOpen: false, selectedItem: '1' });
  });

  it('keeps the selected item on blur', async () => {
    await act(async () => test.user.keyboard('{ArrowDown}'));
    await act(async () => test.user.keyboard('{Enter}'));
    await act(async () => test.user.keyboard('{Enter}'));
    await act(async () => test.user.tab());
    test.expectState({ isOpen: false, selectedItem: '1' });
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

      await act(async () => {
        toggleButton.focus();
        await test.user.keyboard('{ArrowDown}');
      });

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

      await act(async () => {
        await test.user.click(toggleButton);
      });

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
    await act(async () => {
      test.toggleButton.focus();
      await test.user.keyboard('{ArrowDown}');

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

    act(() => test.toggleButton.focus());
    await act(() => test.user.keyboard('{Enter}'));
  });

  it('highlight an item on mouse move', async () => {
    await act(() => test.user.pointer({ target: menuItem1 }));
    test.expectState({ isOpen: true, highlightedIndex: 0 });
  });

  it('select an item on click', async () => {
    await act(() =>
      test.user.pointer({ target: menuItem1, keys: '[MouseLeft]' }),
    );

    test.expectState({ isOpen: false, selectedItem: '1' });
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

      await act(() => test.user.keyboard('{ArrowDown}{Enter}'));

      expect(menuItem1).toHaveAttribute('aria-selected', 'true');
      expect(menuItem2).toHaveAttribute('aria-selected', 'false');
    });
  });
}
