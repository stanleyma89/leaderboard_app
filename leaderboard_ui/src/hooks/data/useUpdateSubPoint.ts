import { useMutation } from "@tanstack/react-query";
import { request } from "../../utils/request";
import type {
  UpdatePointPayload,
  User,
  UpdatedUserResponse,
} from "../../types/user";
import { toast } from "react-hot-toast";

const updateRemovePoint = async ({
  userId,
  payload,
}: {
  userId: number;
  payload: UpdatePointPayload;
}): Promise<User> => {
  const response = await request<UpdatedUserResponse>(
    "PATCH",
    `/api/v1/users/${userId}/points/decrement`,
    payload
  );
  return response.data;
};

export const useUpdateSubPoint = () => {
  return useMutation<
    User,
    Error,
    { userId: number; payload: UpdatePointPayload }
  >({
    mutationFn: (payload) => updateRemovePoint(payload),
    onMutate: (payload) => {
      console.log("User mutation initiated:", payload);
    },
    onError: (error) => {
      console.error("User error:", error);
      toast.error(error.message);
    },
    onSuccess: (data) => {
      console.log("User successful:", data);
    },
    onSettled: (data, error) => {
      console.log("User mutation settled:", { data, error });
    },
  });
};
