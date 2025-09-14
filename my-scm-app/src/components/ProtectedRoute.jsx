import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient.js";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      // ✅ Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(user);

      // ✅ Fetch role from profiles table
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle(); // safer than .single()

      if (error) {
        console.error("❌ Error fetching role:", error.message);
      }

      setRole(profile?.role || "staff"); // default role = staff
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ⏳ Show loader while checking
  if (loading) {
    return <div className="p-6 text-center">⏳ Checking permissions...</div>;
  }

  // 🚪 If not logged in → go to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 🚦 If user’s role is not allowed → redirect to their home
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "manager") return <Navigate to="/psm" replace />;
    if (role === "staff") return <Navigate to="/sws" replace />;
    return <Navigate to="/" replace />; // fallback
  }

  // ✅ Otherwise, allow access
  return children;
}
