import type { Component } from "solid-js";

import { useTheme } from "../shared/ui/styles";

import styles from "./app.module.css";

const App: Component = () => {
  const theme = useTheme();

  console.log(theme);

  return <div class={styles.App}></div>;
};

export default App;
