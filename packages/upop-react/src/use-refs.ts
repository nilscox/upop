import { useCallback, useRef } from 'react';

export function useRefs<T, E extends HTMLElement = HTMLElement>() {
  const refs = useRef(new Map<T, HTMLElement>());

  const capture = useCallback((item: T, ref: E | null) => {
    if (ref === null) {
      refs.current.delete(item);
    } else {
      refs.current.set(item, ref);
    }
  }, []);

  return [refs.current, capture] as const;
}
