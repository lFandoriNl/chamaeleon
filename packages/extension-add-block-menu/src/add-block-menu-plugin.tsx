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
  EditorState,
} from '@chameleon/core';

import { Menu } from './menu';

type PluginState = {
  open: boolean;
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

  private anchorEl!: HTMLElement;

  constructor(options: AddBlockMenuViewOptions) {
    this.pluginKey = options.pluginKey;
    this.editor = options.editor;
    this.element = options.element;
  }

  update(view: EditorView) {
    const { open, event } = this.pluginKey.getState(view.state);

    if (!this.anchorEl && event?.target instanceof HTMLElement) {
      this.anchorEl = event.target;
    }

    const children = open ? <Menu anchorEl={this.anchorEl} /> : null;

    return ReactDOM.createPortal(children, this.element);
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
