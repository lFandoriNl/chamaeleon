import { useCombinedRefs } from '@chamaeleon/hooks';
import { SortableContext } from '@dnd-kit/sortable';
import React, { forwardRef, useContext } from 'react';

import { Block } from '../../model';
import { DndConnectorContext } from './draggable';

type DropzoneProps = {
  block?: Block;
  children: React.ReactElement;
};

export const Dropzone = forwardRef<HTMLElement, DropzoneProps>(
  ({ block, children }, ref) => {
    const context = useContext(DndConnectorContext);

    const blockValue = block || context?.block;

    if (!blockValue)
      throw new Error(
        'Dropzone must be used as a child block in BlockRoot or must pass Block',
      );

    return (
      <SortableContext
        id={blockValue.id}
        items={blockValue.children.children}
        strategy={() => null}
      >
        {React.cloneElement(children, {
          ...children.props,
          // @ts-expect-error
          ref: useCombinedRefs(ref, children.ref),
        })}
      </SortableContext>
    );
  },
);

Dropzone.displayName = 'Dropzone';
