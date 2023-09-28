import { Editor } from '..';
import { AnyExtension, ExtensionProperty, Property } from '../types';

export function getPropertiesFromExtension(
  extension: AnyExtension,
  editor: Editor,
): ExtensionProperty[] {
  const extensionProperties: ExtensionProperty[] = [];

  if (extension.type !== 'block') return extensionProperties;

  const defaultProperty: Required<Property> = {
    default: null,
    isRequired: false,
  };

  const { addProperties } = extension.config;

  if (!addProperties) {
    return extensionProperties;
  }

  const context = {
    editor,
    options: extension.options,
  };

  const properties = addProperties(context);

  Object.entries(properties).forEach(([name, property]) => {
    const mergedProperty = {
      ...defaultProperty,
      ...property,
    };

    if (typeof mergedProperty?.default === 'function') {
      mergedProperty.default = mergedProperty.default();
    }

    if (mergedProperty?.isRequired && mergedProperty?.default === undefined) {
      delete mergedProperty.default;
    }

    extensionProperties.push({
      type: extension.name,
      name,
      property: mergedProperty,
    });
  });

  return extensionProperties;
}
