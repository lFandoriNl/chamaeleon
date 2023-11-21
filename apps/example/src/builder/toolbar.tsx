import { useEditorSelector } from '@chamaeleon/react-editor';
import { HistoryState, historyName } from '@chamaeleon/plugin-history';
import { Button, Text } from '@mantine/core';

type ToolbarProps = {
  className?: string;
};

export function Toolbar({ className }: ToolbarProps) {
  const [state, editor] = useEditorSelector(({ editor }) => editor.state);
  const [historyState] = useEditorSelector(({ editor }) =>
    editor.getPluginState<HistoryState>(historyName),
  );

  const isStateEmpty = Object.keys(state.blocks).length === 0;

  const isShowPresets = localStorage.getItem('showPresets') === 'true';

  return (
    <div className={className}>
      <div className="flex flex-col space-x-2 p-2 sm:flex-row">
        <div className="space-x-2">
          <Button color="blue" onClick={() => editor.commands.undo()}>
            Undo
          </Button>

          <Button color="blue" onClick={() => editor.commands.redo()}>
            Redo
          </Button>
        </div>

        <div className="flex items-center space-x-2 py-4 sm:py-0">
          <Text>
            Current version: {historyState.currentVersion + 1}
            {' / '}
            {historyState.supportedVersions}
            <span>|</span>
            History stack: {historyState.historyTransactions.length}
          </Text>
        </div>

        <div className="space-x-2">
          <Button color="blue" onClick={() => editor.commands.persist()}>
            Persist
          </Button>

          <Button color="blue" onClick={() => editor.commands.clearPersisted()}>
            Clear
          </Button>

          <Button
            color="blue"
            onClick={() => {
              editor.commands.clearPersisted();
              window.location.reload();
            }}
          >
            Reset state
          </Button>
        </div>
      </div>

      {/* {isShowPresets && (
        <div className="flex flex-col space-y-2 p-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button
            color="blue"
            disabled={!isStateEmpty}
            onClick={() => {
              editor.chain.addPage(null).addRow('root').select().run();

              editor.chain
                .addColumn(editor.state.activeId!)
                .addRow('root')
                .run();
            }}
          >
            Preset default
          </Button>

          <Button
            color="blue"
            disabled={!isStateEmpty}
            onClick={() => {
              editor.chain
                .addPage(null)
                .addRow('root')
                .addRow('root')
                .addRow('root')
                .run();
            }}
          >
            Preset only rows
          </Button>

          <Button
            color="blue"
            disabled={!isStateEmpty}
            onClick={() => {
              editor.chain
                .addPage(null)
                .addRow('root')
                .addRow('root')
                .addRow('root')
                .select()
                .run();

              editor.chain
                .addColumn(editor.state.activeId!)
                .addColumn(editor.state.activeId!)
                .select()
                .run();

              editor.chain
                .command(({ commands }) => {
                  commands.insertContent(editor.state.activeId!, {
                    type: 'button',
                  });
                })
                .run();

              editor.chain.addRow('root').select().run();

              editor.chain
                .addColumn(editor.state.activeId!)
                .addRow('root')
                .run();
            }}
          >
            Preset rows with nested columns
          </Button>
        </div>
      )} */}
    </div>
  );
}
