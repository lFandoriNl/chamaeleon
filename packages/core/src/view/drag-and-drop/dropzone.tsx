import { useContext } from 'react';

import {
  SortableContext,
  rectSortingStrategy,
  rectSwappingStrategy,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import { DndConnectorContext } from './block-root';
import { Block } from '../../model';

const strategies = {
  rect: rectSortingStrategy,
  rectSwapping: rectSwappingStrategy,
  vertical: verticalListSortingStrategy,
  horizontal: horizontalListSortingStrategy,
};

type DropzoneProps = {
  block?: Block;
  strategy?: keyof typeof strategies;
  children: React.ReactNode;
};

export function Dropzone({
  block,
  strategy = 'rect',
  children,
}: DropzoneProps) {
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
      strategy={strategies[strategy]}
    >
      {children}
    </SortableContext>
  );
}
