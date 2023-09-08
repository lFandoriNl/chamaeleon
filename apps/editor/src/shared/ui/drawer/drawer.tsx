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
  return (
    <>
      {enableOverlay && (
        <div
          className={clsx(
            'fixed inset-0 opacity-0 bg-[#00000080] transition-all ease-in-out duration-300',
            {
              'opacity-30 z-0': open,
              'opacity-0 -z-10 invisible': !open,
            },
          )}
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      <div
        tabIndex={-1}
        className={clsx(
          `fixed top-0 flex flex-col flex-shrink-0 h-full outline-0 z-[1200] overflow-y-auto bg-white`,
          'transition-all ease-in-out duration-300',
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
