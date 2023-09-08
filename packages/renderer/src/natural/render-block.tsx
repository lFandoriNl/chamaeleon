import { observer } from 'mobx-react-lite';

import { BlockId, typeGuard, useEngine } from '@chameleon/react-engine';
import { clm } from '@chameleon/component-library-manager';

type RenderBlockProps = {
  blockId: BlockId;
};

export const RenderBlock = observer<RenderBlockProps>(({ blockId }) => {
  const engine = useEngine();

  const block = engine.getBlock(blockId);

  if (!block) throw new Error(`Block with id "${blockId}" does not exist.`);

  const Component = clm.getNaturalComponent(block.type);

  if (typeGuard.isWithChildrenBlock(block)) {
    return (
      // @ts-expect-error
      <Component blockId={blockId}>
        {block.props.children.map((id) => (
          <RenderBlock key={id} blockId={id} />
        ))}
      </Component>
    );
  }

  return <Component blockId={blockId} />;
});

RenderBlock.displayName = 'RenderBlock';
