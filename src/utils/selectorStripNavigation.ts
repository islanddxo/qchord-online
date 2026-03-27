/** Previous item in a cyclic strip (matches findIndex → idx fallback → modulo). */
export function stripSelectPrev<T extends { id: string }>(
  items: readonly T[],
  currentId: T["id"],
): T["id"] {
  const n = items.length;
  const i = items.findIndex((it) => it.id === currentId);
  const idx = i < 0 ? 0 : i;
  return items[(idx - 1 + n) % n]!.id;
}

/** Next item in a cyclic strip. */
export function stripSelectNext<T extends { id: string }>(
  items: readonly T[],
  currentId: T["id"],
): T["id"] {
  const n = items.length;
  const i = items.findIndex((it) => it.id === currentId);
  const idx = i < 0 ? 0 : i;
  return items[(idx + 1) % n]!.id;
}
