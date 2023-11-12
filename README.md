# Chamaeleon

- [Overview](#overview)
  - [Building pages](#building-pages)
  - [Extensible Architecture](#extensible-architecture)
  - [Overriding Built-in Components](#overriding-built-in-components)
- [Demo](#demo)
- [Goals for 1.0.0](#goals-for-the-first-release-version-100)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Example](#example)
- [Local setup](#local-setup)

## Overview

Chamaeleon is a dynamic and versatile project designed to provide a flexible and extensible platform for building web pages. It is built on architecture that supports plugins, allowing users to customize and enhance their web development experience.

### Capabilities

#### Building pages

Chamaeleon provides interface building capabilities for creating web pages. It allows users to create, edit and manage web pages with ease, providing a wide range of tools and options to customize the appearance of your pages, like [Notion](https://www.notion.so).

#### Extensible Architecture

Chamaeleon is based on an extensible architecture based on plugins. This design allows users to add new features and functionality to the platform, expanding its functionality to meet their specific needs, be it a new block or new ways to customize block parameter changes or block styles and more.

#### Overriding Built-in Components

Chamaeleon provides the ability to override the editor UI components, allowing users to change the appearance and functionality of built-in components. This feature provides users with the flexibility to customize the look and feel of the editor, enhancing their web development experience.

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
- ➖ view and editing mode of the editor (currently only editing)
- ❌ lightweight rendering without major editor dependencies (only view mode)
- ❌ i18n support
- ✅ possibility to add your own logger

### Devtools

- ✅ basic logging
- ❌ log filtering
- ❌ ability to highlight an element based on the affected log

### Documentation

- ❌ documentation site
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
- built-in blocks
  - ✅ page block - **plugin-page**
  - ✅ grid building blocks - **plugin-grid**
  - ❌ text block - **plugin-typography** (now a primitive implementation)
    - single line text
    - multiline text
    - WYSIWYG editor
  - ❌ button block
  - ❌ select block
  - ❌ checkbox block
  - ❌ radio button block

## Prerequisites

This project is a monorepository that uses **pnpm** for managing packages. **pnpm** is a fast, disk space efficient package manager that helps to work with monorepos.

Before you begin, ensure you have met the following requirements:

Installing **pnpm**

```
npm install -g pnpm
```

## Installation

For basic use you need to install the core and react-editor:

```shell
npm i react react-dom @chamaeleon/core @chamaeleon/react-editor
```

If you want to install base blocks:

```shell
npm i @chamaeleon/plugin-page @chamaeleon/plugin-grid @chamaeleon/plugin-typography
```

If you want to connect built-in plugins for editing and adding blocks, then run:

```shell
npm i @chamaeleon/plugin-add-block-menu @chamaeleon/plugin-configuration-drawer
```

You may also want to install an plugin for the undo redo commands:

```shell
npm i @chamaeleon/plugin-history
```

If you need support persisted state:

```shell
npm i @chamaeleon/plugin-persist
```

## Example

[View examples](./docs/example/example.md)

## Local setup

To set up Chamaeleon locally, you'll need to clone the repository.

To run the app locally, you can run the following commands:

```
pnpm i
pnpm dev
```

- Note: the first time you run **.d.ts** files will not be successfully generated for all packages, this is because turbo does not support task dependencies with the --watch flag, just run `pnpm dev` several times until type errors will disappear
