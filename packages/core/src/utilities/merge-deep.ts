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
    if (!isPlainObject(target[key])) {
      if (key in source) {
        result[key] = source[key];
      }
    }

    if (isPlainObject(source[key])) {
      if (key in target) {
        if (!isPlainObject(target[key])) {
          result[key] = source[key];
        } else {
          result[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(result, { [key]: source[key] });
      }
    } else {
      Object.assign(result, { [key]: source[key] });
    }
  }

  return result;
}
