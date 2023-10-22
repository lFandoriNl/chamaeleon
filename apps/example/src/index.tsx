import ReactDOM from 'react-dom/client';

import { ErrorBoundary } from './app/error-boundary';
import { Example } from './example';

import './styles/global.css';

const App = () => {
  return (
    <ErrorBoundary fallback={<div>Something wrong</div>}>
      <Example />
    </ErrorBoundary>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
