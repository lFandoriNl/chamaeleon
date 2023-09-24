import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import { Instance, Placement, Rect, createPopper } from '@popperjs/core';

export type ActionsTooltipProps = {
  className?: string;
  placement?: Placement;
  component?: React.ReactNode;
  components?: Array<{
    show?: boolean;
    placement: Placement;
    component: React.ReactNode;
  }>;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function ActionsTooltip(props: ActionsTooltipProps) {
  const { className, children } = props;

  const [isOpen, setOpen] = useState(false);

  const referenceRef = useRef<HTMLDivElement>(null);
  const popperRef = useRef<HTMLDivElement[]>([]);

  const popperInstances = useRef<
    Array<{
      popper: Instance;
      destroy: () => void;
    }>
  >([]);

  const components = props.component
    ? [
        {
          placement: props.placement || 'top-end',
          component: props.component,
        },
      ]
    : props.components || [];

  useEffect(() => {
    const referenceElement = referenceRef.current;

    if (!referenceElement || popperRef.current.length === 0) return;

    const open = () => setOpen(true);
    const close = () => setOpen(false);

    referenceElement.addEventListener('mouseover', open);
    referenceElement.addEventListener('mouseleave', close);

    referenceElement.addEventListener('focus', open);
    referenceElement.addEventListener('blur', close);

    popperInstances.current = popperRef.current.map((popperElement, i) => {
      popperElement.addEventListener('mouseover', open);
      popperElement.addEventListener('mouseleave', close);

      const popper = createPopper(referenceElement, popperElement, {
        placement: components[i].placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: ({
                placement,
                popper,
              }: {
                placement: Placement;
                reference: Rect;
                popper: Rect;
              }) => {
                const offsetMap = {
                  auto: [],
                  'auto-start': [],
                  'auto-end': [],
                  'top-start': [],
                  top: [],
                  'top-end': [popper.width / 2, -popper.height / 2],
                  'right-start': [],
                  right: [],
                  'right-end': [],
                  'bottom-start': [],
                  bottom: [],
                  'bottom-end': [],
                  'left-start': [],
                  left: [0, -popper.width / 2],
                  'left-end': [],
                };

                return offsetMap[placement];
              },
            },
          },
        ],
      });

      return {
        popper,
        destroy: () => {
          popperElement.removeEventListener('mouseover', open);
          popperElement.removeEventListener('mouseleave', close);

          popper.destroy();
        },
      };
    });

    return () => {
      referenceElement.removeEventListener('mouseover', open);
      referenceElement.removeEventListener('mouseleave', close);

      referenceElement.removeEventListener('focus', open);
      referenceElement.removeEventListener('blur', close);

      popperInstances.current.forEach(({ destroy }) => destroy());

      popperInstances.current = [];
    };
  }, [children]);

  useEffect(() => {
    popperInstances.current.forEach(({ popper }) => popper.update());
  });

  if (!React.isValidElement(children)) return null;

  return (
    <>
      {React.cloneElement(children, {
        ...children.props,
        ref: referenceRef,
      })}

      {components.map(({ show = true, component }, index) => {
        if (!show) return null;

        return ReactDOM.createPortal(
          <div
            key={index}
            ref={(element) => {
              if (element) {
                popperRef.current[index] = element;
              }
            }}
            className={clsx(isOpen ? 'visible' : 'invisible', className)}
          >
            {component}
          </div>,
          document.body,
        );
      })}
    </>
  );
}
