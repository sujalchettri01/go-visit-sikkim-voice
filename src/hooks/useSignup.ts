import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

interface SignupInput {
  name: string;
  email: string;
  password: string;
}

interface SignupResponse {
  success: boolean;
  message: string;
}

export function useSignup() {
  const navigate = useNavigate();

  return useMutation<SignupResponse, Error, SignupInput>({
    mutationFn: async (input) => {
      const { data } = await api.post<SignupResponse>("/auth/signup", input);
      return data;
    },
    onSuccess: (res) => {
      if (res.success) {
        navigate("/login", { replace: true });
      }
    },
  });
}