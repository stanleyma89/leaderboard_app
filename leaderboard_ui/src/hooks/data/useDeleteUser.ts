import { useMutation } from "@tanstack/react-query";
import { request } from "../../utils/request";
import { toast } from "react-hot-toast";

const deleteUser = async (userId: number): Promise<void> => {
  await request("DELETE", `/api/v1/users/${userId}`);
};

export const useDeleteUser = () => {
  return useMutation<void, Error, { userId: number }>({
    mutationFn: ({ userId }) => deleteUser(userId),
    onMutate: () => {
      console.log("User delete mutation initiated");
    },
    onError: (error) => {
      console.error("User delete error:", error);
      toast.error(error.message);
    },
    onSuccess: () => {
      console.log("User delete successful");
    },
    onSettled: () => {
      console.log("User delete mutation settled");
    },
  });
};
