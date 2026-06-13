import cx from "clsx";
import { Checkbox, Group, ScrollArea, Table, Text } from "@mantine/core";
import classes from "./TableSelection.module.css";
import type { User } from "../types";

const tableHeads = ["Name", "Email", "Status", "Last Seen"];

type TableSelectionProps = {
  data?: User[];
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
          <Group gap="sm">
            <Text size="sm" fw={500}>
              {item.name}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{item.email}</Table.Td>
        <Table.Td>{item.status}</Table.Td>
        <Table.Td>{item.last_seen}</Table.Td>
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
