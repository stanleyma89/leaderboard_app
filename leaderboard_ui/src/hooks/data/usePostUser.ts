import { useMutation } from "@tanstack/react-query";
import { request } from "../../utils/request";
import type { UserPayload, User, CreatedUserResponse } from "../../types/user";
import { toast } from "react-hot-toast";

const postUser = async (userPayload: UserPayload): Promise<User> => {
  const response = await request<CreatedUserResponse>(
    "POST",
    "/api/v1/users",
    userPayload
  );
  return response.data;
};

export const usePostUser = () => {
  return useMutation<User, Error, UserPayload>({
    mutationFn: (userPayload) => postUser(userPayload),
    onMutate: (userPayload) => {
      console.log("User mutation initiated:", userPayload);
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
