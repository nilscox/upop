import { useEffect, useRef } from 'react';

export function useControlProp<T>(
  value: T | undefined,
  onChange: (value: T) => void,
) {
  const prev = useRef(value);

  useEffect(() => {
    if (value !== undefined && value !== prev.current) {
      onChange(value);
    }
  }, [value]);
}
