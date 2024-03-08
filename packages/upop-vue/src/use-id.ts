let globalId = 0;

export function useId(id?: string) {
  return id ?? String(globalId++);
}
