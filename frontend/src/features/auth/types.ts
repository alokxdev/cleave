export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
