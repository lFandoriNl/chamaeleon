import React from 'react';
import { observer } from 'mobx-react-lite';

import { BlockId, RowBlock } from '@chameleon/engine';
import { useEngine } from '@chameleon/react-engine';
import { useEditor } from '@chameleon/react-editor';

import { PanelButton } from '@chameleon/uikit';
import { PropertiesOverlay } from '../../../../editor-core/src/ui/properties-overlay';

type EditorRowProps = {
  blockId: BlockId;
  children?: React.ReactNode[];
};

export const EditorRow = observer<EditorRowProps>(({ blockId, children }) => {
  const editor = useEditor();
  const engine = useEngine();

  const block = engine.getBlock<RowBlock>(blockId);

  console.log({ children });

  const handleOpenSettings = () => {
    editor.ui.openBlockSettings(blockId);
  };

  console.log({ ...editor.ui.blockSettings });

  return (
    <PropertiesOverlay onClick={handleOpenSettings}>
      <div className="grid">
        {children.length === 0 && <PanelButton>Row</PanelButton>}
      </div>
    </PropertiesOverlay>
  );
});

EditorRow.displayName = 'EditorRow';
