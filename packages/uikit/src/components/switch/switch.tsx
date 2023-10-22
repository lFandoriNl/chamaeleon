import React, { HTMLAttributes, useState } from 'react';
import clsx from 'clsx';

export type SwitchProps = HTMLAttributes<HTMLInputElement> & {
  className?: string;
  label?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export function Switch({
  className,
  label,
  checked,
  onChange,
  ...props
}: SwitchProps): React.ReactNode {
  const [innerChecked, setInnerChecked] = useState(false);

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInnerChecked(event.target.checked);
  };

  return (
    <label
      className={clsx(
        'relative mb-4 inline-flex cursor-pointer items-center',
        className,
      )}
    >
      <input
        className="peer sr-only"
        type="checkbox"
        value={String(checked === undefined ? innerChecked : checked)}
        onChange={onChange || handleChecked}
        {...props}
      />
      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
}
