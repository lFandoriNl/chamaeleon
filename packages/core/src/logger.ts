import { Entries } from './types';

export type LoggerOptions = {
  element: HTMLElement | string;
};

export interface Logger {
  init(options: LoggerOptions): void;
  log(data: Data): void;
  info(data: Data): void;
  warn(data: Data): void;
  error(data: Data): void;
  action(data: Data): void;
  system(data: Data): void;
}

type Level = Exclude<keyof Logger, 'init'>;
type Data = number | string | Record<string, any> | any[];

type LogItemHTMLOptions = {
  className: string;
  level: string;
  time: string;
  data: string;
};

export function createLogger(): Logger {
  let logElement!: HTMLElement;

  let initialized = false;

  const logBuffer: Array<{
    level: Level;
    data: Data;
  }> = [];

  const logLevelPadEnd = (level: string) => {
    return level.padEnd(6, ' ');
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  const createLogItemHTML = ({
    className,
    level,
    time,
    data,
  }: LogItemHTMLOptions) => {
    return `<div class="flex border-b border-black last:border-b-0 p-2${
      className ? ` ${className}` : ''
    }">
      <pre class="pr-4">${level}</pre>
      <pre class="pr-4">${time}</pre>
      <pre class="text-sm">${data}</pre>
    </div>`;
  };

  const addLogItem = (html: string) => {
    logElement.innerHTML = html + logElement.innerHTML;
  };

  const logger: Logger = {
    init({ element }) {
      const foundElement =
        typeof element === 'string'
          ? document.querySelector<HTMLElement>(element)
          : element;

      if (!foundElement) throw new Error('Not found logger element.');

      logElement = foundElement;
      logElement.innerHTML = '';

      initialized = true;

      while (logBuffer.length > 0) {
        const logItem = logBuffer.shift();

        if (logItem) {
          logger[logItem.level](logItem.data);
        }
      }
    },
    log: (data) => {
      const date = new Date();

      addLogItem(
        createLogItemHTML({
          className: 'bg-emerald-200',
          level: logLevelPadEnd('log'),
          time: formatTime(date),
          data: JSON.stringify(data, null, 2),
        }),
      );
    },
    info: (data) => {
      const date = new Date();

      addLogItem(
        createLogItemHTML({
          className: 'bg-sky-200',
          level: logLevelPadEnd('info'),
          time: formatTime(date),
          data: JSON.stringify(data, null, 2),
        }),
      );
    },
    warn: (data) => {
      const date = new Date();

      addLogItem(
        createLogItemHTML({
          className: 'bg-yellow-200',
          level: logLevelPadEnd('warn'),
          time: formatTime(date),
          data: JSON.stringify(data, null, 2),
        }),
      );
    },
    error: (data) => {
      const date = new Date();

      addLogItem(
        createLogItemHTML({
          className: 'bg-red-200',
          level: logLevelPadEnd('error'),
          time: formatTime(date),
          data: JSON.stringify(data, null, 2),
        }),
      );
    },
    action: (data) => {
      const date = new Date();

      addLogItem(
        createLogItemHTML({
          className: 'bg-amber-500',
          level: logLevelPadEnd('action'),
          time: formatTime(date),
          data: JSON.stringify(data, null, 2),
        }),
      );
    },
    system: (data) => {
      const date = new Date();

      addLogItem(
        createLogItemHTML({
          className: 'bg-gray-300',
          level: logLevelPadEnd('system'),
          time: formatTime(date),
          data: JSON.stringify(data, null, 2),
        }),
      );
    },
  };

  (Object.entries(logger) as Entries<Logger>).forEach(([key, fn]) => {
    if (key !== 'init') {
      logger[key] = (data) => {
        if (!initialized) {
          logBuffer.push({
            level: key,
            data,
          });

          return;
        }

        fn(data);
      };
    }
  });

  return logger;
}
