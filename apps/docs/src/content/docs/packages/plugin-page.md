---
title: plugin-page
description: Using a page block in Chamaeleon
---

The `Page` is the main block of the editor, a container for all other blocks.

## Installation

```sh
npm i @chamaeleon/plugin-page
```

## Usage

```ts
import { Page } from '@chamaeleon/plugin-page';

const editor = new Editor({
  plugins: [Page()],
});
```
