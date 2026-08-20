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
  return useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
  const { data } = await api.get("/auth/me");
  return data.user ?? null; // never return undefined — React Query requires a defined value
},
    retry: false,       // don't retry on 401
    staleTime: 1000 * 60 * 5,
  });
}