import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookie";

interface User {
  userId: number;
  email: string;
  role: string;
}

function decodeToken(token: string): User | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload)) as User;
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      setUser(decodeToken(token));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome card */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back{user?.email ? `, ${user.email}` : ""}! 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Role: <span className="capitalize font-medium">{user?.role ?? "—"}</span>
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Projects", value: 12 },
          { label: "Tasks", value: 34 },
          { label: "Completed", value: 8 },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Token debug (remove in production) */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800 break-all">
        <p className="font-semibold mb-1">🔑 Token (debug only — remove in prod)</p>
        <p>{getCookie("token")}</p>
      </div>
    </div>
  );
}