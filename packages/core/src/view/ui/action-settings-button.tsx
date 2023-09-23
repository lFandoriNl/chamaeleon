import { IoSettingsOutline } from 'react-icons/io5';

import { ActionButtonProps } from './action-button';
import { type EditorView } from '../editor-view';

export type ActionSettingsButtonProps = Omit<ActionButtonProps, 'children'> & {
  view: EditorView;
};

export function ActionSettingsButton({
  view,
  ...props
}: ActionSettingsButtonProps) {
  return (
    <view.ui.ActionButton {...props}>
      <IoSettingsOutline size={20} />
    </view.ui.ActionButton>
  );
}
