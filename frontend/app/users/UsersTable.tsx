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


export function UsersTable() {
  const { user, logout } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(user?.id || ""),
    retry: 2
  });

  if (isError) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      if (statusCode === 403) {
        logout();
        notifications.show({
          title: "Session Expired",
          message: "Your session has expired. Please log in again.",
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
      <UsersTableToolBar selectedIds={selectedIds} data={data?.users || []} />
      <TableSelection
        data={data?.users || []}
        selectedIds={selectedIds}
        setSelection={setSelectedIds}
      />
    </Container>
  );
}
