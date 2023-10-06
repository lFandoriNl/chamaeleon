# Chamaeleon

- [Overview](#overview)
  - [Building pages](#building-pages)
  - [Extensible Architecture](#extensible-architecture)
  - [Overriding Built-in Components](#overriding-built-in-components)
- [Example](#example)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Local setup](#local-setup)

## Overview

Chamaeleon is a dynamic and versatile project designed to provide a flexible and extensible platform for building web pages. It is built on architecture that supports extensions and plugins, allowing users to customize and enhance their web development experience.

### Capabilities

#### Building pages

Chamaeleon provides interface building capabilities for creating web pages. It allows users to create, edit and manage web pages with ease, providing a wide range of tools and options to customize the appearance of your pages, like [Notion](https://www.notion.so).

#### Extensible Architecture

Chamaeleon is based on an extensible architecture based on extensions and plugins. This design allows users to add new features and functionality to the platform, expanding its functionality to meet their specific needs, be it a new block or new ways to customize block parameter changes or block styles and more.

#### Overriding Built-in Components

Chamaeleon provides the ability to override the editor UI components, allowing users to change the appearance and functionality of built-in components. This feature provides users with the flexibility to customize the look and feel of the editor, enhancing their web development experience.

## Example

[View examples](./docs/example/example.md)

## Prerequisites

This project is a monorepository that uses **pnpm** for managing packages. **pnpm** is a fast, disk space efficient package manager that helps to work with monorepos.

Before you begin, ensure you have met the following requirements:

Installing **pnpm**

```
npm install -g pnpm
```

## Installation

For basic use you need to install the core and react-editor:

```
npm i @chamaeleon/core @chamaeleon/react-editor
```

If you want to connect built-in extensions for editing and adding blocks, then run:

```
npm i @chamaeleon/extension-add-block-menu @chamaeleon/extension-configuration-drawer
```

You may also want to install an extension for the undo redo commands:

```
npm i @chamaeleon/extension-history
```

If you need support persisted state:

```
npm i @chamaeleon/extension-persist
```

## Local setup

To set up Chamaeleon locally, you'll need to clone the repository.

To run the app locally, you can run the following commands:

```
pnpm i
pnpm dev
```

- Note: the first time you run **.d.ts** files will not be successfully generated for all packages, this is because turbo does not support task dependencies with the --watch flag, just run `pnpm dev` several times until type errors will disappear
