/** Next element in `order` after `current`, wrapping (uses indexOf; -1 → first). */
export function nextCyclic<T>(order: readonly T[], current: T): T {
  const n = order.length;
  const i = order.indexOf(current);
  return order[(i + 1 + n) % n]!;
}
