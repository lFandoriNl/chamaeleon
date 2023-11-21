import React from 'react';

import { Editor } from '../editor';
import { Block } from '../model';
import {
  EditorState,
  PluginCommonView,
  PluginPropsView,
  PluginStyleView,
  Transaction,
} from '../state';
import { BlockViewRendererPack, Provider } from '../types';
import {
  DragAndDropState,
  useDragAndDropState,
  useDragAndDropBlockState,
  useDndConnector,
  BlockRoot,
  Dropzone,
} from './drag-and-drop';
import { ActionPopover } from './ui/action-popover';
import { EditorInstanceContext } from './use-editor-instance';

type Props<T extends keyof EditorView['rawUI']> = Omit<
  Parameters<EditorView['rawUI'][T]>[0],
  'view'
>;

export type EditorViewOptions = {
  state: EditorState;
  blockViews?: Record<Block['type']['name'], BlockViewRendererPack>;
  dispatchTransaction?: (tr: Transaction) => void;
  propertyConfigurationRender?: React.FunctionComponent<{ view: EditorView }>;
  styleConfigurationRender?: React.FunctionComponent<{ view: EditorView }>;
  ui?: Partial<EditorView['rawUI']>;
};

export class EditorView {
  state!: EditorState;

  pluginCommonViews: Array<{
    id: string;
    view: PluginCommonView;
  }> = [];

  pluginPropsViews: Array<{
    id: string;
    view: PluginPropsView;
  }> = [];

  pluginStyleViews: Array<{
    id: string;
    view: PluginStyleView;
  }> = [];

  rawUI = {
    ActionPopover,
  };

  ui!: {
    [name in keyof EditorView['rawUI']]: React.FunctionComponent<Props<name>>;
  };

  PluginProviders: Provider = ({ editor, children }) => (
    <EditorInstanceContext.Provider value={editor}>
      {children}
    </EditorInstanceContext.Provider>
  );

  dragAndDrop = {
    state: new DragAndDropState(),
    useState: useDragAndDropState,
    useBlockState: useDragAndDropBlockState,
    useDndConnector,
  };

  Block = BlockRoot;
  Dropzone = Dropzone;

  constructor(
    public editor: Editor,
    public options: EditorViewOptions,
  ) {
    this.state = options.state;

    this.rawUI = {
      ...this.rawUI,
      ...options.ui,
    };

    this.injectViewToUI();

    this.dispatch = this.dispatch.bind(this);
  }

  dispatch(tr: Transaction) {
    const { dispatchTransaction } = this.options;

    if (dispatchTransaction) {
      dispatchTransaction.call(this, tr);
    } else {
      this.updateState(this.state.apply(tr));
    }
  }

  updateState(state: EditorState) {
    this.state = state;
  }

  setOptions(options: Partial<EditorViewOptions>) {
    this.options = {
      ...this.options,
      ...options,
      ui: {
        ...this.options.ui,
        ...options.ui,
      },
    };

    this.rawUI = {
      ...this.rawUI,
      ...this.options.ui,
    };

    this.injectViewToUI();
  }

  setPluginViews(
    common: EditorView['pluginCommonViews'],
    props: EditorView['pluginPropsViews'],
    style: EditorView['pluginStyleViews'],
  ) {
    this.pluginCommonViews = common;
    this.pluginPropsViews = props;
    this.pluginStyleViews = style;
  }

  setPluginProviders(pluginProviders: Provider[] = []) {
    this.PluginProviders = pluginProviders.reduce((Prev, Current) => {
      // eslint-disable-next-line react/display-name
      return ({ Renderer, editor, children }) => (
        <Prev Renderer={Renderer} editor={editor}>
          <Current Renderer={Renderer} editor={editor}>
            {children}
          </Current>
        </Prev>
      );
    }, this.PluginProviders);

    this.PluginProviders.displayName = 'PluginProviders';
  }

  getBlockViews(name: Block['type']['name']) {
    if (!this.options.blockViews || !this.options.blockViews[name])
      throw new RangeError(
        `BlockViews for "Block.type.name=${name}" does not exist.`,
      );

    return this.options.blockViews[name];
  }

  private injectViewToUI() {
    this.ui = (Object.entries(this.rawUI) as any[]).reduce(
      (ui, [name, Component]) => {
        const ComponentWithViewInjected = React.forwardRef<HTMLElement>(
          (props, ref) => {
            return <Component {...props} view={this} ref={ref} />;
          },
        );

        ComponentWithViewInjected.displayName =
          (Component.displayName || Component.name || 'Unknown') +
          '.InjectView';

        ui[name] = ComponentWithViewInjected;

        return ui;
      },
      {} as EditorView['ui'],
    );
  }
}
