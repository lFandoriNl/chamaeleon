import { isFunction } from './is-function';
import { MaybeReturnType } from '../types';

export function callOrReturn<T>(
  value: T,
  context: any = undefined,
  ...props: any[]
): MaybeReturnType<T> {
  if (isFunction(value)) {
    if (context) {
      return value.bind(context)(...props);
    }

    return value(...props);
  }

  return value as MaybeReturnType<T>;
}
