import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Tell backend to clear the httpOnly cookie
      await api.post("/auth/logout");
    },
    onSettled: () => {
      queryClient.clear(); // wipe all cached queries
      navigate("/login", { replace: true });
    },
  });
}