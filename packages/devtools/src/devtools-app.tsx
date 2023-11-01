import { useState } from 'react';

import { useStore } from '@nanostores/react';

import { LogItem } from './log-item';

import { $logs } from './state';

import { Level } from './types';
import { ChamaeleonIcon } from './chamaeleon-icon';
import { useScrollContainer } from './use-scroll-container';

const levelColors: Record<Level, string> = {
  log: 'bg-emerald-200',
  info: 'bg-sky-200',
  warn: 'bg-yellow-200',
  error: 'bg-red-200',
  action: 'bg-amber-500',
  system: 'bg-gray-300',
};

export const DevtoolsApp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const logs = useStore($logs);

  const { outerRef, innerRef, canScrollDown, scrollToDown } =
    useScrollContainer([logs]);

  return (
    <div className="chamaeleon-logger fixed bottom-0 left-0 right-0">
      {!isOpen && (
        <button
          className="fixed bottom-3 left-3 rounded-lg p-1 outline-blue-800 active:outline active:outline-2"
          onClick={() => setIsOpen(true)}
        >
          <ChamaeleonIcon />
        </button>
      )}

      {isOpen && (
        <div
          className="flex h-full flex-col border-t bg-white"
          style={{ height: 300 }}
        >
          <div className="flex justify-between border-b bg-white p-2">
            <div>
              {canScrollDown && <button onClick={scrollToDown}>Scroll</button>}
            </div>

            <div>
              <button
                className="rounded-lg bg-gray-100 px-4 py-2 outline-blue-800 hover:bg-gray-200 focus:outline focus:outline-2"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>

          <div
            ref={outerRef}
            className="outerDiv relative flex-1 overflow-y-auto"
          >
            <div ref={innerRef} className="innerDiv">
              {logs.map((logItem) => {
                return (
                  <LogItem
                    key={logItem.id}
                    className={levelColors[logItem.level]}
                    level={logItem.level}
                    time={logItem.time}
                    data={JSON.stringify(logItem.data, null, 2)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
