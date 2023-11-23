---
title: plugin-history
description: Using the undo redo commands feature with Chamaeleon
---

This plugin provides `undo` and `redo` capabilities using two new commands.

## Installation

```sh frame="none"
npm i @chamaeleon/plugin-history
```

## Usage

```ts
import { History } from '@chamaeleon/plugin-history';

const editor = new Editor({
  plugins: [History()],
});
```

By default, the history limit is 1000 commands, you can configure the plugin to increase or decrease this limit

```ts
import { History } from '@chamaeleon/plugin-history';

const editor = new Editor({
  plugins: [History({ limit: 100 })],
});
```

```ts
const Example = () => {
  const editor = useEditor();

  return (
    <>
      <button onClick={() => editor.commands.undo()}>Undo</button>
      <button onClick={() => editor.commands.redo()}>Redo</button>
    </>
  );
};
```
