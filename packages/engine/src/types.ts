export type Page = {
  id: BlockId;
  title: string;
  props: {
    children: BlockId;
  };
};

export type BlockId = string;

export type BaseBlock = {
  id: BlockId;
};

export type RowBlock = BaseBlock & {
  type: 'row';
  props: {
    children: BlockId[];
  };
};

export type ColumnBlock = BaseBlock & {
  type: 'column';
  props: {
    children: BlockId[];
  };
};

export type TextBlock = BaseBlock & {
  type: 'text';
  props: {
    content: string;
  };
};

export type ButtonBlock = BaseBlock & {
  type: 'button';
  props: {
    children: BlockId[];
  };
};

export type InputBlock = BaseBlock & {
  type: 'input';
  props: {
    placeholder?: string;
  };
};

export type Block =
  | RowBlock
  | ColumnBlock
  | TextBlock
  | ButtonBlock
  | InputBlock;

type HasChildren<T> = T extends { props: { children: BlockId[] } } ? T : never;

export type BlockWithChildren = HasChildren<Block>;
