import { Button, Flex } from "@mantine/core";
import {
  BroomIcon,
  LockIcon,
  LockOpenIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { UserStatus, type User, type UserActionResponse } from "../types";
import { ActionIcon } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { redirect } from "react-router";
import { useAuth } from "~/auth/AuthProvider";
import { deleteUsers } from "~/api";
import { notifications } from "@mantine/notifications";

type UsersTableToolBarProps = {
  selectedIds: string[];
  data: User[];
};

export function UsersTableToolBar({
  selectedIds,
  data,
}: UsersTableToolBarProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const deleteMutation = useMutation({
    mutationFn: (userIds: string[]) => deleteUsers(userIds, user?.id || ""),
    onSuccess: (response: UserActionResponse) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      notifications.show({
        title: "Success",
        message: response.message,
        color: "green",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error.message || "User deletion failed",
        color: "red",
      });
    },
  });


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
        onClick={() => deleteMutation.mutate(selectedIds)}
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
