import { createContext } from "solid-js";

import { Theme, createTheme } from "./create-theme";

export const ThemeContext = createContext<Theme>(createTheme());

export const ThemeProvider = ThemeContext.Provider;
