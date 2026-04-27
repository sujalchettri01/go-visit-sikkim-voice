// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Cookie already set by backend — just redirect
    navigate("/user/dashboard", { replace: true });
  }, []);

  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <p style={{ color: "#6366f1", fontWeight: 600 }}>Signing you in...</p>
    </div>
  );
}