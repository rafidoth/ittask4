import cx from "clsx";
import { Checkbox, Stack, ScrollArea, Table, Text } from "@mantine/core";
import classes from "./TableSelection.module.css";
import type { User } from "../types";

const tableHeads = ["Name", "Email", "Status", "Last Seen"];

type TableSelectionProps = {
  data: User[];
  selectedIds: string[];
  setSelection: React.Dispatch<React.SetStateAction<string[]>>;
};

export function TableSelection({
  data,
  selectedIds,
  setSelection,
}: TableSelectionProps) {
  if (!data) {
    return null;
  }
  console.log(data)
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

  const rows = data.map((item) => {
    const selected = selectedIds.includes(item.id);
    return (
      <Table.Tr
        key={item.id}
        className={cx({ [classes.rowSelected]: selected })}
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
            <Text size="md" fw={500}>
              {item.name}
            </Text>
            <Text size="sm" fw={300}>
              {item.organization_Affiliation || "N/A"}
            </Text>
          </Stack>
        </Table.Td>
        <Table.Td><Text size="md">{item.email}</Text></Table.Td>
        <Table.Td><Text size="md">{item.status}</Text></Table.Td>
        <Table.Td><Text size="md">{item.last_seen}</Text></Table.Td>
      </Table.Tr>
    );
  });

  return (
    <ScrollArea>
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
    </ScrollArea>
  );
}
