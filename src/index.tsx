/* @refresh reload */
import { render } from "solid-js/web";

import App from "./app/app";

import { theme } from "./app/styles";
import { ThemeProvider } from "./shared/ui/styles/theme-provider";

import "./index.css";

render(
  () => (
    <ThemeProvider value={theme}>
      <App />
    </ThemeProvider>
  ),
  document.getElementById("root") as HTMLElement
);
