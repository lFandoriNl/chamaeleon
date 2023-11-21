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

This is the most minimal set. By default, the Chamaeleon has only basic capabilities. To expand their number you need to provide him with plugins.

By default there are no blocks in Chamaeleon, you have to add them yourself from your own components, in the next section we will look at how to transition an existing project to Chamaeleon.
