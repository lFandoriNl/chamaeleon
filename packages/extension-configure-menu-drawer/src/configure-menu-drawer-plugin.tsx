import { useState } from 'react';
import ReactDOM from 'react-dom';

import { AiOutlineBorderLeft, AiOutlineBorderRight } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';

import { IconButton } from '@chameleon/uikit';

import {
  Plugin,
  PluginKey,
  PluginView,
  EditorView,
  Editor,
} from '@chameleon/core';
import { Drawer } from './drawer';
import clsx from 'clsx';

type BlockPropertiesWidgetProps = {
  extra?: React.ReactNode;
};

const BlockPropertiesWidget = ({ extra }: BlockPropertiesWidgetProps) => {
  return (
    <div>
      <div className="p-4 flex items-center justify-between border-b border-gray-300">
        <div>
          {/* {block.type.charAt(0).toLocaleUpperCase() + block.type.slice(1)}{' '} */}
          properties
        </div>

        {extra}
      </div>

      <div className="p-4">content</div>
    </div>
  );
};

type ConfigurationDrawerProps = {
  open: boolean;
  editor: Editor;
};

const ConfigurationDrawer = ({ open, editor }: ConfigurationDrawerProps) => {
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  return (
    <Drawer
      className="top-[40%]"
      open={open}
      onClose={editor.commands.closeConfiguration}
      direction={direction}
      enableOverlay={true}
    >
      <BlockPropertiesWidget
        extra={
          <div>
            <IconButton
              className={clsx('!p-1 !shadow-none rounded-none border', {
                '!bg-slate-200': direction === 'left',
              })}
              onClick={() => setDirection('left')}
            >
              <AiOutlineBorderLeft size={24} />
            </IconButton>

            <IconButton
              className={clsx('!p-1 !shadow-none rounded-none border', {
                '!bg-slate-200': direction === 'right',
              })}
              onClick={() => setDirection('right')}
            >
              <AiOutlineBorderRight size={24} />
            </IconButton>

            <IconButton
              className="ml-4 !shadow-none"
              onClick={editor.commands.closeConfiguration}
            >
              <IoMdClose size={24} />
            </IconButton>
          </div>
        }
      />
    </Drawer>
  );
};

type ConfigureMenuDrawerViewOptions = {
  pluginKey: PluginKey;
  editor: Editor;
  element: HTMLElement;
};

class ConfigureMenuDrawerView implements PluginView {
  private pluginKey!: PluginKey<{ open: boolean }>;

  private editor: Editor;

  private element: HTMLElement;

  constructor(options: ConfigureMenuDrawerViewOptions) {
    this.pluginKey = options.pluginKey;
    this.editor = options.editor;
    this.element = options.element;
  }

  update(view: EditorView) {
    const open = this.pluginKey.getState(view.state)?.open || false;

    return ReactDOM.createPortal(
      <ConfigurationDrawer open={open} editor={this.editor} />,
      this.element,
    );
  }
}

export type ConfigureMenuDrawerPluginOptions = {
  pluginKey: PluginKey | string;
  editor: Editor;
  element: HTMLElement;
};

export const ConfigureMenuDrawerPlugin = (
  options: ConfigureMenuDrawerPluginOptions,
) => {
  const pluginKey =
    typeof options.pluginKey === 'string'
      ? new PluginKey(options.pluginKey)
      : options.pluginKey;

  return new Plugin<{ open: boolean }>({
    key: pluginKey,

    view: () =>
      new ConfigureMenuDrawerView({
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
      apply(tr) {
        return {
          open: tr.getMeta(pluginKey)?.open === true,
        };
      },
    },
  });
};
