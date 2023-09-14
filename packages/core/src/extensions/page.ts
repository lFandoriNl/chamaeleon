import 

import { Block } from '../model/block';

declare module '..' {
  interface Commands<ReturnType> {
    page: {
      addPage: (target: Block['id'] | null, newBlock: Block) => ReturnType;
    };
  }
}

export const Page = Block.create({
  name: 'page',
});
