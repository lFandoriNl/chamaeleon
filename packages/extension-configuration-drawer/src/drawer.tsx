import { useEffect } from 'react';
import clsx from 'clsx';

type DrawerProps = {
  className?: string;
  open: boolean;
  direction: 'right' | 'left';
  enableOverlay?: boolean;
  size?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export const Drawer = ({
  className,
  open,
  direction,
  enableOverlay = true,
  size = '400px',
  onClose,
  children,
}: DrawerProps) => {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      {enableOverlay && (
        <div
          className={clsx(
            'fixed inset-0 bg-[#00000080] opacity-0 transition-all duration-300 ease-in-out',
            {
              'z-0 opacity-30': open,
              'invisible -z-10 opacity-0': !open,
            },
          )}
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      <div
        tabIndex={-1}
        className={clsx(
          `fixed top-0 z-[1200] flex h-full flex-shrink-0 flex-col bg-white outline-0`,
          'transition-all duration-300 ease-in-out',
          {
            'invisible flex-shrink-0': !open,
            'translate-x-full': !open && direction === 'right',
            '-translate-x-full': !open && direction === 'left',
            'left-0 right-auto': direction === 'left',
            'left-auto right-0': direction === 'right',
          },
          className,
        )}
        style={{ width: size }}
      >
        {children}
      </div>
    </>
  );
};
