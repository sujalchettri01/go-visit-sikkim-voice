import { Outlet, Navigate } from "react-router-dom";
import { getCookie } from "../utils/cookie";

export default function Root() {
  const token = getCookie("token");

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="h-14 border-b px-6 flex items-center justify-between bg-white shadow-sm">
        <span className="font-semibold text-lg">MyApp</span>
        <nav className="flex gap-4 text-sm">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <LogoutButton />
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

function LogoutButton() {
  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return (
    <button onClick={handleLogout} className="hover:underline text-red-500">
      Logout
    </button>
  );
}