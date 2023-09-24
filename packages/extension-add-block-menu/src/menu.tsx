import React, { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';

import { createPopper } from '@popperjs/core';

import { useOnClickOutside } from '@chameleon/hooks';

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

    const popper = createPopper(anchorElement, dropdownElement, {
      placement: 'bottom-start',
    });

    setShow(true);

    const handleClick = () => {
      setShow(true);
    };

    anchorElement.addEventListener('click', handleClick);

    return () => {
      anchorElement.removeEventListener('click', handleClick);

      popper.destroy();
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
        'min-w-[12rem] mt-2 py-2 z-50 float-left rounded shadow-md',
        'bg-gray-50',
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          className={clsx(
            'p-2 w-full text-left hover:bg-gray-200 active:bg-gray-300',
            'focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600',
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
