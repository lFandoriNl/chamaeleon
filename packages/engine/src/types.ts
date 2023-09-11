export type EventName = 'onClick';

type EventsMap<T extends EventName> = {
  [K in T]?: string;
};

export type Page = {
  id: BlockId;
  title: string;
  props: {
    children: BlockId | null;
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
    events: EventsMap<'onClick'>;
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

export type StateContext = {
  pages: Record<string, Page>;
  blocks: Record<BlockId, Block>;
};

type FilterType<T, F> = T extends F ? T : never;

export type NestableBlock = FilterType<
  Block,
  { props: { children: BlockId[] } }
>;

export type ClickableBlock = FilterType<
  Block,
  {
    props: {
      events: EventsMap<'onClick'>;
    };
  }
>;

export type WithContentEditBlock = FilterType<
  Block,
  {
    props: {
      content: string;
    };
  }
>;
