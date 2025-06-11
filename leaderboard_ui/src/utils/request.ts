import type { AxiosRequestConfig } from "axios";
import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import { toast } from "react-hot-toast";

export const request = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data: unknown = null,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.error("Response Error:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
        toast.error(error.message);
      } else if (error.request) {
        console.error("Request Error:", error.request);
        toast.error(error.message);
      } else {
        console.error("Axios Error:", error.message);
      }
    } else {
      console.error("Unknown Error:", (error as Error).message);
    }

    throw error;
  }
};
