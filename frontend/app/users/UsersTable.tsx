import { TableSelection } from "./TableSelection";

import { Container, Stack, Loader } from "@mantine/core";
import { useState } from "react";
import { UsersTableToolBar } from "./TableToolbar";
import { getUsers } from "~/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "~/auth/AuthProvider";
import { redirect } from "react-router";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import type { User } from "~/types";


function sortUsersByLastSeen(users?: User[]): User[] {
  if (!users) {
    return []
  }
  const sorted = [...users].sort((a: User, b: User) => {
    if (!a.lastSeen) return 1;
    if (!b.lastSeen) return -1;
    return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
  })
  return sorted
}

export function UsersTable() {
  const { user, logout } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(user?.id || ""),
    retry: false
  });

  if (isError) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      if (statusCode === 403) {
        logout();
        let errorMsg = "Your session has expired. Please log in again.";
        if (error.response) {
          errorMsg = error.response.data.message;
        }
        notifications.show({
          title: "Session Expired",
          message: errorMsg,
          color: "red",
        })
        redirect("/login");
      }
    };
  }

  if (isLoading) {
    return <Stack align="center" justify="center" style={{ height: "100vh" }}>
      <Loader size="md" variant="dots" />
    </Stack>;
  }

  return (
    <Container strategy="grid">
      <UsersTableToolBar
        selectedIds={selectedIds}
        data={data?.users || []}
        filter={filter}
        setFilter={setFilter}
      />
      <TableSelection
        data={sortUsersByLastSeen(data?.users) || []}
        selectedIds={selectedIds}
        setSelection={setSelectedIds}
        filter={filter}
      />
    </Container>
  );
}
