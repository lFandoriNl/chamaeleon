import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button';

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  children?: React.ReactNode | React.ReactNode[];
};

export function ButtonGroup({
  className,
  color,
  size,
  children,
  ...props
}: ButtonGroupProps): React.ReactNode {
  return (
    <div className={clsx('ui-button-group', className)} {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          let className = '';

          if (Array.isArray(children)) {
            const isFirst = children.length > 1 && index === 0;

            const isLast = children.length > 1 && index === children.length - 1;

            const isMiddle = !isFirst && !isLast;

            className = clsx(
              {
                'rounded-r-none': isFirst,
                '!rounded-none': isMiddle,
                'rounded-l-none': isLast,
              },
              child.props.className,
            );
          }

          return React.cloneElement(child, {
            ...child.props,
            className,
            color,
            size,
          });
        }

        return child;
      })}
    </div>
  );
}
