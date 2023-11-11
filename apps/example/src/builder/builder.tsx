import { EditorContent, useEditor } from '@chamaeleon/react-editor';
import { Toolbar } from './toolbar';
import { useEffect, useRef } from 'react';
import { ConfigurationDrawer } from '@chamaeleon/plugin-configuration-drawer';

export function Builder() {
  const editor = useEditor();

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (drawerRef.current) {
      editor.setPluginState(ConfigurationDrawer(), (prev) => ({
        ...prev,
        element: drawerRef.current!,
      }));
    }
  }, []);

  return (
    <>
      <Toolbar className="border-b" />

      <div className="relative flex">
        <div className="flex-1 px-5">
          <EditorContent editor={editor} />
        </div>

        <div ref={drawerRef} className="sticky top-0 self-start" />
      </div>
    </>
  );
}
