import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import { AiOutlineBorderLeft, AiOutlineBorderRight } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';

import { IconButton } from '@chameleon/uikit';

import {
  Plugin,
  PluginKey,
  PluginView,
  EditorView,
  Editor,
  Block,
} from '@chameleon/core';

import { Menu } from './menu';

type PluginState = {
  open: boolean;
  target?: Block['id'];
  event?: Event;
};

type AddBlockMenuViewOptions = {
  pluginKey: PluginKey;
  editor: Editor;
  element: HTMLElement;
};

class AddBlockMenuView implements PluginView {
  private pluginKey!: PluginKey<PluginState>;

  private editor: Editor;

  private element: HTMLElement;

  constructor(options: AddBlockMenuViewOptions) {
    this.pluginKey = options.pluginKey;
    this.editor = options.editor;
    this.element = options.element;
  }

  update(view: EditorView) {
    const { state } = view;

    const { open, target, event } = this.pluginKey.getState(state);

    if (!open) return ReactDOM.createPortal(null, this.element);

    if (!target) throw new RangeError(`There is no target id.`);

    const allowContent = state.getBlock(target).type.spec.allowContent || {};

    const allowedBlocksItems = state.schema
      .getAllowContent(allowContent)
      .map((blockType) => {
        const Component = view.getBlockViews(blockType.name)['palette'];

        return {
          id: blockType.name,
          name: blockType.name,
          component: <Component />,
        };
      });

    const anchorEl = event?.target instanceof HTMLElement ? event.target : null;

    return ReactDOM.createPortal(
      <Menu
        anchorEl={anchorEl}
        items={allowedBlocksItems}
        onClick={({ name }) => {
          this.editor.commands.insertContent(target, {
            type: name,
          });
        }}
        onClose={() => this.editor.commands.closeAddBlockMenu()}
      />,
      this.element,
    );
  }
}

export type AddBlockMenuPluginOptions = {
  pluginKey: PluginKey | string;
  editor: Editor;
  element: HTMLElement;
};

export const AddBlockMenuPlugin = (options: AddBlockMenuPluginOptions) => {
  const pluginKey =
    typeof options.pluginKey === 'string'
      ? new PluginKey(options.pluginKey)
      : options.pluginKey;

  return new Plugin<PluginState>({
    key: pluginKey,

    type: 'common',

    view: () =>
      new AddBlockMenuView({
        pluginKey,
        editor: options.editor,
        element: options.element,
      }),

    state: {
      init() {
        return {
          open: false,
        };
      },
      apply(tr, value) {
        const meta = tr.getMeta(pluginKey);

        if (!meta) {
          return value;
        }

        if (meta.open) {
          return {
            open: true,
            target: meta.target,
            event: meta.event,
          };
        }

        return {
          open: false,
        };
      },
    },
  });
};
