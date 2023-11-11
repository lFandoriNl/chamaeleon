import { HistoryState, historyName } from '@chamaeleon/plugin-history';
import { useEditorSelector } from '@chamaeleon/react-editor';
import { Button } from '@chamaeleon/uikit';

type ToolbarProps = {
  className?: string;
};

export function Toolbar({ className }: ToolbarProps) {
  const [state, editor] = useEditorSelector(({ editor }) => editor.state);

  const historyState = editor.getPluginState<HistoryState>(historyName);

  const isStateEmpty = Object.keys(state.blocks).length === 0;

  return (
    <div className={className}>
      <div className="flex flex-col space-x-2 p-2 sm:flex-row">
        <div className="space-x-2">
          <Button color="secondary" onClick={() => editor.commands.undo()}>
            Undo
          </Button>

          <Button color="secondary" onClick={() => editor.commands.redo()}>
            Redo
          </Button>
        </div>

        <div className="flex items-center space-x-2 py-4 sm:py-0">
          <p className="inline text-base">
            Current version: {historyState.currentVersion + 1}
            {' / '}
            {historyState.supportedVersions}
          </p>

          <span>|</span>

          <p className="inline text-base">
            History stack: {historyState.historyTransactions.length}
          </p>
        </div>

        <div className="space-x-2">
          <Button color="secondary" onClick={() => editor.commands.persist()}>
            Persist
          </Button>

          <Button
            color="secondary"
            onClick={() => editor.commands.clearPersisted()}
          >
            Clear
          </Button>

          <Button
            color="secondary"
            onClick={() => {
              editor.commands.clearPersisted();
              window.location.reload();
            }}
          >
            Reload
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-2 p-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <Button
          color="secondary"
          disabled={!isStateEmpty}
          onClick={() => {
            editor.chain.addPage(null).select().run();
            editor.chain.addRow('root').select().run();
            editor.chain.addColumn(editor.state.activeId!).select().run();
            editor.chain.addRow('root').select().run();
          }}
        >
          Preset default
        </Button>

        <Button
          color="secondary"
          disabled={!isStateEmpty}
          onClick={() => {
            editor.chain.addPage(null).select().run();
            editor.chain.addRow('root').select().run();
            editor.chain.addRow('root').select().run();
            editor.chain.addRow('root').select().run();
          }}
        >
          Preset only rows
        </Button>

        <Button
          color="secondary"
          disabled={!isStateEmpty}
          onClick={() => {
            editor.chain.addPage(null).select().run();
            editor.chain.addRow('root').select().run();
            editor.chain.addRow('root').select().run();
            editor.chain.addRow('root').select().run();
            editor.chain.addColumn(editor.state.activeId!).run();
            editor.chain.addRow('root').select().run();
            editor.chain.addRow('root').select().run();
          }}
        >
          Preset rows with nested columns
        </Button>

        <Button
          color="secondary"
          disabled={!isStateEmpty}
          onClick={() => {
            editor.chain.addPage(null).select().run();
            editor.chain.addRow('root').select().run();
            editor.chain.addRow('root').select().run();
            editor.chain.addRow('root').select().run();
            editor.chain
              .addColumn(editor.state.activeId!)
              .addColumn(editor.state.activeId!)
              .addColumn(editor.state.activeId!)
              .run();
          }}
        >
          Preset row with columns
        </Button>
      </div>
    </div>
  );
}
