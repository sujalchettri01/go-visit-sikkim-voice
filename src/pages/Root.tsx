import { Outlet, Navigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useLogout } from "../hooks/useLogout";

export default function Root() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const { mutate: logout, isPending } = useLogout();
  if (isLoading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  // No user or 401 → go to login
  if (isError || !user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 border-b px-6 flex items-center justify-between bg-white shadow-sm">
        <span className="font-semibold text-lg">MyApp</span>
        <nav className="flex gap-4 items-center text-sm">
          <a href="/user/dashboard" className="hover:underline">Dashboard</a>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">{user.email}</span>
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="text-red-500 hover:underline disabled:opacity-50"
          >
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </nav>
      </header>

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}