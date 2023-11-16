---
title: plugin-grid
description: Using a grid blocks in Chamaeleon
---

The grid plugin provides two blocks `Row` and `Column` for create a grid.

## Installation

```sh
npm i @chamaeleon/plugin-grid
```

## Usage

```ts
import { Row, Column } from '@chamaeleon/plugin-grid';

const editor = new Editor({
  plugins: [Row(), Column()],
});
```
