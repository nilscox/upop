import { Ref, watch, toValue } from 'vue';

export function useControlProp<T>(
  value: Ref<T> | undefined,
  onChange: (value: T) => void,
) {
  if (value !== undefined) {
    watch(value, () => {
      onChange(toValue(value));
    });
  }
}
