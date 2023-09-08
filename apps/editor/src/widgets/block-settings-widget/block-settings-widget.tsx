import { observer } from 'mobx-react-lite';

import { useEditor } from '@chameleon/react-editor';
import { useEngine } from '@chameleon/react-engine';

type BlockSettingsWidgetProps = {
  extra?: React.ReactNode;
};

export const BlockSettingsWidget = observer<BlockSettingsWidgetProps>(
  ({ extra }) => {
    const editor = useEditor();
    const engine = useEngine();

    if (!editor.ui.blockSettings.blockId) return null;

    const block = engine.getBlock(editor.ui.blockSettings.blockId);

    return (
      <div>
        <div className="p-4 flex items-center justify-between border-b border-gray-300">
          <div>
            {block.type.charAt(0).toLocaleUpperCase() + block.type.slice(1)}{' '}
            properties
          </div>

          {extra}
        </div>

        <div className="p-4">content</div>
      </div>
    );
  },
);

BlockSettingsWidget.displayName = 'BlockSettingsWidget';
