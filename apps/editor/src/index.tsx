import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { ErrorBoundary } from './app/error-boundary';
import { PageEditor } from './pages/page-editor';

import './styles/global.css';

if (
  !new (class {
    x;
    // eslint-disable-next-line no-prototype-builtins
  })().hasOwnProperty('x')
)
  throw new Error('Transpiler is not configured correctly');

const App = () => {
  return (
    <ErrorBoundary fallback={<div>Something wrong</div>}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/editor" />
          </Route>

          <Route exact path="/editor">
            <PageEditor />
          </Route>
        </Switch>
      </Router>
    </ErrorBoundary>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );
