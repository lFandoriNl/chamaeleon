import clsx from 'clsx';
import React from 'react';

export type PanelButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export function PanelButton(props: PanelButtonProps) {
  return (
    <button className={clsx('', props.className)}>{props.children}</button>
  );
}
