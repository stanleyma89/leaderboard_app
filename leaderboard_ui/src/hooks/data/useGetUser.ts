import { useQuery } from "@tanstack/react-query";
import { request } from "../../utils/request";
import type { User, UserResponse } from "../../types/user";

const fetchUsers = async (url: string): Promise<User[]> => {
  const response = await request<UserResponse>("GET", url);
  return response.data;
};

export const useGetUsers = (url: string) => {
  return useQuery<User[], Error>({
    queryKey: ["users", url],
    queryFn: () => fetchUsers(url),
    placeholderData: [],
  });
};
