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
  size = '500px',
  children,
}: DrawerProps) => {
  if (!open) return null;

  return (
    <div
      tabIndex={-1}
      className={clsx(
        'z-[100] flex h-full flex-shrink-0 flex-col border-b border-l bg-white outline-0 max-md:fixed max-md:inset-0 max-md:!w-full',
        className,
      )}
      style={{ width: size }}
    >
      {children}
    </div>
  );
};
