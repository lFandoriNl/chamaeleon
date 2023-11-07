import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import { Instance, Placement, Rect, createPopper } from '@popperjs/core';

import { EditorView } from '../editor-view';

function offset({
  placement,
  popper,
}: {
  placement: Placement;
  reference: Rect;
  popper: Rect;
}) {
  const offsetMap = {
    auto: [],
    'auto-start': [],
    'auto-end': [],
    'top-start': [0, -popper.height - 4],
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
}

export type ActionPopoverProps = {
  referenceRef: React.RefObject<HTMLElement | undefined>;
  className?: string;
  placement?: Placement;
  children: React.ReactNode;
} & {
  view: EditorView;
};

export function ActionPopover(props: ActionPopoverProps) {
  const {
    referenceRef,
    className,
    placement = 'top-end',
    children,
    view,
  } = props;

  const [isDragging] = view.dragAndDrop.useState((state) => state.isDragging);

  const [isOpen, setOpen] = useState(false);

  const popperRef = useRef<HTMLDivElement>(null);

  const popperInstance = useRef<Instance | null>(null);

  useEffect(() => {
    const referenceElement = referenceRef.current;

    if (!referenceElement) throw new Error('Reference element not found');

    if (!popperRef.current) return;

    const open = () => setOpen(true);
    const close = () => setOpen(false);

    referenceElement.addEventListener('mouseover', open);
    referenceElement.addEventListener('mouseleave', close);

    referenceElement.addEventListener('focus', open);
    referenceElement.addEventListener('blur', close);

    popperRef.current.addEventListener('mouseover', open);
    popperRef.current.addEventListener('mouseleave', close);

    popperInstance.current = createPopper(referenceElement, popperRef.current, {
      placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset,
          },
        },
      ],
    });

    return () => {
      referenceElement.removeEventListener('mouseover', open);
      referenceElement.removeEventListener('mouseleave', close);

      referenceElement.removeEventListener('focus', open);
      referenceElement.removeEventListener('blur', close);

      if (popperRef.current) {
        popperRef.current.removeEventListener('mouseover', open);
        popperRef.current.removeEventListener('mouseleave', close);
      }

      if (popperInstance.current) {
        popperInstance.current.destroy();
      }

      popperInstance.current = null;
    };
  }, [referenceRef.current, children]);

  useEffect(() => {
    popperInstance.current?.update();
  });

  return ReactDOM.createPortal(
    <div
      ref={popperRef}
      className={clsx(
        'z-50',
        isOpen ? 'visible' : 'invisible',
        isDragging && 'invisible',
        className,
      )}
    >
      {children}
    </div>,
    document.body,
  );
}
