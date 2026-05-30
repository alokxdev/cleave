import { apiClient } from "../../services/apiClient";
import type { LoginInput, RegisterInput, ApiResponse, LoginResponse } from "./types";

export const login = async (data: LoginInput) => {
  const res = await apiClient.post<ApiResponse<LoginResponse>>(
    "/api/auth/login",
    data,
  );

  return res.data.data;
};

export const register = async (data: RegisterInput) => {
  const res = await apiClient.post<ApiResponse<LoginResponse>>(
    "/api/auth/register",
    data,
  );

  return res.data.data;
};
