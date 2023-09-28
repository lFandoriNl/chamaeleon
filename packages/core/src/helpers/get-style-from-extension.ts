import { Editor } from '..';
import { AnyExtension, ExtensionStyle } from '../types';

export function getStyleFromExtension(
  extension: AnyExtension,
  editor: Editor,
): ExtensionStyle | undefined {
  if (extension.type !== 'block') return;

  const { addStyle } = extension.config;

  if (!addStyle) {
    return;
  }

  const context = {
    editor,
    options: extension.options,
  };

  const style = addStyle(context);

  return {
    type: extension.name,
    style,
  };
}
