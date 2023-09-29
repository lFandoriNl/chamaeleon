type Fn = (...args: any[]) => any;

export function isFunction<T extends Fn>(value: any): value is T {
  return typeof value === 'function';
}
