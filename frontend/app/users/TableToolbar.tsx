import { Button, Flex, Input } from "@mantine/core";
import {
  BroomIcon,
  LockIcon,
  LockOpenIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { UserStatus, type User, type UserActionResponse } from "../types";
import { ActionIcon } from "@mantine/core";
import { QueryClient, useMutation, useQueryClient, } from "@tanstack/react-query";
import { useAuth } from "~/auth/AuthProvider";
import { blockUsers, cleanUnverifiedUsers, deleteUsers, unblockUsers } from "~/api";
import { notifications } from "@mantine/notifications";
import type { Dispatch, SetStateAction } from "react";

type MutationFnType = {
  actionName: string,
  actorUserId: string,
  queryClient: QueryClient
}

function useMutationFactory({ actionName, actorUserId, queryClient }: MutationFnType) {
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
    case "clean":
      fn = cleanUnverifiedUsers
      break;
  }
  if (!fn) {
    throw Error("action fn not configured")
  }

  return useMutation({
    mutationFn: (userIds: string[]) => fn(userIds, actorUserId || ""),
    onSuccess: (response: UserActionResponse) => {
      queryClient.invalidateQueries({
        queryKey: ["users"]
      });
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
  filter: string,
  setFilter: Dispatch<SetStateAction<string>>;
};

export function UsersTableToolBar({
  selectedIds,
  data,
  filter,
  setFilter
}: UsersTableToolBarProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient()

  const deleteMutation = useMutationFactory({
    actionName: "delete",
    actorUserId: user?.id || "",
    queryClient: queryClient
  })

  const blockMutation = useMutationFactory({
    actionName: "block",
    actorUserId: user?.id || "",
    queryClient: queryClient

  })
  const unblockMutation = useMutationFactory({
    actionName: "unblock",
    actorUserId: user?.id || "",
    queryClient: queryClient
  })

  const cleanUnverifiedUsersMutation = useMutationFactory({
    actionName: "clean",
    actorUserId: user?.id || "",
    queryClient: queryClient
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
    <Flex justify={{
      md: "space-between"
    }} direction={{
      base: 'column',
      md: 'row'
    }}
      gap={20}
      p={{ base: 10, md: 0 }}
    >
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

        <ActionIcon variant="light" size={"lg"}
          disabled={noUsersSelected}
          color="red"
          onClick={() => cleanUnverifiedUsersMutation.mutate(selectedIds)}
        >
          <BroomIcon size={TOOLBAR_ICON_SIZE} />
        </ActionIcon>
      </Flex>
      <Input
        placeholder="Filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
    </Flex>
  );
}
