import { useState } from "react";
import { supabase } from "../../services/supabaseClient.js";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("staff");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null); // ✅ banner notice

  // ✅ Always redirect to home regardless of role
  const redirectToHome = () => {
    window.location.href = "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

    try {
      if (isLogin) {
        // ---------- LOGIN ----------
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        const user = data.user;
        if (user) {
          redirectToHome(); // ✅ always go to home page
        }
      } else {
        // ---------- REGISTER ----------
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
          },
        });
        if (signUpError) throw signUpError;

        setNotice({
          type: "success",
          text: "✅ Registration successful! Please check your email to confirm your account.",
        });

        // reset form and switch to login
        setIsLogin(true);
        setFullName("");
        setRole("staff");
      }
    } catch (err) {
      setNotice({
        type: "error",
        text: "❌ " + (err?.message || err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-96"
      >
        <h1 className="text-red-600 text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h1>

        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 mb-3 rounded"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {!isLogin && (
          <select
            className="w-full border p-2 mb-3 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Register"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-center text-blue-600 cursor-pointer hover:underline"
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>

        {/* ✅ Banner Notice */}
        {notice && (
          <div
            className={`mt-4 p-3 rounded text-sm ${
              notice.type === "success"
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
          >
            {notice.text}
          </div>
        )}
      </form>
    </div>
  );
}
