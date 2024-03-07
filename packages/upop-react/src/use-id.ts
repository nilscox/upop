import { useId as useIdReact } from 'react';

export function useId(id?: string) {
  const generatedId = useIdReact();
  return id ?? generatedId;
}
