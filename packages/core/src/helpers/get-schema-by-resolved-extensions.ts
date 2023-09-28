import { Editor } from '..';
import { BlockSpec, Schema } from '../model';

import { getPropertiesFromExtension } from './get-properties-from-extensions';
import { getStyleFromExtension } from './get-style-from-extension';
import { splitExtensions } from './split-extensions';
import { callOrReturn } from '../utilities/call-or-return';

import { Extensions } from '../types';

export function getSchemaByResolvedExtensions(
  extensions: Extensions,
  editor: Editor,
): Schema {
  const { blockExtensions } = splitExtensions(extensions);

  const blocks = Object.fromEntries(
    blockExtensions.map((extension) => {
      const extensionProperties = getPropertiesFromExtension(extension, editor);
      const extensionStyle = getStyleFromExtension(extension, editor);

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
        style: extensionStyle?.style,
      };

      return [extension.name, schema];
    }),
  );

  return new Schema({
    blocks,
  });
}
