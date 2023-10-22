import { useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import { AiOutlineBorderLeft, AiOutlineBorderRight } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';

import { IconButton } from '@chamaeleon/uikit';

import {
  Plugin,
  PluginKey,
  PluginView,
  EditorView,
  Editor,
} from '@chamaeleon/core';

import { Drawer } from './drawer';

const capitalize = (str: string) => {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};

type PluginState = {
  open: boolean;
};

type BlockConfigurationProps = {
  view: EditorView;
  extra?: React.ReactNode;
};

const BlockConfiguration = ({ view, extra }: BlockConfigurationProps) => {
  if (!view.state.activeBlock) return null;

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-300 p-4 text-xl">
        <div>{capitalize(view.state.activeBlock.type.name)} properties</div>

        {extra}
      </div>

      <div className="p-4">
        <view.propertyConfiguration.Render view={view} />

        <view.styleConfiguration.Render view={view} />
      </div>
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
      size="500px"
      onClose={editor.commands.closeConfiguration}
      direction={direction}
      enableOverlay={true}
    >
      <BlockConfiguration
        view={editor.view}
        extra={
          <div>
            <IconButton
              className={clsx('rounded-none border !p-1 !shadow-none', {
                '!bg-slate-200': direction === 'left',
              })}
              onClick={() => setDirection('left')}
            >
              <AiOutlineBorderLeft size={24} />
            </IconButton>

            <IconButton
              className={clsx('rounded-none border !p-1 !shadow-none', {
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

type ConfigurationDrawerViewOptions = {
  pluginKey: PluginKey;
  editor: Editor;
  element: HTMLElement;
};

class ConfigurationDrawerView implements PluginView {
  private pluginKey!: PluginKey<PluginState>;

  private editor: Editor;

  private element: HTMLElement;

  constructor(options: ConfigurationDrawerViewOptions) {
    this.pluginKey = options.pluginKey;
    this.editor = options.editor;
    this.element = options.element;
  }

  update(view: EditorView) {
    const { open } = this.pluginKey.getState(view.state);

    if (!view.state.activeBlock) return null;

    return ReactDOM.createPortal(
      <ConfigurationDrawer open={open} editor={this.editor} />,
      this.element,
    );
  }
}

export type ConfigurationDrawerPluginOptions = {
  pluginKey: PluginKey | string;
  editor: Editor;
  element: HTMLElement;
};

export const ConfigurationDrawerPlugin = (
  options: ConfigurationDrawerPluginOptions,
) => {
  const pluginKey =
    typeof options.pluginKey === 'string'
      ? new PluginKey(options.pluginKey)
      : options.pluginKey;

  return new Plugin<PluginState>({
    key: pluginKey,

    type: 'common',

    view: () =>
      new ConfigurationDrawerView({
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
        if (!tr.getMeta(pluginKey)) {
          return value;
        }

        return {
          open: tr.getMeta(pluginKey)?.open === true,
        };
      },
    },
  });
};
