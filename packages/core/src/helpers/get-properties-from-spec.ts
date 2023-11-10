import { BlockProperty, Properties, Property } from '../types';

export function getPropertiesFromSpec(properties: Properties): BlockProperty[] {
  const blockProperties: BlockProperty[] = [];

  const defaultProperty: Required<Property> = {
    default: null,
    isRequired: false,
  };

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

    blockProperties.push({
      name,
      property: mergedProperty,
    });
  });

  return blockProperties;
}
