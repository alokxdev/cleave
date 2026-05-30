import { useMutation } from "@tanstack/react-query";
import { login, register } from "./api";
import { useAuthStore } from "../../store/auth.store";
import { tokenStorage } from "../../services/tokenStorage";

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      tokenStorage.setAccessToken(data.accessToken);

      setUser(data.user);
    },
  });
};

export const useRegister = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: register,

    onSuccess: (data) => {
      tokenStorage.setAccessToken(data.accessToken);

      setUser(data.user);
    },
  });
};
