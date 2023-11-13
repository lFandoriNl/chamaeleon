import React, { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';

import {
  computePosition,
  autoUpdate,
  flip,
  shift,
  limitShift,
} from '@floating-ui/dom';

import { useOnClickOutside } from '@chamaeleon/hooks';

type MenuProps = {
  anchorEl: HTMLElement | null;
  items: Array<{
    id: string;
    name: string;
    component: React.ReactNode;
  }>;
  onClick: (item: { id: string; name: string }) => void;
  onClose?: () => void;
};

export const Menu = ({
  anchorEl = null,
  items,
  onClick,
  onClose,
}: MenuProps) => {
  const [show, setShow] = useState(false);

  const anchorRef = useRef<HTMLElement>(anchorEl);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anchorElement = anchorRef.current;
    const dropdownElement = dropdownRef.current;

    if (!anchorElement || !dropdownElement) return;

    console.log(anchorElement, dropdownElement);

    const cleanup = autoUpdate(anchorElement, dropdownElement, () => {
      computePosition(anchorElement, dropdownElement, {
        placement: 'bottom-start',
        middleware: [flip(), shift({ limiter: limitShift() })],
      }).then(({ x, y }) => {
        Object.assign(dropdownElement.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });

    setShow(true);

    const open = () => {
      setShow(true);
    };

    anchorElement.addEventListener('click', open);

    return () => {
      anchorElement.removeEventListener('click', open);

      cleanup();
    };
  }, [dropdownRef.current]);

  useOnClickOutside(dropdownRef, () => {
    setShow(false);
    onClose?.();
  });

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        show ? 'block' : 'hidden',
        'top-0, absolute left-0 w-max',
        'z-50 float-left mt-2 min-w-[12rem] rounded py-2 shadow-md',
        'bg-gray-50',
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          className={clsx(
            'w-full p-2 text-left hover:bg-gray-200 active:bg-gray-300',
            'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600',
          )}
          onClick={() => {
            onClick({
              id: item.id,
              name: item.name,
            });

            setShow(false);
          }}
        >
          {item.component}
        </button>
      ))}
    </div>
  );
};
