import React, { useState } from 'react';
import clsx from 'clsx';

export type SwitchProps = {
  className?: string;
  label?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export function Switch(props: SwitchProps) {
  const [checked, setChecked] = useState(false);

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <label
      className={clsx(
        'relative inline-flex items-center mb-4 cursor-pointer',
        props.className,
      )}
    >
      <input
        className="sr-only peer"
        type="checkbox"
        value={String(props.checked === undefined ? checked : props.checked)}
        onChange={props.onChange || handleChecked}
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      {props.label && (
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {props.label}
        </span>
      )}
    </label>
  );
}
