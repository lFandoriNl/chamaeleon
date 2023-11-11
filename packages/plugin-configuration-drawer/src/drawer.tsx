import clsx from 'clsx';

type DrawerProps = {
  className?: string;
  open: boolean;
  size?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export const Drawer = ({
  className,
  open,
  size = '400px',
  children,
}: DrawerProps) => {
  if (!open) return null;

  return (
    <div
      tabIndex={-1}
      className={clsx(
        'flex h-full flex-shrink-0 flex-col border-b border-l bg-white outline-0',
        className,
      )}
      style={{ width: size }}
    >
      {children}
    </div>
  );
};
