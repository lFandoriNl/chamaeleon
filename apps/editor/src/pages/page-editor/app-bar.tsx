import { observer } from 'mobx-react-lite';

import { Switch } from '@chameleon/uikit/components/switch';
import { useEditor } from '@chameleon/react-editor';

export const AppBar = observer(() => {
  const editor = useEditor();

  return (
    <div className="p-4 flex items-center justify-between border-b border-gray-300">
      <div>AppBar</div>

      <div className="flex items-center">
        <Switch
          className="mb-0"
          label={
            editor.ui.renderMode === 'preview' ? 'Preview on' : 'Preview off'
          }
          checked={editor.ui.renderMode === 'preview'}
          onChange={(event) =>
            editor.ui.changeRenderMode(
              event.target.checked ? 'preview' : 'editor',
            )
          }
        />
      </div>
    </div>
  );
});

AppBar.displayName = 'AppBar';
