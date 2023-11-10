# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.10.0](https://github.com/lFandoriNl/chamaeleon/compare/@chamaeleon/core@0.8.1...@chamaeleon/core@0.10.0) (2023-11-10)

### Features

- change plugin api
- combining extensions with plugins

## Below is the old style changelog

# 0.9.0

### Minor Changes

- Added configuration plugin for content prop
- `allowContent["name"]` expanded support for new ways to filter blocks `"*"`, `"!blockName"`, `"blockName"`

### Patch Changes

- Updated dependencies
  - @chamaeleon/uikit@0.3.0

# 0.8.1

### Patch Changes

- Fixed crash when dragging a block

# 0.8.0

### Minor Changes

- Page, Row, Column, Text have been moved from the core into a separate package.

# 0.7.2

### Patch Changes

- Moved react to peerDependencies
- Updated dependencies
  - @chamaeleon/hooks@0.0.4
  - @chamaeleon/uikit@0.2.1

# 0.7.1

### Patch Changes

- Updated dependencies
  - @chamaeleon/uikit@0.2.0

# 0.7.0

### Minor Changes

- Added support for custom loggers

# 0.6.0

### Minor Changes

- Added `editor.configureExtension` to configure the extension after startup

# 0.5.0

### Minor Changes

- Added `commands.changeStyle`
- Added style plugin for `gap`
- Changed `plugin.view` function signature, from `(view: EditorView)` to `(context: { editor: Editor; view: EditorView })`

# 0.4.1

### Patch Changes

- Improved performance by reducing renders

# 0.4.0

### Minor Changes

- Added support for configuration templates for `Row`
- Added `property.propertyMatch` for `Plugin['property-configuration']`
- Renamed `plugin.view.update` to `plugin.view.render`

### Patch Changes

- Updated dependencies
  - @chamaeleon/uikit@0.1.0

# 0.3.0

### Minor Changes

- Create drag and drop
- The order of css classes has been changed

### Patch Changes

- Updated dependencies
  - @chamaeleon/hooks@0.0.3
  - @chamaeleon/uikit@0.0.3

# 0.2.1

### Patch Changes

- Add README.md & update package.json fields
- Updated dependencies
  - @chamaeleon/uikit@0.0.2

# 0.2.0

### Minor Changes

- Added serialization and deserialization of state for persist-plugin package

# 0.1.0

### Minor Changes

- Create history-plugin package

# 0.0.2

### Patch Changes

- Updated dependencies
  - @chamaeleon/uikit@0.0.1

# 0.0.1

### Patch Changes

- Initial public release
