export type Theme = {
  name?: string;
};

export type ThemeOptions = {
  name?: Theme["name"];
};

export function createTheme(themeOptions: ThemeOptions = {}): Theme {
  return {
    name: themeOptions.name,
  };
}
