export function isNotNullOrUndefined<T>(
  value: null | undefined | T,
): value is T {
  return value !== null && value !== undefined;
}
