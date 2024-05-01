import { createEffect } from 'solid-js';

export function createControlProp<T>(
  getValue: (() => T | undefined) | undefined,
  onChange: (value: T) => void,
) {
  let prev = getValue?.();

  createEffect(() => {
    const value = getValue?.();

    if (value !== undefined && value !== prev) {
      onChange(value);
    }

    prev = value;
  });
}
