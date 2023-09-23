import React, { useRef, useState, useEffect } from 'react';
import { createPopper } from '@popperjs/core';
import clsx from 'clsx';

type MenuProps = {
  anchorEl?: HTMLElement;
};

export function Menu({ anchorEl }: MenuProps) {
  const [show, setShow] = useState(false);
  const [_, rerender] = useState(0);

  const anchorRef = useRef<HTMLElement>(anchorEl ? anchorEl : null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // console.log(anchorRef.current === anchorEl);

  useEffect(() => {
    // rerender((i) => i + 1);
  }, []);

  useEffect(() => {
    console.log(2, anchorRef.current, dropdownRef.current);

    const anchorElement = anchorRef.current;
    const dropdownElement = dropdownRef.current;

    if (!anchorElement || !dropdownElement) return;

    const handleClick = () => {
      console.log(3, anchorElement, dropdownElement);

      createPopper(anchorElement, dropdownElement, {
        placement: 'bottom-start',
      });

      setShow(true);
    };

    anchorElement.addEventListener('click', handleClick);

    return () => {
      if (anchorElement) {
        anchorElement.removeEventListener('click', handleClick);
      }
    };
  }, [dropdownRef.current]);

  console.log(1, anchorRef.current, dropdownRef.current);

  return (
    <div className="flex flex-wrap">
      <div className="w-full sm:w-6/12 md:w-4/12 px-4">
        <div className="relative inline-flex align-middle w-full">
          <div
            ref={dropdownRef}
            className={clsx(
              show ? 'block' : 'hidden',
              'bg-slate-700 text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1',
            )}
            style={{ minWidth: '12rem' }}
          >
            <button
              className={clsx(
                'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white',
              )}
            >
              Action 1
            </button>

            <button
              className={clsx(
                'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white',
              )}
            >
              Action 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
