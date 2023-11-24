import { useCombinedRefs } from '@chamaeleon/hooks';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { CSS } from '@dnd-kit/utilities';
import React, {
  ReactElement,
  ReactNode,
  Ref,
  forwardRef,
  useContext,
  useMemo,
} from 'react';

import { Block } from '../../model';
import { useEditorInstance } from '../use-editor-instance';
import { useSortable } from './use-sortable';

type DraggableProps = {
  id: Block['id'];
  withActivator?: boolean;
  children:
    | ((connectorAttrs: {
        ref: Ref<HTMLElement>;
        attrs: Partial<DraggableAttributes> & {
          'data-block-id': Block['id'];
        };
        listeners?: SyntheticListenerMap;
        style: {
          transform?: string;
          transition?: string;
        };
      }) => ReactElement)
    | ReactElement
    | [ReactElement, ...ReactNode[]];
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

export const Draggable = forwardRef<HTMLElement, DraggableProps>(
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

    const style = {
      transform: CSS.Translate.toString(transform),
      transition,
    };

    if (typeof children === 'function') {
      return (
        <DndConnectorContext.Provider value={value}>
          {children({
            ref: useCombinedRefs(ref, setNodeRef),
            attrs: {
              'data-block-id': id,
              ...(withActivator ? {} : attributes),
            },
            listeners: withActivator ? {} : listeners,
            style,
          })}
        </DndConnectorContext.Provider>
      );
    }

    const [firstChild, ...restChildren] = Array.isArray(children)
      ? children
      : ([children] as const);

    //@ts-expect-error
    const combinedRef = useCombinedRefs(ref, setNodeRef, firstChild.ref);

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

Draggable.displayName = 'Draggable';
