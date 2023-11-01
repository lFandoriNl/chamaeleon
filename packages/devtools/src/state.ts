import { atom } from 'nanostores';

import { Data, Level } from './types';

let id = 0;

const nextId = () => {
  id += 1;
  return id;
};

export type LogItem = {
  id: number;
  level: Level;
  time: number;
  data: Data;
};

export const $logs = atom<LogItem[]>([]);

export const addLogItem = (level: Level, data: Data) => {
  $logs.set([
    ...$logs.get(),
    {
      id: nextId(),
      level,
      time: Date.now(),
      data,
    },
  ]);
};
