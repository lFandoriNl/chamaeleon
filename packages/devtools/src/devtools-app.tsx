import { useState } from 'react';
import clsx from 'clsx';
import { Resizable } from 're-resizable';

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

  const [isResize, setIsResize] = useState(false);
  const [height, setHeight] = useState(() => {
    const persistedHeight = localStorage.getItem('devtools-height');
    return persistedHeight ? parseInt(persistedHeight) : 300;
  });

  const logs = useStore($logs);

  const { outerRef, innerRef } = useScrollContainer([logs]);

  return (
    <div className="chamaeleon-logger fixed bottom-0 left-0 right-0">
      {!isOpen && (
        <button
          className="fixed bottom-3 left-3 z-[1000] rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
          onClick={() => setIsOpen(true)}
        >
          <ChamaeleonIcon />
        </button>
      )}

      {isOpen && (
        <Resizable
          className="flex h-full flex-col bg-white"
          handleClasses={{
            top: clsx(
              "before:content[''] before:absolute before:mt-1 before:h-[1px] before:w-full before:bg-slate-200",
              'before:hover:h-[3px] before:hover:bg-blue-500',
              isResize && 'before:h-[3px] before:bg-blue-500',
            ),
          }}
          enable={{ top: true }}
          size={{ width: '100%', height }}
          onResizeStart={() => {
            setIsResize(true);
          }}
          onResizeStop={(event, direction, ref, d) => {
            const newHeight = height + d.height;

            setHeight(newHeight);
            setIsResize(false);

            localStorage.setItem('devtools-height', String(newHeight));
          }}
        >
          <div className="flex justify-between border-b bg-white p-2">
            <div></div>

            <div>
              <button
                className="rounded-lg bg-gray-100 px-4 py-2 outline-blue-800 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2"
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
        </Resizable>
      )}
    </div>
  );
};
