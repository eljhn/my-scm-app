import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "./index.css";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages (Modules)
import SWSPage from "./modules/sws/SWSPage";
import SWSProducts from "./modules/sws/SWSProducts";
import SWSWarehouses from "./modules/sws/SWSWarehouses";
import PSMPage from "./modules/psm/PSMPage";
import PurchaseOrderPage from "./modules/psm/PurchaseOrderPage";
import LogisticsPage from "./modules/logistics/LogisticsPage";
import AssetsPage from "./modules/assets/AssetsPage";
import DTRSPage from "./modules/dtrs/DTRSPage";
import AuthPage from "./modules/auth/AuthPage";

// Admin & Misc
import AdminPanel from "./pages/AdminPanel";
import AdminMessagesPage from "./pages/AdminMessagesPage";
import GetInTouchPage from "./pages/GetInTouchPage";

// Supabase Client
import { supabase } from "./services/supabaseClient";

// ✅ Homepage Component
function HomePage({ user }) {
  return (
    <div className="mt-20"> {/* increased margin-top for navbar spacing */}
      {/* Main Title */}
      <h1 className="text-xl md:text-3xl font-bold text-red-700 mb-2 text-center">
        Smart Supply Chain System
      </h1>

      {/* Tagline */}
      <p className="text-md md:text-lg text-gray-700 font-medium text-center mb-2">
        Driving efficiency, transparency, and innovation in every step.
      </p>

      {/* Short description */}
      <p className="text-sm md:text-base text-gray-600 text-center max-w-2xl mx-auto mb-6">
        An integrated platform that empowers businesses with seamless solutions 
        for warehousing, procurement, logistics, asset management, and records 
        tracking—all in one unified system.
      </p>

      {/* Image with Overlayed Description */}
      <div className="relative w-full">
        <img
          src="src/assets/warehouse.jpg"
          alt="Smart Warehousing"
          className="w-full h-[400px] md:h-[500px] object-cover"
        />

        {/* Desktop Overlay */}
        <div className="hidden md:flex absolute inset-0 items-start justify-start px-6 md:px-12 py-6">
          <div className="backdrop-blur-lg p-6 md:p-10 rounded-2xl max-w-xl text-left">
            <p className="text-white mb-3 text-sm md:text-base">
              Our platform is designed to transform the way businesses manage
              their operations. With a focus on efficiency, transparency, and
              innovation, we deliver end-to-end solutions that help companies
              gain better control of their supply chains, reduce costs, and make
              smarter decisions.
            </p>
            <p className="text-white mb-3 text-sm md:text-base">
              For organizations, this means seamless integration of warehousing,
              procurement, logistics, assets, and records into one unified
              system that drives growth and competitiveness.
            </p>
            <p className="text-white text-sm md:text-base">
              For professionals, this is more than just a workplace—it is an
              environment where talent meets opportunity.
            </p>
          </div>
        </div>

        {/* Mobile Text */}
        <div className="md:hidden mt-4 px-4">
          <div className="backdrop-blur-lg shadow-md rounded-2xl p-4 text-left bg-transparent">
            <p className="text-black mb-3 text-sm">
              Our platform is designed to transform the way businesses manage
              their operations. With a focus on efficiency, transparency, and
              innovation, we deliver end-to-end solutions that help companies
              gain better control of their supply chains, reduce costs, and make
              smarter decisions.
            </p>
            <p className="text-black mb-3 text-sm">
              For organizations, this means seamless integration of warehousing,
              procurement, logistics, assets, and records into one unified
              system that drives growth and competitiveness.
            </p>
            <p className="text-black text-sm">
              For professionals, this is more than just a workplace—it is an
              environment where talent meets opportunity.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Get in Touch Card (only show if NOT logged in) */}
      {!user && (
        <div className="mt-8 flex justify-end md:justify-center">
          <Link
            to="/get-in-touch"
            className="w-full md:w-1/2 lg:w-1/3 bg-white/60 backdrop-blur-lg text-black-800 rounded-2xl shadow-lg p-4 text-center hover:bg-white/80 transition"
          >
            <h2 className="text-lg text-red-700 font-semibold">Get in Touch</h2>
            <p className="mt-1 text-sm">
              Reach out to us for inquiries, support, or collaboration.
            </p>
          </Link>
        </div>
      )}

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-10">
        <FeatureCard
          title="Smart Warehousing System"
          description="Real-time inventory control and optimized stock movements."
        />
        <FeatureCard
          title="Procurement & Sourcing Management"
          description="Centralized supplier database and automated purchase orders."
        />
        <FeatureCard
          title="Project Logistics Tracker"
          description="End-to-end shipment visibility and delivery monitoring."
        />
        <FeatureCard
          title="Asset Lifecycle & Maintenance System"
          description="Track equipment, schedule maintenance, and reduce downtime."
        />
        <FeatureCard
          title="Document Tracking System"
          description="Secure digital repository with fast retrieval and compliance."
        />
      </div>
    </div>
  );
}

// ✅ App Content Wrapper
function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // ✅ Check user session from Supabase
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-1 p-6">
        <Routes>
          {/* ✅ Homepage */}
          <Route path="/" element={<HomePage user={user} />} />

          {/* ✅ Public Routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/get-in-touch" element={<GetInTouchPage />} />

          {/* ✅ Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute>
                <AdminMessagesPage />
              </ProtectedRoute>
            }
          />

          {/* ✅ Smart Warehousing */}
          <Route
            path="/sws"
            element={
              <ProtectedRoute>
                <SWSPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sws/products"
            element={
              <ProtectedRoute>
                <SWSProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sws/warehouses"
            element={
              <ProtectedRoute>
                <SWSWarehouses />
              </ProtectedRoute>
            }
          />

          {/* ✅ Procurement & Supply Management */}
          <Route
            path="/psm"
            element={
              <ProtectedRoute>
                <PSMPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/psm/purchase-orders"
            element={
              <ProtectedRoute>
                <PurchaseOrderPage />
              </ProtectedRoute>
            }
          />

          {/* ✅ Logistics */}
          <Route
            path="/logistics"
            element={
              <ProtectedRoute>
                <LogisticsPage />
              </ProtectedRoute>
            }
          />

          {/* ✅ Assets Lifecycle Manager */}
          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <AssetsPage />
              </ProtectedRoute>
            }
          />

          {/* ✅ Daily Time Record System */}
          <Route
            path="/dtrs"
            element={
              <ProtectedRoute>
                <DTRSPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* ✅ Footer only on homepage */}
      {location.pathname === "/" && (
        <footer className="bg-red-700 text-white py-6 mt-12">
          <div className="max-w-6xl mx-auto text-center space-y-2 text-sm">
            <p>Contact us: info@smartsupplychain.com | +63 912 345 6789</p>
            <p>
              © {new Date().getFullYear()} Smart Supply Chain System. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

// ✅ Main App with BrowserRouter wrapper
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

// ✅ Non-clickable Feature Card Component
function FeatureCard({ title, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-left hover:shadow-lg transition">
      <h2 className="text-lg font-semibold text-red-700">{title}</h2>
      <p className="mt-2 text-gray-600 text-sm">{description}</p>
    </div>
  );
}
