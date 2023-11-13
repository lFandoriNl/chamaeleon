import { IoMdClose } from 'react-icons/io';

import { IconButton } from '@chamaeleon/uikit';

import { EditorView, Editor } from '@chamaeleon/core';

import { Drawer } from './drawer';

const capitalize = (str: string) => {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};

type BlockConfigurationProps = {
  view: EditorView;
  extra?: React.ReactNode;
};

const BlockConfiguration = ({ view, extra }: BlockConfigurationProps) => {
  if (!view.state.activeBlock) return null;

  return (
    <div className="h-full">
      <div className="flex items-center justify-between border-b border-gray-300 p-4 text-xl">
        <div>{capitalize(view.state.activeBlock.type.name)} properties</div>

        {extra}
      </div>

      <div className="h-full overflow-y-auto p-4">
        <view.propsConfiguration.Render view={view} />

        <p className="pb-2 pt-4 text-center text-lg">Style</p>

        <view.styleConfiguration.Render view={view} />
      </div>
    </div>
  );
};

type ConfigurationDrawerViewProps = {
  open: boolean;
  editor: Editor;
};

export const ConfigurationDrawerView = ({
  open,
  editor,
}: ConfigurationDrawerViewProps) => {
  return (
    <Drawer open={open} onClose={editor.commands.closeConfiguration}>
      <BlockConfiguration
        view={editor.view}
        extra={
          <div>
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
