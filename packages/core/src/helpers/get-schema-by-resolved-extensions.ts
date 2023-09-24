import { BlockSpec, Schema } from '../model/schema';

import { getPropertiesFromExtensions } from './get-properties-from-extensions';
import { splitExtensions } from './split-extensions';
import { callOrReturn } from '../utilities/call-or-return';

import { Extensions } from '../types';
import { type Editor } from '..';

export function getSchemaByResolvedExtensions(
  extensions: Extensions,
  editor: Editor,
): Schema {
  const allProperties = getPropertiesFromExtensions(extensions, editor);
  const { blockExtensions } = splitExtensions(extensions);

  const blocks = Object.fromEntries(
    blockExtensions.map((extension) => {
      const extensionProperties = allProperties.filter(
        (property) => property.type === extension.name,
      );

      const schema: BlockSpec = {
        allowContent: callOrReturn(extension.config.allowContent),
        withValue: callOrReturn(extension.config.withValue),
        withChildren: callOrReturn(extension.config.withChildren),
        rootable: callOrReturn(extension.config.rootable),
        structural: callOrReturn(extension.config.structural),
        props: Object.fromEntries(
          extensionProperties.map((extensionProperty) => {
            return [
              extensionProperty.name,
              { default: extensionProperty?.property?.default },
            ];
          }),
        ),
      };

      return [extension.name, schema];
    }),
  );

  return new Schema({
    blocks,
  });
}
