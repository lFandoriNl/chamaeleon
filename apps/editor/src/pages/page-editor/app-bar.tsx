import { observer } from 'mobx-react-lite';

import { Switch } from '@chameleon/uikit/components/switch';
import { editorModel } from './model/editor-model';

export const AppBar = observer(() => {
  return (
    <div className="p-4 flex items-center justify-between border-b border-gray-300">
      <div>AppBar</div>

      <div className="flex items-center">
        <Switch
          className="mb-0"
          label={
            editorModel.renderMode === 'preview' ? 'Preview on' : 'Preview off'
          }
          checked={editorModel.renderMode === 'preview'}
          onChange={(event) =>
            editorModel.changeRenderMode(
              event.target.checked ? 'preview' : 'editor',
            )
          }
        />
      </div>
    </div>
  );
});

AppBar.displayName = 'AppBar';
