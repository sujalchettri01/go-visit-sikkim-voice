import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export function useLogin() {
  const navigate = useNavigate();

  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async (credentials) => {
      try {
        const { data } = await api.post<LoginResponse>("/auth/login", credentials);
        return data;
      } catch (err: any) {
        const message = err?.response?.data?.message ?? "Login failed.";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      navigate("/user/dashboard", { replace: true });
    },
    onError: (err: any) => {
      // axios wraps the response error — extract backend message
      const message = err?.response?.data?.message ?? "Login failed.";
      throw new Error(message);
    },
  });
}