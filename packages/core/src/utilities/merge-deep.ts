import { isPlainObject } from './is-plain-object';

export function mergeDeep(
  target: Record<string, any>,
  source: Record<string, any>,
): Record<string, any> {
  const result = { ...target };

  if (!(isPlainObject(target) && isPlainObject(source))) {
    return result;
  }

  for (const key in source) {
    if (isPlainObject(source[key])) {
      if (!(key in target)) {
        Object.assign(result, { [key]: source[key] });
      } else {
        result[key] = mergeDeep(target[key], source[key]);
      }
    } else {
      Object.assign(result, { [key]: source[key] });
    }
  }

  return result;
}
