# Chamaeleon

- [Documentation](#documentation)
- [Overview](#overview)
  - [Building pages](#building-pages)
  - [Extensible Architecture](#extensible-architecture)
  - [Drag And Drop](#drag-and-drop)
- [Demo](#demo)
- [Goals for 1.0.0](#goals-for-the-first-release-version-100)
- [Local setup](#local-setup)

## Documentation

The full documentation is available on [chamaeleon-docs](https://chamaeleon-docs.vercel.app).

## Overview

Chamaeleon is a framework that aims to provide a flexible and extensible framework for creating a web builder. It's built on a plugin-friendly architecture, allowing you to make your builder however you want.

### Capabilities

#### Building pages

Chamaeleon provides interface building capabilities for creating web pages. It allows users to create, edit and manage web pages with ease, providing a wide range of tools and options to customize the appearance of your pages, like [Notion](https://www.notion.so).

#### Extensible Architecture

Chamaeleon is based on an extensible architecture based on plugins. This design allows users to add new features and functionality to the framework, expanding its functionality to meet their specific needs, be it a new block or new ways to customize block parameter changes or block styles and more.

#### Drag And Drop

Chameleon provides Drag And Drop capabilities out of the box

## Demo

[Live demo](https://lfandorinl.github.io/chamaeleon/)

<video src="https://github.com/lFandoriNl/chamaeleon/assets/23149596/173e5059-a58d-4021-945e-b6442061fdad" controls="controls" style="max-width: 500px;">
</video>

## Goals for the first release version `1.0.0`

### Core functionality

- ✅ creating an editor instance does not depend on React rendering
- ✅ first-class API plugin support
- ✅ support for drag and drop blocks out of the box
- ✅ update state using command
- ✅ override internal UI components of the editor
- ✅ `view` and `editor` mode of the editor
- ❌ lightweight rendering without major editor dependencies (only `view` mode)
- ❌ i18n support
- ✅ possibility to add your own logger

### Devtools

- ✅ basic logging
- ❌ log filtering
- ❌ ability to highlight an element based on the affected log

### Documentation

- ✅ documentation site
- ❌ guidelines for converting an existing code base to Chamaeleon

### Plugin API

- ✅ async initialization
- ✅ own state
  - change by listening to transaction
  - getting/setting state from anywhere in your application
- ✅ adding new commands
- ✅ adding your own providers for the editor
- ✅ adding new blocks
  - nested block rules
- ✅ adding different views using createPortal anywhere in the editor
- ✅ adding views to configure block props/style
- ✅ ability to filter transactions
- ✅ ability to add transactions during a transaction

### Plugins

- ✅ possibility of undo redo commands - **plugin-history**
- ❌ collaboration capabilities
  - share state
  - share cursor
- ✅ inline menu to adding a block - **plugin-add-block-menu**
- ✅ drawer for editing block parameters - **plugin-configuration-drawer**

## Local setup

Before you start, make sure you have **pnpm** installed, if not, install it:

```
npm install -g pnpm
```

To set up Chamaeleon locally, you'll need to clone the repository.

To run the app locally, you can run the following commands:

```
pnpm i
pnpm dev
```

- Note: the first time you run **.d.ts** files will not be successfully generated for all packages, this is because turbo does not support task dependencies with the --watch flag, just run `pnpm dev` several times until type errors will disappear
