import { ActionIcon, ActionIconProps, ElementProps } from '@mantine/core';
import { IoSettingsOutline } from 'react-icons/io5';

export function SettingButton(
  props: ActionIconProps & ElementProps<'button', keyof ActionIconProps>,
) {
  return (
    <ActionIcon
      radius="xl"
      bg="white"
      variant="outline"
      aria-label="Open block settings"
      {...props}
    >
      <IoSettingsOutline size={20} />
    </ActionIcon>
  );
}
