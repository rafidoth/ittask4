import { TableSelection } from "./TableSelection";

import { Container } from "@mantine/core";
import { useState } from "react";
import { UserStatus, type User } from "../types";
import { UsersTableToolBar } from "./TableToolbar";

const userData: User[] = [
  {
    id: "1",
    name: "Robert Wolfkisser",
    organizational_affiliation: "Architect, Meta Platforms, Inc",
    email: "rob_wolf@gmail.com",
    status: UserStatus.Unverified,
    last_seen: "5 minutes ago",
  },
  {
    id: "2",
    name: "Jill Jailbreaker",
    organizational_affiliation: "Senior Engineer, Stripe",
    email: "jill.jailbreaker@stripe.com",
    status: UserStatus.Unverified,
    last_seen: "12 minutes ago",
  },
  {
    id: "3",
    name: "Henry Silkeater",
    organizational_affiliation: "Product Designer, Figma",
    email: "henry.silkeater@figma.com",
    status: UserStatus.Unverified,
    last_seen: "1 hour ago",
  },
  {
    id: "4",
    name: "Bill Horsefighter",
    organizational_affiliation: "Engineering Manager, Atlassian",
    email: "bill.horsefighter@atlassian.com",
    status: UserStatus.Blocked,
    last_seen: "2 days ago",
  },
];

export function UsersTable() {
  const [data, setData] = useState<User[]>(userData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  return (
    <Container strategy="grid">
      <UsersTableToolBar selectedIds={selectedIds} data={data} />
      <TableSelection
        data={data}
        selectedIds={selectedIds}
        setSelection={setSelectedIds}
      />
    </Container>
  );
}
