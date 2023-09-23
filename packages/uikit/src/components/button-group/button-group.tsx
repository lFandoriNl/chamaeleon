import clsx from 'clsx';
import React from 'react';
import { ButtonProps } from '../button';

export type ButtonGroupProps = {
  className?: string;
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  children?: React.ReactNode | React.ReactNode[];
};

export function ButtonGroup(props: ButtonGroupProps): React.ReactNode {
  return (
    <div className={clsx('ui-button-group', props.className)}>
      {React.Children.map(props.children, (child, index) => {
        if (React.isValidElement(child)) {
          let className = '';

          if (Array.isArray(props.children)) {
            const isFirst = props.children.length > 1 && index === 0;

            const isLast =
              props.children.length > 1 && index === props.children.length - 1;

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
            color: props.color,
            size: props.size,
          });
        }

        return child;
      })}
    </div>
  );
}
