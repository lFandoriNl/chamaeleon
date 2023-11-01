export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type Level = Exclude<keyof Logger, 'init'>;
export type Data = number | string | Record<string, any> | any[];

export interface Logger {
  init(): void;
  log(data: Data): void;
  info(data: Data): void;
  warn(data: Data): void;
  error(data: Data): void;
  action(data: Data): void;
  system(data: Data): void;
}
