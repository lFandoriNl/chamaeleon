---
title: Setup
description: Basic introduction to getting started with Chamaeleon
---

Chamaeleon is a framework that aims to provide a flexible and extensible framework for creating a web builder. It's built on a plugin-friendly architecture, allowing you to make your builder however you want.

## Installation

:::note
It is assumed that you have already installed `react` and `react-dom`.
:::

For basic use you need to install the `core` and `react-editor`:

```sh
npm i @chamaeleon/core @chamaeleon/react-editor
```

If you want to connect built-in plugins for editing and adding blocks, then run:

```sh
npm i @chamaeleon/plugin-add-block-menu @chamaeleon/plugin-configuration-drawer
```

## Usage

Creating a Basic Editor Instance

```ts
import { Editor } from '@chamaeleon/core';
import {
  EditorContent,
  EditorProvider,
  useEditor,
} from '@chamaeleon/react-editor';

const editor = new Editor();

const Content = () => {
  const editor = useEditor();

  return <EditorContent editor={editor} />;
};

const Example = () => {
  return (
    <EditorProvider value={editor}>
      <Content />
    </EditorProvider>
  );
};
```

This is the most minimal set. By default, the chameleon has only basic capabilities. To expand their number you need to provide him with plugins.

By default there are no blocks in chameleon, you can install basic plugins to get started.

- [plugin-add-block-menu](/packages/plugin-add-block-menu/)
- [plugin-configuration-drawer](/packages/plugin-configuration-drawer/)
- [plugin-page](/packages/plugin-page/)
- [plugin-grid](/packages/plugin-grid/)
