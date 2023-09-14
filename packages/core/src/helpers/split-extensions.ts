import { Extension } from '../extension';
import { Block } from '../block';
import { Extensions } from '../types';

export function splitExtensions(extensions: Extensions) {
  const baseExtensions = extensions.filter(
    (extension) => extension.type === 'extension',
  ) as Extension[];

  const blockExtensions = extensions.filter(
    (extension) => extension.type === 'node',
  ) as Block[];

  return {
    baseExtensions,
    blockExtensions,
  };
}
