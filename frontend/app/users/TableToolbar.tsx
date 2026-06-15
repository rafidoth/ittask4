import { Button, Flex, Input } from "@mantine/core";
import {
  BroomIcon,
  LockIcon,
  LockOpenIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { UserStatus, type User, type UserActionResponse } from "../types";
import { ActionIcon } from "@mantine/core";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { redirect } from "react-router";
import { useAuth } from "~/auth/AuthProvider";
import { blockUsers, deleteUsers, unblockUsers } from "~/api";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { setDate } from "date-fns";

type MutationFnType = {
  actionName: string,
  actorUserId: string,
}

function useMutationFactory({ actionName, actorUserId }: MutationFnType) {
  let fn;
  switch (actionName) {
    case "delete":
      fn = deleteUsers;
      break;
    case "block":
      fn = blockUsers;
      break;
    case "unblock":
      fn = unblockUsers;
      break;
  }
  if (!fn) {
    throw Error("action fn not configured")
  }

  return useMutation({
    mutationFn: (userIds: string[]) => fn(userIds, actorUserId || ""),
    onSuccess: (response: UserActionResponse) => {
      notifications.show({
        title: "Success",
        message: response.message,
        color: "green",
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: "Error",
        message: error.message || `User ${actionName} failed`,
        color: "red",
      });
    },
  });
}

type UsersTableToolBarProps = {
  selectedIds: string[];
  data: User[];
};

export function UsersTableToolBar({
  selectedIds,
  data,
}: UsersTableToolBarProps) {
  const { user } = useAuth();

  const deleteMutation = useMutationFactory({
    actionName: "delete",
    actorUserId: user?.id || ""
  })

  const blockMutation = useMutationFactory({
    actionName: "block",
    actorUserId: user?.id || ""
  })

  const unblockMutation = useMutationFactory({
    actionName: "unblock",
    actorUserId: user?.id || ""
  })

  const TOOLBAR_ICON_SIZE = 16;
  const allSelectedUsersAreAlreadyBlocked = selectedIds.every(
    (id) => data.find((user) => user.id === id)?.status === UserStatus.Blocked,
  );
  const allSelectedUsersAreNotBlocked = selectedIds.every(
    (id) => data.find((user) => user.id === id)?.status !== UserStatus.Blocked,
  );
  const noUsersSelected = selectedIds.length === 0;

  return (
    <Flex justify={"space-between"}>
      <Flex justify="flex-start" gap="md">
        <Button
          disabled={noUsersSelected || allSelectedUsersAreAlreadyBlocked || blockMutation.isPending}
          variant="light"
          leftSection={<LockIcon size={TOOLBAR_ICON_SIZE}
          />}
          onClick={() => blockMutation.mutate(selectedIds)}
        >
          Block
        </Button>
        <ActionIcon
          disabled={noUsersSelected || allSelectedUsersAreNotBlocked || unblockMutation.isPending}
          variant="light"
          size={"lg"}
          onClick={() => unblockMutation.mutate(selectedIds)}
        >
          <LockOpenIcon size={TOOLBAR_ICON_SIZE} />
        </ActionIcon>

        <ActionIcon
          disabled={noUsersSelected || deleteMutation.isPending}
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
      <Input
        placeholder="Filter"
      />
    </Flex>
  );
}
