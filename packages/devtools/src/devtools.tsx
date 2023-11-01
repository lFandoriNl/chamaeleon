import ReactDOM from 'react-dom';

import { createLogger } from './logger';
import { DevtoolsApp } from './devtools-app';
import { addLogItem } from './state';

const logger = createLogger({ addLogItem });

logger.init();

export const ChamaeleonDevtools = {
  logger,
  Render: () => {
    return ReactDOM.createPortal(<DevtoolsApp />, document.body);
  },
};
