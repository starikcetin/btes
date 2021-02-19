/** Returns false if value is `null` or `undefined`; true otherwise. */
export function hasValue<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}
