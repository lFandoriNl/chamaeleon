import { Extension } from '../extension';
import { BlockExtension } from '../block-extension';
import { Extensions } from '../types';

export function splitExtensions(extensions: Extensions) {
  const baseExtensions = extensions.filter(
    (extension) => extension.type === 'extension',
  ) as Extension[];

  const blockExtensions = extensions.filter(
    (extension) => extension.type === 'block',
  ) as BlockExtension[];

  return {
    baseExtensions,
    blockExtensions,
  };
}
