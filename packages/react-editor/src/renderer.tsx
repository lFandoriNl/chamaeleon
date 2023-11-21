import { Editor, Block, BlockViewRendererPack } from '@chamaeleon/core';
import React from 'react';

import { useBlock } from './use-block';

type RendererProps = {
  block: Block;
  editor: Editor;
  componentType: keyof BlockViewRendererPack;
};

export const Renderer = (props: RendererProps): React.ReactNode => {
  const { editor, componentType } = props;

  const block = useBlock(props.block);

  const Component = editor.view.getBlockViews(block.type.name)[componentType];

  return (
    <Component block={block} editor={editor}>
      {block.children.children.map((id) => (
        <Renderer
          key={id}
          block={editor.state.getBlock(id)}
          editor={editor}
          componentType={componentType}
        />
      ))}
    </Component>
  );
};
