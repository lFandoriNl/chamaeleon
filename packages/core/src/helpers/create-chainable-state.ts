import { EditorState, Transaction } from '../state';

export function createChainableState(config: {
  transaction: Transaction;
  state: EditorState;
}): EditorState {
  const { state, transaction } = config;

  let { blocks, activeId, lastModifiedBlock } = transaction;

  return {
    ...state,
    get blocks() {
      return blocks;
    },
    get activeId() {
      return activeId;
    },
    get lastModifiedBlock() {
      return lastModifiedBlock;
    },
    schema: state.schema,
    plugins: state.plugins,
    propertyConfigurationPlugins: state.propertyConfigurationPlugins,
    activeBlock: state.activeBlock,
    blocksArray: state.blocksArray,
    rootPage: state.rootPage,
    getBlock: state.getBlock.bind({ ...state, blocks }),
    apply: state.apply.bind(state),
    filterTransaction: state.filterTransaction.bind(state),
    applyTransaction: state.applyTransaction.bind(state),
    get tr() {
      blocks = transaction.blocks;

      return transaction;
    },
    applyInner: state.applyInner.bind(state),
    reconfigure: state.reconfigure.bind(state),
    toJSON: state.toJSON.bind(state),
  };
}
