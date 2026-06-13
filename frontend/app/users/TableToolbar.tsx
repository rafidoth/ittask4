import { Button, Flex } from "@mantine/core";

import {
  BroomIcon,
  LockIcon,
  LockOpenIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { UserStatus, type User } from "../types";
import { ActionIcon } from "@mantine/core";
type UsersTableToolBarProps = {
  selectedIds: string[];
  data: User[];
};

export function UsersTableToolBar({
  selectedIds,
  data,
}: UsersTableToolBarProps) {
  const TOOLBAR_ICON_SIZE = 16;
  const allSelectedUsersAreAlreadyBlocked = selectedIds.every(
    (id) => data.find((user) => user.id === id)?.status === UserStatus.Blocked,
  );
  const allSelectedUsersAreNotBlocked = selectedIds.every(
    (id) => data.find((user) => user.id === id)?.status !== UserStatus.Blocked,
  );

  const noUsersSelected = selectedIds.length === 0;
  return (
    <Flex justify="flex-start" gap="md">
      <Button
        disabled={noUsersSelected || allSelectedUsersAreAlreadyBlocked}
        variant="default"
        leftSection={<LockIcon size={TOOLBAR_ICON_SIZE} />}
      >
        Block
      </Button>
      <ActionIcon
        disabled={noUsersSelected || allSelectedUsersAreNotBlocked}
        variant="default"
        size={"lg"}
      >
        <LockOpenIcon size={TOOLBAR_ICON_SIZE} />
      </ActionIcon>

      <ActionIcon
        disabled={noUsersSelected}
        variant="light"
        size={"lg"}
        color="red"
      >
        <TrashIcon
          size={TOOLBAR_ICON_SIZE}
          color={noUsersSelected ? "gray" : "red"}
        />
      </ActionIcon>

      <ActionIcon variant="light" size={"lg"} color="red">
        <BroomIcon size={TOOLBAR_ICON_SIZE} />
      </ActionIcon>
    </Flex>
  );
}
