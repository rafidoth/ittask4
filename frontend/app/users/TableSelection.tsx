import cx from "clsx";
import { Checkbox, Stack, ScrollArea, Table, Text, Paper, TooltipFloating } from "@mantine/core";
import classes from "./TableSelection.module.css";
import type { User } from "../types";
import { parse, format } from 'date-fns';
import { ActivityChart } from "./ActivityChart";
import { useAuth } from "~/auth/AuthProvider";

function timeAgo(date: Date) {
  const sec = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (sec < 60) return "less than a minute ago";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minute${min > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}



const tableHeads = ["Name", "Email", "Status", "Last Login", "Joined", "Last Seen"];

type TableSelectionProps = {
  data: User[];
  selectedIds: string[];
  setSelection: React.Dispatch<React.SetStateAction<string[]>>;
  filter: string;
};

export function TableSelection({
  data,
  selectedIds,
  setSelection,
  filter
}: TableSelectionProps) {
  if (!data) {
    return null;
  }

  const { user } = useAuth()
  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  const toggleAll = () =>
    setSelection((current) =>
      current.length === data.length ? [] : data.map((item) => item.id),
    );

  const rows = data
    .filter(r => r.name.toLowerCase().includes(filter.toLowerCase()) || filter === "")
    .map((item) => {
      const selected = selectedIds.includes(item.id);
      const last_seen = item.lastSeen ? timeAgo(new Date(item.lastSeen)) : "Never seen"

      const chart_data = item.activitesInMinutes &&
        Object.entries(item.activitesInMinutes).map(([dateStr, activity]) => {
          const dateObj = parse(dateStr, 'yyyy-MM-dd', new Date());
          const date = format(dateObj, 'd MMMM, yyyy');
          return { date, activity }
        })

      return (
        <Table.Tr
          key={item.id}
          className={cx({ [classes.rowSelected]: selected })}
          c={item.status === "Blocked" ? "dark.2" : ""}
        >
          <Table.Td>
            <Checkbox
              checked={selectedIds.includes(item.id)}
              onChange={() => toggleRow(item.id)}
              aria-label="Select row"
            />
          </Table.Td>
          <Table.Td>
            <Stack gap="sm">
              <Text size="md" fw={500}
                c={item.id === user?.id ? "blue.8" : ""}
                td={item.status === "Blocked" ? "line-through" : ""}
              >
                {item.name}
                <Text size="sm" fw={300}>
                  {item.organization_Affiliation || "N/A"}
                </Text>
              </Text>

            </Stack>
          </Table.Td>
          <Table.Td><Text size="md">{item.email}</Text></Table.Td>
          <Table.Td><Text size="md">{item.status}</Text></Table.Td>
          <Table.Td>
            <Text size="md">{format(item.lastLogin!, "hh.mm a")}
              <Text size="md">{format(item.lastLogin!, "dd MMMM, yyyy")}</Text>
            </Text>
          </Table.Td>
          <Table.Td><Text size="md">{format(item.createdAt!, "dd MMMM, yyyy")}</Text></Table.Td>
          <Table.Td>
            <Stack>
              <TooltipFloating
                label={
                  <span>{format(new Date(item.lastSeen!), "dd MMMM, yyyy, hh.mm a")}
                  </span>
                }>
                <Text size="md" style={{ cursor: "pointer" }}>{last_seen}</Text>
              </TooltipFloating>
              {item.activitesInMinutes && chart_data &&
                <ActivityChart
                  data={chart_data}
                />}
            </Stack>
          </Table.Td>
        </Table.Tr>
      );
    });

  return (
    <Table miw={800} verticalSpacing="sm">
      <Table.Thead>
        <Table.Tr>
          <Table.Th w={40} aria-label="Select all rows">
            <Checkbox
              onChange={toggleAll}
              checked={selectedIds.length === data.length}
              indeterminate={
                selectedIds.length > 0 && selectedIds.length !== data.length
              }
              aria-label="Select all rows"
            />
          </Table.Th>
          {tableHeads.map((th) => (
            <Table.Th key={th}>
              {th}
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
