import { ActionIcon, ActionIconProps, ElementProps } from '@mantine/core';
import { AiOutlinePlus } from 'react-icons/ai';

export function AddBlockButton(
  props: ActionIconProps & ElementProps<'button', keyof ActionIconProps>,
) {
  return (
    <ActionIcon
      size={38}
      radius="xl"
      variant="outline"
      aria-label="Add block"
      {...props}
    >
      <AiOutlinePlus size={20} />
    </ActionIcon>
  );
}
