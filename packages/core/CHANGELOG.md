# @chamaeleon/core

## 0.13.0

### Minor Changes

- [`4b700c8`](https://github.com/lFandoriNl/chamaeleon/commit/4b700c833b54f2760125459f79d57bdea96fc62f) Thanks [@lFandoriNl](https://github.com/lFandoriNl)! - Transition to a headless approach

- [`6d41538`](https://github.com/lFandoriNl/chamaeleon/commit/6d41538585606e109615c2006541167913e0a837) Thanks [@lFandoriNl](https://github.com/lFandoriNl)! - Add a plugin view name to indicate its impact, override or show conflicts

- [`fac1845`](https://github.com/lFandoriNl/chamaeleon/commit/fac1845cdd56446f789c04fd4bf2c530fe611ad6) Thanks [@lFandoriNl](https://github.com/lFandoriNl)! - Add plugin view tokens

- [`99ec42b`](https://github.com/lFandoriNl/chamaeleon/commit/99ec42b8fe8da6d28f7bb9b0ae3d6c28f6c7baa4) Thanks [@lFandoriNl](https://github.com/lFandoriNl)! - Add padding plugin

### Patch Changes

- [`b986b4c`](https://github.com/lFandoriNl/chamaeleon/commit/b986b4cc5b31773f79f70f9de6484b3fac74af95) Thanks [@lFandoriNl](https://github.com/lFandoriNl)! - add touch events for dnd triggers

- [`5958003`](https://github.com/lFandoriNl/chamaeleon/commit/59580033dbde0a73e828a44364fcad4fdae44f39) Thanks [@lFandoriNl](https://github.com/lFandoriNl)! - Fix the definition of isAllowedContent for a block, affecting the correct operation of drag and drop

## 0.12.0

### Minor Changes

- [`f3ecd89`](https://github.com/lFandoriNl/chamaeleon/commit/f3ecd8948f721706363a277637d39b9bb15d6db6) Thanks [@lFandoriNl](https://github.com/lFandoriNl)! - migrate from @popperjs to @floating-ui

## 0.11.1

### Patch Changes

- [`53c67c5`](https://github.com/lFandoriNl/chamaeleon/commit/53c67c58095a9b0d4c364332e6a06a55048414b4) Thanks [@lFandoriNl](https://github.com/lFandoriNl)! - Fix crash during drag and drop
  Fix pass attributes to drag node when there is an activator node

## 0.11.0

### Minor Changes

- Replacing peerDependencies with dependencies without duplicating the bundle, due to the fact that only types are used
- Renaming plugin packages

## 0.10.0

### Minor Changes

- Change plugin api
- Combining extensions with plugins

## 0.9.0

### Minor Changes

- Added configuration plugin for content prop
- `allowContent["name"]` expanded support for new ways to filter blocks `"*"`, `"!blockName"`, `"blockName"`

### Patch Changes

- Updated dependencies
  - @chamaeleon/uikit@0.3.0

## 0.8.1

### Patch Changes

- Fixed crash when dragging a block

## 0.8.0

### Minor Changes

- Page, Row, Column, Text have been moved from the core into a separate package.

## 0.7.2

### Patch Changes

- Moved react to peerDependencies
- Updated dependencies
  - @chamaeleon/hooks@0.0.4
  - @chamaeleon/uikit@0.2.1

# 0.7.1

### Patch Changes

- Updated dependencies
  - @chamaeleon/uikit@0.2.0

## 0.7.0

### Minor Changes

- Added support for custom loggers

## 0.6.0

### Minor Changes

- Added `editor.configureExtension` to configure the extension after startup

## 0.5.0

### Minor Changes

- Added `commands.changeStyle`
- Added style plugin for `gap`
- Changed `plugin.view` function signature, from `(view: EditorView)` to `(context: { editor: Editor; view: EditorView })`

## 0.4.1

### Patch Changes

- Improved performance by reducing renders

## 0.4.0

### Minor Changes

- Added support for configuration templates for `Row`
- Added `property.propertyMatch` for `Plugin['property-configuration']`
- Renamed `plugin.view.update` to `plugin.view.render`

### Patch Changes

- Updated dependencies
  - @chamaeleon/uikit@0.1.0

## 0.3.0

### Minor Changes

- Create drag and drop
- The order of css classes has been changed

### Patch Changes

- Updated dependencies
  - @chamaeleon/hooks@0.0.3
  - @chamaeleon/uikit@0.0.3

## 0.2.1

### Patch Changes

- Add README.md & update package.json fields
- Updated dependencies
  - @chamaeleon/uikit@0.0.2

## 0.2.0

### Minor Changes

- Added serialization and deserialization of state for plugin-persist package

## 0.1.0

### Minor Changes

- Create plugin-history package

## 0.0.2

### Patch Changes

- Updated dependencies
  - @chamaeleon/uikit@0.0.1

## 0.0.1

### Patch Changes

- Initial public release
