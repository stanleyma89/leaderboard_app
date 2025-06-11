import { Button } from "@mantine/core";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";

export const SortButton = ({
  field,
  children,
  sortBy,
  sortDirection,
  handleSort,
}: {
  field: string;
  children: React.ReactNode;
  sortBy: string;
  sortDirection: "asc" | "desc";
  handleSort: (field: string) => void;
}) => (
  <Button
    variant="subtle"
    onClick={() => handleSort(field)}
    px={6}
    py={2}
    radius="md"
    color="gray"
    leftSection={undefined}
    rightSection={
      sortBy === field ? (
        sortDirection === "asc" ? (
          <IconChevronUp size={16} />
        ) : (
          <IconChevronDown size={16} />
        )
      ) : null
    }
  >
    {children}
  </Button>
);
