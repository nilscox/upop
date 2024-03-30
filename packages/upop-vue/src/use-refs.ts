export function useRefs<T, E extends HTMLElement = HTMLElement>() {
  const refs = new Map<T, E>();

  const capture = (item: T, ref: E | null) => {
    if (ref === null) {
      refs.delete(item);
    } else {
      refs.set(item, ref);
    }
  };

  return [refs, capture] as const;
}
