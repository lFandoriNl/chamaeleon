import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { Plugin } from '..';
import { Block } from '../model';
import { Provider } from '../types';

function DragOverlayActiveBlock({
  Renderer,
  editor,
}: Omit<Parameters<Provider>[0], 'children'>) {
  const [activeBlock] = editor.view.dragAndDrop.useState(
    (state) => state.activeBlock,
  );

  return (
    <DragOverlay>
      {activeBlock && (
        <div>
          <Renderer block={activeBlock} />
        </div>
      )}
    </DragOverlay>
  );
}

// Dnd cases
// 1. Move to same container
//    - row
//      - column ->
//      - column
//      - place <-
//
// 2. Move to same container with nested non-empty container
//    - row ->
//    - row
//      - column
//      - column
//    - place <-
//
// 3. Move to different container
//    - row
//      - column ->
//      - column
//    - row
//      - column
//      - place <-
//
// 4. Move from one container to another higher or lower container
//    - row
//      - column
//        - row
//          - column
//          - column ->
//      - place <-
//
//    -- or --
//
//    - row
//      - column
//        - row
//          - place <-
//          - column
//      - column ->

const blockToLog = (block: Block) => {
  return `${block.type.name}-${block.id}`;
};

const DragAndDropProvider: Provider = ({ Renderer, editor, children }) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const move = (
    fromContainerId: Block['id'],
    toContainerId: Block['id'],
    from: number,
    to: number,
  ) => {
    editor.commands.move(fromContainerId, toContainerId, from, to);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        const activeBlock = editor.view.state.getBlock(
          active.id as Block['id'],
        );

        const availableDropBlocks = editor.schema
          .getAllowContentAsChildren(activeBlock)
          .map((blockType) => blockType.name);

        editor.view.dragAndDrop.state.changeAvailableDropBlocks(
          availableDropBlocks,
        );

        editor.logger.info([
          'drag start',
          'start drag, active block - ' + blockToLog(activeBlock),
          'available drop blocks - ' + availableDropBlocks.join(', '),
        ]);

        editor.view.dragAndDrop.state.changeActiveBlock(activeBlock);
      }}
      onDragCancel={() => {
        editor.logger.info('drag cancel');

        editor.view.dragAndDrop.state.resetActiveBlock();
      }}
      onDragOver={({ active, over }) => {
        if (!active.data.current) return;
        if (!over?.data.current) return;

        const activeId = active.id as Block['id'];
        const overId = over.id as Block['id'];

        const activeContainerId = active.data.current.sortable?.containerId;

        const overContainerId = over.data.current.sortable?.containerId;

        if (!activeContainerId || !overContainerId) return;

        editor.view.dragAndDrop.state.changeOverContainerId(overContainerId);

        if (activeId === overId) return;

        const activeBlock = editor.view.state.getBlock(activeId);
        const overBlock = editor.view.state.getBlock(overId);

        const activeContainer = editor.view.state.getBlock(activeContainerId);
        const overContainer = editor.view.state.getBlock(overContainerId);

        const from = activeContainer.children.indexOf(activeBlock);
        const to = overContainer.children.indexOf(overBlock);

        const { logger } = editor;

        logger.log({
          source: blockToLog(activeContainer),
          target: blockToLog(overContainer),
          active: blockToLog(activeBlock),
          over: blockToLog(overBlock),
          from,
          to,
        });

        const isAllowedOverBlock = overBlock.type.isAllowedContent(activeBlock);

        if (isAllowedOverBlock) {
          logger.action('changeOverContainerId to ' + blockToLog(overBlock));

          editor.view.dragAndDrop.state.changeOverContainerId(overBlock.id);
        }

        const isAllowedOverContainer =
          overContainer.type.isAllowedContent(activeBlock);

        if (!isAllowedOverBlock && isAllowedOverContainer) {
          logger.action(
            'changeOverContainerId to ' + blockToLog(overContainer),
          );

          editor.view.dragAndDrop.state.changeOverContainerId(overContainer.id);
        }

        if (from === -1 || to === -1) return;

        if (activeContainer.id === overContainer.id) {
          logger.action(
            'changeOverContainerId to ' + blockToLog(activeContainer),
          );

          editor.view.dragAndDrop.state.changeOverContainerId(
            activeContainer.id,
          );

          if (activeBlock.id === overBlock.id) return;

          logger.action([
            'move to same container ' + blockToLog(activeContainer),
            `from: ${from}, to: ${to}`,
            `active: ${blockToLog(activeBlock)}, over: ${blockToLog(
              overBlock,
            )}`,
            `source: ${blockToLog(activeContainer)}, target: ${blockToLog(
              overContainer,
            )}`,
          ]);

          move(activeContainer.id, overContainer.id, from, to);
          return;
        }

        if (
          isAllowedOverBlock &&
          !activeContainer.hasNestedBlock(overBlock.id, editor.state.blocks)
        ) {
          logger.action([
            'move to over ' + blockToLog(overBlock),
            `from: ${from}, to: ${to}`,
            `active: ${blockToLog(activeBlock)}, over: ${blockToLog(
              overBlock,
            )}`,
            `source: ${blockToLog(activeContainer)}, target: ${blockToLog(
              overContainer,
            )}`,
          ]);

          move(activeContainer.id, overBlock.id, from, to);
        } else if (isAllowedOverContainer) {
          logger.action([
            'move to target ' + blockToLog(overContainer),
            `from: ${from}, to: ${to}`,
            `active: ${blockToLog(activeBlock)}, over: ${blockToLog(
              overBlock,
            )}`,
            `source: ${blockToLog(activeContainer)}, target: ${blockToLog(
              overContainer,
            )}`,
          ]);

          move(activeContainer.id, overContainer.id, from, to);
        }
      }}
      onDragEnd={({ over }) => {
        editor.logger.info(
          'drag end, over block - ' +
            (over
              ? blockToLog(editor.state.getBlock(over.id as Block['id']))
              : 'null'),
        );

        editor.view.dragAndDrop.state.resetActiveBlock();
      }}
    >
      {children}

      <DragOverlayActiveBlock Renderer={Renderer} editor={editor} />
    </DndContext>
  );
};

export function DragAndDrop(): Plugin {
  return {
    name: 'drag-and-drop',
    apply(_, methods) {
      methods.addProvider(DragAndDropProvider);
    },
  };
}
