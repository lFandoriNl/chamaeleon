import { useContext } from "solid-js";

import { ThemeContext } from "./theme-provider";
import type { Theme } from "./create-theme";

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
