import clsx from 'clsx';

import { IconButton, IconButtonProps } from '@chamaeleon/uikit';

import { EditorView } from '../editor-view';

export type ActionButtonProps = IconButtonProps & {
  view: EditorView;
};

export function ActionButton({ view: _, ...props }: ActionButtonProps) {
  return (
    <IconButton {...props} className={clsx(props.className, 'rounded-lg')} />
  );
}
