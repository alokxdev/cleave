import axios from "axios";

type ErrorResponse = {
  message?: string;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
) => {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};
