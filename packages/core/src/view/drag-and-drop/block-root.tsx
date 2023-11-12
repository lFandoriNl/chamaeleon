import React, { forwardRef, useContext, useMemo } from 'react';

import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

import { useCombinedRefs } from '@chamaeleon/hooks';

import { Block } from '../../model';
import { useSortable } from './use-sortable';
import { useEditorInstance } from '../use-editor-instance';
import { CSS } from '@dnd-kit/utilities';

type BlockProps = {
  id: Block['id'];
  withActivator?: boolean;
  children: React.ReactElement | [React.ReactElement, ...React.ReactNode[]];
};

type DndConnectorContextValue =
  | {
      withActivator: false;
      block: Block;
    }
  | {
      withActivator: true;
      block: Block;
      ref: (element: HTMLElement | null) => void;
      attributes: DraggableAttributes;
      listeners?: SyntheticListenerMap;
    };

export const DndConnectorContext =
  React.createContext<DndConnectorContextValue | null>(null);

export const useDndConnector = () => {
  const value = useContext(DndConnectorContext);

  if (!value) {
    throw new Error('useDndConnector can only be used inside BlockRoot');
  }

  return value;
};

export const BlockRoot = forwardRef<HTMLElement, BlockProps>(
  ({ id, withActivator = true, children }, ref) => {
    const { view } = useEditorInstance();

    const block = view.state.getBlock(id);

    const {
      setNodeRef,
      setActivatorNodeRef,
      attributes,
      listeners,
      transform,
      transition,
    } = useSortable(block);

    const value = useMemo((): DndConnectorContextValue => {
      if (withActivator) {
        return {
          withActivator: true,
          block,
          ref: setActivatorNodeRef,
          attributes,
          listeners,
        };
      }

      return {
        withActivator: false,
        block,
      };
    }, [
      id,
      withActivator,
      ...(withActivator ? [setActivatorNodeRef, attributes, listeners] : []),
    ]);

    const [firstChild, ...restChildren] = Array.isArray(children)
      ? children
      : ([children] as const);

    //@ts-expect-error
    const combinedRef = useCombinedRefs(ref, setNodeRef, firstChild.ref);

    const style = {
      transform: CSS.Translate.toString(transform),
      transition,
    };

    return (
      <DndConnectorContext.Provider value={value}>
        {React.cloneElement(firstChild, {
          ...firstChild.props,
          ref: combinedRef,
          style: {
            ...firstChild.props.style,
            ...style,
          },
          ...(withActivator ? {} : { ...attributes, ...listeners }),
          'data-block-id': id,
        })}

        {restChildren}
      </DndConnectorContext.Provider>
    );
  },
);

BlockRoot.displayName = 'BlockRoot';
