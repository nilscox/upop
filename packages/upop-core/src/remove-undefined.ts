export function removeUndefined<T extends object>(obj: T) {
  return Object.entries(obj).reduce<Record<string, unknown>>(
    (obj, [key, value]) => {
      if (value !== undefined) {
        obj[key] = value;
      }

      return obj;
    },
    {},
  ) as T;
}
