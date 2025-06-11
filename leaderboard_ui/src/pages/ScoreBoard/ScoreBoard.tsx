import { useState } from "react";
import {
  Container,
  Paper,
  Title,
  Group,
  Button,
  TextInput,
  Stack,
  Text,
  Box,
  Center,
  Divider,
  Collapse,
  ActionIcon,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconCircleX,
  IconCirclePlus,
  IconCircleMinus,
  IconUserPlus,
  IconTrophy,
  IconSearch,
  IconArrowRight,
} from "@tabler/icons-react";
import { useGetUsers } from "../../hooks/data/useGetUser";
import { useDeleteUser } from "../../hooks/data/useDeleteUser";
import { useUpdateAddPoint } from "../../hooks/data/useUpdateAddPoint";
import { useUpdateSubPoint } from "../../hooks/data/useUpdateSubPoint";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { SortButton } from "../../components/SortButton/SortButton";
import { AddUserModal } from "../../components/AddUserModal/AddUserModa";
import type { User } from "../../types/user";

type PointMutationInput = {
  userId: number;
  payload: {
    points: number;
  };
};

export const ScoreBoard = () => {
  const baseUrl = "/api/v1/users";
  const [url, setUrl] = useState<string>(baseUrl);
  const { data: users, isLoading: isLoadingUsers } = useGetUsers(url);
  const { mutateAsync: mutateAsyncDeleteUser, isPending: isPendingDeleteUser } =
    useDeleteUser();
  const { mutateAsync: mutateAsyncAddPoint, isPending: isPendingAddPoint } =
    useUpdateAddPoint();
  const { mutateAsync: mutateAsyncSubPoint, isPending: isPendingSubPoint } =
    useUpdateSubPoint();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("points");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [openedModal, modalHandlers] = useDisclosure(false);
  const toggleDetails = (userId: number) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };
  const queryClient = useQueryClient();

  const handleSort = (column: string) => {
    const newSortBy = column;
    let newSortOrder: "asc" | "desc" = "asc";

    if (sortBy === column) {
      newSortOrder = sortDirection === "asc" ? "desc" : "asc";
    }

    setSortBy(newSortBy);
    setSortDirection(newSortOrder);

    updateUrl({ sort_by: newSortBy, sort_direction: newSortOrder });
  };

  const updateUrl = (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    setUrl(`${baseUrl}?${query}`);
  };

  const handleDelete = async (userId: number) => {
    await mutateAsyncDeleteUser({ userId });
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const handlePointUpdate = async (
    userId: number,
    points: number,
    mutationFn: (input: PointMutationInput) => Promise<User>
  ) => {
    const payload = { points };
    await mutationFn({ userId, payload });
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const handleSearch = () => {
    updateUrl({ search: searchTerm });
  };

  const isLoading =
    isLoadingUsers ||
    isPendingDeleteUser ||
    isPendingAddPoint ||
    isPendingSubPoint;

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "blue.5", type: "bars" }}
      />
      <Container size="lg" py="xl">
        <Paper radius="xl" p="xl" withBorder>
          <Center mb="xl">
            <Group wrap="nowrap" gap="sm">
              <IconTrophy size={32} color="#fcc419" />
              <Title order={2}>Scoreboard</Title>
            </Group>
          </Center>

          <Box pb="md">
            <TextInput
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              leftSection={<IconSearch size={18} color="#343a40" />}
              size="md"
              rightSection={
                <Group gap={4}>
                  <ActionIcon
                    size={32}
                    radius="xl"
                    color="blue.8"
                    variant="filled"
                    onClick={() => handleSearch()}
                  >
                    <IconArrowRight size={18} stroke={1.5} />
                  </ActionIcon>
                </Group>
              }
            />
          </Box>

          <Paper withBorder radius="md" p="sm" mb="md" bg="gray.1">
            <Group justify="space-between">
              <Group gap="sm">
                <Box>
                  <Text size="sm" fw={600} c="gray.6">
                    Rank
                  </Text>
                </Box>
                <Text size="sm" fw={600} c="gray.6"></Text>
                <SortButton
                  field="name"
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  handleSort={handleSort}
                >
                  <Text size="sm" fw={600} c="gray.6">
                    Name
                  </Text>
                </SortButton>
              </Group>

              <SortButton
                field="points"
                sortBy={sortBy}
                sortDirection={sortDirection}
                handleSort={handleSort}
              >
                <Text size="sm" fw={600} c="gray.6">
                  Points
                </Text>
              </SortButton>
            </Group>
          </Paper>

          <Stack>
            {users?.map((user, index) => (
              <Paper key={user.id} p="md" radius="lg" withBorder>
                <Group justify="space-between">
                  <Group gap="xl">
                    <Box>
                      <Text size="lg" c="dimmed" fw={600}>
                        #{index + 1}
                      </Text>
                    </Box>

                    <Text
                      fw={700}
                      size="xl"
                      onClick={() => toggleDetails(user.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {user.name}
                    </Text>
                  </Group>

                  <Group wrap="nowrap" align="center">
                    <Button
                      variant="light"
                      color="green"
                      onClick={() => {
                        handlePointUpdate(user.id, 1, mutateAsyncAddPoint);
                      }}
                      title="Add point"
                    >
                      <IconCirclePlus size={24} />
                    </Button>

                    <Button
                      variant="light"
                      color="orange"
                      onClick={() => {
                        handlePointUpdate(user.id, 1, mutateAsyncSubPoint);
                      }}
                      title="Remove point"
                    >
                      <IconCircleMinus size={24} />
                    </Button>

                    <Button
                      variant="light"
                      color="red"
                      onClick={() => handleDelete(user.id)}
                      title="Remove user"
                    >
                      <IconCircleX size={24} />
                    </Button>

                    <Box ta="right" miw={60}>
                      <Text fw={700} size="xl">
                        {user.points}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {user.points === 1 ? "point" : "points"}
                      </Text>
                    </Box>
                  </Group>
                </Group>

                <Collapse in={expandedUserId === user.id}>
                  <Box mt="xs" pl="lg">
                    <Text size="sm">
                      <strong>Name:</strong> {user.name}
                    </Text>
                    <Text size="sm">
                      <strong>Age:</strong> {user.age}
                    </Text>
                    <Text size="sm">
                      <strong>Points:</strong> {user.points}
                    </Text>
                    <Text size="sm">
                      <strong>Address:</strong> {user.address}
                    </Text>
                  </Box>
                </Collapse>
              </Paper>
            ))}
          </Stack>

          <Divider my="xl" />

          <Group justify="flex-end" mt="md">
            <Button
              color="blue"
              radius="xl"
              size="md"
              onClick={modalHandlers.open}
            >
              <Group wrap="nowrap" gap={6}>
                <IconUserPlus size={20} />
                <Text>Add Player</Text>
              </Group>
            </Button>
          </Group>
        </Paper>
        <AddUserModal opened={openedModal} onClose={modalHandlers.close} />
      </Container>
    </Box>
  );
};
