import { AiOutlinePlus } from 'react-icons/ai';

import { ActionButtonProps } from './action-button';

import { type EditorView } from '../editor-view';

export type ActionAddBlockButtonProps = Omit<ActionButtonProps, 'children'> & {
  view: EditorView;
};

export function ActionAddBlockButton({
  view,
  ...props
}: ActionAddBlockButtonProps) {
  return (
    <view.ui.ActionButton {...props}>
      <AiOutlinePlus size={20} />
    </view.ui.ActionButton>
  );
}
