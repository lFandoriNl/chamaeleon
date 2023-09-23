import React from 'react';
import clsx from 'clsx';

type Placement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left-start'
  | 'left'
  | 'left-end';

export type BlockTooltipProps = {
  className?: string;
  wrapperClassName?: string;
  placement?: Placement;
  component?: React.ReactNode;
  components?: Array<{
    placement: Placement;
    component: React.ReactNode;
  }>;
  children: React.ReactNode | React.ReactNode[];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function BlockTooltip(props: BlockTooltipProps) {
  const { className, wrapperClassName, children } = props;

  const components = props.component
    ? [
        {
          placement: props.placement || 'top-end',
          component: props.component,
        },
      ]
    : props.components || [];

  return (
    <div
      className={clsx('group/tooltip relative inline-flex', wrapperClassName)}
    >
      {children}

      {components.map(({ placement, component }, index) => {
        const placementMap = {
          'top-start': '',
          top: '',
          'top-end': '-top-0 -right-0 -translate-y-1/2 translate-x-1/2',
          'right-start': '',
          right: '',
          'right-end': '',
          'bottom-start': '',
          bottom: '',
          'bottom-end': '',
          'left-start': '',
          left: 'top-1/2 -left-0 -translate-y-1/2 -translate-x-1/2',
          'left-end': '',
        };

        return (
          <div
            key={index}
            className={clsx(
              'absolute z-10 hidden group-hover/tooltip:block group-focus/tooltip:block',
              placementMap[placement],
              className,
            )}
          >
            {component}
          </div>
        );
      })}
    </div>
  );
}
