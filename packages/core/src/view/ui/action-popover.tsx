import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import {
  computePosition,
  autoUpdate,
  flip,
  shift,
  limitShift,
  offset as offsetMiddleware,
  Placement,
  OffsetOptions,
} from '@floating-ui/dom';

import { EditorView } from '../editor-view';

export type ActionPopoverProps = {
  referenceRef: React.RefObject<HTMLElement | undefined>;
  className?: string;
  placement?: Placement;
  offset?: OffsetOptions;
  children: React.ReactNode;
} & {
  view: EditorView;
};

export function ActionPopover(props: ActionPopoverProps) {
  const {
    referenceRef,
    className,
    placement = 'top-end',
    offset,
    children,
    view,
  } = props;

  const [isDragging] = view.dragAndDrop.useState((state) => state.isDragging);

  const [isOpen, setOpen] = useState(false);

  const popperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!popperRef.current) return;

    const referenceElement = referenceRef.current;
    if (!referenceElement) throw new Error('Reference element not found');

    const open = () => setOpen(true);
    const close = () => setOpen(false);

    referenceElement.addEventListener('mouseover', open);
    referenceElement.addEventListener('mouseleave', close);

    referenceElement.addEventListener('focus', open);
    referenceElement.addEventListener('blur', close);

    const popperElement = popperRef.current;

    const cleanup = autoUpdate(referenceElement, popperElement, () => {
      computePosition(referenceElement, popperElement, {
        placement,
        middleware: [
          flip(),
          shift({ limiter: limitShift() }),
          offsetMiddleware(
            offset !== undefined
              ? offset
              : ({ placement, rects: { floating } }) => {
                  switch (placement) {
                    case 'top-start':
                      return {
                        mainAxis: -floating.height - 4,
                      };
                    case 'top-end':
                      return {
                        crossAxis: floating.width / 2,
                        mainAxis: -floating.height / 2,
                      };

                    default:
                      return 0;
                  }
                },
          ),
        ],
      }).then(({ x, y }) => {
        Object.assign(popperElement.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });

    return () => {
      referenceElement.removeEventListener('mouseover', open);
      referenceElement.removeEventListener('mouseleave', close);

      referenceElement.removeEventListener('focus', open);
      referenceElement.removeEventListener('blur', close);

      cleanup();
    };
  }, [referenceRef.current, children]);

  return ReactDOM.createPortal(
    <div
      ref={popperRef}
      className={clsx(
        'top-0, absolute left-0 z-50 w-max',
        isOpen ? 'visible' : 'invisible',
        isDragging && 'invisible',
        className,
      )}
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
    </div>,
    document.body,
  );
}
