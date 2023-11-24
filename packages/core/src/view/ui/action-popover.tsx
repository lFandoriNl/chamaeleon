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
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

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
          offsetMiddleware(offset),
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
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 'max-content',
        zIndex: 50,
        ...(isOpen ? { visibility: 'visible' } : { visibility: 'hidden' }),
        ...(isDragging && { visibility: 'hidden' }),
      }}
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
    </div>,
    document.body,
  );
}
