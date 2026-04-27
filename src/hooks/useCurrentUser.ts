import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  provider: string;
}

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data.user; // matches your backend: res.json({ user: result.data })
    },
    retry: false,       // don't retry on 401
    staleTime: 1000 * 60 * 5,
  });
}