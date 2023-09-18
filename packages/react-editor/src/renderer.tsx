import React from 'react';

import { Editor, Block, BlockViewRendererPack } from '@chameleon/core';
import { useBlock } from './use-block';

type ChildrenRendererProps = {
  editor: Editor;
  block: Block;
  componentType: keyof BlockViewRendererPack;
};

const ChildrenRenderer = ({
  block,
  editor,
  componentType,
}: ChildrenRendererProps): React.ReactNode[] => {
  const fragment = block.children;

  return fragment.children.map((id) => (
    <Renderer
      key={id}
      block={editor.state.getBlock(id)}
      editor={editor}
      componentType={componentType}
    />
  ));
};

type RendererProps = {
  editor: Editor;
  block: Block;
  componentType: keyof BlockViewRendererPack;
};

export const Renderer = (props: RendererProps): React.ReactNode => {
  const { editor, componentType } = props;

  const block = useBlock(props.block);

  console.log(block);

  const Component = editor.view.getBlockViews(block.type.name)[componentType];

  return (
    <Component block={block} editor={editor}>
      <ChildrenRenderer
        block={block}
        editor={editor}
        componentType={componentType}
      />
    </Component>
  );
};
