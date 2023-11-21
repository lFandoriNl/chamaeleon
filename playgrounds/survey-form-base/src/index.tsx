import CssBaseline from '@mui/material/CssBaseline';
import {
  experimental_extendTheme as extendTheme,
  Experimental_CssVarsProvider as CssVarsProvider,
} from '@mui/material/styles';
import ReactDOM from 'react-dom/client';

import { Example } from './example';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './styles/global.css';

const theme = extendTheme({});

const App = () => {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Example />
    </CssVarsProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
