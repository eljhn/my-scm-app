import { Link, useLocation } from "react-router-dom";
import { supabase } from "../services/supabaseClient.js";
import { useEffect, useState, useCallback } from "react";
import { User, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const location = useLocation();

  // ✅ Fetch profile
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data: profileRow, error } = await supabase
        .from("profiles")
        .select("full_name, role, avatar_url")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setProfile({
        full_name: profileRow?.full_name || "User",
        role: profileRow?.role || "staff",
        avatar_url: profileRow?.avatar_url || null,
        email: user?.email || "No email",
      });
    } catch (err) {
      console.error("❌ Error fetching profile:", err.message);
    }
  }, []);

  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const sessionUser = data.session?.user || null;

    setUser(sessionUser);
    if (sessionUser) {
      fetchProfile(sessionUser.id);
    } else {
      setProfile(null);
    }
  }, [fetchProfile]);

  useEffect(() => {
    checkSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const sessionUser = session?.user || null;
        setUser(sessionUser);
        if (sessionUser) {
          fetchProfile(sessionUser.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription?.subscription?.unsubscribe();
  }, [checkSession, fetchProfile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setOpenModal(null);
    window.location.href = "/auth";
  };

  const isAuthPage = location.pathname === "/auth";
  const isGetInTouchPage = location.pathname === "/get-in-touch";

  const toggleModal = (modal) => {
    setOpenModal(openModal === modal ? null : modal);
  };

  // ✅ Build services menu depending on role
  const servicesLinks = [
    { path: "/", label: "Home", roles: ["staff", "manager", "admin"] },
    { path: "/sws", label: "Warehousing", roles: ["staff", "manager", "admin"] },
    { path: "/logistics", label: "Logistics", roles: ["staff", "manager", "admin"] },
    { path: "/assets", label: "Assets", roles: ["staff", "manager", "admin"] },
    { path: "/dtrs", label: "Documents", roles: ["staff", "manager", "admin"] },
    { path: "/psm", label: "Suppliers", roles: ["manager", "admin"] },
    { path: "/psm/purchase-orders", label: "Purchase Orders", roles: ["manager", "admin"] },
    { path: "/admin", label: "Admin Panel", roles: ["admin"] },
  ];

  const allowedLinks = servicesLinks.filter((link) =>
    profile?.role ? link.roles.includes(profile.role) : false
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md px-8 py-2 flex items-center justify-between shadow-sm">
      {/* ✅ Hide Brand on auth + get-in-touch */}
      {!isAuthPage && !isGetInTouchPage && (
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold ml-10 text-red-600 tracking-wide"
        >
          EJ
        </Link>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 text-lg relative">
        {!user && !isAuthPage && !isGetInTouchPage && (
          <>
            <Link to="/get-in-touch" className="hover:underline">
              Get in Touch
            </Link>
            <Link
              to="/auth"
              className="bg-red-600 px-4 py-1 rounded text-white font-medium hover:bg-red-700 mr-6"
            >
              Login
            </Link>
          </>
        )}

        {!user && (isAuthPage || isGetInTouchPage) && (
          <Link
            to="/"
            className="bg-red-600 px-4 py-1 rounded text-white font-medium hover:bg-red-700 mr-6"
          >
            Home
          </Link>
        )}

        {user && (
          <>
            {/* Services */}
            <button
              onClick={() => toggleModal("services")}
              className="flex items-center gap-1 hover:underline"
            >
              Services <ChevronDown size={18} />
            </button>

            <div
              className={`absolute top-16 right-40 bg-white shadow-lg rounded-lg p-4 w-56 transform origin-top transition-all duration-200
                ${
                  openModal === "services"
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
            >
              <ul className="flex flex-col gap-1 text-gray-700">
                {allowedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpenModal(null)}
                    className={`block px-3 py-2 rounded-md transition 
                      ${
                        location.pathname === link.path
                          ? "bg-red-50 text-red-600 font-semibold"
                          : "hover:bg-gray-100 hover:text-red-600"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </ul>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => toggleModal("profile")}
                className="rounded-full w-9 h-9 overflow-hidden border-2 border-red-600 mr-6"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 mx-auto my-2 text-red-600" />
                )}
              </button>

              <div
                className={`absolute right-0 top-14 bg-white shadow-lg rounded-lg p-4 w-64 transform origin-top transition-all duration-200
                  ${
                    openModal === "profile"
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
              >
                <div className="flex flex-col items-center text-gray-700">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-600 mb-2">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 mx-auto my-4 text-red-600" />
                    )}
                  </div>
                  <p className="font-bold text-lg">{profile?.full_name}</p>
                  <p className="text-sm text-gray-500">{profile?.role}</p>
                  <p className="text-sm text-gray-500">{profile?.email}</p>

                  <button
                    onClick={handleLogout}
                    className="mt-3 text-center px-4 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ✅ Mobile Navigation */}
      <div className="flex md:hidden items-center gap-4 text-lg relative">
        {!user && !isAuthPage && !isGetInTouchPage && (
          <>
            <Link
              to="/get-in-touch"
              className="bg-gray-100 border px-3 py-1 rounded hover:bg-gray-200"
            >
              Get in Touch
            </Link>
            <Link
              to="/auth"
              className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-800 mr-4"
            >
              Login
            </Link>
          </>
        )}

        {!user && (isAuthPage || isGetInTouchPage) && (
          <Link
            to="/"
            className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700 mr-4"
          >
            Home
          </Link>
        )}

        {user && (
          <>
            {/* Services */}
            <button
              onClick={() => toggleModal("services")}
              className="flex items-center gap-1 bg-gray-100 border px-3 py-2 rounded hover:bg-gray-200"
            >
              Services <ChevronDown size={16} />
            </button>

            <div
              className={`absolute top-16 left-4 bg-white shadow-lg rounded-lg p-4 w-56 transform origin-top transition-all duration-200
                ${
                  openModal === "services"
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
            >
              <ul className="flex flex-col gap-1 text-gray-700">
                {allowedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpenModal(null)}
                    className={`block px-3 py-2 rounded-md transition 
                      ${
                        location.pathname === link.path
                          ? "bg-red-50 text-red-600 font-semibold"
                          : "hover:bg-gray-100 hover:text-red-600"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </ul>
            </div>

            {/* Profile */}
            <button
              onClick={() => toggleModal("profile")}
              className="rounded-full w-8 h-8 overflow-hidden border-2 border-red-700 mr-4"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 mx-auto my-1 text-red-700" />
              )}
            </button>

            <div
              className={`absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-56 transform origin-top transition-all duration-200
                ${
                  openModal === "profile"
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
            >
              <div className="flex flex-col items-center text-gray-700">
                <p className="font-bold">{profile?.full_name}</p>
                <p className="text-sm">{profile?.role}</p>
                <p className="text-sm">{profile?.email}</p>
                <button
                  onClick={handleLogout}
                  className="mt-4 text-center px-4 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
