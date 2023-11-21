import { MantineProvider, createTheme } from '@mantine/core';
import ReactDOM from 'react-dom/client';

import { ErrorBoundary } from './app/error-boundary';
import { Example } from './example';

import '@mantine/core/styles/global.css';
import '@mantine/core/styles.css';

import './styles/global.css';

const theme = createTheme({});

const App = () => {
  return (
    <ErrorBoundary fallback={<div>Something wrong</div>}>
      <MantineProvider theme={theme}>
        <Example />
      </MantineProvider>
    </ErrorBoundary>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
