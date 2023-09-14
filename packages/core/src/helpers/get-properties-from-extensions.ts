import { ExtensionProperty, Extensions, Property } from '../types';
import { splitExtensions } from './split-extensions';

export function getPropertiesFromExtensions(
  extensions: Extensions,
): ExtensionProperty[] {
  const extensionProperties: ExtensionProperty[] = [];

  const { blockExtensions } = splitExtensions(extensions);

  const defaultProperty: Required<Property> = {
    default: null,
    isRequired: false,
  };

  blockExtensions.forEach((extension) => {
    const { addProperties } = extension.config;

    if (!addProperties) {
      return;
    }

    const properties = addProperties();

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
  });

  return extensionProperties;
}
