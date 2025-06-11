import {
  Modal,
  NumberInput,
  Stack,
  TextInput,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { usePostUser } from "../../hooks/data/usePostUser";
import { useQueryClient } from "@tanstack/react-query";

type ModalProps = {
  opened: boolean;
  onClose: () => void;
};

export const AddUserModal = ({ opened, onClose }: ModalProps) => {
  const { mutateAsync: mutateAsyncAddUser, isPending: isPendingAddUser } =
    usePostUser();

  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      name: "",
      age: 0,
      address: "",
    },

    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Name is required"),
      age: (value) => (value > 0 ? null : "Age must be greater than 0"),
      address: (value) =>
        value.trim().length > 0 ? null : "Address is required",
    },
  });

  const handleOnSubmit = async (values: typeof form.values) => {
    console.log(values);
    const payload = {
      name: values.name,
      age: values.age,
      address: values.address,
    };
    await mutateAsyncAddUser(payload);
    form.reset();
    queryClient.invalidateQueries({ queryKey: ["users"] });
    onClose();
  };

  if (isPendingAddUser) {
    return null;
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Add User" centered>
      <form onSubmit={form.onSubmit(handleOnSubmit)}>
        <Stack>
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...form.getInputProps("name")}
          />

          <NumberInput
            label="Age"
            placeholder="Enter age"
            min={0}
            {...form.getInputProps("age")}
          />

          <TextInput
            label="Address"
            placeholder="Enter Address"
            {...form.getInputProps("address")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
