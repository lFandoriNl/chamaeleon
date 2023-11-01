# @chamaeleon/core

## 0.8.0

### Minor Changes

- Page, Row, Column, Text have been moved from the core into a separate package.

## 0.7.2

### Patch Changes

- Moved react to peerDependencies
- Updated dependencies
  - @chamaeleon/hooks@0.0.4
  - @chamaeleon/uikit@0.2.1

## 0.7.1

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

- Added serialization and deserialization of state for extension-persist package

## 0.1.0

### Minor Changes

- Create extension-history package

## 0.0.2

### Patch Changes

- Updated dependencies
  - @chamaeleon/uikit@0.0.1

## 0.0.1

### Patch Changes

- Initial public release
