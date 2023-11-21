import { addLogItem } from './state';
import { Entries, Logger, Level, Data } from './types';

type CreateLoggerOptions = {
  addLogItem: typeof addLogItem;
};

export function createLogger({ addLogItem }: CreateLoggerOptions): Logger {
  let initialized = false;

  const logBuffer: Array<{
    level: Level;
    data: Data;
  }> = [];

  const logger: Logger = {
    init() {
      initialized = true;

      while (logBuffer.length > 0) {
        const logItem = logBuffer.shift();

        if (logItem) {
          logger[logItem.level](logItem.data);
        }
      }
    },
    log: (data) => {
      addLogItem('log', data);
    },
    info: (data) => {
      addLogItem('info', data);
    },
    warn: (data) => {
      addLogItem('warn', data);
    },
    error: (data) => {
      addLogItem('error', data);
    },
    action: (data) => {
      addLogItem('action', data);
    },
    system: (data) => {
      addLogItem('system', data);
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
