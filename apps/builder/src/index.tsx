import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { PageEditor } from './pages/page-editor';

import './index.css';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/editor">
          <PageEditor />
        </Route>
      </Switch>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
