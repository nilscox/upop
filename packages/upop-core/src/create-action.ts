type Action<Type> = { type: Type };
type PayloadAction<Type, Payload> = { type: Type } & Payload;

export function createAction<Type extends string>(
  type: Type,
): () => Action<Type>;

export function createAction<
  Type extends string,
  Params extends unknown[],
  Payload,
>(
  type: Type,
  prepare: (...params: Params) => Payload,
): (...params: Params) => PayloadAction<Type, Payload>;

export function createAction<
  Type extends string,
  Params extends unknown[],
  Payload,
>(type: Type, prepare?: (...params: Params) => Payload) {
  return (...params: Params) => ({ type, ...prepare?.(...params) });
}
