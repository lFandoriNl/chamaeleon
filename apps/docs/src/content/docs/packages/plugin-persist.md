---
title: plugin-persist
description: Using persistent state with Chamaeleon
---

This plugin allows you to persist your state in the storage you need, `localStorage` is used by default.

## Installation

```sh
npm i @chamaeleon/plugin-persist
```

## Usage

```ts
import { Persist } from '@chamaeleon/plugin-persist';

const editor = new Editor({
  plugins: [Persist()],
});
```

You can pass your own storage and expireIn timestamp to clean up the stale state

```ts
const editor = new Editor({
  plugins: [
    Persist({
      // one hour
      expireIn: 1 * 60 * 60 * 1000,
      storage: myStorage,
    }),
  ],
});
```

You can use the `persist` command to force a save:

```ts
editor.commands.persist();
```

And the `clearPersisted` command to clear the persisted state:

```ts
editor.commands.clearPersisted();
```
