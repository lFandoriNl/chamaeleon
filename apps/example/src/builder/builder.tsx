import { useEffect, useRef } from 'react';

import { EditorContent, useEditor } from '@chamaeleon/react-editor';
import { ConfigurationDrawer } from '../plugins/configuration-drawer';

import { Toolbar } from './toolbar';
import { Button, Flex } from '@mantine/core';

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
      <Toolbar className="border-0 border-b border-solid border-gray-300" />

      <div className="relative flex">
        <div className="flex-1 px-5">
          <EditorContent
            editor={editor}
            empty={
              <Flex justify="center" p={10}>
                <Button
                  onClick={() => {
                    editor.chain
                      .insertRootContent({
                        id: editor.schema.spec.rootBlockId,
                        type: 'page',
                      })
                      .select()
                      .run();
                  }}
                >
                  Add first page
                </Button>
              </Flex>
            }
          />
        </div>

        <div ref={drawerRef} className="relative top-0 self-start md:sticky" />
      </div>
    </>
  );
}
